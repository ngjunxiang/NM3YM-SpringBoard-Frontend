import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Message } from 'primeng/components/common/api';

@Component({
  selector: 'app-cm',
  templateUrl: './cm.component.html',
  styleUrls: ['./cm.component.scss']
})

export class CMComponent implements OnInit {

    // Theme
    color = 'defaultdark';
    showSettings = false;
    showMinisidebar = false; 
    showDarktheme = false;

    // UI Control
    msgs: Message[] = [];

	public config: PerfectScrollbarConfigInterface = {};

    constructor(
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        if (this.router.url === '/') {
            this.router.navigate(['/dashboard/dashboard1']);
        }

        if (this.route.snapshot.queryParams['err'] === 'auth001') {
            this.msgs.push({ severity: 'warn', summary: 'Access Denied', detail: 'You do not have permission to access that page. Please contact the admin.' });
        }
    }
}