import {ChangeDetectionStrategy, Component, Input, OnInit, Inject, ViewChildren, QueryList} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {firstValueFrom, Observable} from 'rxjs';
import { getEmptyGrid } from '../data/grid';
import { DataService, TestCase, TestSuite, TestSuiteResults } from '../data.service';
import { EditTestCaseComponent } from '../edit-test-case/edit-test-case.component';
import { DialogEditTestSuiteLabel } from '../local-tests/local-tests.component';
import {CopypasteService} from "../copypaste.service";
import {CdkDragDrop} from "@angular/cdk/drag-drop";


@Component({
  selector: 'app-bloc-tests[suite]',
  templateUrl: './bloc-tests.component.html',
  styleUrls: ['./bloc-tests.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlocTestsComponent implements OnInit {
  private _suite!: TestSuite | TestSuiteResults;
  private stat = {nb: 0, nbOK: 0};
  Ldetails: boolean[] = [];
  showList = true;
  @Input()
  get suite(): TestSuite | TestSuiteResults {
    return this._suite;
  }
  set suite(S: TestSuite | TestSuiteResults) {
    this._suite = S;
    this.Ldetails = S.tests.map( (_, i) => this.Ldetails[i] ?? false );
    const L = (this.suite as TestSuiteResults).tests;
    this.stat.nb = L.length;
    this.stat.nbOK = L.reduce((nb, tc) => tc.pass ? nb + 1 : nb, 0);
  }

  @Input() editable = false;

  constructor(private dataService: DataService, private dialog: MatDialog, private cp: CopypasteService) { }

  ngOnInit(): void {
  }

  drop(evt: CdkDragDrop<TestSuite, TestSuite, TestCase>) {
    this.dataService.MoveTestCase({
      testcase: evt.item.data,
      from: evt.previousContainer.data,
      to: evt.container.data,
      atIndex: evt.currentIndex
    })
  }

  trackById(i: number, tc: TestCase): string {
    return tc.id;
  }

  get passAll(): boolean {
    return this.stat.nbOK === this.stat.nb;
  }

  get resultLabel(): string {
    if ( (this.suite as TestSuiteResults).tests[0]?.pass !== undefined ) {
      return `(${this.stat.nbOK}/${this.stat.nb})`
    } else {
      return '';
    }
  }

  get label(): string {
    return `${this.suite.label} ${this.resultLabel}`;
  }

  get details(): boolean {
    return this.Ldetails.reduce( (acc, d) => acc && d, true ) ?? false;
  }
  set details(d: boolean) {
    for (let i = 0; i < this.Ldetails.length; i++) {
      this.Ldetails[i] = d;
    }
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

  get canPaste(): Observable<boolean> {
    return this.cp.canPasteTC;
  }

  paste() {
    const tc = this.cp.pasteTestCase();
    if (tc) {
      this.dataService.appendTestCase(this.suite, tc);
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
