import { Component, ChangeDetectionStrategy} from '@angular/core';
import { Auth, sendPasswordResetEmail, User } from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {BehaviorSubject, filter, firstValueFrom, map, Observable, shareReplay} from 'rxjs';
import { DataService } from './data.service';
import {Navigation, NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private userSubj = new BehaviorSubject<User | null>( null );
  readonly userObs: Observable<User | null> = this.userSubj.asObservable();
  readonly obsCurrentRoute: Observable<string>;
  readonly routes: {label: string, url: string}[] = [
    {label: "Play", url: "/play"},
    {label: "Local tests", url: "/local-tests"},
    {label: "Server tests", url: "/server-tests"},
  ]

  constructor(
    private dialog: MatDialog,
    private auth: Auth,
    private dataS: DataService,
    private router: Router,
  ) {
    auth.onAuthStateChanged( this.userSubj );
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
  readonly loginOptions: string[] = [
    "alexandre.demeure@univ-grenoble-alpes.fr", "Adil-Massa.Adomo-Bitea@etu.univ-grenoble-alpes.fr", "Elhadj.Bah@etu.univ-grenoble-alpes.fr", "Ibrahima.Barry2@etu.univ-grenoble-alpes.fr", "Mariama.Barry@etu.univ-grenoble-alpes.fr", "Anas.Benabbou@etu.univ-grenoble-alpes.fr", "Ilian.Benaissa@etu.univ-grenoble-alpes.fr", "Sami.Bensaid@etu.univ-grenoble-alpes.fr", "Mustapha-Mahrez.Bouchelouche@etu.univ-grenoble-alpes.fr", "Walid.Bouhali@etu.univ-grenoble-alpes.fr", "Leo.Bouvier1@etu.univ-grenoble-alpes.fr", "Quentin.Bebin@etu.univ-grenoble-alpes.fr", "Kyllian.Charre@etu.univ-grenoble-alpes.fr", "Vincent.Chazeau@etu.univ-grenoble-alpes.fr", "Seynabou.Conde@etu.univ-grenoble-alpes.fr", "Levi.Cormier@etu.univ-grenoble-alpes.fr", "Samuel.Damessi@etu.univ-grenoble-alpes.fr", "Alex.Delagrange@etu.univ-grenoble-alpes.fr", "Oumou.Dembele@etu.univ-grenoble-alpes.fr", "Fatoumata.Diaby@etu.univ-grenoble-alpes.fr", "Aminata.Diagne@etu.univ-grenoble-alpes.fr", "Thierno.Diallo3@etu.univ-grenoble-alpes.fr", "Tien.Duong@etu.univ-grenoble-alpes.fr", "Anas.El-Bouchrifi@etu.univ-grenoble-alpes.fr", "Mouad.El-Kbabty@etu.univ-grenoble-alpes.fr", "Chaymae.Elkhou@etu.univ-grenoble-alpes.fr", "Khalil.Essouaid@etu.univ-grenoble-alpes.fr", "Abdelkader.Ezarouali@etu.univ-grenoble-alpes.fr", "Matias.Freund-Galeano@etu.univ-grenoble-alpes.fr", "Lucas.Giry@etu.univ-grenoble-alpes.fr", "Quentin.Grange@etu.univ-grenoble-alpes.fr", "Rayane.Guendouz@etu.univ-grenoble-alpes.fr", "Paul.Gueripel@etu.univ-grenoble-alpes.fr", "Jocelin.Heinen@etu.univ-grenoble-alpes.fr", "Floriane.Jandot@etu.univ-grenoble-alpes.fr", "Myriam.Khaddar@etu.univ-grenoble-alpes.fr", "Ibrahim-Goukouni.Khalil@etu.univ-grenoble-alpes.fr", "Zeinabou.Kone@etu.univ-grenoble-alpes.fr", "Hatim.Laghrissi@etu.univ-grenoble-alpes.fr", "Yasmine.Larbi@etu.univ-grenoble-alpes.fr", "Nour.Machmachi@etu.univ-grenoble-alpes.fr", "Salaheddin.Mesouak@etu.univ-grenoble-alpes.fr", "Souleymen.Ouchane@etu.univ-grenoble-alpes.fr", "Lyna.Oulahcene@etu.univ-grenoble-alpes.fr", "Willem.Papeau@etu.univ-grenoble-alpes.fr", "Theo.Patrac@etu.univ-grenoble-alpes.fr", "Timoty.Razafindrabe@etu.univ-grenoble-alpes.fr", "Bastien.Riado@etu.univ-grenoble-alpes.fr", "Ayman.Salouh@etu.univ-grenoble-alpes.fr", "Floreal.Sangenis@etu.univ-grenoble-alpes.fr", "Farah.Seifeddine@etu.univ-grenoble-alpes.fr", "Mariam.Sidibe@etu.univ-grenoble-alpes.fr", "Damien.Tornambe@etu.univ-grenoble-alpes.fr", "Julien.Turc@etu.univ-grenoble-alpes.fr", "Marie.Wyss@etu.univ-grenoble-alpes.fr", "Sicong.Xu@etu.univ-grenoble-alpes.fr", "Mohamad-Majd.Yagan@etu.univ-grenoble-alpes.fr", "Kokouvi.Zodjihoue@etu.univ-grenoble-alpes.fr"
  ].map( s => s.toLowerCase() );
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
