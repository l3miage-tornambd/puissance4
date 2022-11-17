import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-server-tests',
  templateUrl: './server-tests.component.html',
  styleUrls: ['./server-tests.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServerTestsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
