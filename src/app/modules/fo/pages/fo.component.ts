import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Message } from 'primeng/components/common/api';

import { ROUTES } from './fo.sidebar-items';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { FOService } from '../../../core/services/fo.service';

@Component({
  selector: 'app-fo',
  templateUrl: './fo.component.html',
  styleUrls: ['./fo.component.scss']
})

export class FOComponent implements OnInit {

    // Theme
    color = 'defaultdark';
    showSettings = false;
    showMinisidebar = false; 
    showDarktheme = false;

    
    // UI Control
    loading = true;
    sidebarRoutes = ROUTES;
    appMsgs: Message[] = [];

    // Name & Email
    name: string;
    email: string;
    notifications: any[];

    public config: PerfectScrollbarConfigInterface = {};

    constructor(
        private authService: AuthenticationService,
        private foService: FOService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        if (this.router.url === '/') {
            this.router.navigate(['/dashboard']);
        }

        this.route.queryParams.subscribe(params => {
            if (params['err'] === 'auth001') {
                this.appMsgs.push({
                    severity: 'warn', summary: 'Access Denied', detail: 'You do not have permission to access that page. Please contact the admin.'
                });
            }
        });

        this.retrieveUserDetails();
        this.retrieveNotifications();
    }

    async retrieveUserDetails() {
        await this.authService.retrieveUserDetails().then(res => {
            if (res.error) {
                this.appMsgs.push({
                    severity: 'error', summary: 'Server Error', detail: 'Please contact the admin.'
                });
            }

            if (res.name && res.email) {
                this.name = res.name;
                this.email = res.email;
                this.authService.userDetails = {
                    'name': this.name,
                    'email': this.email
                };
            }
        }, error => {
            this.appMsgs.push({
                severity: 'error', summary: 'Server Error', detail: error
            });
        });
    }

    retrieveNotifications() {
        this.foService.retrieveNotifications().subscribe(res => {
            if (res.error) {
                this.appMsgs.push({
                    severity: 'error', summary: 'Server Error', detail: 'Notifications cannot be retrieved. Please contact the admin.'
                });
            }
            if (res.results) {
                this.notifications = res.results.notifications;
            }

            this.loading = false;
        }, error => {
            this.appMsgs.push({
                severity: 'error', summary: 'Server Error', detail: error
            });
            this.notifications = [];
            this.loading = false;
        });
    }

    updateNotifications(event) {
        this.foService.updateNotifications().subscribe(res => {
            if (res.error) {
                this.appMsgs.push({
                    severity: 'error', summary: 'Server Error', detail: 'Notifications cannot be retrieved. Please contact the admin.'
                });
            }
            
            this.loading = false;
        }, error => {
            this.appMsgs.push({
                severity: 'error', summary: 'Server Error', detail: error
            });
            this.loading = false;
        });
    }
}