import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';

import { Message } from 'primeng/components/common/api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AdminService } from '../../../../core/services/admin.service';

@Component({
    selector: 'admin-update',
    templateUrl: './update-admin.component.html',
    styleUrls: ['./update-admin.component.scss']
})

export class UpdateAdminComponent implements OnInit {

    // UI Control
    loading = false;
    msgs: Message[] = [];

    // UI Component
    updateUserForm: FormGroup;
    usernameList = [];
    filteredUsernameList = [];

    constructor(
        private fb: FormBuilder,
        private adminService: AdminService
    ) {

    }

    ngOnInit() {
        this.loading = true;
        this.retrieveAllUsers();
        this.createForm();
    }

    createForm() {
        this.updateUserForm = this.fb.group({
            username: new FormControl('', Validators.required),
            password: new FormControl('', [
                Validators.required, 
                Validators.minLength(6),
                this.hasLowerUppercase,
                this.hasNumber,
                this.hasSpecialChar
            ]),
            confirmPassword: new FormControl('', Validators.required)
        }, {
                validator: this.passwordMismatch
            });

        this.updateUserForm.controls.password.setAsyncValidators(this.differentPasswordValidator());
        this.updateUserForm.controls.username.setAsyncValidators(this.usernameExists());

        this.loading = false;
    }

    retrieveAllUsers() {
        this.adminService.retrieveUsersList().subscribe(data => {
            let usernames = [];
            data.forEach(user => {
                usernames.push(user.username);
            });
            this.usernameList = usernames;
        }, error => {
            this.msgs.push({
                severity: 'error', summary: 'Server Error', detail: error
            });
        });
    }

    searchUser() {
        let filtered: any[] = [];
        for (let i = 0; i < this.usernameList.length; i++) {
            let username = this.usernameList[i];
            if (username.toLowerCase().indexOf(this.updateUserForm.controls.username.value.toLowerCase()) == 0) {
                filtered.push(username);
            }
        }
        this.filteredUsernameList = filtered;
    }

    usernameExists() {
        return (control: AbstractControl) => {
            return this.checkUsernameExists(control.value).pipe(map(res => {
                return res ? null : { 'usernameNoExist': true };
            }));
        };
    }

    checkUsernameExists(inputUsername: string): Observable<boolean> {
        return this.adminService.retrieveUsersList().pipe(map(data => {
            let exists = false;
            data.forEach(user => {
                if (user.username === inputUsername) {
                    exists = true;
                }
            });
            return exists;
        }, error => {
            this.msgs.push({
                severity: 'error', summary: 'Server Error', detail: error
            });
            return false;
        }));
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

    differentPasswordValidator() {
        return (control: AbstractControl) => {
            return this.checkDifferentPassword(control.value).pipe(map(res => {
                return res ? { 'samePassword': true } : null;
            }));
        };
    }

    checkDifferentPassword(inputPassword: string): Observable<boolean> {
        return this.adminService.retrieveUsersList().pipe(map(data => {
            let exists = false;
            data.forEach(user => {
                if (user.username === this.updateUserForm.controls.username.value) {
                    exists = (user.password === inputPassword);
                }
            });
            return exists;
        }, error => {
            this.msgs.push({
                severity: 'error', summary: 'Server Error', detail: error
            });
            return false;
        }));
    }

    updateUser() {
        this.loading = true;

        this.updateUserForm.controls.username.markAsDirty();
        this.updateUserForm.controls.password.markAsDirty();
        this.updateUserForm.controls.confirmPassword.markAsDirty();

        if (this.updateUserForm.invalid ||
            this.updateUserForm.controls.username.invalid ||
            this.updateUserForm.controls.password.invalid ||
            this.updateUserForm.controls.confirmPassword.invalid) {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: 'Please correct the invalid fields highlighted'
            });
            this.loading = false;
            return;
        }

        let updateUsername = this.updateUserForm.controls.username.value;
        let updatePassword = this.updateUserForm.controls.password.value;

        this.adminService.updateUser(updateUsername, updatePassword).subscribe(res => {
            if (res.error) {
                this.msgs.push({
                    severity: 'error', summary: 'Error', detail: res.error
                });
                return;
            }

            if (res.results) {
                this.msgs.push({
                    severity: 'success', summary: 'Success', detail: 'User password has been updated'
                });
            } else {
                this.msgs.push({
                    severity: 'error', summary: 'Error', detail: 'Username not found'
                });
            }
            this.loading = false;
        }, error => {
            this.msgs.push({ severity: 'error', summary: 'Server Error', detail: error + ' Please try again later.' });
            this.loading = false;
        });
    }
}
