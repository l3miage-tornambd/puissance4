import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GAME_STATE } from 'src/data/grid';
import { isValid } from 'src/data/isValid';
import { PLAY_FAILURE } from 'src/data/play';
import { winner } from 'src/data/winner';
import { TestCase } from '../data.service';

type Mutable<T> = { -readonly [P in keyof T]: T[P] };

@Component({
  selector: 'app-edit-test-case',
  templateUrl: './edit-test-case.component.html',
  styleUrls: ['./edit-test-case.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditTestCaseComponent implements OnInit {
  readonly operations: readonly TestCase["op"][] = ["isValid", "play", "winner"];
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
  readonly expectWinnerValues: ReturnType<typeof winner>[] = [
    "DRAW", "P1", "P2", "no winner yet"
  ];
  readonly expectPlay_allReasons: PLAY_FAILURE["reason"][] = [
    "column is full", "game is over", "no such column"
  ];

  op: TestCase["op"];
  state: GAME_STATE;
  id: string;
  comment = ""

  playColumn: number;
  expectIsValid: Mutable< ReturnType<typeof isValid> >;
  expectWinner:  Mutable< ReturnType<typeof winner> >;
  expectPlaySuccess: boolean;
  expectPlayFailureReason: PLAY_FAILURE["reason"];
  expectNewState: GAME_STATE;

  constructor(private dialogRef: MatDialogRef<EditTestCaseComponent>, @Inject(MAT_DIALOG_DATA) public test: TestCase) {
    this.comment = test.comment;
    this.id = test.id;
    this.op = test.op;
    this.state = test.params[0];
    this.playColumn = test.op === "play" ? test.params[1] : 1;
    this.expectIsValid = test.op === "isValid" ? {...test.expect} : {valid: true};
    this.expectWinner = test.op === "winner" ? test.expect : "no winner yet";
    this.expectPlaySuccess = test.op === "play" ? test.expect.success : false;
    this.expectPlayFailureReason = test.op === "play" && !test.expect.success ? test.expect.reason : "no such column";
    if (test.op === "play" && test.expect.success) {
      this.expectNewState = test.expect.state;
    } else {
      this.expectNewState = {...test.params[0], turn: test.params[0].turn === "P1" ? "P2" : "P1"};
    }
  }

  ngOnInit(): void {
  }

  get statePlay() {
    return this.state
  }

  ok() {
    const ntc: TestCase =
        this.op === "isValid" ? {id: this.id, op: this.op, comment: this.comment, params: [this.state], expect: this.expectIsValid}
        : this.op === "winner" ? {id: this.id, op: this.op, comment: this.comment, params: [this.state], expect: this.expectWinner}
          : {
              id: this.id, op: this.op, comment: this.comment,
              params: [this.state, this.playColumn],
              expect: this.expectPlaySuccess ? {success: true, state: this.expectNewState} : {success: false, reason: this.expectPlayFailureReason}
            }

    this.dialogRef.close( ntc );
  }

  cancel() {
    this.dialogRef.close();
  }

}
