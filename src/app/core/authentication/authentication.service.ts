import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { User } from '../domain/user';

interface LoginData {
    status: boolean,
    user: User
}

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    currentUser: User;

    constructor(private http: HttpClient) { }

    validateUser(username, password) {
        // change this to post
        return this.http.get<LoginData>("/assets/login.json").pipe(map(data => {
            if (data.status) {
                localStorage.setItem('currentUser', 'validUser');
                localStorage.setItem('userType', data.user.userType);
                this.currentUser = data.user;
            }
            return data;
        }));
    }

    invalidateUser() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userType');
    }

    getUserType() {
        return this.currentUser.userType;
    }
}
