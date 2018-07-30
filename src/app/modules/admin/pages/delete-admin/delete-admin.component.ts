import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';

import { Message } from 'primeng/components/common/api';

import { UserMgmtService } from '../../../../core/admin/user-mgmt.service';

@Component({
    selector: 'admin-delete',
    templateUrl: './delete-admin.component.html',
    styleUrls: ['./delete-admin.component.scss']
})

export class DeleteAdminComponent implements OnInit {
    // UI Control
    loading = false;
    msgs: Message[] = [];

    // UI Component
    deleteUserForm: FormGroup;
    usernameList = [];
    filteredUsernameList = [];

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
        this.deleteUserForm = this.fb.group({
            username: new FormControl('', [Validators.required, this.usernameExists])
        });

        this.loading = false;
    }

    retrieveAllUsers() {
        this.userMgmtService.retrieveUsersList().subscribe(data => {
            if (!data) {
                this.msgs.push({
                    severity: 'error', summary: 'Server Error', detail: 'Please contact the system admin'
                });
                return;
            }
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

    usernameExists(control: AbstractControl): { [key: string]: boolean } | null {
        if (this.usernameList.includes(control.value))
            return null;

        return { 'doesNotExist': true };
    }

    searchUser() {
        let filtered: any[] = [];
        for (let i = 0; i < this.usernameList.length; i++) {
            let username = this.usernameList[i];
            if (username.toLowerCase().indexOf(this.deleteUserForm.controls.username.value.toLowerCase()) == 0) {
                filtered.push(username);
            }
        }
        this.filteredUsernameList = filtered;
    }

    deleteUser() {
        this.loading = true;

        this.deleteUserForm.controls.username.markAsDirty();

        if (this.deleteUserForm.controls.username.invalid) {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: 'Please correct the invalid fields highlighted'
            });
            this.loading = false;
            return;
        }

        let deleteUsername = this.deleteUserForm.controls.username.value;

        this.userMgmtService.deleteUser(deleteUsername).subscribe(res => {
            if (res.error) {
                this.msgs.push({
                    severity: 'error', summary: 'Error', detail: res.error
                });
                return;
            }

            if (res.results && res.items_deleted === 1) {
                this.msgs.push({
                    severity: 'success', summary: 'Success', detail: 'User has been deleted'
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
