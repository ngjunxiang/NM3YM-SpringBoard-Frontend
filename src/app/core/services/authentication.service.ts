import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';

interface LoginData {
    token: string;
    userType: string;
    name: string;
    error: string;
}

interface AuthResponse {
    error: string;
    newToken: string;
}

interface UserDetailsResponse {
    error: string;
    name: string;
    email: string;
}

@Injectable({
    providedIn: 'root'
})

export class AuthenticationService {

    private loginURL = environment.host + '/app/login';
    private authURL = environment.host + '/app/authenticate';
    private retrieveNameURL = environment.host + '/app/retrieve-user-details';

    userDetails; 
    
    constructor(private http: HttpClient) { }

    authenticate(userType): Promise<any> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const postData = this.authItems;

        return this.http.post<AuthResponse>(this.authURL + userType, postData, httpOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            ).toPromise();
    }

    validateUser(username, password): Observable<LoginData> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const postData = {
            'username': username,
            'password': password
        };

        return this.http.post<LoginData>(this.loginURL, postData, httpOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }

    invalidateUser() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const postData = {
            'username': this.authItems.username,
            'token': this.authItems.token
        };

        localStorage.removeItem('USERNAME');
        localStorage.removeItem('JSESSIONID');
        localStorage.removeItem('USERTYPE');

        return this.http.post(this.loginURL, postData, httpOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }

    retrieveUserDetails() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const postData = this.authItems;

        return this.http.post<UserDetailsResponse>(this.retrieveNameURL, postData, httpOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            ).toPromise();
    }

    setLocalStorage(username, token, userType) {
        localStorage.setItem('USERNAME', username);
        localStorage.setItem('JSESSIONID', token);
        localStorage.setItem('USERTYPE', userType);
    }

    get authItems() {
        return {
            username: localStorage.getItem('USERNAME'),
            token: localStorage.getItem('JSESSIONID'),
            userType: localStorage.getItem('USERTYPE')
        };
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
