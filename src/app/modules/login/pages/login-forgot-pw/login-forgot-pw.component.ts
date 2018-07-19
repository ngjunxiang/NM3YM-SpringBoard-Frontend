import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Message } from 'primeng/components/common/api';

@Component({
    selector: 'app-login-forgot-pw',
    templateUrl: './login-forgot-pw.component.html',
    styleUrls: ['./login-forgot-pw.component.css']
})
export class LoginForgotPwComponent implements OnInit {

    // UI Control
    isSent = false;
    loading = false;
    msgs: Message[] = [];

    // UI Component
    email: string;
    forgotPwForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private titleService: Title
    ) {
    }

    ngOnInit() {
        this.titleService.setTitle("SpringBoard - Forgot Password");
        this.createForm();
    }

    createForm() {
        this.forgotPwForm = this.fb.group({
            email: new FormControl('', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')])
        });
    }

    sendEmail() {
        this.loading = true;

        this.email = this.forgotPwForm.controls['email'].value;

        this.msgs.push({
            severity: 'success', summary: 'A recovery email has been sent to '
                + this.email + '.', detail: 'You\'ll be redirected back to the login page in a few seconds.'
        });

        setTimeout(() => {
            this.router.navigate(['/login']);
        }, 5000);
    }
}
