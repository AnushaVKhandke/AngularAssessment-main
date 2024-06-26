import { Component, NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LoginComponent } from './login/login.component';


import { HomeComponent } from './components/home/home.component';
import { JiraComponent } from './components/jira/jira.component';
import { BuildHistoryComponent } from './components/build-history/build-history.component';
import { BodyComponent } from './components/body/body.component';
import { AuthGuard } from './gurds/auth.guard';
import { SettingsComponent } from './components/settings/settings.component';
import { PermissionsComponent } from './components/permissions/permissions.component';
import { backbuttonGuard } from './gurds/backbutton.guard';
import { permissionsGuard } from './gurds/permissions.guard';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'body', component: BodyComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canDeactivate: [backbuttonGuard] },
  { path: 'jira', component: JiraComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'build', component: BuildHistoryComponent, canActivate: [permissionsGuard] },
  { path: 'permissions', component: PermissionsComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
