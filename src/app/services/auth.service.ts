import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  tap,
  throwError,
} from 'rxjs';
import { User } from '../model/user';
import { useAnimation } from '@angular/animations';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loggedIn: boolean = false;
  curid: string | null;
  permissionData: any = {};
  sequence: string = '';
  currentSequence: number = 0;
  public sequenceMap: { [key: string]: number } = {};
  public currentDate: string = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format

  constructor(private http: HttpClient, private route: Router) {}
  resetSequence(): void {
    this.currentDate = new Date().toISOString().slice(0, 10);
    this.currentSequence = 0;
    this.sequenceMap = {};
  }

  signUp(email, password) {
    const data = { email: email, password: password, returnSecureToken: true };
    return this.http
      .post(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAsLkzJKlXlTIs7OnEaXPE8YrdcIC7uL8c',
        data
      )
      .pipe(catchError(this.handleError));
  }

  login(email, password) {
    const data = { email: email, password: password, returnSecureToken: true };
    return this.http
      .post(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAsLkzJKlXlTIs7OnEaXPE8YrdcIC7uL8c',
        data
      )
      .pipe(
        tap((res: any) => {
          if (res && res.localId) {
            sessionStorage.setItem('currentUserId', res.localId);
            this.loggedIn = true;
            sessionStorage.setItem('isLoggedIn', this.loggedIn.toString());
            console.log(res);
          }
        })
      );
  }

  private handleError(err) {
    let errorMessage = 'An unknown error occured';
    if (!err.error || !err.error.error) {
      return throwError(() => errorMessage);
    }
    switch (err.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'email already exists';
        break;
      case 'OPERATION_NOT_ALLOWED':
        errorMessage = 'operation not allowed';
        break;
    }
    return throwError(() => errorMessage);
  }

  logout() {
    this.loggedIn = false;
    sessionStorage.clear();
    this.route.navigate(['/login']);
  }

  getCurrentUserId(): string | null {
    this.curid = sessionStorage.getItem('currentUserId');
    return this.curid;
  }

  isAuthenticated() {
    let loggedIn =
      sessionStorage.getItem('isLoggedIn') !== '' ||
      sessionStorage.getItem('isLoggedIn') != undefined
        ? true
        : false;
    return loggedIn;
  }

  isLoggedIn() {
    return (
      sessionStorage.getItem('currentUserId') !== undefined &&
      sessionStorage.getItem('currentUserId') !== null
    );
  }

  fetchUserdetails(id) {
    this.http
      .get<{ [key: string]: User }>(
        'https://jirabuildmngt-default-rtdb.firebaseio.com/users.json'
      )
      .pipe(
        map((res) => {
          const user = [];
          for (const key in res) {
            if (res.hasOwnProperty(key) && res[key].localId === id) {
              user.push({ ...res[key], id: key });
              sessionStorage.setItem('userDetails', JSON.stringify(user));
              sessionStorage.setItem('baseUrl', res[key].baseUrl);
            }
          }
          return user;
        })
      )
      .subscribe((res) => {
        console.log(res);
      });
  }

  getPermissions() {
    if (
      sessionStorage.getItem('userDetails') &&
      (this.permissionData === undefined ||
        Object.values(this.permissionData).length === 0)
    ) {
      this.permissionData = JSON.parse(
        sessionStorage.getItem('userDetails')
      )[0].permissionMap;
    }
    return this.permissionData;
  }

  getNameFromSession() {
    const userDetails = JSON.parse(sessionStorage.getItem('userDetails'));
    if (userDetails && userDetails.length > 0) {
      return userDetails[0].name;
    } else {
      return null;
    }
  }

  private baseUrl =
    'https://jirabuildmngt-default-rtdb.firebaseio.com/users.json';

  fetchData(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  loggedInUserDetails() {
    return (
      sessionStorage.getItem('userDetails') !== undefined &&
      sessionStorage.getItem('userDetails') !== null
    );
  }
}
