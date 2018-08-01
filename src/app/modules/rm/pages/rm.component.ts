import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Message } from 'primeng/components/common/api';

import { ROUTES } from './rm.sidebar-items';

@Component({
  selector: 'app-rm',
  templateUrl: './rm.component.html',
  styleUrls: ['./rm.component.scss']
})

export class RMComponent implements OnInit {

    // Theme
    color = 'defaultdark';
    showSettings = false;
    showMinisidebar = false; 
    showDarktheme = false;

    
    // UI Control
    sidebarRoutes = ROUTES;
    appMsgs: Message[] = [];

    // Name & Email
    name = 'RM';
    email = 'rm@bnpp.com';

    public config: PerfectScrollbarConfigInterface = {};

    constructor(
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
    }
}