import { Component, OnInit } from '@angular/core';

import { Message } from 'primeng/components/common/api';

import { AdminService } from '../../../../core/services/admin.service';

@Component({
    selector: 'admin-panel',
    templateUrl: './admin-panel.component.html',
    styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

    // UI Control
    loading = false;
    msgs: Message[] = [];
    users: any[];
    cols: any[];

    constructor(
        private adminService: AdminService
    ) { }

    ngOnInit() {
        this.loading = true;

        this.cols = [
            { field: 'name', header: 'Name' },
            { field: 'username', header: 'Username' },
            { field: 'userType', header: 'User Type' },
            { field: 'email', header:'Email' }
        ];

        this.retrieveAllUsers();
    }

    retrieveAllUsers() {
        this.adminService.retrieveUsersList().subscribe(res => {
            if (!res) {
                this.msgs.push({
                    severity: 'error', summary: 'Server Error', detail: 'Please contact the system admin'
                });
                return;
            }
            this.users = res;
            this.loading = false;
        }, error => {
            this.msgs.push({
                severity: 'error', summary: 'Server Error', detail: error
            });
        });
    }
}
