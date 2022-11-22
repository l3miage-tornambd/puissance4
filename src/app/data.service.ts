import {Injectable, OnDestroy} from '@angular/core';
import {
  BehaviorSubject,
  combineLatest, filter,
  map,
  Observable,
  of,
  shareReplay,
  Subscription,
  switchMap, tap,
} from 'rxjs';
import {play} from './data/play';
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
  updateDoc, deleteDoc, WithFieldValue,
  DocumentReference, arrayUnion
} from "@angular/fire/firestore";
import {FirestoreDataConverter, DocumentData, QueryDocumentSnapshot, SnapshotOptions} from "@firebase/firestore";
import {
  Mutant, SerializedMutant, serializeMutant,
  TestCase,
  TestCaseResult,
  TestSuite,
  TestSuiteResults, unserializeMutant
} from './data/tests-definitions';

const googleProvider = new GoogleAuthProvider();
export const logins: readonly string[] = [
  "alexandre.demeure@univ-grenoble-alpes.fr", "Adil-Massa.Adomo-Bitea@etu.univ-grenoble-alpes.fr", "Elhadj.Bah@etu.univ-grenoble-alpes.fr", "Ibrahima.Barry2@etu.univ-grenoble-alpes.fr", "Mariama.Barry@etu.univ-grenoble-alpes.fr", "Anas.Benabbou@etu.univ-grenoble-alpes.fr", "Ilian.Benaissa@etu.univ-grenoble-alpes.fr", "Sami.Bensaid@etu.univ-grenoble-alpes.fr", "Mustapha-Mahrez.Bouchelouche@etu.univ-grenoble-alpes.fr", "Walid.Bouhali@etu.univ-grenoble-alpes.fr", "Leo.Bouvier1@etu.univ-grenoble-alpes.fr", "Quentin.Bebin@etu.univ-grenoble-alpes.fr", "Kyllian.Charre@etu.univ-grenoble-alpes.fr", "Vincent.Chazeau@etu.univ-grenoble-alpes.fr", "Seynabou.Conde@etu.univ-grenoble-alpes.fr", "Levi.Cormier@etu.univ-grenoble-alpes.fr", "Samuel.Damessi@etu.univ-grenoble-alpes.fr", "Alex.Delagrange@etu.univ-grenoble-alpes.fr", "Oumou.Dembele@etu.univ-grenoble-alpes.fr", "Fatoumata.Diaby@etu.univ-grenoble-alpes.fr", "Aminata.Diagne@etu.univ-grenoble-alpes.fr", "Thierno.Diallo3@etu.univ-grenoble-alpes.fr", "Tien.Duong@etu.univ-grenoble-alpes.fr", "Anas.El-Bouchrifi@etu.univ-grenoble-alpes.fr", "Mouad.El-Kbabty@etu.univ-grenoble-alpes.fr", "Chaymae.Elkhou@etu.univ-grenoble-alpes.fr", "Khalil.Essouaid@etu.univ-grenoble-alpes.fr", "Abdelkader.Ezarouali@etu.univ-grenoble-alpes.fr", "Matias.Freund-Galeano@etu.univ-grenoble-alpes.fr", "Lucas.Giry@etu.univ-grenoble-alpes.fr", "Quentin.Grange@etu.univ-grenoble-alpes.fr", "Rayane.Guendouz@etu.univ-grenoble-alpes.fr", "Paul.Gueripel@etu.univ-grenoble-alpes.fr", "Jocelin.Heinen@etu.univ-grenoble-alpes.fr", "Floriane.Jandot@etu.univ-grenoble-alpes.fr", "Myriam.Khaddar@etu.univ-grenoble-alpes.fr", "Ibrahim-Goukouni.Khalil@etu.univ-grenoble-alpes.fr", "Zeinabou.Kone@etu.univ-grenoble-alpes.fr", "Hatim.Laghrissi@etu.univ-grenoble-alpes.fr", "Yasmine.Larbi@etu.univ-grenoble-alpes.fr", "Nour.Machmachi@etu.univ-grenoble-alpes.fr", "Salaheddin.Mesouak@etu.univ-grenoble-alpes.fr", "Souleymen.Ouchane@etu.univ-grenoble-alpes.fr", "Lyna.Oulahcene@etu.univ-grenoble-alpes.fr", "Willem.Papeau@etu.univ-grenoble-alpes.fr", "Theo.Patrac@etu.univ-grenoble-alpes.fr", "Timoty.Razafindrabe@etu.univ-grenoble-alpes.fr", "Bastien.Riado@etu.univ-grenoble-alpes.fr", "Ayman.Salouh@etu.univ-grenoble-alpes.fr", "Floreal.Sangenis@etu.univ-grenoble-alpes.fr", "Farah.Seifeddine@etu.univ-grenoble-alpes.fr", "Mariam.Sidibe@etu.univ-grenoble-alpes.fr", "Damien.Tornambe@etu.univ-grenoble-alpes.fr", "Julien.Turc@etu.univ-grenoble-alpes.fr", "Marie.Wyss@etu.univ-grenoble-alpes.fr", "Sicong.Xu@etu.univ-grenoble-alpes.fr", "Mohamad-Majd.Yagan@etu.univ-grenoble-alpes.fr", "Kokouvi.Zodjihoue@etu.univ-grenoble-alpes.fr"
];

export async function evalMutant(mutant: SerializedMutant<any>, Ltc: {ts: TestSuite, tc: TestCase}[]): Promise<{ts: TestSuite, tcr: TestCaseResult}[]> {
  return Promise.all(
    Ltc.map( ({tc, ts}) => new Promise<{ts: TestSuite, tcr: TestCaseResult}>( resolve => {
      const worker = new Worker(new URL('./eval-mutant.worker', import.meta.url));
      const timer = setTimeout(
        () => {
          worker.terminate();
          resolve({ts, tcr: {...tc, pass: false, result: {exec: "failed", reason: "timeout"}}} );
        },
        1000
      )

      worker.onmessage = (evt: MessageEvent<TestCaseResult>) => {
        clearTimeout(timer);
        resolve({ts, tcr: evt.data} );
      };

      worker.postMessage({tc, seriMutant: mutant});
    }))
  );
}

function evalTestLocally(t: TestCase): Promise<TestCaseResult> {
  return new Promise<TestCaseResult>(resolve => {
    const worker = new Worker(new URL('./test-case.worker', import.meta.url));
    const timer = setTimeout(
      () => {
        worker.terminate();
        resolve({...t, pass: false, result: {exec: "failed", reason: "timeout"}});
      },
      1000
    )
    worker.onmessage = (evt: MessageEvent<TestCaseResult>) => {
      clearTimeout(timer);
      resolve(evt.data);
    };
    worker.postMessage(t);
  });
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
    if (expectPlay.success) { //if defined as true
      obj['expect']['state'] = JSON.stringify(expectPlay.state);
    }
    return obj;
  },
  fromFirestore: d => {
    const data = d.data();
    if (data['expect']?.['state']) { //if defined as true
      data['expect']['state'] = JSON.parse(data['expect']['state']);
    }
    return {...data, params: JSON.parse(data['params'])} as TestCase
  },
};

interface FS_User {
  play: string;
  winner: string;
  isValid: string;
  mutants: string[];
}

const TUserConverter: FirestoreDataConverter<FS_User> = {
  toFirestore: (U: WithFieldValue<FS_User>) => U,
  fromFirestore: U => ({
    play: U.get("play") ?? "",
    winner: U.get("winner") ?? "",
    isValid: U.get("isValid") ?? "",
    mutants: U.get("mutants") ?? [],
  })
}

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

  constructor(private auth: Auth, private fs: Firestore) {
    auth.onAuthStateChanged(this.userSubj);
    const obsU: Observable<User> = this.userSubj.pipe(
      tap(u => {
        if (!u) {
          this.collectionSuites = undefined;
          this.collectionTests = undefined;
          this.docUser = undefined;
          this.subscriptions.forEach( S => S.unsubscribe() )
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
      obsU.pipe(switchMap( u => {
        this.docUser = doc(this.fs, `users/${u.email}`).withConverter(TUserConverter);
        return docData(this.docUser).pipe(
          map( fsu => fsu.mutants.map( str => JSON.parse(str) as SerializedMutant<any>) )
        )
      })).subscribe( this.mutantsSubj )
    );

    // Test suites
    this.subscriptions.push(
      obsU.pipe(
        // Avoir aussi une zone de stockage possible dans des fichiers ???
        switchMap(u => {
          this.collectionSuites = collection(this.fs, `users/${u.email}/suites`).withConverter(TestSuiteConverter);
          this.collectionTests = collection(this.fs, `users/${u.email}/tests`).withConverter(TestCaseConverter);
          const obsLts = collectionData(query(this.collectionSuites), {idField: "id"});
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
            })))
          )
        })
      ).subscribe(this.testSuitesBS)
    );

    this.localTestsSuitesResults = this.testSuites.pipe(
      // tap( Lts => console.log("Lts =", Lts) ),
      map(Lts => Lts.map(async ts => ({...ts, tests: await Promise.all(ts.tests.map(evalTestLocally))}))),
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

  async loginGoogle() {
    return signInWithPopup(this.auth, googleProvider);
  }

  async login({email, password}: Partial<{ email: string | null, password: string | null }>) {
    if (email && password) {
      await signInWithEmailAndPassword(this.auth, email, password);
    }
  }

  async appendMutant(m: Mutant<any>) {
    if (this.docUser) {
      const str: string = JSON.stringify( serializeMutant(m) );
      updateDoc(this.docUser, {mutants: arrayUnion( str )})
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
