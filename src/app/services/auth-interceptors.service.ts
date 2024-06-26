import { Injectable } from '@angular/core';


import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {

  constructor() {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    const userDetailsString = sessionStorage.getItem('userDetails');

  if (userDetailsString !== undefined && userDetailsString !== null) {

    const userDetails = JSON.parse(userDetailsString);
    const authToken = userDetails[0].authToken;
    console.log("authtoken is",authToken)
    localStorage.setItem(authToken,authToken)

    const authReq = req.clone({
      setHeaders: {
        Authorization: 'Basic ' + authToken,
      }
    });

   
    return next.handle(authReq);
  } else {
    
    return next.handle(req);
  }
}
  
  }

  
   
     


