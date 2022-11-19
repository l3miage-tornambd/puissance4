import {Injectable, OnDestroy} from '@angular/core';
import * as deepEqual from 'fast-deep-equal';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  of,
  shareReplay,
  Subscription,
  switchMap,
  tap
} from 'rxjs';
import { isValid } from "src/data/isValid"
import { play } from 'src/data/play';
import { winner } from 'src/data/winner';
import {Auth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, User} from "@angular/fire/auth"
import {
  Firestore,
  collection,
  doc,
  docData,
  collectionData,
  query,
  CollectionReference,
  addDoc,
  updateDoc, deleteDoc
} from "@angular/fire/firestore";
import {FirestoreDataConverter} from "@firebase/firestore";

const googleProvider = new GoogleAuthProvider();

export type TestCaseIsValid = Readonly<{id: string, op: "isValid", comment: string, params: Parameters<typeof isValid>, expect: ReturnType<typeof isValid>}>;
export type TestCaseWinner  = Readonly<{id: string, op: "winner", comment: string, params: Parameters<typeof winner>, expect: ReturnType<typeof winner>}>
export type TestCasePlay    = Readonly<{id: string, op: "play", comment: string, params: Parameters<typeof play>, expect: ReturnType<typeof play>}>
export type TestCase = TestCaseIsValid | TestCaseWinner | TestCasePlay;

export type TestCaseResultIsValid = TestCaseIsValid & Readonly<{pass: boolean, result: ReturnType<typeof isValid>}>
export type TestCaseResultWinner  = TestCaseWinner  & Readonly<{pass: boolean, result: ReturnType<typeof winner>}>
export type TestCaseResultPlay    = TestCasePlay    & Readonly<{pass: boolean, result: ReturnType<typeof play>}>
export type TestCaseResult = TestCaseResultIsValid | TestCaseResultWinner | TestCaseResultPlay;

export interface TestSuite {
  readonly id: string;
  readonly label: string;
  readonly tests: readonly TestCase[];
}

export interface TestSuiteResults {
  readonly id: string;
  readonly label: string;
  readonly tests: readonly TestCaseResult[];
}

function evalTestLocally(t: TestCase): TestCaseResult {
  const tcr = t.op === "isValid" ? {...t, result: isValid(...t.params)}
                  : t.op === "winner" ? {...t, result: winner(...t.params)}
                    : {...t, result: play(...t.params)};
  return {...tcr, pass: deepEqual(tcr.expect, tcr.result)};
}

interface FS_TestSuite {
  id: string;
  label: string;
  LtestIds: string[];
}

const TestSuiteConverter: FirestoreDataConverter<FS_TestSuite> = {
  toFirestore: ts => ts,
  fromFirestore: d => d.data() as FS_TestSuite,
}
const TestCaseConverter: FirestoreDataConverter<TestCase> = {
  toFirestore: tc => {
    const obj: any = {...tc};
    if (tc.params) {
      obj['params'] = JSON.stringify(tc.params)
    }
    const expectPlay = tc.expect as ReturnType<typeof play>;
    if ( expectPlay.success ) { //if defined as true
      obj['expect']['state'] = JSON.stringify( expectPlay.state );
    }
    return obj;
  },
  fromFirestore: d => {
    const data = d.data();
    if ( data['expect']?.['state'] ) { //if defined as true
      data['expect']['state'] = JSON.parse( data['expect']['state'] );
    }
    return {...data, params: JSON.parse(data['params'])} as TestCase
  },
};


@Injectable({
  providedIn: 'root'
})
export class DataService implements OnDestroy {
  private userSubj = new BehaviorSubject<User | null>(null);
  readonly obsUser = this.userSubj.asObservable();
  private testSuitesBS = new BehaviorSubject<readonly TestSuite[]>([]);
  readonly testSuites: Observable<readonly TestSuite[]> = this.testSuitesBS.asObservable();
  readonly localTestsSuitesResults: Observable<readonly TestSuiteResults[]>;
  private collectionSuites?: CollectionReference<FS_TestSuite>;
  private collectionTests?: CollectionReference<TestCase>;
  private subscription: Subscription;

  constructor(private auth: Auth, private fs: Firestore) {
    auth.onAuthStateChanged(this.userSubj);
    this.subscription = this.userSubj.pipe(
      // Avoir aussi une zone de stockage possible dans des fichiers ???
      switchMap( u => {
        if (!u) return of([] as TestSuite[]);
        this.collectionSuites = collection(this.fs, `users/${u.email}/suites`).withConverter(TestSuiteConverter);
        this.collectionTests  = collection(this.fs, `users/${u.email}/tests`).withConverter(TestCaseConverter);
        const obsLts = collectionData( query(this.collectionSuites), {idField: "id"} );
        return obsLts.pipe(
          switchMap( Lts => combineLatest(Lts.map( ts => {
            const Ltc = ts.LtestIds.map( tcid => docData(doc(this.fs, `users/${u.email}/tests/${tcid}`).withConverter(TestCaseConverter), {idField: "id"}) );
            return Ltc.length === 0 ? of({id: ts.id, label: ts.label, tests: []}) : combineLatest(Ltc).pipe( map(tests => ({
              id: ts.id,
              label: ts.label,
              tests,
            })) );
          })))
        )
      })
    ).subscribe( this.testSuitesBS );
    this.localTestsSuitesResults = this.testSuites.pipe(
      // tap( Lts => console.log("Lts =", Lts) ),
      map( Lts => Lts.map( ts => ({...ts, tests: ts.tests.map( evalTestLocally ) }) )
      ),
      shareReplay(1)
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async logout() {
    return this.auth.signOut();
  }

  async loginGoogle() {
    return signInWithPopup(this.auth, googleProvider);
  }

  async login({ email, password }: Partial<{email: string | null, password: string | null}>) {
    if (email && password) {
      await signInWithEmailAndPassword(this.auth, email, password);
    }
  }

  async MoveTestCase({testcase, from, to, atIndex}: {testcase: TestCase, from: TestSuite, to: TestSuite, atIndex: number}) {
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
      return deleteDoc( doc(this.fs,`users/${this.auth.currentUser.email}/suites/${suite.id}`) )
    }
  }

  async updatetestSuiteLabel(suite: TestSuite, label: string) {
    if (this.auth.currentUser?.email) {
      return updateDoc( doc(this.fs,`users/${this.auth.currentUser.email}/suites/${suite.id}`).withConverter(TestSuiteConverter), {label} )
    }
  }

  async updateTestCase(testCase: TestCase) {
    if (this.auth.currentUser?.email) {
      return updateDoc<TestCase>( doc(this.fs,`users/${this.auth.currentUser.email}/tests/${testCase.id}`).withConverter(TestCaseConverter), TestCaseConverter.toFirestore(testCase) )
    }
  }

  async appendTestCase(suite: TestSuite, tc: TestCase) {
    if (this.collectionTests && this.auth.currentUser) {
      const ref = await addDoc( this.collectionTests, tc );
      const up: Partial<FS_TestSuite> = {LtestIds: [...suite.tests.map( tc => tc.id ), ref.id]};
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
      const L = this.testSuitesBS.value.filter( ts => ts.tests.find( tc => tc.id === testCase.id) );
      await Promise.all(
        L.map( ts => updateDoc(
          doc(this.fs, `users/${email}/suites/${ts.id}`).withConverter(TestSuiteConverter),
          {LtestIds: ts.tests.filter(tc => tc.id !== testCase.id).map(tc => tc.id)}
        ) )
      )
      // Remove testcase
      await deleteDoc(d)
    }
  }

}
