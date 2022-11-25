import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {DataService} from "../data.service";
import {Observable} from "rxjs";
import {User} from "@angular/fire/auth";
import { DocumentSnapshot} from "@angular/fire/firestore";
import {FS_User} from "../utils";

@Component({
  selector: 'app-server-tests',
  templateUrl: './server-tests.component.html',
  styleUrls: ['./server-tests.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServerTestsComponent implements OnInit {

  constructor(private dataService: DataService) {
  }

  ngOnInit(): void {
  }

  get obsUser(): Observable<User | null> {
    return this.dataService.obsUser;
  }

  getStudentName(snap: DocumentSnapshot<FS_User>): string {
    return snap.id.split("@")[0]?.split(".").join(" ") ?? "problem...";
  }

  getStudentResult(snap: DocumentSnapshot<FS_User>): string {
    return "WiP";
  }

  forceEval(snap: DocumentSnapshot<FS_User>) {
    // get student tests
    this.dataService.forceEvalStudent( snap.ref );
  }
}
