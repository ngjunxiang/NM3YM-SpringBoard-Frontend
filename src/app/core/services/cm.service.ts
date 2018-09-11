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
    updatedBy: string;
    version: string;
    dateCreated: Date;
}

interface Response {
    results: string;
    error: string;
}

@Injectable({
    providedIn: 'root'
})

export class CMService {

    private retrieveAgmtCodesURL = environment.host + '/app/cm/retrieve-AgmtCodes';
    private retrieveChecklistNamesURL = environment.host + '/app/cm/retrieve-checklistNames';
    private retrieveChecklistLogNamesURL = environment.host + '/app/cm/retrieve-clIDWithVersion';
    private retrieveChecklistLogDetailsURL = environment.host + '/app/cm/retrieve-loggedLists';
    private updateChecklistURL = environment.host + '/app/cm/update-checklist';
    private retrieveChecklistURL = environment.host + '/app/cm/manage-checklist';

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

        return this.http.post<Checklist>(this.retrieveChecklistURL, postData, httpOptions)
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