import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedServicesService {
  http: any;
  issues: string[] = []; 

  constructor() { }
  setIssues(issues: string[]): void {
    issues.forEach(issue => {
      if(!this.issues.includes(issue)){
        this.issues.push(issue);
      }
    });
  }
  
}
