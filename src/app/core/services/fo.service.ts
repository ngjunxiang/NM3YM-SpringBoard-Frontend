import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { AuthenticationService } from './authentication.service';
import { environment } from '../../../environments/environment';

interface Response {
    results: any;
    error: string;
}

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


interface DashboardResults {
    results: any;
    docChanges: any;
    clientsAffected: any[];
    pendingClients: any[];
    recentlyAnswerQuestions: any[];
    error: string;
}

interface ObList {
    name: string;
    obID: string;
    clID: string;
    version: string;
    progress: number;
    requiredFields: any[];
    conditions: any[];
    dateCreated: Date;
    urgent: boolean;
    complianceDocuments: any;
    legalDocuments: any;
    error: string;
}

@Injectable({
    providedIn: 'root'
})

export class FOService {
    // Dashboard Endpoint
    private retrieveDashboardStatsURL = environment.host + '/app/fo/retrieve-dashboard';

    // Checklist Endpoints
    private retrieveChecklistNamesURL = environment.host + '/app/fo/retrieve-checklistNames';
    private retrieveChecklistURL = environment.host + '/app/fo/retrieve-checklist';

    // Notifications Endpoints
    private retrieveNotificationsURL = environment.host + '/app/fo/retrieve-notifications';
    private updateNotificationsURL = environment.host + '/app/fo/update-notifications';

    // Onboard Endpoints
    private createOnboardProcessURL = environment.host + '/app/fo/create-onboard';
    private retrieveAllOnboardProcessesURL = environment.host + '/app/fo/retrieve-all-onboard';
    private retrieveSortedOnboardProcessesURL = environment.host + '/app/fo/filtersort-onboard';
    private retrieveFilteredOnboardProcessesURL = environment.host + '/app/fo/filterby-onboard';
    private retrieveOnboardProcessDetailsURL = environment.host + '/app/fo/retrieve-selected-onboard';
    private deleteUpdateOnboardProcessURL = environment.host + '/app/fo/manage-onboard';
    private lockUpdateOnboardProcessURL = environment.host + '/app/fo/lock-onboard';
    private retrieveAllRMNamesURL = environment.host + '/app/fo/retrieve-rm-names';

    // FAQ Endpoints
    private retrieveFAQURL = environment.host + '/app/faq/retrieve';
    private retrieveUserFAQURL = environment.host + '/app/faq/retrieve-userQNA'
    private retrieveAllFAQURL = environment.host + '/app/faq/retrieve-allAQ';
    private createUnansweredQuestionURL = environment.host + '/app/faq/add-UQ';
    private increaseViewURL = environment.host + '/app/faq/increment-QNAViews';
    private retrieveFAQByCategoryAndSortURL = environment.host + '/app/faq/retrieve-allAQBy';
    private retrieveFAQByCategoryURL = environment.host + '/app/train/retrieve-byIntent';
    private retrieveIntentsURL = environment.host + '/app/train/retrieve-intents';
    private retrieveSelectedAnsweredFAQURL = environment.host + '/app/faq/retrieve-AQ';

    // PDF URL
    private retrievePdfURL = environment.host + '/app/faq/retrieve-file';

    // GENERATED PDF
    private retrieveGeneratedPdfURL = environment.host + '/app/fo/generatedocument';

    // Reg51 Notification Endpoint
    private retrieveReg51NotificationsURL = environment.host + '/app/fo/retrieve-req51-notifications';

    constructor(
        private authService: AuthenticationService,
        private http: HttpClient
    ) { }

    retrievePdf() {
        let headers = new HttpHeaders();
        headers = headers.set('Accept', 'application/pdf, */*');

        const postData = this.authService.authItems;

        return this.http.post(this.retrievePdfURL, postData, { headers: headers, responseType: 'blob' as 'json' })
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }


   
    retrieveGeneratedPdf(obID) {
        let headers = new HttpHeaders();
        headers = headers.set('Accept', 'application/pdf, */*');
        const obIDData = {
            'obID': obID
        };
        const postData = Object.assign(this.authService.authItems, obIDData);
        return this.http.post(this.retrieveGeneratedPdfURL, postData, { headers: headers, responseType: 'blob' as 'json' })
            .pipe(
                catchError(this.handleError)
            );
    }

    retrieveDashboardStats() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const postData = this.authService.authItems;

        return this.http.post<DashboardResults>(this.retrieveDashboardStatsURL, postData, httpOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }

    retrieveReg51Notification() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const postData = Object.assign(this.authService.authItems);

        return this.http.post<Response>(this.retrieveReg51NotificationsURL, postData, httpOptions)
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

    retrieveChecklistNames() {
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

    retrieveChecklistDetails(checklistId) {
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
                catchError(this.handleError)
            );
    }

    retrieveAllOnboardProcesses() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const postData = this.authService.authItems;

        return this.http.post<Response>(this.retrieveAllOnboardProcessesURL, postData, httpOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }

    retrieveSortedOnboardProcesses(sortValue, obProcesses) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const sortData = {
            'sortBy': sortValue,
            'obList': obProcesses
        };

        const postData = Object.assign(this.authService.authItems, sortData);

        return this.http.post<Response>(this.retrieveSortedOnboardProcessesURL, postData, httpOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }

    retrieveFilteredOnboardProcesses(filterValue, obProcesses) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const filterData = {
            'filterBy': filterValue,
            'obList': obProcesses
        };

        const postData = Object.assign(this.authService.authItems, filterData);

        return this.http.post<Response>(this.retrieveFilteredOnboardProcessesURL, postData, httpOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }


    retrieveAllRMNames() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const postData = this.authService.authItems;

        return this.http.post<Response>(this.retrieveAllRMNamesURL, postData, httpOptions)
            .pipe(
                retry(3),
        );
    }

    retrieveOnboardProcessDetails(obID) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const obIDData = {
            'obID': obID
        };

        const postData = Object.assign(this.authService.authItems, obIDData);

        return this.http.post<ObList>(this.retrieveOnboardProcessDetailsURL, postData, httpOptions)
            .pipe(
                catchError(this.handleError)
            );
    }

    retrieveSelectedAnsweredFAQ(qnID) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const selectedAQ = {
            'qnID': qnID
        };

        const postData = Object.assign(this.authService.authItems, selectedAQ);

        return this.http.post<Response>(this.retrieveSelectedAnsweredFAQURL, postData, httpOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }

    retrieveFaq(question) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const questionData = {
            'question': question
        };

        const postData = Object.assign(this.authService.authItems, questionData);

        return this.http.post<Response>(this.retrieveFAQURL, postData, httpOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }

    retrieveAllFaq() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const postData = this.authService.authItems;

        return this.http.post<Response>(this.retrieveAllFAQURL, postData, httpOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }

    retrieveFAQByCategoryAndSort(category, sort) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const categoriseBy = {
            'retrieveBy': category
        }

        const sortBy = {
            'sortBy': sort
        };

        const filterRef = { 
            'filterRef': false
        }

        const postData = Object.assign(this.authService.authItems, categoriseBy, sortBy, filterRef);

        return this.http.post<Response>(this.retrieveFAQByCategoryAndSortURL, postData, httpOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }

    retrieveFAQByIntent(value) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const categoriseBy = {
            'intent': value
        };

        const postData = Object.assign(this.authService.authItems, categoriseBy);

        return this.http.post<Response>(this.retrieveFAQByCategoryURL, postData, httpOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }

    retrieveIntents() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const postData = Object.assign(this.authService.authItems);

        return this.http.post<Response>(this.retrieveIntentsURL, postData, httpOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }


    retrieveUserFAQ() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const postData = this.authService.authItems;

        return this.http.post<Response>(this.retrieveUserFAQURL, postData, httpOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }

    createUnansweredQuestion(newQuestion) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const newQuestionData = {
            'question': newQuestion
        };

        const postData = Object.assign(this.authService.authItems, newQuestionData);

        return this.http.post<Response>(this.createUnansweredQuestionURL, postData, httpOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );

    }

    increaseView(quesID) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const qnID = {
            'qnID': quesID
        };

        const postData = Object.assign(this.authService.authItems, qnID);

        return this.http.post<Response>(this.increaseViewURL, postData, httpOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }


    createOnboardProcess(onboardProcessData) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const onboardData = {
            'checklist': JSON.stringify(onboardProcessData)
        };

        const postData = Object.assign(this.authService.authItems, onboardData);

        return this.http.post<Response>(this.createOnboardProcessURL, postData, httpOptions)
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

    updateOnboardProcess(onboardProcessData) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        console.log('onboardProcessData', onboardProcessData);

        const onboardData = {
            'obID': onboardProcessData.obID,
            'checklist': JSON.stringify(onboardProcessData)
        };

        const postData = Object.assign(this.authService.authItems, onboardData);

        return this.http.post<Response>(this.deleteUpdateOnboardProcessURL, postData, httpOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }

    deleteOnboardProcess(obID) {
        const obIDData = {
            'obID': obID
        };

        const postData = Object.assign(this.authService.authItems, obIDData);

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
            body: postData
        };

        return this.http.delete<Response>(this.deleteUpdateOnboardProcessURL, httpOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }

    lockOnboardProcess(obID) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        const obIDData = {
            'obID': obID
        };

        const postData = Object.assign(this.authService.authItems, obIDData);

        return this.http.put<Response>(this.lockUpdateOnboardProcessURL, postData, httpOptions)
            .pipe(
                catchError(this.handleError)
            );
    }

    uploadFile(onboardProcessData) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const onboardData = {
            'checklist': JSON.stringify(onboardProcessData)
        };

        const postData = Object.assign(this.authService.authItems, onboardData);

        return this.http.post<Response>(this.createOnboardProcessURL, postData, httpOptions)
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
