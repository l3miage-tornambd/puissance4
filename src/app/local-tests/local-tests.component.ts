import { ChangeDetectionStrategy, Component, OnInit, Inject } from '@angular/core';
import { User } from '@angular/fire/auth';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { firstValueFrom, Observable } from 'rxjs';
import { DataService, TestSuite, TestSuiteResults } from '../data.service';

@Component({
  selector: 'app-local-tests',
  templateUrl: './local-tests.component.html',
  styleUrls: ['./local-tests.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocalTestsComponent implements OnInit {

  constructor(private dataService: DataService, private dialog: MatDialog) {}

  ngOnInit(): void {
  }

  trackById(i: number, ts: TestSuite): string {
    return ts.id;
  }

  get obsUser(): Observable<User | null> {
    return this.dataService.obsUser;
  }

  get localTestsSuitesResults(): Observable<readonly TestSuiteResults[]> {
    return this.dataService.localTestsSuitesResults;
  }

  async suitesToClipboard(): Promise<string> {
    const L = await firstValueFrom( this.localTestsSuitesResults );
    const str = JSON.stringify( L );
    navigator.clipboard.writeText(str);
    return str;
  }

  async appendTestSuite() {
    const ts: TestSuite = {id: Date.now().toString(), label: "new test suite", tests: []};
    const dialogRef = this.dialog.open<DialogEditTestSuiteLabel, TestSuite, TestSuite | undefined>(DialogEditTestSuiteLabel, {
      width: '320px',
      data: ts,
    });

    const res = await firstValueFrom( dialogRef.afterClosed() );
    if (res) {
      this.dataService.appendTestSuite( res.label );
    }
  }
}


@Component({
  selector: 'dialog-edit-test-suite-label',
  template: `
    <h2 mat-dialog-title>test suite</h2>

    <mat-dialog-content>
      <form class="example-form">
        <mat-form-field class="example-full-width" appearance="fill">
          <mat-label>Test suite label</mat-label>
          <input #newLabel matInput placeholder="label" name="tsLabel" [ngModel]="testSuite.label">
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions>
      <button mat-button color="warn" mat-dialog-close (click)="close()">Cancel</button>
      <button mat-button color="primary" [mat-dialog-close]="true" (click)="close(newLabel.value)">OK</button>
    </mat-dialog-actions>
  `,
})
export class DialogEditTestSuiteLabel {
  constructor(
    public dialogRef: MatDialogRef<DialogEditTestSuiteLabel, TestSuite | undefined>,
    @Inject(MAT_DIALOG_DATA) public testSuite: TestSuite,
  ) {}

  close(label?: string): void {
    this.dialogRef.close(label ? {id: Date.now().toString(), label, tests: []} : undefined);
  }
}
