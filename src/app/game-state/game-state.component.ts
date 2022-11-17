import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GAME_STATE } from 'src/data/grid';

let copiedGS: GAME_STATE;

@Component({
  selector: 'app-game-state[state]',
  templateUrl: './game-state.component.html',
  styleUrls: ['./game-state.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameStateComponent implements OnInit {
  @Input() editable = false;
  @Input() state!: GAME_STATE
  @Output() update = new EventEmitter<GAME_STATE>();

  constructor() { }

  ngOnInit(): void {
  }

  updateTurn(turn: GAME_STATE["turn"]): void {
    this.update.emit( {...this.state, turn} )
  }

  updateGrid(grid: GAME_STATE["grid"]): void {
    this.update.emit( {...this.state, grid} )
  }


  get canPaste(): boolean {
    return !!copiedGS;
  }

  copy() {
    copiedGS = this.state;
  }

  paste() {
    this.state = copiedGS;
  }

}
