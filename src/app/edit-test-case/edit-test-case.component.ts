import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GAME_STATE, PLAYER } from 'src/data/grid';
import { isValid } from 'src/data/isValid';
import { TestCase } from '../data.service';

@Component({
  selector: 'app-edit-test-case',
  templateUrl: './edit-test-case.component.html',
  styleUrls: ['./edit-test-case.component.scss']
})
export class EditTestCaseComponent implements OnInit {
  readonly operations: readonly TestCase["op"][] = ["isValid", "play", "winner"];
  op: TestCase["op"];
  state: GAME_STATE;
  expect: TestCase["expect"];
  playColumn: number;
  expectIsValid: ReturnType<typeof isValid> = {valid: true};
  get expectIsValid_valid(): boolean {
    return this.expectIsValid.valid;
  }
  set expectIsValid_valid(v: boolean) {
    this.expectIsValid = v ? {valid: true} : {valid: false, reason: this.expectIsValid_reason};
  }
  readonly expectIsValid_allReasons: Exclude<ReturnType<typeof isValid>, {valid: true}>["reason"][] = [
      "There cannot be two winners",
      "column 1 has too much tokens",
      "column 2 has too much tokens",
      "column 3 has too much tokens",
      "column 4 has too much tokens",
      "column 5 has too much tokens",
      "column 6 has too much tokens",
      "column 7 has too much tokens",
      "not the turn of P1",
      "not the turn of P2",
      "too much token for P1",
      "too much token for P2"
    ];
  
  get expectIsValid_reason(): Exclude<ReturnType<typeof isValid>, {valid: true}>["reason"] {
    return this.expectIsValid.valid ? "There cannot be two winners" : this.expectIsValid.reason;
  }
  set expectIsValid_reason(reason: Exclude<ReturnType<typeof isValid>, {valid: true}>["reason"]) {
    this.expectIsValid = {valid: false, reason};
  }
  /**
   * Readonly<{valid: true}>
 | Readonly<{
       valid: false,
       reason: `not the turn of ${PLAYER}`
             | `too much token for ${PLAYER}` // PLAYER has too much token provided that it is the turn of state.turn and P1 begins
             | `column ${1 | 2 | 3 | 4 | 5 | 6 | 7} has too much tokens`
             | `There cannot be two winners`
   }>
   */

  constructor(private dialogRef: MatDialogRef<EditTestCaseComponent>, @Inject(MAT_DIALOG_DATA) public test: TestCase) {
    this.op = test.op;
    this.expect = test.expect;
    this.state = test.params[0];
    this.playColumn = test.op === "play" ? test.params[1] : 1;
    this.expectIsValid_valid = test.op === "isValid" ? test.expect.valid : true;
  }

  ngOnInit(): void {
  }

  get statePlay() {
    return this.state
  }

  ok() {
    this.dialogRef.close(
      this.op === "isValid" ? this.expectIsValid
        : this.op === "winner" ? this.expectWinner
          : this.expectPlay
    );
  }

  cancel() {
    this.dialogRef.close();
  }

}
