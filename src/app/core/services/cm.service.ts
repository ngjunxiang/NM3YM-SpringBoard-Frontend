import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { AuthenticationService } from '../services/authentication.service';
import { environment } from '../../../environments/environment';

interface Checklist {
    clID: string;
    name: string;
    requiredFields: string[];
    conditions: any;
    complianceDocuments: any;
    legalDocuments: any;
    error: string;
}

interface ChecklistNames {
    clNames: ChecklistName[];
    error: string;
}

interface ChecklistName {
    name: string;
    clID: string;
    createdBy: string;
    updatedBy: string;
    version: string;
    dateCreated: Date;
    dateUpdated: Date;
}

interface Response {
    results: any;
    error: string;
}

@Injectable({
    providedIn: 'root'
})

export class CMService {

    // Checklist Endpoints
    private retrieveAgmtCodesURL = environment.host + '/app/cm/retrieve-AgmtCodes';
    private retrieveChecklistNamesURL = environment.host + '/app/cm/retrieve-checklistNames';
    private retrieveChecklistLogNamesURL = environment.host + '/app/cm/retrieve-clIDWithVersion';
    private retrieveChecklistLogDetailsURL = environment.host + '/app/cm/retrieve-loggedLists';
    private createChecklistURL = environment.host + '/app/cm/create-checklist';
    private updateChecklistURL = environment.host + '/app/cm/update-checklist';
    private retrieveDeleteChecklistURL = environment.host + '/app/cm/manage-checklist';

    // FAQ Endpoints
    private retrieveUnansweredFAQURL = environment.host + '/app/faq/retrieve-UQ';
    private updateUnansweredFAQURL = environment.host + '/app/faq/add-AQ';
    private deleteUnansweredFAQURL = environment.host + '/app/faq/delete-UQ';
    private retrieveAnsweredFAQURL = environment.host + '/app/faq/retrieve-allAQ';
    private updateAnsweredFAQURL = environment.host + '/app/faq/edit-AQ';
    private deleteAnsweredFAQURL = environment.host + '/app/faq/delete-AQ';

    // Notifications Endpoints
    private retrieveNotificationsURL = environment.host + '/app/cm/retrieve-notifications';
    private updateNotificationsURL = environment.host + '/app/cm/update-notifications';

    constructor(
        private authService: AuthenticationService,
        private http: HttpClient
    ) { }

    retrieveAgmtCodes() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const postData = this.authService.authItems;

        return this.http.post<Response>(this.retrieveAgmtCodesURL, postData, httpOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }

    retrieveCMChecklistNames() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const postData = this.authService.authItems;

        return this.http.post<ChecklistNames>(this.retrieveChecklistNamesURL, postData, httpOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }

    retrieveCMChecklistDetails(checklistId) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const checklistIdData = {
            'clID': checklistId
        };

        const postData = Object.assign(this.authService.authItems, checklistIdData);

        return this.http.post<Checklist>(this.retrieveDeleteChecklistURL, postData, httpOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }

    createCMChecklist(checklist) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const checklistData = {
            'checklist': JSON.stringify(checklist),
            'name': this.authService.userDetails.name
        };

        const postData = Object.assign(this.authService.authItems, checklistData);

        return this.http.post<Response>(this.createChecklistURL, postData, httpOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }

    updateCMChecklist(checklistId, checklist) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const checklistData = {
            'checklist': JSON.stringify(checklist),
            'clID': checklistId,
            'name': this.authService.userDetails.name
        };

        const postData = Object.assign(this.authService.authItems, checklistData);

        return this.http.post<Response>(this.updateChecklistURL, postData, httpOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }

    deleteCMChecklist(checklistId) {
        const checklistData = {
            'clID': checklistId
        };

        const postData = Object.assign(this.authService.authItems, checklistData);

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
            body: postData
        };

        return this.http.delete<Response>(this.retrieveDeleteChecklistURL, httpOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }

    retrieveCMChecklistLogNames() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const postData = this.authService.authItems;

        return this.http.post<Response>(this.retrieveChecklistLogNamesURL, postData, httpOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }

    retrieveCMChecklistLogDetails(clID, version) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const logData = {
            'clID': clID,
            'version': JSON.stringify(version)
        };

        const postData = Object.assign(this.authService.authItems, logData);

        return this.http.post<Response>(this.retrieveChecklistLogDetailsURL, postData, httpOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }
    

    retrieveNotifications() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const postData = this.authService.authItems;

        return this.http.post<Response>(this.retrieveNotificationsURL, postData, httpOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }

    updateNotifications() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const postData = this.authService.authItems;

        return this.http.post<Response>(this.updateNotificationsURL, postData, httpOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }


    retrieveAnsweredFAQ() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const postData = this.authService.authItems;

        return this.http.post<Response>(this.retrieveAnsweredFAQURL, postData, httpOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }

    updateAnsweredFAQ(qnID, question, answer) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const updateQuestionData = {
            'qna': {
                'qnID': qnID,
                'question': question,
                'answer': answer
            }
        };
        
        const postData = Object.assign(this.authService.authItems, updateQuestionData);

        return this.http.post<Response>(this.updateAnsweredFAQURL, postData, httpOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }

    deleteAnsweredFAQ(question) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const deleteQuestionData = {
            'question': question
        };

        const postData = Object.assign(this.authService.authItems, deleteQuestionData);

        return this.http.post<Response>(this.deleteAnsweredFAQURL, postData, httpOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }

    retrieveUnansweredFAQ() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const postData = this.authService.authItems;

        return this.http.post<Response>(this.retrieveUnansweredFAQURL, postData, httpOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }

    updateUnansweredFAQ(qnID, question, answer) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const updateQuestionData = {
            'qna': {
                'qnID': qnID,
                'question': question,
                'answer': answer
            }
        };

        const postData = Object.assign(this.authService.authItems, updateQuestionData);

        return this.http.post<Response>(this.updateUnansweredFAQURL, postData, httpOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }

    deleteUnansweredFAQ(question) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const deleteQuestionData = {
            'question': question
        };

        const postData = Object.assign(this.authService.authItems, deleteQuestionData);

        return this.http.post<Response>(this.deleteUnansweredFAQURL, postData, httpOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
        }
        // return an observable with a user-facing error message
        return throwError(
            'Something bad happened; please try again later.');
    };
}
