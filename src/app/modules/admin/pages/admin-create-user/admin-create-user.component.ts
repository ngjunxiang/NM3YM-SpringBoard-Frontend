import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';

import { SelectItem, MessageService } from 'primeng/components/common/api';
import { map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

import { AdminService } from '../../../../core/services/admin.service';

@Component({
    selector: 'admin-create-user',
    templateUrl: './admin-create-user.component.html',
    styleUrls: ['./admin-create-user.component.scss']
})

export class AdminCreateUserComponent implements OnInit {

    // UI Control
    loading = false;

    // UI Component
    createUserForm: FormGroup;
    passwordForm: FormGroup;
    userTypes: SelectItem[];
    usernames = [];
    emails = [];

    constructor(
        private fb: FormBuilder,
        private adminService: AdminService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.loading = true;

        this.userTypes = [
            { label: 'Admin', value: 'ADMIN' },
            { label: 'Client Management', value: 'CM' },
            { label: 'Marketing Assistant', value: 'MA' },
            { label: 'Relationship Manager', value: 'RM' }
        ];

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
        this.adminService.retrieveUsersList().subscribe(data => {
            data.forEach(user => {
                this.usernames.push(user.username);
            });
        }, error => {
            this.messageService.add({ 
                key: 'msgs', severity: 'error', summary: 'Server Error', detail: error
            });
        });

        if (inputUsername && this.usernames.length !== 0) {
            return of(this.usernames.includes(inputUsername));
        }
        return of(false);
    }

    checkEmailExists(inputEmail: string): Observable<boolean> {
        this.adminService.retrieveUsersList().subscribe(data => {
            data.forEach(user => {
                this.emails.push(user.email);
            });
        }, error => {
            this.messageService.add({ 
                key: 'msgs', severity: 'error', summary: 'Server Error', detail: error
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
            this.messageService.add({ 
                key: 'msgs', severity: 'error', summary: 'Error', detail: 'Please correct the invalid fields highlighted'
            });
            this.loading = false;
            return;
        }

        let newName = this.createUserForm.controls.name.value;
        let newUsername = this.createUserForm.controls.username.value;
        let newPassword = this.createUserForm.controls.passwordForm.get('password').value;
        let newEmail = this.createUserForm.controls.email.value;
        let newUserType = this.createUserForm.controls.userType.value;

        this.adminService.createUser(newName, newUsername, newEmail, newUserType, newPassword).subscribe(res => {
            if (res.error) {
                this.messageService.add({ 
                    key: 'msgs', severity: 'error', summary: 'Error', detail: res.error
                });
                return;
            }

            if (res.results) {
                this.messageService.add({ 
                    key: 'msgs', severity: 'success', summary: 'Success', detail: newUsername + ' has been created'
                });

                this.createUserForm.controls.name.reset('');
                this.createUserForm.controls.username.reset('');
                this.createUserForm.controls.passwordForm.get('password').reset('');
                this.createUserForm.controls.passwordForm.get('confirmPassword').reset('');
                this.createUserForm.controls.email.reset('');
                this.createUserForm.controls.userType.reset('');
            } else {
                this.messageService.add({ 
                    key: 'msgs', severity: 'error', summary: 'Error', detail: 'Something went wrong'
                });
            }
            this.loading = false;
        }, error => {
            this.messageService.add({ 
                key: 'msgs', severity: 'error', summary: 'Server Error', detail: error
            });
            this.loading = false;
        });
    }
}
