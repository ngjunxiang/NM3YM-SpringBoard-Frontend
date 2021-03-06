import { Component, OnInit } from '@angular/core';

import { MessageService } from 'primeng/api';

import { AdminService } from '../../../../core/services/admin.service';

@Component({
    selector: 'admin-view-all',
    templateUrl: './admin-view-all.component.html',
    styleUrls: ['./admin-view-all.component.css']
})

export class AdminViewAllComponent implements OnInit {

    // UI Control
    loading = false;
    users: any[];
    cols: any[];

    constructor(
        private adminService: AdminService,
        private messageService: MessageService        
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
                this.messageService.add({ 
                    key: 'msgs', severity: 'error', summary: 'Server Error', detail: 'Please contact the system admin'
                });
                return;
            }
            this.users = res;
            this.loading = false;
        }, error => {
            this.messageService.add({ 
                key: 'msgs', severity: 'error', summary: 'Server Error', detail: error
            });
        });
    }
}
