import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {COLUMN, GAME_STATE, GRID, PLAYER} from '../data/grid';

export function* genNb(grid: GRID, nbMin: number) {
  const nb = Math.max(nbMin, grid.reduce( (n, L) => L.length > n ? L.length : n, 0) )
  for (let i = 0; i < nb; i++) {
    yield nb - i - 1;
  }
}

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent implements OnInit {
  @Input() grid!: GRID;
  @Input() editable = false;
  @Output() update = new EventEmitter<GRID>();
  currentTurn: GAME_STATE["turn"] | "DEL" = "P1";
  hover: number = -1;

  constructor() { }

  ngOnInit(): void {
  }

  get nbLines(): number {
    return Math.max(6, this.grid.reduce( (n, L) => n < L.length ? L.length : n, 0) )
  }

  get lines() {
    return [...genNb(this.grid, 6)];
  }

  columns(nbL: number): (PLAYER | "EMPTY")[] {
    return this.grid.map( col => col[nbL] ?? "EMPTY" );
  }

  play(col: number) {
    if (this.editable) {
      if (this.currentTurn === "DEL") {
        this.update.emit(
          this.grid.map((L, i) => {
            if (i !== col) {
              return L;
            } else {
              const nL = [...L];
              nL.pop();
              return nL;
            }
          }) as unknown as GRID
        )
      } else {
        // Publish a new grid
        this.update.emit(
          this.grid.map((L, i) => i !== col ? L : [...L, this.currentTurn]) as unknown as GRID
        )
        this.currentTurn = this.currentTurn === "P1" ? "P2" : "P1";
      }
    }
  }

  get nbP1(): number {
    return this.nb("P1")
  }

  get nbP2(): number {
    return this.nb("P2")
  }

  private nb(p: GAME_STATE["turn"]): number {
    return this.grid.reduce(
      (nb, L) => nb + L.reduce( (n, c) => c === p ? 1 + n : n, 0)
      , 0
    )
  }
}
