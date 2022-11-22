import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {DataService, evalMutant} from "../data.service";
import {combineLatest, firstValueFrom, map, Observable, switchMap, from, tap, shareReplay} from "rxjs";
import {User} from "@angular/fire/auth";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {
  getFunctionNameFromCode,
  getSerializedMutantFromCodeComment,
  SerializedMutant, TestCase,
  TestCaseResult, TestSuite, unserializeMutant,
} from "../data/tests-definitions";

interface MutantUI {
  op: string;
  L: {
    mutant: SerializedMutant<any>;
    pass: {ts: TestSuite, tcr: TestCaseResult}[];
    fail: {ts: TestSuite, tcr: TestCaseResult}[];
  }[];
}

@Component({
  selector: 'app-mutants',
  templateUrl: './mutants.component.html',
  styleUrls: ['./mutants.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MutantsComponent implements OnInit {
  readonly mutants: Observable<MutantUI[]>;

  constructor(private dialog: MatDialog,
              private dataService: DataService,
              ) {
    const obsLT = dataService.testSuites;
    this.mutants = combineLatest([dataService.mutants, obsLT]).pipe(
      map( ([LMutants, Lts]) => [LMutants, Lts.reduce( (L, ts) => [...L, ...ts.tests.map( tc => ({tc, ts}) )], [] as {ts: TestSuite, tc: TestCase}[]) ] as const ),
      map( ([LMutants, Ltcts]) => ["isValid", "winner", "play"].map( op => ({
          op,
          LMutants: LMutants.filter( mutant => mutant.op === op),
          Ltcts: Ltcts.filter( ({tc}) => tc.op === op)
        } as {op: string, LMutants: SerializedMutant<any>[], Ltcts: {ts: TestSuite, tc: TestCase}[]}) )
      ),
      tap( Lop => console.log("Lop =", Lop) ),
      map(async Lop => Promise.all( Lop.map(
        async ({op, LMutants, Ltcts}) => ({
          op,
          L: await Promise.all( LMutants.map( async mutant => {
            const LtcRes = await evalMutant(mutant, Ltcts);
            return {
              mutant,
              pass: LtcRes.filter( tstcr =>  tstcr.tcr.pass ),
              fail: LtcRes.filter( tstcr => !tstcr.tcr.pass ),
            }
          }) )
        } )
      ) ) ),
      switchMap( L => from(L) ),
      shareReplay(1)
    );
  }

  ngOnInit(): void {
  }

  get obsUser(): Observable<User | null> {
    return this.dataService.obsUser;
  }

  async addMutant() {
    const dialogRef = this.dialog.open<DialogMutant, {code: string, comment: string}, SerializedMutant<any> | undefined>(DialogMutant, {
      width: '320px',
      data: {code: "", comment: "a new mutant..."}
    });

    const mutant = await firstValueFrom( dialogRef.afterClosed() );
    if (mutant) {
      console.log( mutant );
      await this.dataService.appendMutant( unserializeMutant(mutant) );
    }
  }
}



@Component({
  selector: 'dialog-student-login',
  template: `
      <h2 mat-dialog-title>
        <label>Mutant ({{functionName}})</label>
        <label class="expand"></label>
      </h2>

      <mat-dialog-content>
        <form >
          <mat-form-field appearance="fill" class="block">
            <mat-label>Comment mutant</mat-label>
            <textarea [(ngModel)]="comment" name="comment" matInput placeholder="Comment mutant"></textarea>
          </mat-form-field>
          <mat-form-field appearance="fill" class="block">
            <mat-label>Mutant code</mat-label>
            <textarea [(ngModel)]="code" name="code" matInput placeholder="Mutant code"></textarea>
          </mat-form-field>
        </form>
      </mat-dialog-content>

      <mat-divider></mat-divider>
      <mat-dialog-actions>
        <hr/>
        <button mat-button color="warn" mat-dialog-close (click)="close()">Cancel</button>
        <button mat-button color="primary" [mat-dialog-close]="true" (click)="close({code, comment})" [disabled]="!canValidate">OK</button>
      </mat-dialog-actions>
  `,
  styles: [`
    form {
      display: flex;
      flex-flow: column;
    }

    .expand {
      flex: 1 1;
    }

    h2 {
      display: flex;
      flex-flow: row;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogMutant {
  code    = "";
  comment = "";
  get functionName(): string | undefined {
    return getFunctionNameFromCode(this.code)
  }
  get canValidate(): boolean {
    const name = this.functionName;
    return name === "play" || name === "isValid" || name === "winner";
  }

  constructor(
    public dialogRef: MatDialogRef<DialogMutant, SerializedMutant<any>>,
    @Inject(MAT_DIALOG_DATA) public data: {code: string, comment: string}
  ) {
    this.code = data.code;
    this.comment = data.comment;
  }

  close(data?: {code: string, comment: string}): void {
    this.dialogRef.close(data ? getSerializedMutantFromCodeComment(data) : undefined );
  }

}
