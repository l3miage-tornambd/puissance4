/// <reference lib="webworker" />

import {ExecResult, SerializedMutant, TestCase, TestCaseResult, unserializeMutant} from "./data/tests-definitions";
import * as deepEqual from 'fast-deep-equal';

addEventListener('message', (evt: MessageEvent<{Ltc: TestCase[], seriMutant: SerializedMutant<any>}>) => {
  const {Ltc, seriMutant} = evt.data;
  const mutant = unserializeMutant<any>(seriMutant);

  const Lres: TestCaseResult[] = [];
  for (const tc of Ltc) {
    let res: TestCaseResult;
    try {
      const fres = mutant.f(...tc.params);
      if (!fres) {
        console.error("Problem evaluating mutant, returns", fres, "for", mutant.f, seriMutant);
      }
      const tcr = {...tc, result: {exec: "success", returns: fres} as ExecResult<any>};
      res = {...tcr, pass: tcr.result.exec === "success" && deepEqual(tcr.expect, tcr.result.returns)}
    } catch (err) {
      res = {...tc, pass: false, result: {exec: "failed", reason: `error: ${err}`}};
    }
    Lres.push(res);
  }
  postMessage( Lres );
  close();
});
