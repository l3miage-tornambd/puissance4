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
  readonly evalsObs: Observable<FS_User['evals']>;

  constructor(private dataService: DataService) {
    this.usersObserved = dataService.usersObserved;
    this.evalsObs = dataService.evalsObs;
  }

  ngOnInit(): void {
  }

  get obsUser(): Observable<User | null> {
    return this.dataService.obsUser;
  }

  getStudentName(U: FS_User): string {
    return U.email.split("@")[0]?.split(".").join(" ") ?? "problem...";
  }

  getStudentResult(U: FS_User): FS_User['evals'] {
    return U.evals ?? [];
  }

  forceEval(U: FS_User) {
    this.dataService.forceEvalStudent(U);
  }

  version(E: FS_User['evals']): number {
    return E[0];
  }

  versusCode(E: FS_User['evals']): string {
    const P = E[1].play;
    const V = E[1].isValid;
    const W = E[1].winner;
    return `(pass/total):
            <label class="${V[1] > 0 && V[0] === V[1] ? 'pass' : 'fail'}">isValid: ${V[0]}/${V[1]}</label>
            <label class="${W[1] > 0 && W[0] === W[1] ? 'pass' : 'fail'}"> winner: ${W[0]}/${W[1]}</label>
            <label class="${P[1] > 0 && P[0] === P[1] ? 'pass' : 'fail'}">   play: ${P[0]}/${P[1]}</label>`
  }

  versusMutants(E: FS_User['evals']): string {
    const P = E[2].play;
    const V = E[2].isValid;
    const W = E[2].winner;
    return `(killed/total):
            <label class="${V[1] > 0 && V[0] === V[1] ? 'pass' : 'fail'}">isValid: ${V[0]}/${V[1]}</label>
            <label class="${W[1] > 0 && W[0] === W[1] ? 'pass' : 'fail'}"> winner: ${W[0]}/${W[1]}</label>
            <label class="${P[1] > 0 && P[0] === P[1] ? 'pass' : 'fail'}">   play: ${P[0]}/${P[1]}</label>`

  }

}
