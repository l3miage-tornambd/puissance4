import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocalTestsComponent } from './local-tests/local-tests.component';

const routes: Routes = [
  {path: 'local-tests', component: LocalTestsComponent},
  {path: '', redirectTo: '/local-tests', pathMatch: 'full'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
