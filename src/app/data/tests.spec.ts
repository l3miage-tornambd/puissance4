import {winner} from "./winner";
import {play} from "./play";
import {isValid} from "./isValid";
import {TestSuite} from "./tests-definitions";
import { dataTests } from "../data-tests/tests";


const Ltests = dataTests.suites as unknown as TestSuite[];

for (const ts of Ltests) {
  describe(ts.label, () => {
    for (const tc of ts.tests) {
      it (tc.comment, () => {
        const res = tc.op === "play" ? play(...tc.params)
                  : tc.op === "winner" ? winner(...tc.params)
                  : isValid(...tc.params);
        expect( res ).toEqual( tc.expect );
      })
    }
  })
}
