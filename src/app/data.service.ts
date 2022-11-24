import {Injectable, OnDestroy} from '@angular/core';
import {
  BehaviorSubject,
  combineLatest, filter, from,
  map,
  Observable,
  of,
  shareReplay,
  Subscription,
  switchMap, tap,
} from 'rxjs';
import {play} from './data/play';
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
import {winner} from "./data/winner";
import {isValid} from "./data/isValid";
import {MatSnackBar} from "@angular/material/snack-bar";
import {
  evalMutant,
  evalTestsLocally,
  FS_TestSuite,
  FS_User, LocalSave,
  TestCaseConverter,
  TestSuiteConverter,
  UserConverter
} from './utils';



@Injectable({
  providedIn: 'root'
})
export class DataService implements OnDestroy {
  private userSubj = new BehaviorSubject<User | null>(null);
  readonly obsUser = this.userSubj.asObservable();
  private testSuitesBS = new BehaviorSubject<readonly TestSuite[]>([]);
  readonly testSuites: Observable<readonly TestSuite[]> = this.testSuitesBS.asObservable();
  readonly localTestsSuitesResults: Observable<readonly TestSuiteResults[]>;
  private mutantsSubj = new BehaviorSubject<SerializedMutant<any>[]>([]);
  readonly mutants = this.mutantsSubj.asObservable();
  private docUser?: DocumentReference<FS_User>;
  private collectionSuites?: CollectionReference<FS_TestSuite>;
  private collectionTests?: CollectionReference<TestCase>;
  private subscriptions: Subscription[] = [];
  private observatedUsersDocBS = new BehaviorSubject<DocumentSnapshot<FS_User>[]>([]);
  readonly observatedUsersDoc = this.observatedUsersDocBS.asObservable();
  private testsVersion = new BehaviorSubject<number>(-1);
  readonly obsTestsVersion = this.testsVersion.asObservable();


  constructor(private auth: Auth, private fs: Firestore, private _snackBar: MatSnackBar) {
    auth.onAuthStateChanged(this.userSubj);
    const obsU: Observable<User> = this.userSubj.pipe(
      tap(u => {
        if (!u) {
          this.collectionSuites = undefined;
          this.collectionTests = undefined;
          this.docUser = undefined;
          this.subscriptions.forEach(S => S.unsubscribe())
          this.mutantsSubj.next([]);
          this.testSuitesBS.next([]);
        }
      }),
      filter(u => !!u),
      map(u => u as User),
      shareReplay(1)
    );

    // User document (code and mutants)
    this.subscriptions.push(
      obsU.pipe(
        map(async u => {
          this.docUser = doc(this.fs, `users/${u.email}`).withConverter(UserConverter);
          const fsu = await getDoc(this.docUser)
          const str = fsu.data()?.canObserve ?? "[]";
          let Lstr: string[] = JSON.parse(str);
          const email = u.email?.toLowerCase() ?? "fail";
          Lstr = Lstr.map(s => s.toLowerCase()).filter(s => s !== email);
          const L = await Promise.all(Lstr.map(id => getDoc(doc(this.fs, `users/${id}`).withConverter(UserConverter))))
          this.observatedUsersDocBS.next(L.filter(s => s.exists()));
          return docData(this.docUser).pipe(
            map(fsu => fsu.mutants.map(str => JSON.parse(str) as SerializedMutant<any>))
          )
        }),
        switchMap(PU => PU),
        switchMap(PU => PU)
      ).subscribe(this.mutantsSubj)
    );

    // Test suites
    this.subscriptions.push(
      obsU.pipe(
        switchMap( async u => {
          this.docUser = doc(this.fs, `users/${u.email}`).withConverter(UserConverter);
          this.collectionSuites = collection(this.fs, `users/${u.email}/suites`).withConverter(TestSuiteConverter);
          this.collectionTests = collection(this.fs, `users/${u.email}/tests`).withConverter(TestCaseConverter);

          // Get saved state, if any
          const savedState: LocalSave = (await this.readFromLocal()) ?? {
            userMail: u.email ?? "",
            version: -1,
            testSuites: [] as TestSuite[]
          };

          return docData( this.docUser ).pipe(
            switchMap(fsu => {
              this.testsVersion.next(fsu.testsVersion);
              console.log(`${u.email}/${savedState.userMail} && ${fsu.testsVersion}/${savedState.version}`, savedState);
              if (u.email === savedState.userMail && fsu.testsVersion === savedState.version) {
                console.log("On utilise la sauvegarde locale...")
                return of( savedState.testSuites );
              } else {
                console.log("Maintenant on observe Firestore...")
                const obsLts = collectionData(query(this.collectionSuites!), {idField: "id"});
                return obsLts.pipe(
                  switchMap(Lts => combineLatest(Lts.map(ts => {
                    const Ltc = ts.LtestIds.map(tcid => docData(doc(this.fs, `users/${u.email}/tests/${tcid}`).withConverter(TestCaseConverter), {idField: "id"}));
                    return Ltc.length === 0 ? of({
                      id: ts.id,
                      label: ts.label,
                      tests: []
                    }) : combineLatest(Ltc).pipe(map(tests => ({
                      id: ts.id,
                      label: ts.label,
                      tests,
                    })));
                  }))),
                  tap( L => this.saveToLocal(L) )
                );
              }
            })
          );
        }),
        switchMap( from ),
      ).subscribe(this.testSuitesBS)
    );

    this.localTestsSuitesResults = this.testSuites.pipe(
      // tap( Lts => console.log("Lts =", Lts) ),
      map(Lts => Lts.map(async ts => ({...ts, tests: ts.tests.length === 0 ? [] : await evalTestsLocally(ts.tests)}))),
      switchMap(L => Promise.all(L)),
      shareReplay(1)
    );

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
    let msg = res.ok ? "Tests loaded from local server" : `Error loading tests: ${res.status} ${res.statusText}`;
    this._snackBar.open(msg, undefined,{duration: res.ok ? 1000 : 2000, verticalPosition: "top"});
    return res.ok ? await res.json() as LocalSave : undefined;
  }

  async saveToLocal(L: TestSuite[]) {
    try {
      const svg: LocalSave = {
        userMail: this.userSubj.value?.email ?? "",
        version: this.testsVersion.value,
        testSuites: L
      }
      const res = await fetch('/api-local', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(svg)
      });
      if (res.ok) {
        const content = await res.json();
        this._snackBar.open("Tests saved locally", undefined,{
          duration: 1000,
          verticalPosition: "top"
        })
        console.log("response:", content);
      } else {
        const msg = res.status === 504 ? "Try restarting local server : npm run local-api-server" : `Error saving file locally: ${res.status} ${res.statusText}`;
        console.error(msg);
        res.json().then(console.error)
        this._snackBar.open(msg, undefined,{
          duration: 2000,
          verticalPosition: "top"
        })
      }
    } catch(err) {
      console.error("Error saving file locally:", err);
      this._snackBar.open(`Error saving file locally: ${err}`, undefined,{
        duration: 2000,
        verticalPosition: "top"
      })
    }
  }

  async forceEvalStudent(docRef: DocumentReference<FS_User>) {
    // get snapshot
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      // get tests and pass them against reference code and mutants
      const collecTests = await getDocs(collection(this.fs, `users/${docRef.id}/tests`).withConverter(TestCaseConverter));
      const LTests = collecTests.docs.map(d => d.data());

      // Tests again local code
      const testsVsCode = await evalTestsLocally( LTests )

      // Tests again local mutants
      const ts: TestSuite = {id: "pipo", label: "tests versus mutants", tests: []};
      const testsVsMutants = (
        await Promise.all( this.mutantsSubj.value.map( mutant => evalMutant(mutant, LTests.map( tc => ({ts, tc}) ) ) ) )
      ).flatMap( l => l).map( ({tcr}) => tcr );


    }
  }

  async appendMutant(m: Mutant<any>) {
    if (this.docUser) {
      const str: string = JSON.stringify(serializeMutant(m));
      updateDoc(this.docUser, {mutants: arrayUnion(str)})
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
        await updateDoc(doc(this.fs, `users/${email}/suites/${from.id}`).withConverter(TestSuiteConverter),
          {LtestIds});
      } else {
        await updateDoc(doc(this.fs, `users/${email}/suites/${from.id}`).withConverter(TestSuiteConverter),
          {LtestIds: from.tests.filter(tc => tc.id !== testcase.id).map(tc => tc.id)});
        const LtestIds = to.tests.map(tc => tc.id)
        LtestIds.splice(atIndex, 0, testcase.id);
        await updateDoc(doc(this.fs, `users/${email}/suites/${to.id}`).withConverter(TestSuiteConverter),
          {LtestIds});
      }
    }
  }

  async appendTestSuite(label: string) {
    const ts: FS_TestSuite = {id: "pipo", label, LtestIds: []};
    if (this.collectionSuites) {
      addDoc(this.collectionSuites, ts);
    }
  }

  async removeTestSuite(suite: TestSuite) {
    if (this.auth.currentUser?.email) {
      return deleteDoc(doc(this.fs, `users/${this.auth.currentUser.email}/suites/${suite.id}`))
    }
  }

  async updatetestSuiteLabel(suite: TestSuite, label: string) {
    if (this.auth.currentUser?.email) {
      return updateDoc(doc(this.fs, `users/${this.auth.currentUser.email}/suites/${suite.id}`).withConverter(TestSuiteConverter), {label})
    }
  }

  async updateTestCase(testCase: TestCase) {
    if (this.auth.currentUser?.email) {
      return updateDoc<TestCase>(doc(this.fs, `users/${this.auth.currentUser.email}/tests/${testCase.id}`).withConverter(TestCaseConverter), TestCaseConverter.toFirestore(testCase))
    }
  }

  async appendTestCase(suite: TestSuite, tc: TestCase) {
    if (this.collectionTests && this.auth.currentUser) {
      const ref = await addDoc(this.collectionTests, tc);
      const up: Partial<FS_TestSuite> = {LtestIds: [...suite.tests.map(tc => tc.id), ref.id]};
      return updateDoc(
        doc(this.fs, `users/${this.auth.currentUser.email}/suites/${suite.id}`).withConverter(TestSuiteConverter),
        up
      );
    }
  }

  async removeTestCase(testCase: TestCase) {
    if (this.auth.currentUser?.email) {
      const email: string = this.auth.currentUser?.email;
      const d = doc(this.fs, `users/${email}/tests/${testCase.id}`);
      // Remove d from suites
      const L = this.testSuitesBS.value.filter(ts => ts.tests.find(tc => tc.id === testCase.id));
      await Promise.all(
        L.map(ts => updateDoc(
          doc(this.fs, `users/${email}/suites/${ts.id}`).withConverter(TestSuiteConverter),
          {LtestIds: ts.tests.filter(tc => tc.id !== testCase.id).map(tc => tc.id)}
        ))
      )
      // Remove testcase
      await deleteDoc(d)
    }
  }

}
