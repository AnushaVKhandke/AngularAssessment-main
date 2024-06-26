import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  viewChild,
} from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { AuthService } from '../../services/auth.service';

import {
  ConfirmationService,
  MessageService,
  ConfirmEventType,
} from 'primeng/api';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { SharedServicesService } from '../../services/shared-services.service';
import { Table } from 'primeng/table';

interface sideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-jira',
  templateUrl: './jira.component.html',
  styleUrl: './jira.component.css',
})
export class JiraComponent implements OnInit {
  showRecordNotFound: boolean = false;
  notFoundRecordList = [];
  checked: boolean;
  checkBox: boolean;
  inpSwitch: boolean = false;
  dataLoaded: boolean = false;
  isSideNavCollapsed = false;
  isSelectedAll: boolean = false;
  isedit = false;
  displayModalReleaseTag: boolean = false;
  displayModalStoryPoint: boolean = false;
  displayModalStatusBuild: boolean = false;

  rowsPerPageOption: number[] = [1, 2,3];
  tickets: any[] = [];
  originalEstimatedTimes: string[] = [];
  issues: any[] = [];
  originalTickets: any[] = [];
  selectedTicket = [];

  position: string;
  EstimateTime: string;
  screenWidth = 0;
  releaseTagInput: string = '';
  inputValue: string = '';
  generatedValues;
  rowsPerPageSelected:number = 5;
  rows:number = 1;
  totalPages:number;
  first = 1;
  totalRecords;
  last;
  gotoPage!: number;
  @ViewChild('dt1') dt1!: Table;

  editedTickets: Map<string, string> = new Map();
  checkboxdata: Map<string, string> = new Map();
  selectId: Map<string, string> = new Map();
  selectedTicketDetails: Map<string, string> = new Map();
  selectedTicketid = new Map<string, string>();
  releaseTagData = new Map<string, string>();

  

  constructor(
    private platformLocation: PlatformLocation,
    private sharedService: SharedServicesService,
    private http: HttpClient,
    public authService: AuthService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    history.pushState(null, '', location.href);
    this.platformLocation.onPopState(() => {
      history.pushState(null, '', location.href);
    });
  }

  ngOnInit() {
    if (this.sharedService.issues.length > 0) {
      this.issues = [...this.sharedService.issues];
     
      console.log(this.totalPages);
    }
    this.onSave();
  }

  onEdit() {
    this.isedit = true;
  }

  onCancel() {
    this.isedit = false;
    this.onSave();
  }

  selectAllTickets() {
    this.tickets.forEach((ticket) => (ticket.checked = true));
    this.isSelectedAll = true;
  }

  showModal(dialogType: string) {
    this.displayModalReleaseTag = false;
    this.displayModalStoryPoint = false;
    this.displayModalStatusBuild = false;

    switch (dialogType) {
      case 'updateReleaseTag':
        this.displayModalReleaseTag = true;
        break;
      case 'updateStoryPoint':
        this.displayModalStoryPoint = true;
        break;
      case 'updateStatusBuild':
        this.displayModalStatusBuild = true;
        break;
      default:
        break;
    }
  }

  confirmPosition(position: string) {
    this.position = position;

    this.confirmationService.confirm({
      message: '',
      icon: '',
      accept: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Record Updated',
        });
      },
      reject: (type) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Rejected',
              detail: 'You have updated',
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Cancelled',
              detail: 'you have not updated',
            });
            break;
        }
      },
      key: 'positionDialog',
    });
  }

  onSave() {
    console.log('onSave called');
    console.log('Current state of issues:', this.issues);
    this.showRecordNotFound = false;
    this.originalTickets = [...this.tickets];
    const headersOption = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, GET',
      }),
    };

    if (Array.isArray(this.issues) && this.issues.length > 0) {
      let issueURL =
        'http://localhost:9090/getIssuesDetails?ticketIds=' +
        this.issues.join(',');
      this.http.get(issueURL, headersOption).subscribe(
        (response) => {
          let data: any = response;
          this.tickets = [];
          let foundRecordList = [];
          this.originalEstimatedTimes = [];
          for (let jiraData of data) {
            let index = data.indexOf(jiraData);
            let jiraDetails = JSON.parse(jiraData);
            if (jiraDetails.hasOwnProperty('errorMessages')) {
              this.showRecordNotFound = true;
            } else if (!jiraDetails.hasOwnProperty('errorMessages')) {
              this.showRecordNotFound = false;
              foundRecordList.push(jiraDetails.key.toLowerCase());
              let temp = {
                TicketID: jiraDetails.key ? jiraDetails.key : '',
                Description: jiraDetails.fields.summary
                  ? jiraDetails.fields.summary
                  : '',
                JiraType: jiraDetails.fields.issuetype
                  ? jiraDetails.fields.issuetype.name
                  : '',
                Assignee: jiraDetails.fields.assignee
                  ? jiraDetails.fields.assignee.displayName
                  : '',
                Status: jiraDetails.fields.status
                  ? jiraDetails.fields.status.name
                  : '',
                EstimatedTime: jiraDetails.fields.timeestimate
                  ? this.convertSecondsToHours(jiraDetails.fields.timeestimate)
                  : '',

                StoryPoint: jiraDetails.fields.customfield_10016
                  ? jiraDetails.fields.customfield_10016
                  : '',
                ReleaseTag: jiraDetails.fields.customfield_10032
                  ? jiraDetails.fields.customfield_10032.value
                  : '',
                Sprint: jiraDetails.fields.customfield_10020
                  ? jiraDetails.fields.customfield_10020[0].name
                  : '',
              };

              this.tickets.push(temp);
              this.originalEstimatedTimes.push(temp.EstimatedTime);
              console.log(this.originalEstimatedTimes);
            }
          }
          let tempIssueList = this.issues.map((issue) => issue.toLowerCase());
          this.notFoundRecordList = tempIssueList.filter(
            (issue) => !foundRecordList.includes(issue)
          );
          let row = this.dt1 && this.dt1.rows ? this.dt1.rows : 1;
          this.totalPages = Math.ceil(this.tickets.length / row);
          console.log('Response for issue:', response);
        },
        (error) => {
          console.error('An error occurred for issue:', error);
        }
      );
    }
  }

  convertSecondsToHours(value: any): string {
    if (value === null || value === undefined) return '';
    let seconds = parseInt(value, 10);
    const hours = Math.floor(seconds / 3600);
    return `${hours}`;
  }

  storeEditedTicket(ticketID: string, editedValue: any) {
    this.editedTickets.set(ticketID, editedValue);
  }

  updateEstimate() {
    const headersOption = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, GET',
      }),
    };

    let body = {
      inputData: JSON.stringify(Object.fromEntries(this.editedTickets)),
    };

    let issueURL = 'http://localhost:9090/updateEstimate';
    this.http.post(issueURL, body, headersOption).subscribe(
      (response) => {
        let data: any = response;
        console.log('Response for issue:', response);
        this.isedit = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Estimate Updated Successfully!',
        });
      },
      (error) => {
        console.error('An error occurred for issue:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed To Update Estimate Time.',
        });
      }
    );
  }

  updateStoryPoint() {
    const headersOption = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, GET',
      }),
    };
    let body = {
      inputData: JSON.stringify(Object.fromEntries(this.selectedTicketDetails)),
    };
    let issueURL = 'http://localhost:9090/updateStoryPoint';
    this.http.post(issueURL, body, headersOption).subscribe(
      (response) => {
        console.log('response of story point', response);
        this.displayModalStoryPoint = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Story Point Updated Successfully!',
        });
      },
      (error) => {
        console.error('An error occurred for issue:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed To Update Story Point.',
        });
      }
    );
  }

  getCurrentUTCDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = this.padNumber(now.getMonth() + 1);
    const day = this.padNumber(now.getDate());
    let hours = now.getHours();
    const minutes = this.padNumber(now.getMinutes());
    const seconds = this.padNumber(now.getSeconds());
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight (0 hours)
    const utcDateTime = `${year}/${month}/${day},${hours}.${minutes} ${ampm}`;
    return utcDateTime;
  }
  padNumber(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  generateSequence(): string {
    const today: string = new Date().toISOString().slice(0, 10);

    if (today !== this.authService.currentDate) {
      // If date has changed, reset the sequence
      this.authService.currentDate = today;
      this.authService.currentSequence = 0;
      console.log('generateSequence call');
    } else {
      // Increment the sequence for the current date
      this.authService.currentSequence++;
    }

    // Store the current sequence number for the current date
    this.authService.sequenceMap[this.authService.currentDate] =
      this.authService.currentSequence;

    // Format the result as YYYYMMDD-Sequence
    const formattedDate: string = this.authService.currentDate.replace(
      /-/g,
      ''
    );
    const sequence: string = `${formattedDate}${(
      '00' + this.authService.currentSequence
    ).slice(-2)}`; // Assuming up to 999 sequences per day
    //this.authService.currentSequence--;
    return sequence;
  }

  getCurrentSequence(): number {
    return this.authService.sequenceMap[this.authService.currentDate] || 0;
  }

  updateBuildStatus() {
    console.log('updateBuildStatus call');
    const headersOption = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, GET',
      }),
    };
    const ticketIds = Array.from(this.selectedTicketDetails.keys());
    let body = {
      inputData: JSON.stringify(Object.fromEntries(this.selectedTicketDetails)),
    };
    let issueURL = 'http://localhost:9090/updateStatusForBuild';
    console.log('updateBuildStatus URL call');
    this.http.post(issueURL, body, headersOption).subscribe(
      (response) => {
        this.displayModalStatusBuild = false;
        const generateNumberFromCurrentDate = this.generateSequence();
        const utcDateTime = this.getCurrentUTCDateTime();

        this.generatedValues = {
          generateNumberFromCurrentDate,
          utcDateTime,
          ticketIds,
        };
        this.http
          .post(
            `https://jirabuildmngt-default-rtdb.firebaseio.com/BuildHistory.json`,
            this.generatedValues
          )
          .subscribe(
            (response) => {
              console.log(response);
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Build Status updated successfully!',
              });
              this.selectedTicketDetails.clear();
            },
            (err) => {
              console.log(err);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed To Update Build Status.',
              });
            }
          );
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onClick() {
    this.displayModalStatusBuild = false;
    this.displayModalReleaseTag = false;
    this.displayModalStoryPoint = false;
  }

  selectJiraData(t, event) {
    if (event.checked) {
      this.selectedTicketDetails.set(t.TicketID, t.EstimatedTime);
      this.selectedTicketid.set(t.TicketID, t.JiraType);
      this.releaseTagData.set(t.TicketID, this.releaseTagInput);
    } else {
      this.selectedTicketDetails.delete(t.TicketID);
      this.selectedTicketid.delete(t.TicketID);
      this.releaseTagData.delete(t.TicketID);
    }
  }

  updateReleaseTag() {
    const headersOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    this.releaseTagData.forEach((data, key) => {
      this.releaseTagData.set(key, this.releaseTagInput);
    });
    let params = new HttpParams().set('releaseTag', this.releaseTagInput);

    let body = {
      inputData: JSON.stringify(Object.fromEntries(this.releaseTagData)),
      // inputData : this.releaseTagInput
    };

    let issueURL = 'http://localhost:9090/updateReleaseTag';
    this.http
      .post(issueURL, body, { headers: headersOption.headers, params: params })
      .subscribe(
        (response: any) => {
          console.log('Response:', response);
          this.displayModalReleaseTag = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Release Tag Updated Successfully!',
          });

          this.releaseTagInput = '';
        },
        (error) => {
          console.error('an error occured', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed To Update Release Tag.',
          });
        }
      );
  }
  checkUserDetails() {
    return this.authService.loggedInUserDetails();
  }
  checklog() {
    return this.authService.isAuthenticated();
  }
  checkisLoggedIn() {
    return this.authService.isLoggedIn();
  }
  rowsPerPageOptionsVisible = false;
  toggleRowsPerPageOptions() {
    this.rowsPerPageOptionsVisible = !this.rowsPerPageOptionsVisible;
  }
 
  onRowsPerPageChange(newRowsPerPage: number) {
    this.rowsPerPageSelected = newRowsPerPage
    this.rows = this.rowsPerPageSelected;
    this.tickets = this.tickets.slice(this.first, this.rows + 1);
    if (this.rows < this.totalRecords) {
      this.last = this.rows
    } else {
      this.last = this.totalRecords
    }
  }
  onGoButtonClick(){
    console.log('Go button clicked.');
    console.log(this.gotoPage);
 
    if (this.gotoPage > 0 && this.gotoPage <= this.totalPages && this.dt1) {
      this.dt1.first = (this.gotoPage - 1) * 1;
    }
  }
  
}
