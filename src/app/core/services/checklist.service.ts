import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { AuthenticationService } from '../services/authentication.service';
import { environment } from '../../../environments/environment';

interface Checklist {
    name: string;
    requiredFields: string[];
    conditions: any;
    complianceDocuments: any;
    legalDocuments: any;
}

interface ChecklistNames {
    clNames: ChecklistName[];
}

interface ChecklistName {
    name: string,
    dateCreated: Date
}

interface Response {
    results: string;
    error: string;
}

@Injectable({
    providedIn: 'root'
})

export class ChecklistService {

    private retrieveCMChecklistNamesURL = environment.host + '/app/cm-retrieve-checklistNames';
    private retrieveRMChecklistNamesURL = environment.host + '/app/rm-retrieve-checklistNames';
    private retrieveRMChecklistURL = environment.host + '/app/rm-retrieve-checklist';
    private retrieveDeleteCMChecklistURL = environment.host + '/app/cm-manage-checklist';
    private updateCMChecklistURL = environment.host + '/app/update-checklist';
    private createCMChecklistURL = environment.host + '/app/create-checklist';

    constructor(
        private authService: AuthenticationService,
        private http: HttpClient
    ) { }

    retrieveCMChecklistNames() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const postData = this.authService.authItems;

        return this.http.post<ChecklistNames>(this.retrieveCMChecklistNamesURL, postData, httpOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }

    retrieveCMChecklistDetails(checklistName) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const checklistNameData = {
            'clName': checklistName
        };

        const postData = Object.assign(this.authService.authItems, checklistNameData);

        return this.http.post<Checklist>(this.retrieveDeleteCMChecklistURL, postData, httpOptions)
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
            'checklist': JSON.stringify(checklist)
        };

        const postData = Object.assign(this.authService.authItems, checklistData);

        return this.http.post<Response>(this.createCMChecklistURL, postData, httpOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }

    updateCMChecklist(checklistName, checklist) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const checklistData = {
            'checklist': JSON.stringify(checklist),
            'clName': checklistName
        };

        const postData = Object.assign(this.authService.authItems, checklistData);

        return this.http.post<Response>(this.updateCMChecklistURL, postData, httpOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }

    deleteCMChecklist(checklistName) {
        const checklistData = {
            'clName': checklistName
        };

        const postData = Object.assign(this.authService.authItems, checklistData);

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
            body: postData
        };

        return this.http.delete<Response>(this.retrieveDeleteCMChecklistURL, httpOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }



    retrieveRMChecklistNames() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const postData = this.authService.authItems;

        return this.http.post<ChecklistNames>(this.retrieveRMChecklistNamesURL, postData, httpOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }
    
    retrieveRMChecklistDetails(checklistName) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const checklistNameData = {
            'clName': checklistName
        };

        const postData = Object.assign(this.authService.authItems, checklistNameData);

        return this.http.post<Checklist>(this.retrieveRMChecklistURL, postData, httpOptions)
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
