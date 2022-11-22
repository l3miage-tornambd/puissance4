/// <reference lib="webworker" />

import { isValid } from "./data/isValid";
import { play } from "./data/play";
import { winner } from "./data/winner";
import * as deepEqual from 'fast-deep-equal';
import { ExecResult, TestCase, TestCaseResult } from "./data/tests-definitions";

addEventListener('message', (evt: MessageEvent<TestCase>) => {
  const t = evt.data;
  let res: TestCaseResult;
  try {
    const tcr = t.op === "isValid" ? {...t, result: {exec: "success", returns: isValid(...t.params)} as ExecResult<typeof isValid>}
                    : t.op === "winner" ? {...t, result: {exec: "success", returns: winner(...t.params)} as ExecResult<typeof winner>}
                      : {...t, result: {exec: "success", returns: play(...t.params)} as ExecResult<typeof play>};
    res = {...tcr, pass: tcr.result.exec === "failed" ? false : deepEqual(tcr.expect, tcr.result.returns)}
  } catch(err) {
    res = {...t, pass: false, result: {exec: "failed", reason: `error: ${err}`}};
  }
  postMessage( res );
  close();
});
