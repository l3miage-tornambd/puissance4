import {Injectable, NgZone, OnDestroy} from '@angular/core';
import {
  BehaviorSubject,
  combineLatest, debounceTime, distinctUntilChanged, filter, firstValueFrom,
  map,
  Observable,
  of,
  shareReplay, Subject,
  Subscription,
  switchMap, tap,
} from 'rxjs';
import {Auth, signInWithEmailAndPassword, User} from "@angular/fire/auth"
import {
  Firestore,
  collection,
  doc,
  docData,
  collectionData,
  query,
  CollectionReference,
  addDoc,
  updateDoc, deleteDoc,
  DocumentReference, arrayUnion, getDocs, getDoc, arrayRemove,
} from "@angular/fire/firestore";
import {
  Mutant, SerializedMutant, serializeMutant,
  TestCase, TestCaseResult,
  TestSuite,
  TestSuiteResults
} from './data/tests-definitions';
import {MatSnackBar} from "@angular/material/snack-bar";
import {
  evalMutant,
  evalTestsLocally,
  FS_TestSuite,
  FS_User, runInZone, STAT,
  TestCaseConverter,
  TestSuiteConverter,
  UserConverter
} from './utils';

interface STATE {
  readonly userMail: string;
  readonly version: number;
  readonly mutants: SerializedMutant<any>[];
  readonly suites: readonly TestSuite[];
  canObserve: Observable<FS_User[]>;
}

const emptyState: STATE = {
  userMail: "",
  version: -1,
  mutants: [],
  suites: [],
  canObserve: of([])
};

@Injectable({
  providedIn: 'root'
})
export class DataService implements OnDestroy {
  private subscriptions: Subscription[] = [];
  private userSubj = new BehaviorSubject<User | null>(null);
  readonly obsUser = this.userSubj.asObservable();

  private docUser?: DocumentReference<FS_User>;
  private collectionSuites?: CollectionReference<FS_TestSuite>;
  private collectionTests?: CollectionReference<TestCase>;

  private stateBS = new BehaviorSubject<STATE>(emptyState);
  readonly stateObs: Observable<STATE>;
  readonly mutants: Observable<SerializedMutant<any>[]>;
  readonly testSuites: Observable<readonly TestSuite[]>;
  readonly localTestsSuitesResults: Observable<readonly TestSuiteResults[]>;
  readonly usersObserved: Observable<FS_User[]>;

  constructor(private auth: Auth, private fs: Firestore, private _snackBar: MatSnackBar, private ngZone: NgZone) {
    this.stateObs = this.stateBS.asObservable(); // .pipe( runInZone(ngZone) );
    this.mutants = this.stateObs.pipe(map(S => S.mutants))
    this.testSuites = this.stateObs.pipe(map(S => S.suites));
    this.localTestsSuitesResults = this.testSuites.pipe(
      map(Lts => Lts.map(async ts => ({...ts, tests: ts.tests.length === 0 ? [] : await evalTestsLocally(ts.tests)}))),
      switchMap(L => Promise.all(L)),
      shareReplay(1)
    );
    this.usersObserved = this.stateObs.pipe(
      switchMap(S => S.canObserve ),
      map( L => L.filter(u => !!u) ),
      shareReplay(1)
    )

    auth.onAuthStateChanged(this.userSubj);
    const obsU: Observable<User> = this.userSubj.pipe(
      tap(u => {
        if (!u) {
          this.collectionSuites = undefined;
          this.collectionTests = undefined;
          this.docUser = undefined;
          this.subscriptions.forEach(S => S.unsubscribe())
        }
      }),
      filter(u => !!u),
      map(u => u as User),
      shareReplay(1)
    );

    // STATE
    obsU.pipe(
      switchMap(async u => {
        this.docUser = doc(this.fs, `users/${u.email}`).withConverter(UserConverter);
        this.collectionSuites = collection(this.fs, `users/${u.email}/suites`).withConverter(TestSuiteConverter);
        this.collectionTests = collection(this.fs, `users/${u.email}/tests`).withConverter(TestCaseConverter);

        // Get saved state, if any
        let data = await this.readFromLocal();
        if (data == undefined) {
          this._snackBar.open("Start local server (npm run local-api-server)", undefined, {verticalPosition: "top"});
          return of(emptyState);
        }
        let savedState = data ?? emptyState;

        // Get observable from Firestore (no subscribe yet)
        const obsUser = docData(this.docUser);
        const obsLts = collectionData(query(this.collectionSuites!), {idField: "id"}).pipe(shareReplay(1));
        const obsLtc = collectionData(query(this.collectionTests!), {idField: "id"}).pipe(shareReplay(1));

        const obsFirestore: Observable<STATE> = combineLatest([obsUser, obsLts, obsLtc]).pipe(
          debounceTime(50),
          distinctUntilChanged(([u1], [u2]) => u1.testsVersion === u2.testsVersion),
          map<[FS_User, FS_TestSuite[], TestCase[]], STATE>(([fsu, Lts, Ltc]) => ({
            userMail: u.email!,
            version: fsu.testsVersion,
            mutants: fsu.mutants.map(str => JSON.parse(str) as SerializedMutant<any>),
            suites: Lts.map(ts => ({
              ...ts,
              tests: ts.LtestIds.map(idTc => Ltc.find(tc => tc.id === idTc)!)
            })),
            canObserve: this.getObsUsersFromEmails( fsu.canObserve ? JSON.parse(fsu.canObserve) : [])
          })),
          map(async S => {
            return (await this.saveToLocal(S)) ? S : emptyState;
          }),
          switchMap( S => S ),
          shareReplay(1)
        );
        const subjFireStore = new Subject<STATE>();
        let subToFS: Subscription;

        this.subscriptions.push(obsUser.subscribe(fsu => {
          if (fsu.testsVersion === savedState.version) {
            console.log("On utilise la sauvegarde locale...", savedState)
            subjFireStore.next(savedState);
          } else {
            if (!subToFS) {
              console.log("Maintenant on observe Firestore...")
              this.subscriptions.push(subToFS = obsFirestore.subscribe(subjFireStore))
            }
          }
        }));

        return subjFireStore.pipe(shareReplay(1));
      }),
      switchMap(v => v ),
    ).subscribe( this.stateBS );

  }

  ngOnDestroy() {
    this.subscriptions.forEach(S => S.unsubscribe());
  }

  async logout() {
    return this.auth.signOut();
  }

  async login({email, password}: Partial<{ email: string | null, password: string | null }>) {
    if (email && password) {
      await signInWithEmailAndPassword(this.auth, email, password);
    }
  }

  private getObsUsersFromEmails(Lmails: string[]): Observable<FS_User[]> {
    return combineLatest( Lmails.map(
      uid => docData( doc(this.fs, `users/${uid}` ).withConverter(UserConverter) )
    ))
  }

  async readFromLocal(): Promise<STATE | undefined> {
    const res = await fetch('/api-local');
    const tmp = res.ok ? await res.json() : undefined;
    if (tmp) {
      return {
        ...tmp,
        canObserve: this.getObsUsersFromEmails( (tmp.canObserve as string[]) ?? [] )
      }
    } else {
      return undefined;
    }
  }

  async saveToLocal(S: STATE): Promise<boolean> {
    try {
      const res = await fetch('/api-local', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...S,
          canObserve: (await firstValueFrom(S.canObserve)).filter(u => !!u).map( u => u.email )
        })
      });
      if (res.ok) {
        const content = await res.json();
        this._snackBar.open("Tests saved locally", undefined, {
          duration: 1000,
          verticalPosition: "top"
        })
        return true;
      } else {
        const msg = res.status === 504 ? "Try restarting local server : npm run local-api-server" : `Error saving file locally: ${res.status} ${res.statusText}`;
        console.error(msg);
        this._snackBar.open(msg, undefined, {
          verticalPosition: "top"
        })
      }
    } catch (err) {
      console.error("Error saving file locally:", err);
      this._snackBar.open(`Error saving file locally: ${err}`, undefined, {
        verticalPosition: "top"
      })
    }
    return false;
  }

  async forceEvalStudent(U: FS_User) {
    // get tests and suites
    const [snapLts, snapLtc] = await Promise.all([
      getDocs( collection(this.fs, `users/${U.email}/suites`).withConverter(TestSuiteConverter) ),
      getDocs( collection(this.fs, `users/${U.email}/tests`).withConverter(TestCaseConverter) ),
    ]);

    const Ltctmp = snapLtc.docs.map( s => s.data()  );
    const Lts = snapLts.docs.map( s => s.data() );
    Lts.forEach( ts => ts.LtestIds.forEach( tcid => {
      if (!Ltctmp.find(tc => tc.id === tcid)) {
        console.error("problem with", ts, tcid)
      }
    } ) )
    const Ltc: TestCase[] = Lts.flatMap( ts => ts.LtestIds.map( tcid => Ltctmp.find(tc => tc.id === tcid)! ) )
    const Ltcr = await evalTestsLocally(Ltc);
    const LtcPlay    = Ltcr.filter( tc => tc.op === "play"    );
    const LtcWinner  = Ltcr.filter( tc => tc.op === "winner"  );
    const LtcIsValid = Ltcr.filter( tc => tc.op === "isValid" );

    // Tests again code
    const evalCode: FS_User["evals"][1] = {
      play: [LtcPlay.filter(tcr => tcr.pass).length, LtcPlay.length] ,
      isValid: [LtcIsValid.filter(tcr => tcr.pass).length, LtcIsValid.length] ,
      winner: [LtcWinner.filter(tcr => tcr.pass).length, LtcWinner.length] ,
    }

    console.log(
      LtcPlay.filter(tcr => !tcr.pass),
      LtcIsValid.filter(tcr => !tcr.pass),
      LtcWinner.filter(tcr => !tcr.pass),
    )

    const Lmutants = this.stateBS.value.mutants;
    const mutantsPlay = Lmutants.filter( m => m.op === "play");
    const mutantsWinner = Lmutants.filter( m => m.op === "winner");
    const mutantsIsValid = Lmutants.filter( m => m.op === "isValid");
    const tsMutants: TestSuite = {id: "mutants", label: "Testing mutants", tests: []}
    const [Ltcrplay, LtcrWinner, LtcrIsValid] = await Promise.all([
      Promise.all(mutantsPlay   .map( m => evalMutant(m, LtcPlay   .map( tc => ({ts: tsMutants, tc}) )) )),
      Promise.all(mutantsWinner .map( m => evalMutant(m, LtcWinner .map( tc => ({ts: tsMutants, tc}) )) )),
      Promise.all(mutantsIsValid.map( m => evalMutant(m, LtcIsValid.map( tc => ({ts: tsMutants, tc}) )) )),
    ]);
    const evalMutants: FS_User["evals"][2] = {
      play: [Ltcrplay.reduce( (nb, L) => L.find( ({tcr}) => !tcr.pass) ? nb + 1 : nb, 0), mutantsPlay.length], // [eliminate: number, total: number]
      winner: [LtcrWinner.reduce( (nb, L) => L.find( ({tcr}) => !tcr.pass) ? nb + 1 : nb, 0), mutantsWinner.length],
      isValid: [LtcrIsValid.reduce( (nb, L) => L.find( ({tcr}) => !tcr.pass) ? nb + 1 : nb, 0), mutantsIsValid.length],
    }

    // Mettre à jour les résultats pour l'étudiant
    updateDoc( doc(this.fs, `users/${U.email}`).withConverter(UserConverter), {
      evals: [
        U.testsVersion,
        evalCode,
        evalMutants
      ]
    } )
    // Sauvegarder pour le demandeur ?

  }

  async appendMutant(m: Mutant<any>) {
    if (this.docUser) {
      const str: string = JSON.stringify(serializeMutant(m));
      updateDoc(this.docUser, {mutants: arrayUnion(str), testsVersion: this.stateBS.value.version + 1})
    }
  }

  async MoveTestCase({
                       testcase,
                       from,
                       to,
                       atIndex
                     }: { testcase: TestCase, from: TestSuite, to: TestSuite, atIndex: number }) {
    if (this.auth.currentUser?.email) {
      const email: string = this.auth.currentUser?.email;
      if (from === to) {
        const LtestIds = from.tests.filter(tc => tc.id !== testcase.id).map(tc => tc.id);
        LtestIds.splice(atIndex, 0, testcase.id);
        updateDoc(doc(this.fs, `users/${email}/suites/${from.id}`).withConverter(TestSuiteConverter),
          {LtestIds});
      } else {
        updateDoc(doc(this.fs, `users/${email}/suites/${from.id}`).withConverter(TestSuiteConverter),
          {LtestIds: from.tests.filter(tc => tc.id !== testcase.id).map(tc => tc.id)});
        const LtestIds = to.tests.map(tc => tc.id)
        LtestIds.splice(atIndex, 0, testcase.id);
        updateDoc(doc(this.fs, `users/${email}/suites/${to.id}`).withConverter(TestSuiteConverter),
          {LtestIds});
      }
      await this.incrVersion();
    }
  }

  async appendTestSuite(label: string) {
    const ts: FS_TestSuite = {id: "pipo", label, LtestIds: []};
    if (this.collectionSuites) {
      addDoc(this.collectionSuites, ts);
      this.incrVersion();
    }
  }

  async removeTestSuite(suite: TestSuite) {
    if (this.auth.currentUser?.email) {
      deleteDoc(doc(this.fs, `users/${this.auth.currentUser.email}/suites/${suite.id}`))
      this.incrVersion();
    }
  }

  async updatetestSuiteLabel(suite: TestSuite, label: string) {
    if (this.auth.currentUser?.email) {
      updateDoc(doc(this.fs, `users/${this.auth.currentUser.email}/suites/${suite.id}`).withConverter(TestSuiteConverter), {label})
      this.incrVersion();
    }
  }

  async updateTestCase(testCase: TestCase) {
    if (this.auth.currentUser?.email) {
      updateDoc<TestCase>(doc(this.fs, `users/${this.auth.currentUser.email}/tests/${testCase.id}`).withConverter(TestCaseConverter), TestCaseConverter.toFirestore(testCase))
      this.incrVersion();
    }
  }

  async appendTestCase(suite: TestSuite, tc: TestCase) {
    if (this.collectionTests && this.auth.currentUser) {
      const ref = await addDoc(this.collectionTests, tc);
      const up: Partial<FS_TestSuite> = {LtestIds: [...suite.tests.map(tc => tc.id), ref.id]};
      updateDoc(
        doc(this.fs, `users/${this.auth.currentUser.email}/suites/${suite.id}`).withConverter(TestSuiteConverter),
        up
      );
      this.incrVersion();
    }
  }

  async removeTestCase(testCase: TestCase) {
    if (this.auth.currentUser?.email) {
      const email: string = this.auth.currentUser?.email;
      const d = doc(this.fs, `users/${email}/tests/${testCase.id}`);
      // Remove d from suites
      const L = this.stateBS.value.suites.filter(ts => ts.tests.find(tc => tc.id === testCase.id));
      Promise.all(
        L.map(ts => updateDoc(
          doc(this.fs, `users/${email}/suites/${ts.id}`).withConverter(TestSuiteConverter),
          {LtestIds: ts.tests.filter(tc => tc.id !== testCase.id).map(tc => tc.id)}
        ))
      )
      // Remove testcase
      deleteDoc(d)
      this.incrVersion();
    }
  }

  private async incrVersion() {
    if (this.docUser) {
      await updateDoc(this.docUser, {
        testsVersion: this.stateBS.value.version + 1
      });
    }
  }
}
