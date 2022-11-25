import {ChangeDetectionStrategy, Component, NgZone, OnInit} from '@angular/core';
import {GAME_STATE, getEmptyGrid, GRID, PLAYER} from "../data/grid";
import {winner} from "../data/winner";
import {genNb} from "../grid/grid.component";
import {isValid} from "../data/isValid";
import {CopypasteService} from "../copypaste.service";
import {
  BehaviorSubject,
  Observable,
  shareReplay,
  switchMap,
} from "rxjs";
import { DATAEXEC, EXECTYPE, ExecResult } from '../data/tests-definitions';
import { play } from '../data/play';
import {runInZone} from "../utils";



async function execF<T extends EXECTYPE>(ex: DATAEXEC<T>): Promise<ExecResult<T>> {
  return new Promise( resolve => {
    const worker = new Worker(new URL('../play.worker', import.meta.url));
    const timer = setTimeout(
      () => {
        worker.terminate();
        resolve({exec: "failed", reason: "timeout"});
      },
      1000
    )
    worker.onmessage = (evt: MessageEvent<ExecResult<T>>) => {
      clearTimeout( timer );
      resolve( evt.data );
    };
    worker.postMessage(ex);
  });
}

function nb(grid: GRID, p: GAME_STATE["turn"]): number {
  return grid.reduce(
    (nb, L) => nb + L.reduce( (n, c) => c === p ? 1 + n : n, 0)
    , 0
  )
}

interface STATE {
  gs: GAME_STATE;
  winner: ExecResult<typeof winner>;
  isValid: ExecResult<typeof isValid>;
  nbP1: number;
  nbP2: number;
}

async function gsp2State(gs: GAME_STATE): Promise<STATE> {
  return {
    gs: gs,
    winner: await execF<typeof winner>({op: "winner", params: [gs]}),
    isValid: await execF<typeof isValid>({op: "isValid", params: [gs]}),
    nbP1: nb(gs.grid, "P1"),
    nbP2: nb(gs.grid, "P2"),
  };
}

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayComponent implements OnInit {
  private gs = new BehaviorSubject<GAME_STATE>({
    turn: "P1",
    grid: getEmptyGrid()
  });
  playRes?: ExecResult<typeof play>;
  hover = -1;
  readonly obsState: Observable<STATE>;

  constructor(private cp: CopypasteService, private ngZone: NgZone) {
    this.obsState = this.gs.pipe(
      switchMap( gsp2State ),
      shareReplay(1),
      runInZone( this.ngZone )
    );
  }

  ngOnInit(): void {
  }

  copyGS() {
    this.cp.copyGameState( this.gs.value );
  }
  pasteGS() {
    const state = this.cp.pasteGameState();
    if (state) {
      this.gs.next( state );
    }
  }
  get canPasteGS(): Observable<boolean> {
    return this.cp.canPasteGS;
  }

  async play(col: number) {
    this.playRes = col === undefined ? undefined : await execF<typeof play>({op: "play", params: [this.gs.value, col]});
    const newGS = (!this.playRes || this.playRes.exec === "failed" || !this.playRes.returns.success ) ? this.gs.value : this.playRes.returns.state;
    this.gs.next( newGS );
  }

  get nbLines(): number {
    return Math.max(6, this.gs.value.grid.reduce( (n, L) => n < L.length ? L.length : n, 0) )
  }

  get lines() {
    return [...genNb(this.gs.value.grid, 6)];
  }

  columns(nbL: number): (PLAYER | "EMPTY")[] {
    return this.gs.value.grid.map( col => col[nbL] ?? "EMPTY" );
  }

}

