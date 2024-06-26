import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent {
  isLoading: boolean = false;
  private messageService: MessageService;
  password: string = '';
  email: string = '';
  cpassword: string = '';
  name: string = '';
  showErrorMessage: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private route: Router
  ) {}

  passwordsMatch(): boolean {
    return this.password === this.cpassword;
  }
  onfail() {
    if (!this.name || !this.email || !this.password || !this.cpassword) {
      this.showErrorMessage = true;
      return;
    }
  }
  onFormSubmitted(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;
    const name = form.value.name;
    const body = {
      name: form.value.name,
      email: form.value.email,
      usertype: 'user',
      permissionMap: {
        updateEstimateTime: false,
        updateReleaseTag: false,
        updateStoryPoint: false,
        updateStatusBuild: false,
        buildHistory: false,
      },
      status: 'active',
      localId: '',
      authToken: '',
      baseUrl: '',
    };
    this.isLoading = true;
    this.authService.signUp(email, password).subscribe({
      next: (res) => {
        this.isLoading = false;
        console.log(res);
        body.localId = res['localId'];
        console.log('sign up successful');
        this.route.navigate(['/login']);
        this.userDetail(body);
      },
      error: (errMsg) => {
        this.isLoading = false;
        this.errorMessage = errMsg;
        this.hideSnackbar();
      },
    });

    form.reset();
  }

  hideSnackbar() {
    setTimeout(() => {
      this.errorMessage = null;
    }, 3000);
  }

  userDetail(body) {
    const url = `https://jirabuildmngt-default-rtdb.firebaseio.com/users.json`;

    this.http.post(url, body).subscribe(
      (response) => {
        console.log('User details stored successfully in Firestore');
      },
      (error) => {
        console.error('Error storing user details in Firestore:', error);
      }
    );
  }
}
