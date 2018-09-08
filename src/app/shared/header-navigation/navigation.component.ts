import { Component, AfterViewInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;

@Component({
    selector: 'ui-navigation',
    templateUrl: './navigation.component.html'
})

export class NavigationComponent implements AfterViewInit {
    
    @Input('name') name: string;
    @Input('email') email: string;
    notifications = ['Notification 1', 'Notification 2'];
    
    constructor(private modalService: NgbModal) { }

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
}
