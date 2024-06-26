import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { map } from 'rxjs';

import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent {
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  authToken = '';
  baseUrl = '';
  editMode = false;
  userData = null;
  dataStored: boolean = false;


  ngOnInit() {
    this.getUserData();
  }

  getUserData() {
    const userDataString = sessionStorage.getItem('userDetails');
    if (userDataString) {
      this.userData = JSON.parse(userDataString)[0];
      this.dataStored = true;
      console.log('auth token', this.userData.authToken);
      console.log('baseurl', this.userData.baseUrl);
    }
  }

  updateUserData() {
    if (!this.userData.authToken || !this.userData.baseUrl) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in all fields',
      });
      return;
    }

    let userData = { ...this.userData };
    let objId = userData.id;
    let url = `https://jirabuildmngt-default-rtdb.firebaseio.com/users/${objId}.json`;

    userData.authToken = this.userData.authToken;
    userData.baseUrl = this.userData.baseUrl;
   

    this.http.put(url, userData).subscribe(
      (res) => {
        sessionStorage.setItem('userDetails', JSON.stringify([userData]));
        sessionStorage.setItem('authToken', userData.authToken);
        this.dataStored = true;
        console.log(res);
        this.editMode = !this.editMode;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Data Saved',
        });
      },
      (err) => {
        console.error(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to save data',
        });
      }
    );
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }
  onBack() {
    this.editMode = false; 
    this.getUserData();
  }
}
