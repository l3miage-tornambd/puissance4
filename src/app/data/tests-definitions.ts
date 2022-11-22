import { isValid } from "./isValid";
import { play } from "./play";
import { winner } from "./winner";

export type TestCaseIsValid = Readonly<{id: string, op: "isValid", comment: string, params: Parameters<typeof isValid>, expect: ReturnType<typeof isValid>}>;
export type TestCaseWinner  = Readonly<{id: string, op: "winner", comment: string, params: Parameters<typeof winner>, expect: ReturnType<typeof winner>}>
export type TestCasePlay    = Readonly<{id: string, op: "play", comment: string, params: Parameters<typeof play>, expect: ReturnType<typeof play>}>
export type TestCase = TestCaseIsValid | TestCaseWinner | TestCasePlay;

export type EXECTYPE = typeof winner | typeof play | typeof isValid;
export type ExecResult<T extends EXECTYPE> = {exec: "failed", reason: "timeout" | `error: ${string}`}
                          | {exec: "success", returns: ReturnType<T>}
export type TestCaseResultIsValid = TestCaseIsValid & Readonly<{pass: boolean, result: ExecResult<typeof isValid>}>
export type TestCaseResultWinner  = TestCaseWinner  & Readonly<{pass: boolean, result: ExecResult<typeof winner>}>
export type TestCaseResultPlay    = TestCasePlay    & Readonly<{pass: boolean, result: ExecResult<typeof play>}>
export type TestCaseResult = TestCaseResultIsValid | TestCaseResultWinner | TestCaseResultPlay;

export type DATAEXEC<T extends EXECTYPE> = T extends typeof winner ? Pick<TestCaseWinner , "op" | "params">
                                         : T extends typeof play ? Pick<TestCasePlay   , "op" | "params">
                                         : Pick<TestCaseIsValid, "op" | "params">

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
