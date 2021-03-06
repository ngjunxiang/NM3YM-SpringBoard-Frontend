import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Message } from 'primeng/components/common/api';

import { AuthenticationService } from '../../../../core/services/authentication.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

    // UI Control
    isValidUser = true;
    loading = false;
    returnUrl: string;
    msgs: Message[] = [];

    // UI Component
    username: string;
    password: string;
    loginForm: FormGroup;

    constructor(
        private authService: AuthenticationService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private titleService: Title
    ) {
    }

    ngOnInit() {
        this.titleService.setTitle("SpringBoard - Login");
        this.createForm();

        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

        if (this.route.snapshot.queryParams['err'] === 'auth001') {
            this.authService.invalidateUser();
            this.msgs.push({ severity: 'warn', summary: 'Access Denied', detail: 'Please log in again.' });
        }

        if (this.route.snapshot.queryParams['err'] === 'idle001') {
            this.authService.invalidateUser();
            this.msgs.push({ severity: 'warn', summary: 'Session Expired', detail: 'You have been inactive for more than 30 minutes. Please log in again.' });
        }

        if (this.route.snapshot.queryParams['action'] === 'logout') {
            this.authService.invalidateUser();
            this.msgs.push({ severity: 'success', summary: 'Logged Out Successfully', detail: '' });
        }
    }

    createForm() {
        this.loginForm = this.fb.group({
            username: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required)
        });
    }

    loginUser() {
        for (const i in this.loginForm.controls) {
            if (this.loginForm.controls[i]) {
                this.loginForm.controls[i].markAsDirty();
            }
        }

        if (this.loginForm.controls['username'].invalid ||
            this.loginForm.controls['password'].invalid) {
            return;
        }

        this.loading = true;

        this.username = this.loginForm.controls['username'].value;
        this.password = this.loginForm.controls['password'].value;

        this.authService.validateUser(this.username, this.password).subscribe(loginData => {
            this.isValidUser = true;
            if (loginData.error) {
                this.isValidUser = false;
                this.loginForm.controls['password'].setValue('');
                this.loginForm.controls['password'].markAsPristine();
                this.loginForm.updateValueAndValidity();
            }

            if (this.isValidUser) {
                this.authService.setLocalStorage(this.username, loginData.token, loginData.userType);

                if (this.returnUrl !== '/') {
                    this.router.navigate([this.returnUrl]);
                }
                if (loginData.userType) {
                    this.router.navigate(['/' + loginData.userType.toLowerCase()]);
                }
            }
            this.loading = false;
        }, error => {
            this.isValidUser = false;
            this.loginForm.controls['password'].setValue('');
            this.loginForm.controls['password'].markAsPristine();
            this.loginForm.updateValueAndValidity();
            this.msgs.push({ severity: 'error', summary: 'Server Error', detail: 'Please contact the system admin.' });
            this.loading = false;
        });
    }
}
