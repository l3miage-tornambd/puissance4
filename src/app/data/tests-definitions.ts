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

export interface Mutant<T extends EXECTYPE> {
  op: T extends typeof isValid ? "isValid"
    : T extends typeof winner ? "winner"
    : T extends typeof play ? "play"
    : never;
  comment: string;
  f: T
}

export interface SerializedMutant<T extends EXECTYPE> {
  op: T extends typeof isValid ? "isValid"
    : T extends typeof winner ? "winner"
      : T extends typeof play ? "play"
        : never;
  comment: string;
  code: string;
  body: string;
  args: string[];
}

export function serializeMutant<T extends EXECTYPE>(m: Mutant<T>): SerializedMutant<T> {
  // Non robuste
  const code = m.f.toString();
  const body = getFunctionBodyFromCode(code);
  const args = getFunctionArgsFromCode(code);
  return {
    ...m,
    code,
    body,
    args
  }
}

export function unserializeMutant<T extends EXECTYPE>(m: SerializedMutant<T>): Mutant<T>{
  return {
    ...m,
    f: new Function(...m.args, m.body) as Mutant<T>["f"]
  }
}

export function getFunctionBodyFromCode(code: string): string {
  return code.slice(code.indexOf("{") + 1, code.lastIndexOf("}"))
}

export function getFunctionNameFromCode(str: string): string | undefined {
  return str.match(/function(.*?)\(/)?.[1].trim();
}

export function getFunctionArgsFromCode(code: string): string[] {
  return code.slice(code.indexOf("(") + 1, code.indexOf(")")).split(",").map( s => s.trim() );
}

export function getSerializedMutantFromCodeComment({code, comment}: {code: string, comment: string}): undefined | SerializedMutant<any> {
  const op = getFunctionNameFromCode(code);
  if (op === "isValid" || op === "winner" || op === "play") {
    return {
      op,
      comment,
      code,
      body: getFunctionBodyFromCode(code),
      args: getFunctionArgsFromCode(code)
    };
  }
  return undefined;
}

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
