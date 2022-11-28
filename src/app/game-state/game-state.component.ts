import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GAME_STATE } from '../data/grid';
import {CopypasteService} from "../copypaste.service";
import {Observable} from "rxjs";

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

  constructor(private cp: CopypasteService) { }

  ngOnInit(): void {
  }

  updateTurn(turn: GAME_STATE["turn"]): void {
    this.update.emit( {...this.state, turn} )
  }

  updateGrid(grid: GAME_STATE["grid"]): void {
    this.update.emit( {...this.state, grid} )
  }


  get canPaste(): Observable<boolean> {
    return this.cp.canPasteGS
  }

  copy() {
    this.cp.copyGameState( this.state );
  }

  paste() {
    const state = this.cp.pasteGameState();
    if (state) {
      this.update.emit(this.state = state);
    }
  }

}
