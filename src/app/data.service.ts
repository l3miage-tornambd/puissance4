import {Injectable, NgZone, OnDestroy} from '@angular/core';
import {
  BehaviorSubject,
  combineLatest, debounceTime, distinctUntilChanged, filter,
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
  DocumentReference, arrayUnion, getDocs, getDoc, setDoc,
  DocumentSnapshot
} from "@angular/fire/firestore";
import {
  Mutant, SerializedMutant, serializeMutant,
  TestCase,
  TestSuite,
  TestSuiteResults
} from './data/tests-definitions';
import {MatSnackBar} from "@angular/material/snack-bar";
import {
  evalMutant,
  evalTestsLocally,
  FS_TestSuite,
  FS_User, LocalSave, runInZone,
  TestCaseConverter,
  TestSuiteConverter,
  UserConverter
} from './utils';

interface STATE {
  readonly userMail: string;
  readonly version: number;
  readonly mutants: SerializedMutant<any>[];
  readonly suites: readonly TestSuite[]
}

const emptyState: STATE = {
  userMail: "",
  version: -1,
  mutants: [],
  suites: []
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

  constructor(private auth: Auth, private fs: Firestore, private _snackBar: MatSnackBar, private ngZone: NgZone) {
    this.stateObs = this.stateBS.pipe( runInZone(ngZone) );
    this.mutants = this.stateObs.pipe(map(S => S.mutants))
    this.testSuites = this.stateObs.pipe(map(S => S.suites));
    this.localTestsSuitesResults = this.testSuites.pipe(
      map(Lts => Lts.map(async ts => ({...ts, tests: ts.tests.length === 0 ? [] : await evalTestsLocally(ts.tests)}))),
      switchMap(L => Promise.all(L)),
      shareReplay(1)
    );

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
            }))
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
            console.log("On utilise la sauvegarde locale...")
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

  async readFromLocal() {
    const res = await fetch('/api-local');
    return res.ok ? await res.json() as STATE : undefined;
  }

  async saveToLocal(S: STATE): Promise<boolean> {
    try {
      const res = await fetch('/api-local', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(S)
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

  async forceEvalStudent(docRef: DocumentReference<FS_User>) {
    // get snapshot
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      // get tests and pass them against reference code and mutants
      const collecTests = await getDocs(collection(this.fs, `users/${docRef.id}/tests`).withConverter(TestCaseConverter));
      const LTests = collecTests.docs.map(d => d.data());

      // Tests again local code
      const testsVsCode = await evalTestsLocally(LTests)

      // Tests again local mutants
      const ts: TestSuite = {id: "pipo", label: "tests versus mutants", tests: []};
      const testsVsMutants = (
        await Promise.all(this.stateBS.value.mutants.map(mutant => evalMutant(mutant, LTests.map(tc => ({ts, tc})))))
      ).flatMap(l => l).map(({tcr}) => tcr);


    }
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
