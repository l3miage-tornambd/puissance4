import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GAME_STATE } from 'src/data/grid';
import { isValid } from 'src/data/isValid';
import { play } from 'src/data/play';
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

  op: TestCase["op"];
  state: GAME_STATE;

  playColumn: number;
  expectIsValid: Mutable< ReturnType<typeof isValid> >; 
  expectWinner:  Mutable< ReturnType<typeof winner> >;
  expectPlay:    Mutable< ReturnType<typeof play> >;

  /*
  get expectIsValid_valid(): boolean {
    return this.expectIsValid.valid;
  }
  set expectIsValid_valid(v: boolean) {
    this.expectIsValid = v ? {valid: true} : {valid: false, reason: this.expectIsValid_reason};
  }
  
  get expectIsValid_reason(): Exclude<ReturnType<typeof isValid>, {valid: true}>["reason"] {
    return this.expectIsValid.valid ? "There cannot be two winners" : this.expectIsValid.reason;
  }
  set expectIsValid_reason(reason: Exclude<ReturnType<typeof isValid>, {valid: true}>["reason"]) {
    this.expectIsValid = {valid: false, reason};
  }
  */

  constructor(private dialogRef: MatDialogRef<EditTestCaseComponent>, @Inject(MAT_DIALOG_DATA) public test: TestCase) {
    this.op = test.op;
    this.state = test.params[0];
    this.playColumn = test.op === "play" ? test.params[1] : 1;
    this.expectIsValid = test.op === "isValid" ? {...test.expect} : {valid: true};
    this.expectWinner = test.op === "winner" ? test.expect : "no winner yet";
    this.expectPlay = test.op === "play" ? {...test.expect} : {success: false, reason: "no such column"};
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
