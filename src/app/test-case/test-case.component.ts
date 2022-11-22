import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  DataService
} from '../data.service';
import { EditTestCaseComponent } from '../edit-test-case/edit-test-case.component';
import { firstValueFrom } from "rxjs";
import {CopypasteService} from "../copypaste.service";
import { TestSuite, TestSuiteResults, TestCase, TestCaseResult, TestCaseResultPlay } from '../data/tests-definitions';

@Component({
  selector: 'app-test-case[test][suite]',
  templateUrl: './test-case.component.html',
  styleUrls: ['./test-case.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestCaseComponent implements OnInit {
  @Input() suite!: TestSuite | TestSuiteResults;
  @Input() test!: TestCase | TestCaseResult;
  private _details = false;
  @Input()
  get details(): boolean {return this._details}
  set details(d: boolean) {this._details = d; this.detailsChange.emit(d)}
  @Output() detailsChange = new EventEmitter<boolean>();
  selected = false;

  constructor(private dataService: DataService, private dialog: MatDialog, private cp: CopypasteService) { }

  ngOnInit(): void {
  }

  copy() {
    this.cp.copyTestCase( this.test );
  }

  async duplicate() {
    return this.dataService.appendTestCase(this.suite, this.test);
  }

  get asTestPlay(): TestCaseResultPlay {
    return this.test as TestCaseResultPlay;
  }

  get hasResult(): boolean {
    return (this.test as TestCaseResult).result !== undefined;
  }

  get asTestResult(): TestCaseResult {
    return this.test as TestCaseResult;
  }

  get validClass(): string {
    return !this.hasResult ? "" : this.asTestResult.pass ? "pass" : "fail"
  }

  async delete() {
    this.dataService.removeTestCase( this.test );
  }

  async edit() {
    const dialogRef = this.dialog.open<EditTestCaseComponent, TestCase, TestCase | undefined>(EditTestCaseComponent, {
      width: '90%',
      height: "95%",
      data: this.test,
    });

    const res = await firstValueFrom( dialogRef.afterClosed() );
    if (res) {
      this.dataService.updateTestCase( res );
    }
  }

}
