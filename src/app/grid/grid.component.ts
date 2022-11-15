import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GAME_STATE, GRID, PLAYER } from 'src/data/grid';

function* genNb(nb: number) {
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
  currentTurn: GAME_STATE["turn"] = "P1";
  hover: number = -1;

  constructor() { }

  ngOnInit(): void {
  }

  get lines() {
    return [...genNb(6)];
  }

  columns(nbL: number): (PLAYER | "EMPTY")[] {
    return this.grid.map( col => col[nbL] ?? "EMPTY" );
  }

  play(col: number) {
    if (this.editable) {
      console.log("play at column", col)
    }
  }

}
