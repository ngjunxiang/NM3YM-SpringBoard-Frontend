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

interface DashboardResults {
    results: any;
    updatedChecklists: any;
    mostRecentQuestions: any;
    error: string;
}

interface UncleanFAQ {
    results: any;
    numUnclean: number;
    error: string;
}

interface Response {
    results: any;
    error: string;
}

@Injectable({
    providedIn: 'root'
})

export class CMService {
    // Dashboard Endpoints
    private retrieveDashboardStatsURL = environment.host + '/app/cm/retrieve-dashboard';

    // Checklist Endpoints
    private retrieveAgmtCodesURL = environment.host + '/app/cm/retrieve-AgmtCodes';
    private retrieveChecklistNamesURL = environment.host + '/app/cm/retrieve-checklistNames';
    private retrieveChecklistLogNamesURL = environment.host + '/app/cm/retrieve-clIDWithVersion';
    private retrieveChecklistLogDetailsURL = environment.host + '/app/cm/retrieve-loggedLists';
    private createChecklistURL = environment.host + '/app/cm/create-checklist';
    private updateChecklistURL = environment.host + '/app/cm/update-checklist';
    private retrieveDeleteChecklistURL = environment.host + '/app/cm/manage-checklist';

    // FAQ Endpoints
    private createFAQURL = environment.host + '/app/faq/add-CMQ';
    private retrieveUnansweredFAQURL = environment.host + '/app/faq/retrieve-UQ';
    private updateUnansweredFAQURL = environment.host + '/app/faq/add-AQ';
    private deleteUnansweredFAQURL = environment.host + '/app/faq/delete-UQ';
    private retrieveAnsweredFAQURL = environment.host + '/app/faq/retrieve-allAQ';
    private retrieveSelectedAnsweredFAQURL = environment.host + '/app/faq/retrieve-AQ';
    private updateAnsweredFAQURL = environment.host + '/app/faq/edit-AQ';
    private deleteAnsweredFAQURL = environment.host + '/app/faq/delete-AQ';
    private retrieveFAQByCategoryAndSortURL = environment.host + '/app/faq/retrieve-allAQBy';
    private retrieveFAQByCategoryURL = environment.host + '/app/train/retrieve-byIntent';
    private retrieveFAQURL = environment.host + '/app/faq/retrieve';
    private retrieveCMFAQURL = environment.host + '/app/faq/retrieve-cmUserQNA';

    // NLU Model Endpoints 
    private returnCleanedFAQURL = environment.host + '/app/train/store-cleaned'
    private retrieveUncleanedFAQURL = environment.host + '/app/train/retrieve-unclean';
    private retrieveIntentsURL = environment.host + '/app/train/retrieve-intents';
    private retrieveSynonymsURL = environment.host + '/app/train/retrieve-synonyms';
    private retrieveEntitiesURL = environment.host + '/app/train/retrieve-entities';
    private trainModelURL = environment.host + '/app/train/train-model';
    private updateSynonymsURL = environment.host + '/app/train/update-synonyms';

    // Notifications Endpoints
    private retrieveNotificationsURL = environment.host + '/app/cm/retrieve-notifications';
    private updateNotificationsURL = environment.host + '/app/cm/update-notifications';

    // PDF URL
    private retrievePdfURL = environment.host + '/app/faq/retrieve-file';

    // Reg51 Notification Endpoint
    private retrieveReg51NotificationsURL = environment.host + '/app/cm/retrieve-req51-notifications';
    private updateReg51NotificationsURL = environment.host + '/app/cm/update-req51-notifications';

    constructor(
        private authService: AuthenticationService,
        private http: HttpClient
    ) { }

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

    createFAQ(question, answer, PDFPages) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const createdFAQ = {
            'qna': {
                'question': question,
                'answer': answer,
                'refPages': PDFPages
            }
        };

        const postData = Object.assign(this.authService.authItems, createdFAQ);

        return this.http.post<Response>(this.createFAQURL, postData, httpOptions)
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

    updateAnsweredFAQ(updatedFaq) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const updateQuestionData = {
            'qna': {
                'qnID': updatedFaq.qnID,
                'question': updatedFaq.question,
                'answer': updatedFaq.answer,
                'refPages': updatedFaq.PDFPages,
                'qnIDRef': updatedFaq.qnIDRef
            }
        };
        
        const postData = Object.assign(this.authService.authItems, updateQuestionData);

        return this.http.post<Response>(this.updateAnsweredFAQURL, postData, httpOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }

    deleteAnsweredFAQ(qnID, question) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const deleteQuestionData = {
            'question': question,
            'qnID': qnID
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

    updateUnansweredFAQ(updatedFaq) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const updateQuestionData = {
            'qna': {
                'qnID': updatedFaq.qnID,
                'question': updatedFaq.question,
                'answer': updatedFaq.answer,
                'refPages': updatedFaq.PDFPages,
                'username': updatedFaq.username,
                'qnIDRef': updatedFaq.qnIDRef
            }
        };

        const postData = Object.assign(this.authService.authItems, updateQuestionData);

        return this.http.post<Response>(this.updateUnansweredFAQURL, postData, httpOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }

    deleteUnansweredFAQ(qnID, question) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const deleteQuestionData = {
            'question': question,
            'qnID': qnID
        };

        const postData = Object.assign(this.authService.authItems, deleteQuestionData);

        return this.http.post<Response>(this.deleteUnansweredFAQURL, postData, httpOptions)
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

    retrieveSimilarFaq(question, num) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const questionData = {
            'question': question,
            'num': num
        };

        const postData = Object.assign(this.authService.authItems, questionData);

        return this.http.post<Response>(this.retrieveFAQURL, postData, httpOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }

    retrieveCMFAQ() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const postData = Object.assign(this.authService.authItems);

        return this.http.post<Response>(this.retrieveCMFAQURL, postData, httpOptions)
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

        const postData = Object.assign(this.authService.authItems, sortBy, categoriseBy);

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


    retrieveUncleanedFAQ() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const postData = Object.assign(this.authService.authItems);

        return this.http.post<UncleanFAQ>(this.retrieveUncleanedFAQURL, postData, httpOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }

    returnCleanedFAQ(cleaned) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const cleanedFAQ = {
            'cleanedFAQ': cleaned
        };

        const postData = Object.assign(this.authService.authItems, cleanedFAQ);

        return this.http.post<UncleanFAQ>(this.returnCleanedFAQURL, postData, httpOptions)
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

    retrieveEntities() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const postData = Object.assign(this.authService.authItems);

        return this.http.post<Response>(this.retrieveEntitiesURL, postData, httpOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }

    retrieveSynonyms() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const postData = Object.assign(this.authService.authItems);

        return this.http.post<Response>(this.retrieveSynonymsURL, postData, httpOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }

    updateSynonyms(Synonyms) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const updatedSynonyms = {
            'synonyms': Synonyms
        };

        //add here
        const postData = Object.assign(this.authService.authItems, updatedSynonyms);

        return this.http.post<Response>(this.updateSynonymsURL, postData, httpOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }

    trainModel() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const postData = Object.assign(this.authService.authItems);

        return this.http.post<Response>(this.trainModelURL, postData, httpOptions)
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

    updateReg51Notification(reg51NotificationValue) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const reg51Notification = {
            'reg51Notification': reg51NotificationValue
        };

        const postData = Object.assign(this.authService.authItems, reg51Notification);

        return this.http.post<Response>(this.updateReg51NotificationsURL, postData, httpOptions)
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
