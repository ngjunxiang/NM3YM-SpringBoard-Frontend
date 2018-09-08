import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';

import { Message } from 'primeng/components/common/api';
import { map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

import { UserMgmtService } from '../../../../core/services/user-mgmt.service';

interface UserType {
    name: string;
    code: string;
}

@Component({
    selector: 'admin-create',
    templateUrl: './create-admin.component.html',
    styleUrls: ['./create-admin.component.scss']
})

export class CreateAdminComponent implements OnInit {

    // UI Control
    loading = false;
    msgs: Message[] = [];

    // UI Component
    createUserForm: FormGroup;
    passwordForm: FormGroup;
    userTypes: UserType[];
    usernames = [];
    emails = [];

    constructor(
        private fb: FormBuilder,
        private userMgmtService: UserMgmtService
    ) {
        this.userTypes = [
            { name: 'Admin', code: 'ADMIN' },
            { name: 'Client Management', code: 'CM' },
            { name: 'Compliance', code: 'COM' },
            { name: 'Relationship Manager', code: 'RM' }

        ]
    }

    ngOnInit() {
        this.loading = true;

        this.createForm();
    }

    createForm() {
        this.passwordForm = this.fb.group({
            password: new FormControl('', [
                Validators.required,
                Validators.minLength(6),
                this.hasLowerUppercase,
                this.hasNumber,
                this.hasSpecialChar
            ]),
            confirmPassword: new FormControl('', [Validators.required])
        }, {
                validator: this.passwordMismatch
            });

        this.createUserForm = this.fb.group({
            name: new FormControl('', Validators.required),
            username: new FormControl('', Validators.required),
            email: new FormControl('', [Validators.required, Validators.email]),
            userType: new FormControl('', Validators.required),
            passwordForm: this.passwordForm
        });

        this.createUserForm.controls.username.setAsyncValidators(this.usernameValidator());
        this.createUserForm.controls.email.setAsyncValidators(this.emailValidator());

        this.loading = false;
    }

    checkUsernameExists(inputUsername: string): Observable<boolean> {
        this.userMgmtService.retrieveUsersList().subscribe(data => {
            data.forEach(user => {
                this.usernames.push(user.username);
            });
        }, error => {
            this.msgs.push({
                severity: 'error', summary: 'Server Error', detail: error
            });
        });

        if (inputUsername && this.usernames.length !== 0) {
            return of(this.usernames.includes(inputUsername));
        }
        return of(false);
    }

    checkEmailExists(inputEmail: string): Observable<boolean> {
        this.userMgmtService.retrieveUsersList().subscribe(data => {
            data.forEach(user => {
                this.emails.push(user.email);
            });
        }, error => {
            this.msgs.push({
                severity: 'error', summary: 'Server Error', detail: error
            });
        });

        if (inputEmail && this.emails.length !== 0) {
            return of(this.emails.includes(inputEmail));
        }
        return of(false);
    }

    usernameValidator() {
        return (control: AbstractControl) => {
            return this.checkUsernameExists(control.value).pipe(map(res => {
                return res ? { 'usernameExists': true } : null;
            }));
        };
    }

    emailValidator() {
        return (control: AbstractControl) => {
            return this.checkEmailExists(control.value).pipe(map(res => {
                return res ? { 'emailExists': true } : null;
            }));
        };
    }

    hasLowerUppercase(control: AbstractControl): { [key: string]: boolean } | null {
        if (!(/[a-z]/.test(control.value) && /[A-Z]/.test(control.value)))
            return { 'caseError': true };
        return null;
    }

    hasNumber(control: AbstractControl): { [key: string]: boolean } | null {
        if (!/\d/.test(control.value))
            return { 'numberError': true };
        return null;
    }

    hasSpecialChar(control: AbstractControl): { [key: string]: boolean } | null {
        if (!(/[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(control.value)))
            return { 'specialCharError': true };
        return null;
    }

    passwordMismatch(passwordForm: FormGroup) {
        let password = passwordForm.controls.password.value;
        let confirmPassword = passwordForm.controls.confirmPassword.value;

        if (confirmPassword.length <= 0) {
            return null;
        }

        if (confirmPassword !== password) {
            return { 'mismatch': true };
        }

        return null;
    }

    createUser() {
        this.loading = true;

        for (const i in this.createUserForm.controls) {
            if (this.createUserForm.controls[i]) {
                this.createUserForm.controls[i].markAsDirty();
            }
        }

        this.createUserForm.controls.passwordForm.get('password').markAsDirty();
        this.createUserForm.controls.passwordForm.get('confirmPassword').markAsDirty();

        if (this.createUserForm.controls.name.invalid ||
            this.createUserForm.controls.username.invalid ||
            this.createUserForm.controls.email.invalid ||
            this.createUserForm.controls.passwordForm.get('password').invalid ||
            this.createUserForm.controls.passwordForm.get('confirmPassword').invalid ||
            this.createUserForm.controls.passwordForm.errors ||
            this.createUserForm.controls.userType.invalid) {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: 'Please correct the invalid fields highlighted'
            });
            this.loading = false;
            return;
        }

        let newName = this.createUserForm.controls.name.value;
        let newUsername = this.createUserForm.controls.username.value;
        let newPassword = this.createUserForm.controls.passwordForm.get('password').value;
        let newEmail = this.createUserForm.controls.email.value;
        let newUserType = this.createUserForm.controls.userType.value.code;

        this.userMgmtService.createUser(newName, newUsername, newEmail, newUserType, newPassword).subscribe(res => {
            if (res.error) {
                this.msgs.push({
                    severity: 'error', summary: 'Error', detail: res.error
                });
                return;
            }

            if (res.results) {
                this.msgs.push({
                    severity: 'success', summary: 'Success', detail: 'User has been created'
                });
            } else {
                this.msgs.push({
                    severity: 'error', summary: 'Error', detail: 'Something went wrong'
                });
            }
            this.loading = false;
        }, error => {
            this.msgs.push({
                severity: 'error', summary: 'Server Error', detail: error
            });
            this.loading = false;
        });
    }
}
