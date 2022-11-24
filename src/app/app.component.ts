import { Component, ChangeDetectionStrategy} from '@angular/core';
import { Auth, sendPasswordResetEmail, User } from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {BehaviorSubject, filter, firstValueFrom, map, Observable, of, shareReplay} from 'rxjs';
import {DataService} from './data.service';
import {NavigationEnd, Router} from "@angular/router";
import {logins} from "./utils";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private userSubj = new BehaviorSubject<User | null>( null );
  readonly userObs: Observable<User | null> = this.userSubj.asObservable();
  readonly obsCurrentRoute: Observable<string>;
  readonly routes: Observable<{label: string, url: string}[]>;

  constructor(
    private dialog: MatDialog,
    private auth: Auth,
    private dataS: DataService,
    private router: Router,
  ) {
    auth.onAuthStateChanged( this.userSubj );
    this.routes = this.userObs.pipe(
      map( u => u ? [
        {label: "Play", url: "/play"},
        {label: "Local tests", url: "/local-tests"},
        {label: "Mutants", url: "/mutants"},
        {label: "Evaluations", url: "/server-tests"},
      ] : [{label: "Play", url: "/play"}] )
    )
    this.obsCurrentRoute = router.events.pipe(
      filter( e => e instanceof NavigationEnd ),
      map( e => (e as NavigationEnd).url ),
      shareReplay(1)
    )
  }

  async loginStudent() {
    const dialogRef = this.dialog.open<DialogStudentLogin, void, void>(DialogStudentLogin, {
      width: '480px'
    });
    return firstValueFrom( dialogRef.afterClosed() );
  }

  async logout() {
    return this.dataS.logout();
  }

}



@Component({
  selector: 'dialog-student-login',
  template: `
    <h2 mat-dialog-title>
      <label>Student login</label>
      <label class="expand"></label>
      <button mat-raised-button color="warn" (click)="passForgotten()" [disabled]="!(emailInList | async) || reset">Password forgotten</button>
    </h2>

    <ng-container *ngIf="!reset; else resetCont">
      <mat-dialog-content>
        <form [formGroup]="fg">
          <mat-form-field appearance="fill">
            <mat-label>Login (UGA email)</mat-label>
            <input matInput placeholder="UGA mail" formControlName="email" [matAutocomplete]="auto">
            <mat-autocomplete #auto="matAutocomplete">
              <mat-option *ngFor="let option of filteredLoginOptions | async" [value]="option">
                {{option}}
              </mat-option>
            </mat-autocomplete>
          </mat-form-field>
          <mat-form-field appearance="fill">
            <mat-label>Password</mat-label>
            <input matInput type="password" placeholder="password" formControlName="password">
          </mat-form-field>
        </form>
      </mat-dialog-content>

      <mat-divider></mat-divider>
      <mat-dialog-actions>
        <hr/>
        <button mat-button color="warn" mat-dialog-close (click)="close()">Cancel</button>
        <button mat-button color="primary" [mat-dialog-close]="true" (click)="connect()" [disabled]="!fg.valid">OK</button>
      </mat-dialog-actions>
    </ng-container>
    <ng-template #resetCont>
      <mat-dialog-content>
        Check your mail to reset your password...
      </mat-dialog-content>
    </ng-template>
  `,
  styles: [`
    form {
      display: flex;
      flex-flow: column;
    }

    .expand {
      flex: 1 1;
    }

    h2 {
      display: flex;
      flex-flow: row;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogStudentLogin {
  reset = false;
  readonly loginOptions: string[] = logins.map( s => s.toLowerCase() );
  filteredLoginOptions: Observable<string[]>;

  readonly fg = new FormGroup({
    email: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required])
  });

  readonly emailInList = this.fg.valueChanges.pipe(
    map(v => (v.email ?? "").toLowerCase() ),
    map( s => this.loginOptions.indexOf(s) >= 0 )
  );

  constructor(
    public dialogRef: MatDialogRef<DialogStudentLogin, void>,
    private dataS: DataService,
    private auth: Auth,
  ) {
    this.filteredLoginOptions = this.fg.valueChanges.pipe(
      map(v => (v.email ?? "").toLowerCase() ),
      map(s => this.loginOptions.filter(log => log.indexOf(s) >= 0 ) )
    )
  }

  close(): void {
    this.dialogRef.close();
  }

  connect() {
    this.dataS.login( this.fg.value );
    this.close();
  }

  passForgotten() {
    const email = this.fg.value.email;
    if (email) {
      sendPasswordResetEmail(this.auth, email, { url: 'http://localhost:4200' });
      this.reset = true;
    }
  }

}
