import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authservice:AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    if(this.authservice.loggedInUserDetails()  ){
      return true
    }else{
      return false
    }
  }
}
// if(this.authservice.getPermissions()['buildHistory']){
    //   return true;
    // }
    // else{
    //    return false;
    // }
