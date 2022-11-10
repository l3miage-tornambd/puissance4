import { Injectable } from '@angular/core';
import * as deepEqual from 'fast-deep-equal';
import { BehaviorSubject, map, Observable, of, shareReplay, tap } from 'rxjs';
import { getEmptyGrid } from 'src/data/grid';
import { isValid } from "src/data/isValid"
import { play } from 'src/data/play';
import { winner } from 'src/data/winner';

export type TestCase = Readonly<{id: string, op: "isValid", comment: string, params: Parameters<typeof isValid>, expect: ReturnType<typeof isValid>}>
                     | Readonly<{id: string, op: "winner", comment: string, params: Parameters<typeof winner>, expect: ReturnType<typeof winner>}>
                     | Readonly<{id: string, op: "play", comment: string, params: Parameters<typeof play>, expect: ReturnType<typeof play>}>

export type TestCaseResult = Readonly<{id: string, op: "isValid", comment: string, params: Parameters<typeof isValid>, expect: ReturnType<typeof isValid>, pass: boolean, result: ReturnType<typeof isValid>}>
                           | Readonly<{id: string, op: "winner", comment: string, params: Parameters<typeof winner>, expect: ReturnType<typeof winner>, pass: boolean, result: ReturnType<typeof winner>}>
                           | Readonly<{id: string, op: "play", comment: string, params: Parameters<typeof play>, expect: ReturnType<typeof play>, pass: boolean, result: ReturnType<typeof play>}>

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


@Injectable({
  providedIn: 'root'
})
export class DataService {
  private testSuitesBS = new BehaviorSubject<TestSuite[]>([]);
  readonly testSuites = this.testSuitesBS.asObservable();
  readonly localTestsSuitesResults: Observable<TestSuiteResults[]> = this.testSuites.pipe(
    tap( Lts => console.log("Lts =", Lts) ),
    map( Lts => Lts.map( ts => ({...ts, tests: ts.tests.map( evalTestLocally ) }) )
    ),
    shareReplay(1)
  );

  constructor() {
    this.testSuitesBS.next([
      {
        id: "ts::1",
        label: "tests for isValid",
        tests: [
          {id: "tc::1", op: "play", comment: "play at 3 on empty grid is OK if P1 turn", params: [{grid: getEmptyGrid(), turn: "P1"}, 1], expect: {success: true, state: {grid: [[], [], ["P1"], [], [], [], []], turn: "P2"}}},
          {id: "tc::2", op: "isValid", comment: "empty grid is not OK if P2 turn", params: [{grid: getEmptyGrid(), turn: "P2"}], expect: {valid: false, reason: "not the turn of P2"}},
          {id: "tc::3", op: "isValid", comment: "2 tokens P1 and a token P2 => not the turn of P1", params: [{grid: [[], [], [], ["P1", "P1"], ["P2"], [], []], turn: "P1"}], expect: {valid: false, reason: "not the turn of P1"}},
        ]
      }
    ]);
  }

  async appendTestSuite(label: string) {
    const L = this.testSuitesBS.value;
    this.testSuitesBS.next([...L, {id: Date.now().toString(), label, tests: []}]);
  }

  async removeTestSuite(suite: TestSuite) {
    const L = this.testSuitesBS.value;
    this.testSuitesBS.next( L.filter(ts => ts.id !== suite.id) );
  }

  async updatetestSuiteLabel(suite: TestSuite, label: string) {
    const L = this.testSuitesBS.value;
    this.testSuitesBS.next( L.map(ts => ts.id !== suite.id ? ts : {...suite, label} ) );
  }

  async updateTestCase(testCase: TestCase) {
    const L = this.testSuitesBS.value;
    this.testSuitesBS.next(
      L.map( ts => {
        // Is the original here ?
        if (ts.tests.find( tc => tc.id === testCase.id)) {
          return {...ts, tests: ts.tests.map( tc => tc.id !== testCase.id ? tc : testCase) }
        }
        return ts;
      })
    );
  }

  async appendTestCase(suite: TestSuite, tc: TestCase) {
    const L = this.testSuitesBS.value;
    this.testSuitesBS.next(
      L.map( ts => ts.id !== suite.id ? ts : {...ts, tests: [...ts.tests, tc]} )
    );
  }

  async removeTestCase(tcr: TestCase) {
    const L = this.testSuitesBS.value;
    this.testSuitesBS.next(
      L.map( ts => {
        if (ts.tests.find( tc => tc.id === tcr.id )) {
          return {...ts, tests: ts.tests.filter( tc => tc.id !== tcr.id ) }
        }
        return ts;
      })
    );
  }

}
