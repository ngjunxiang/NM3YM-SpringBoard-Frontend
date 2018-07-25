import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';

import { AuthenticationService } from '../authentication/authentication.service';

interface Checklist {
    name: string;
    required_fields: string[];
    conditions: any[];
    documents: any[];
}

interface Checklists {
    checklists: Checklist[];
}

@Injectable({
    providedIn: 'root'
})

export class ChecklistService {

    private retrieveChecklistURL = 'http://localhost:8000/app/retrieve-users';

    constructor(
        private authService: AuthenticationService,
        private http: HttpClient
    ) { }

    retrieveChecklist(): Observable<Checklists> {
        return this.http.get<Checklists>('assets/checklist.json');
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
