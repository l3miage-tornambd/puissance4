import { ChangeDetectionStrategy, Component, Input, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { getEmptyGrid } from 'src/data/grid';
import { DataService, TestCase, TestSuite, TestSuiteResults } from '../data.service';
import { EditTestCaseComponent } from '../edit-test-case/edit-test-case.component';
import { DialogEditTestSuiteLabel } from '../local-tests/local-tests.component';

@Component({
  selector: 'app-bloc-tests[suite]',
  templateUrl: './bloc-tests.component.html',
  styleUrls: ['./bloc-tests.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlocTestsComponent implements OnInit {
  @Input() suite!: TestSuite | TestSuiteResults;
  @Input() editable = false;

  constructor(private dataService: DataService, private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  async editLabel() {
    const dialogRef = this.dialog.open<DialogEditTestSuiteLabel, TestSuite, TestSuite | undefined>(DialogEditTestSuiteLabel, {
      width: '320px',
      data: this.suite,
    });

    const res = await firstValueFrom( dialogRef.afterClosed() );
    if (res) {
      console.log( res.label );
      this.dataService.updatetestSuiteLabel( this.suite, res.label );
    }
  }

  async appendTestCase() {
    const tc: TestCase = {id: Date.now().toString(), op: "isValid", comment: "...", params: [{grid: getEmptyGrid(), turn: "P1"}], expect: {valid: true}}
    const dialogRef = this.dialog.open<EditTestCaseComponent, TestCase, TestCase | undefined>(EditTestCaseComponent, {
      width: '90%',
      height: "95%",
      data: tc,
    });

    const ntc = await firstValueFrom( dialogRef.afterClosed() );
    if (ntc) {
      console.log("got a new test case :", ntc);
      this.dataService.appendTestCase( this.suite, ntc );
    }

  }

  async removeTestSuite() {
    this.dataService.removeTestSuite( this.suite );
  }

}
