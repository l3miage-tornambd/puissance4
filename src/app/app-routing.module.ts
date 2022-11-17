import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocalTestsComponent } from './local-tests/local-tests.component';
import {PlayComponent} from "./play/play.component";
import {ServerTestsComponent} from "./server-tests/server-tests.component";

const routes: Routes = [
  {path: 'local-tests', component: LocalTestsComponent},
  {path: 'server-tests', component: ServerTestsComponent},
  {path: 'play', component: PlayComponent},
  {path: '**', redirectTo: '/play'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
