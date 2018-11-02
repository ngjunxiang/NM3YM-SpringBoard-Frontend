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
    sidebarRoutes = ROUTES;
    appMsgs: Message[] = [];

    // Name & Email
    name: string;
    email: string;
    notifications: any;

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
                this.notifications = {};
                let newNotifications = [];
                let allNotifications = [];

                res.results.checkListNotifications.forEach(notification => {
                    let notif;

                    if (notification.type.changed === '1') {
                        notif = notification.name + ': <br> \n <strong><font color="black">' + notification.type.documentName + '</font></strong> has been <strong><font color="black">edited</font></strong>.';
                    }

                    if (notification.type.changed === '2') {
                        notif = notification.name + ': <br> \n <strong><font color="black">' + notification.type.documentName + '</font></strong> has been <strong><font color="black">added</font></strong>.';
                    }

                    if (notification.type.changed === '3') {
                        notif = notification.name + ': <br> \n <strong><font color="black">' + notification.type.documentName + '</font></strong> has been <strong><font color="black">deleted</font></strong>.';
                    }

                    if (!notification.checked) {
                        newNotifications.push(notif);
                    }
                    
                    allNotifications.push(notif);
                });

                res.results.answerNotifications.forEach(notification => {
                    let notif;

                    if (notification.question && notification.answer) {
                        notif = 'Your question <strong><font color="black">' + notification.question + '</font></strong> has been answered';
                    }

                    if (!notification.checked) {
                        newNotifications.push(notif);
                    }
                    
                    allNotifications.push(notif);
                });

                this.notifications['newNotifications'] = newNotifications;
                this.notifications['allNotifications'] = allNotifications;
            }
        }, error => {
            this.appMsgs.push({
                severity: 'error', summary: 'Server Error', detail: error
            });
        });
    }

    updateNotifications(event) {
        this.foService.updateNotifications().subscribe(res => {
            if (res.error) {
                this.appMsgs.push({
                    severity: 'error', summary: 'Server Error', detail: 'Notifications cannot be retrieved. Please contact the admin.'
                });
            }
        }, error => {
            this.appMsgs.push({
                severity: 'error', summary: 'Server Error', detail: error
            });
        });
    }
}