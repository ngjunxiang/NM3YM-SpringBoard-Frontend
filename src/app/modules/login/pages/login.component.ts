import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AuthenticationService } from '../../../core/authentication/authentication.service';

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

        this.authService.invalidateUser();

        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
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

        this.authService.validateUser(this.username, this.password).subscribe(data => {
            this.isValidUser = data.status;

            if (this.isValidUser) {
                console.log(this.returnUrl);
                if (this.returnUrl !== '/') {
                    this.router.navigate([this.returnUrl]);
                }
                if (data.user.userType === 'admin') {
                    this.router.navigate(['/admin']);
                }
                if (data.user.userType === 'user') {
                    this.router.navigate(['/user']);
                }
            }
        });

        
    }
}
