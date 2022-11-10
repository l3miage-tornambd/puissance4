import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataService, TestCase, TestCaseResult } from '../data.service';
import { EditTestCaseComponent } from '../edit-test-case/edit-test-case.component';
import { firstValueFrom } from "rxjs";

@Component({
  selector: 'app-test-case[test]',
  templateUrl: './test-case.component.html',
  styleUrls: ['./test-case.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestCaseComponent implements OnInit {
  @Input() test!: TestCase | TestCaseResult;

  constructor(private dataService: DataService, private dialog: MatDialog) { }

  ngOnInit(): void {
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
