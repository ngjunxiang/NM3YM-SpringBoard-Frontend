import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';

import { Message } from 'primeng/components/common/api';

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

    constructor(
        private fb: FormBuilder
    ) {
        this.userTypes = [
            { name: 'Admin', code: 'ADMIN' },
            { name: 'Client Management', code: 'CM' },
            { name: 'Relationship Manager', code: 'RM' }
        ]
    }

    ngOnInit() {
        this.loading = true;
        this.createForm();
        this.loading = false;
    }

    createForm() {
        this.passwordForm = this.fb.group({
            password: new FormControl('', [Validators.required, Validators.minLength(6)]),
            confirmPassword: new FormControl('', [Validators.required])
        }, {
                validator: this.passwordMismatch
            });

        this.createUserForm = this.fb.group({
            username: new FormControl('', [Validators.required, this.usernameValidator]),
            email: new FormControl('', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
            userType: new FormControl('', Validators.required),
            passwordForm: this.passwordForm
        });
    }

    usernameValidator(control: AbstractControl): { [key: string]: boolean } | null {
        const existingUsers = ['admin', 'RandyLai', 'LimPeiXuan'];
        if (control.value && existingUsers && existingUsers.includes(control.value)) {
            return { 'usernameExists': true };
        }
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

        if (this.createUserForm.controls.username.invalid ||
            this.createUserForm.controls.email.invalid ||
            this.createUserForm.controls.passwordForm.get('password').invalid ||
            this.createUserForm.controls.passwordForm.get('confirmPassword').invalid ||
            this.createUserForm.controls.passwordForm.hasError ||
            this.createUserForm.controls.userType.invalid) {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: 'Please correct the invalid fields highlighted'
            });
            this.loading = false;
            return;
        }

        this.loading = false;

        this.msgs.push({
            severity: 'success', summary: 'Success', detail: 'User has been created'
        });
    }
}
