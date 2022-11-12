import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GridComponent } from './grid/grid.component';
import { GameStateComponent } from './game-state/game-state.component';
import { BlocTestsComponent } from './bloc-tests/bloc-tests.component';
import { TestCaseComponent } from './test-case/test-case.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogEditTestSuiteLabel, LocalTestsComponent } from './local-tests/local-tests.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import { EditTestCaseComponent } from './edit-test-case/edit-test-case.component';
import {MatSelectModule} from '@angular/material/select';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';


@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
    GameStateComponent,
    BlocTestsComponent,
    TestCaseComponent,
    LocalTestsComponent,
    DialogEditTestSuiteLabel,
    EditTestCaseComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatToolbarModule,
    BrowserAnimationsModule,
    MatButtonModule, MatIconModule,
    MatDialogModule, MatInputModule,
    MatMenuModule, MatSelectModule, provideFirebaseApp(() => initializeApp(environment.firebase)), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
