import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Message } from 'primeng/components/common/api';

import { ROUTES } from './compliance.sidebar-items';
import { AuthenticationService } from '../../../core/services/authentication.service';

@Component({
  selector: 'app-compliance',
  templateUrl: './compliance.component.html',
  styleUrls: ['./compliance.component.scss']
})

export class ComplianceComponent implements OnInit {

    // Theme
    color = 'defaultdark';
    showSettings = false;
    showMinisidebar = false; 
    showDarktheme = false;

    
    // UI Control
    sidebarRoutes = ROUTES;
    appMsgs: Message[] = [];

    // Outputs
    name: string;
    email: string;
    notifications: any[] = [];

    public config: PerfectScrollbarConfigInterface = {};

    constructor(
        private authService: AuthenticationService,
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
        })
    }
}