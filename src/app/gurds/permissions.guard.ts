import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})

export class permissionsGuard implements CanActivate {
  constructor(private router: Router, private authservice:AuthService) {}
  canActivate() {
   if(this.authservice.getPermissions()['buildHistory']){
      return true;
    }
    else{
       return false;
    }
  }
  
  
};
