import { Component, AfterViewInit, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;

@Component({
    selector: 'ui-navigation',
    templateUrl: './navigation.component.html'
})

export class NavigationComponent implements AfterViewInit, OnInit {
    
    @Input('name') name: string;
    @Input('email') email: string;
    @Input('notifications') notifications: any[];
    @Output() notificationsRead = new EventEmitter();

    // UI Control
    hasNew: boolean;
    showAll: boolean = false;

    // UI Components
    latestNotifications: any[];
    allNotifications: any[];
    newCount: number;
    
    constructor(private modalService: NgbModal) { }

    ngOnInit() {
        let count = 0;
        this.latestNotifications = [];
        this.allNotifications = [];
        this.notifications.forEach(notification => {
            if (count < 5) {
                this.latestNotifications.push('Changes have been made to ' + notification.name + '. Please review');
            }
            this.allNotifications.push('Changes have been made to ' + notification.name + '. Please review');
            count++;
        });
        
        if (this.latestNotifications.length > 0) {
            this.hasNew = true;
            this.newCount = this.latestNotifications.length;
        }
    }

    ngAfterViewInit() {
        var set = function () {
            var width = (window.innerWidth > 0) ? window.innerWidth : this.screen.width;
            var topOffset = 0;
            if (width < 1170) {
                $("#main-wrapper").addClass("mini-sidebar");
            } else {
                $("#main-wrapper").removeClass("mini-sidebar");
            }
        };
        $(window).ready(set);
        $(window).on("resize", set);


        $(".search-box a, .search-box .app-search .srh-btn").on('click', function () {
            $(".app-search").toggle(200);
        });

        $("body").trigger("resize");
    }

    toggleHasNew(event) {
        if (!event && this.hasNew) {
            this.hasNew = false;
            this.notificationsRead.emit(true);
        }
    }

    showMore() {
        this.showAll = true;
    }

    showLess() {
        this.showAll = false;
    }
}
