import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { AuthenticationService } from '../services/authentication.service';
import { environment } from '../../../environments/environment';

interface Response {
    results: string;
    error: string;
}

@Injectable({
    providedIn: 'root'
})

export class OnboardService {

    private createOnboardProcessURL = environment.host + '/app/rm-create-onboard';

    constructor(
        private authService: AuthenticationService,
        private http: HttpClient
    ) { }

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
