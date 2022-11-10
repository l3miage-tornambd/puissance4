import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { GRID, PLAYER } from 'src/data/grid';

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

  constructor() { }

  ngOnInit(): void {
  }

  get lines() {
    return [...genNb(6)];
  }

  columns(nbL: number): (PLAYER | "EMPTY")[] {
    return this.grid.map( col => col[nbL] ?? "EMPTY" );
  }

}
