import { Injectable } from '@angular/core';
import {GAME_STATE} from "./data/grid";
import {TestCase} from "./data.service";
import {BehaviorSubject, map, shareReplay} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CopypasteService {
  private gs = new BehaviorSubject<undefined | GAME_STATE>(undefined);
  private testcase = new BehaviorSubject<undefined | TestCase>(undefined);

  readonly canPasteGS = this.gs.pipe( map(gs => !!gs), shareReplay(1) )
  readonly canPasteTC = this.testcase.pipe( map(tc => !!tc), shareReplay(1) )

  constructor() { }

  copyGameState(gs: GAME_STATE) {
    this.gs.next(gs);
  }

  pasteGameState(): undefined | GAME_STATE {
    return this.gs.value;
  }

  copyTestCase(testcase: TestCase) {
    this.testcase.next(testcase);
  }

  pasteTestCase(): undefined | TestCase {
    return this.testcase.value;
  }

}
