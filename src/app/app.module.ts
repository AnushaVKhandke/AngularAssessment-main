import {
  ApplicationConfig,
  NgModule,
  importProvidersFrom,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { HomeComponent } from './components/home/home.component';
import { BodyComponent } from './components/body/body.component';
import { JiraComponent } from './components/jira/jira.component';
import { BuildHistoryComponent } from './components/build-history/build-history.component';
import { ChipsModule } from 'primeng/chips';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { AuthGuard } from './gurds/auth.guard';
import { LoaderComponent } from './utility/loader/loader.component';
import { SnackbarComponent } from './utility/snackbar/snackbar.component';
import { SettingsComponent } from './components/settings/settings.component';

import { PermissionsComponent } from './components/permissions/permissions.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthTokenInterceptor } from './services/auth-interceptors.service';
import { SecondsToHoursPipe } from './seconds-to-hours.pipe';
import { MultilineformatPipe } from './multilineformat.pipe';
import { permissionsGuard } from './gurds/permissions.guard';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    HomeComponent,
    BodyComponent,
    JiraComponent,
    BuildHistoryComponent,
    LoaderComponent,
    SnackbarComponent,
    SettingsComponent,
    PermissionsComponent,
    SecondsToHoursPipe,
    MultilineformatPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    InputTextModule,
    ReactiveFormsModule,
    ButtonModule,
    CheckboxModule,
    FormsModule,
    HttpClientModule,
    ChipsModule,
    InputSwitchModule,
    TableModule,
    ToastModule,
    BrowserAnimationsModule,
    DialogModule,
  ],
  providers: [
    AuthGuard,
    permissionsGuard,
    MessageService,
    ConfirmationService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true },
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
