import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {DataService} from "../data.service";
import {Observable} from "rxjs";
import {User} from "@angular/fire/auth";
import {FS_User} from "../utils";
import {collection, getDocs} from "@angular/fire/firestore";

@Component({
  selector: 'app-server-tests',
  templateUrl: './server-tests.component.html',
  styleUrls: ['./server-tests.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServerTestsComponent implements OnInit {
  readonly usersObserved: Observable<FS_User[]>;

  constructor(private dataService: DataService) {
    this.usersObserved = dataService.usersObserved;
  }

  ngOnInit(): void {
  }

  get obsUser(): Observable<User | null> {
    return this.dataService.obsUser;
  }

  getStudentName(U: FS_User): string {
    return U.email.split("@")[0]?.split(".").join(" ") ?? "problem...";
  }

  getStudentResult(U: FS_User): undefined | FS_User['evals'] {
    return U.evals;
  }

  forceEval(U: FS_User) {
    this.dataService.forceEvalStudent(U);
  }
}
