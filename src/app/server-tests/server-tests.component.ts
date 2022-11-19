import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {DataService} from "../data.service";
import {Observable} from "rxjs";
import {User} from "@angular/fire/auth";

@Component({
  selector: 'app-server-tests',
  templateUrl: './server-tests.component.html',
  styleUrls: ['./server-tests.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServerTestsComponent implements OnInit {

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
  }

  get obsUser(): Observable<User | null> {
    return this.dataService.obsUser;
  }

}
