/// <reference lib="webworker" />

import { isValid } from "./data/isValid";
import { play } from "./data/play";
import { winner } from "./data/winner";
import { DATAEXEC, ExecResult, EXECTYPE } from "./data/tests-definitions";

addEventListener('message', (evt: MessageEvent<DATAEXEC<EXECTYPE>>) => {
  const t = evt.data;
  
  let res: ExecResult<EXECTYPE>;
  try {
    res = t.op === "isValid" ? {exec: "success", returns: isValid(...t.params)} as ExecResult<typeof isValid>
                    : t.op === "winner" ? {exec: "success", returns: winner(...t.params)} as ExecResult<typeof winner>
                      : {exec: "success", returns: play(...t.params)} as ExecResult<typeof play>;
  } catch(err) {
    res = {exec: "failed", reason: `error: ${err}`}
  }
  postMessage( res );
  close();
});
