import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

interface LoginData {
    token: string;
    userType: string;
    name: string;
    error: string;
}

interface Response {
    results: string;
    error: string;
}

@Injectable({
    providedIn: 'root'
})

export class AuthenticationService {

    private host = "http://localhost:8000";
    private loginURL = this.host + '/app/login';
    private authURL = this.host + '/app/authenticate';

    constructor(private http: HttpClient) { }

    authenticate(userType): Promise<any> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const postData = this.authItems;

        return this.http.post<Response>(this.authURL + userType, postData, httpOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            ).toPromise();
    }

    checkAuth(userType) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const postData = this.authItems;

        return this.http.post<Response>(this.authURL + userType, postData, httpOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
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
        localStorage.removeItem('USERNAME');
        localStorage.removeItem('JSESSIONID');
        localStorage.removeItem('USERTYPE');
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
