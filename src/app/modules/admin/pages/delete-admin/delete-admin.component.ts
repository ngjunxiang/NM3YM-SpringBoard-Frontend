import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';

import { Message } from 'primeng/components/common/api';
import { map } from 'rxjs/operators';

import { UserMgmtService } from '../../../../core/admin/user-mgmt.service';
import { Observable, of } from '../../../../../../node_modules/rxjs';

@Component({
    selector: 'app-delete-admin',
    templateUrl: './delete-admin.component.html',
    styleUrls: ['./delete-admin.component.scss']
})

export class DeleteAdminComponent implements OnInit {

    // UI Control
    loading = false;
    msgs: Message[] = [];

    // UI Component
    updateUserForm: FormGroup;
    usernameList = [];
    filteredUsernameList = [];
    passwordExists = false;

    constructor(
        private fb: FormBuilder,
        private userMgmtService: UserMgmtService
    ) {

    }

    ngOnInit() {
        this.loading = true;
        this.retrieveAllUsers();
        this.createForm();
    }

    createForm() {
        this.updateUserForm = this.fb.group({
            username: new FormControl('', [Validators.required]),
            password: new FormControl('', [Validators.required, Validators.minLength(6)]),
            confirmPassword: new FormControl('', [Validators.required])
        }, {
                validator: this.passwordMismatch,
            });

        this.updateUserForm.controls.password.setAsyncValidators(this.differentPasswordValidator());

        this.loading = false;
    }

    retrieveAllUsers() {
        this.userMgmtService.retrieveUsersList().subscribe(data => {
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
                console.log(res + 'this is res')
                return res ? { 'samePassword': true } : null;
            }));
        };
    }

    checkDifferentPassword(inputPassword: string): Observable<boolean> {
        this.userMgmtService.retrieveUsersList().subscribe(data => {
            let exists = false;
            data.forEach(user => {
                if (user.username === this.updateUserForm.controls.username.value) {
                    exists = (user.password === inputPassword);
                }
            });
            console.log(exists + 'inside');
            this.passwordExists = exists;
        }, error => {
            this.msgs.push({
                severity: 'error', summary: 'Server Error', detail: error
            });
        })
        return of(this.passwordExists);
    }

    updateUser() {
        this.loading = true;

        this.updateUserForm.controls.username.markAsDirty();
        this.updateUserForm.controls.password.markAsDirty();
        this.updateUserForm.controls.confirmPassword.markAsDirty();

        if (this.updateUserForm.controls.username.invalid ||
            this.updateUserForm.controls.password.invalid ||
            this.updateUserForm.controls.confirmPassword.invalid) {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: 'Please correct the invalid fields highlighted'
            });
            this.loading = false;
            return;
        }

        let newUsername = this.updateUserForm.controls.username.value;
        let newPassword = this.updateUserForm.controls.password.value;

        // this.userMgmtService.createUser(newUsername, newEmail, newUserType, newPassword).subscribe(res => {
        //     if (res.error) {
        //         this.msgs.push({
        //             severity: 'error', summary: 'Error', detail: res.error
        //         });
        //         return;
        //     }

        //     if (res.results) {
        //         this.msgs.push({
        //             severity: 'success', summary: 'Success', detail: 'User has been created'
        //         });
        //     } else {
        //         this.msgs.push({
        //             severity: 'error', summary: 'Error', detail: 'Something went wrong'
        //         });
        //     }
        //     this.loading = false;
        // }, error => {
        //     this.msgs.push({ severity: 'error', summary: 'Server Error', detail: error + ' Please try again later.' });
        //     this.loading = false;
        // });
    }
}
