import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable, map } from 'rxjs';
import { NgForm } from '@angular/forms';

import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  showErrorMessage: boolean = false;
  constructor(
    private authservice: AuthService,
    private route: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {}

  loggedIn: boolean;
  onFormSubmit(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;
    this.authservice.login(email, password).subscribe(
      (res) => {
        console.log(res);
        this.authservice.fetchUserdetails(
          sessionStorage.getItem('currentUserId')
        );
        this.route.navigate(['/jira']);
        console.log('login successful');
        form.reset();
      },
      (err) => {
        console.log(err);
        this.showErrorMessage = true;
      }
    );
  }

  isAdmin(): boolean {
    const currentUserID = this.authservice.getCurrentUserId();
    const adminID = 'w5YLbZibd6e4FzLfJgikSJDVVrJ3';
    console.log(currentUserID);
    return currentUserID === adminID;
  }
}
