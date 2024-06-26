import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-build-history',
  templateUrl: './build-history.component.html',
  styleUrl: './build-history.component.css',
})
export class BuildHistoryComponent {
  tickets: any = [];
  baseUrls: string[] = [];
  baseUrl;
  email;
  userUrl = null;
  userData = null;
  selectedBaseUrl: any;
  checked: boolean;
  
  constructor(private http: HttpClient, private authservice: AuthService) {
    this.baseUrl = sessionStorage.getItem('baseUrl');
    console.log('Base URL:', this.baseUrl);
    this.email = sessionStorage.getItem('email');
    console.log('Baseemail:', this.email);
  }

  ngOnInit() {
    this.authservice.fetchData().subscribe(
      (response) => {
        console.log('Fetched data:', response);
        this.extractBaseUrls(response);
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );

    this.getBuildHistoryData();
  }

  extractBaseUrls(data: any): void {
    if (data && data.users) {
      const users = data.users;
      for (let key in users) {
        if (users.hasOwnProperty(key) && users[key].baseUrl) {
          this.baseUrls.push(users[key].baseUrl);
        }
      }
    }
    if (this.baseUrls.length === 0) {
      console.log('No baseUrl found in the data.');
    } else {
      console.log('Extracted baseUrls:', this.baseUrls);
    }
  }

  getBuildHistoryData() {
    return this.http
      .get(
        'https://jirabuildmngt-default-rtdb.firebaseio.com/BuildHistory.json'
      )
      .subscribe(
        (res) => {
          this.tickets = Object.values(res);

          console.log(res);
        },
        (err) => {
          console.log(err);
        }
      );
  }
}
