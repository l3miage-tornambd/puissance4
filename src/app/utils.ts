import {SerializedMutant, TestCase, TestCaseResult, TestSuite} from "./data/tests-definitions";
import {FirestoreDataConverter, WithFieldValue} from "@angular/fire/firestore";
import {play} from "./data/play";
import {NgZone} from "@angular/core";
import {Observable, OperatorFunction} from "rxjs";

export const logins: readonly string[] = [
  "alexandre.demeure@univ-grenoble-alpes.fr", "sybille.caffiau@univ-grenoble-alpes.fr", "Adil-Massa.Adomo-Bitea@etu.univ-grenoble-alpes.fr", "Elhadj.Bah@etu.univ-grenoble-alpes.fr", "Ibrahima.Barry2@etu.univ-grenoble-alpes.fr", "Mariama.Barry@etu.univ-grenoble-alpes.fr", "Anas.Benabbou@etu.univ-grenoble-alpes.fr", "Ilian.Benaissa@etu.univ-grenoble-alpes.fr", "Sami.Bensaid@etu.univ-grenoble-alpes.fr", "Mustapha-Mahrez.Bouchelouche@etu.univ-grenoble-alpes.fr", "Walid.Bouhali@etu.univ-grenoble-alpes.fr", "Leo.Bouvier1@etu.univ-grenoble-alpes.fr", "Quentin.Bebin@etu.univ-grenoble-alpes.fr", "Kyllian.Charre@etu.univ-grenoble-alpes.fr", "Vincent.Chazeau@etu.univ-grenoble-alpes.fr", "Seynabou.Conde@etu.univ-grenoble-alpes.fr", "Levi.Cormier@etu.univ-grenoble-alpes.fr", "Samuel.Damessi@etu.univ-grenoble-alpes.fr", "Alex.Delagrange@etu.univ-grenoble-alpes.fr", "Oumou.Dembele@etu.univ-grenoble-alpes.fr", "Fatoumata.Diaby@etu.univ-grenoble-alpes.fr", "Aminata.Diagne@etu.univ-grenoble-alpes.fr", "Thierno.Diallo3@etu.univ-grenoble-alpes.fr", "Tien.Duong@etu.univ-grenoble-alpes.fr", "Anas.El-Bouchrifi@etu.univ-grenoble-alpes.fr", "Mouad.El-Kbabty@etu.univ-grenoble-alpes.fr", "Chaymae.Elkhou@etu.univ-grenoble-alpes.fr", "Khalil.Essouaid@etu.univ-grenoble-alpes.fr", "Abdelkader.Ezarouali@etu.univ-grenoble-alpes.fr", "Matias.Freund-Galeano@etu.univ-grenoble-alpes.fr", "Lucas.Giry@etu.univ-grenoble-alpes.fr", "Quentin.Grange@etu.univ-grenoble-alpes.fr", "Rayane.Guendouz@etu.univ-grenoble-alpes.fr", "Paul.Gueripel@etu.univ-grenoble-alpes.fr", "Jocelin.Heinen@etu.univ-grenoble-alpes.fr", "Floriane.Jandot@etu.univ-grenoble-alpes.fr", "Myriam.Khaddar@etu.univ-grenoble-alpes.fr", "Ibrahim-Goukouni.Khalil@etu.univ-grenoble-alpes.fr", "Zeinabou.Kone@etu.univ-grenoble-alpes.fr", "Hatim.Laghrissi@etu.univ-grenoble-alpes.fr", "Yasmine.Larbi@etu.univ-grenoble-alpes.fr", "Nour.Machmachi@etu.univ-grenoble-alpes.fr", "Salaheddin.Mesouak@etu.univ-grenoble-alpes.fr", "Souleymen.Ouchane@etu.univ-grenoble-alpes.fr", "Lyna.Oulahcene@etu.univ-grenoble-alpes.fr", "Willem.Papeau@etu.univ-grenoble-alpes.fr", "Theo.Patrac@etu.univ-grenoble-alpes.fr", "Timoty.Razafindrabe@etu.univ-grenoble-alpes.fr", "Bastien.Riado@etu.univ-grenoble-alpes.fr", "Ayman.Salouh@etu.univ-grenoble-alpes.fr", "Floreal.Sangenis@etu.univ-grenoble-alpes.fr", "Farah.Seifeddine@etu.univ-grenoble-alpes.fr", "Mariam.Sidibe@etu.univ-grenoble-alpes.fr", "Damien.Tornambe@etu.univ-grenoble-alpes.fr", "Julien.Turc@etu.univ-grenoble-alpes.fr", "Marie.Wyss@etu.univ-grenoble-alpes.fr", "Sicong.Xu@etu.univ-grenoble-alpes.fr", "Mohamad-Majd.Yagan@etu.univ-grenoble-alpes.fr", "Kokouvi.Zodjihoue@etu.univ-grenoble-alpes.fr"
];

export async function evalMutant(mutant: SerializedMutant<any>, Ltcts: { ts: TestSuite, tc: TestCase }[]): Promise<{ ts: TestSuite, tcr: TestCaseResult }[]> {
  const Ltc = Ltcts.map(({tc}) => tc);
  const worker = new Worker(new URL('./eval-mutant.worker', import.meta.url));
  return new Promise<{ ts: TestSuite, tcr: TestCaseResult }[]>(resolve => {
    const timer = setTimeout(
      async () => {
        worker.terminate();
        if (Ltcts.length === 1) {
          const {ts, tc} = Ltcts[0];
          resolve([{ts, tcr: {...tc, pass: false, result: {exec: "failed", reason: "timeout"}}}]);
        } else {
          // Try one by one
          console.error("mutant test timeout, try one by one:", mutant, Ltcts);
          const L = await Promise.all(Ltcts.map(tcts => evalMutant(mutant, [tcts])));
          resolve(L.flatMap(l => l));
        }
      },
      1000
    );

    // Subscribe to worker response
    worker.onmessage = (evt: MessageEvent<TestCaseResult[]>) => {
      clearTimeout(timer);
      const Ltcr = evt.data;
      resolve(Ltcr.map((tcr, i) => ({tcr, ts: Ltcts[i].ts})));
    };

    // Send list to process seriMutant
    const msg: { Ltc: TestCase[], seriMutant: SerializedMutant<any> } = {Ltc, seriMutant: mutant};
    worker.postMessage(msg)
  });

}

export function evalTestsLocally(Lt: readonly TestCase[]): Promise<readonly TestCaseResult[]> {
  return new Promise<readonly TestCaseResult[]>(resolve => {
    const worker = new Worker(new URL('./test-case.worker', import.meta.url));
    const timer = setTimeout(
      async () => {
        worker.terminate();
        if (Lt.length === 1) {
          resolve([{...Lt[0], pass: false, result: {exec: "failed", reason: "timeout"}}]);
        } else {
          // Try one by one
          console.error("timeout... try one by one:", Lt);
          const L = await Promise.all(Lt.map(t => evalTestsLocally([t])));
          resolve(L.flatMap(lt => lt))
        }
      },
      1000
    )
    worker.onmessage = (evt: MessageEvent<readonly TestCaseResult[]>) => {
      clearTimeout(timer);
      resolve(evt.data);
    };
    worker.postMessage(Lt);
  });
}

export interface FS_TestSuite {
  id: string;
  label: string;
  LtestIds: string[];
}

export const TestSuiteConverter: FirestoreDataConverter<FS_TestSuite> = {
  toFirestore: ts => ts,
  fromFirestore: d => d.data() as FS_TestSuite,
}
export const TestCaseConverter: FirestoreDataConverter<TestCase> = {
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

export interface STAT<T> {
  play: T;
  isValid: T;
  winner: T;
}

export interface FS_User {
  email: string;
  mutants: string[];
  testsVersion: number;
  canObserve?: string;
  evals: [
    version: number,
    testsVersusCoderef: STAT<[pass: number, total: number]>,
    testsVersusMutants: STAT<[eliminate: number, total: number]>,
  ]
}

export const UserConverter: FirestoreDataConverter<FS_User> = {
  toFirestore: (U: WithFieldValue<FS_User>) => U,
  fromFirestore: U => ({
    email: U.id,
    canObserve: U.get("canObserve"),
    mutants: U.get("mutants") ?? [],
    testsVersion: U.get("testsVersion") ?? 0,
    evals: U.get("evals") ?? [
      -1,
      {play: [0,0], isValid: [0,0], winner: [0,0]},
      {play: [0,0], isValid: [0,0], winner: [0,0]},
    ] as FS_User["evals"]
  })
}

export interface LocalSave {
  readonly userMail: string;
  readonly version: number;
  readonly testSuites: readonly TestSuite[]
}




export function runInZone<T>(zone: NgZone): OperatorFunction<T, T> {
  return (source) => {
    return new Observable(observer => {
      const onNext = (value: T) => zone.run(() => observer.next(value));
      const onError = (e: any) => zone.run(() => observer.error(e));
      const onComplete = () => zone.run(() => observer.complete());
      return source.subscribe(onNext, onError, onComplete);
    });
  };
}
