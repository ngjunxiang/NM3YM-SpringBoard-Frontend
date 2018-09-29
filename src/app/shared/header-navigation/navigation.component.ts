import { Component, AfterViewInit, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;

@Component({
    selector: 'ui-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.css']
})

export class NavigationComponent implements AfterViewInit, OnInit {

    @Input('name') name: string;
    @Input('email') email: string;
    @Input('notifications') notifications: any;
    @Output() notificationsRead = new EventEmitter();

    // UI Control
    hasNew: boolean;
    showAll: boolean = false;
    loading = false;

    // UI Components
    newNotifications: any[];
    allNotifications: any[];
    newCount: number;

    constructor(private modalService: NgbModal) { }

    async ngOnInit() {
        this.loading = true;

        await this.retrieveNotifications().then(res => {
            if (res) {
                this.loading = false;
            }
        });
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

    async retrieveNotifications(): Promise<boolean> {
        if (this.notifications) {
            this.newNotifications = this.notifications.newNotifications;
            this.allNotifications = this.notifications.allNotifications;
        }

        if (this.newNotifications.length > 0) {
            this.hasNew = true;
            this.newCount = this.newNotifications.length;
        }

        return true;
    }

    showMore() {
        this.showAll = true;
    }

    showLess() {
        this.showAll = false;
    }
}
