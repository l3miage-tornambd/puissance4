import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { GAME_STATE } from 'src/data/grid';

@Component({
  selector: 'app-game-state[state]',
  templateUrl: './game-state.component.html',
  styleUrls: ['./game-state.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameStateComponent implements OnInit {
  @Input() state!: GAME_STATE;
  @Input() editable = false;

  constructor() { }

  ngOnInit(): void {
  }

}
