import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from "@angular/router";
import { RouteInfo } from './sidebar.metadata';

declare var $: any;

@Component({
    selector: 'ui-sidebar',
    templateUrl: './sidebar.component.html'
})

export class SidebarComponent implements OnInit {
    
    @Input('sidebarRoutes') ROUTES: RouteInfo[];
    @Input('name') name: string;
    
    isLoading = true;

    showMenu: string = '';
    showSubMenu: string = '';
    public sidebarnavItems: any[];

    //this is for the open close
    addExpandClass(element: any) {
        if (element === this.showMenu) {
            this.showMenu = '0';

        } else {
            this.showMenu = element;
        }
    }

    addActiveClass(element: any) {
        if (element === this.showSubMenu) {
            this.showSubMenu = '0';

        } else {
            this.showSubMenu = element;
        }
    }

    constructor(
        private modalService: NgbModal, 
        private router: Router,
        private route: ActivatedRoute
    ) { }

    // End open close
    ngOnInit() {
        this.sidebarnavItems = this.ROUTES.filter(sidebarnavItem => sidebarnavItem);
        $(function () {
            $(".sidebartoggler").on('click', function () {
                if ($("#main-wrapper").hasClass("mini-sidebar")) {
                    $("body").trigger("resize");
                    $("#main-wrapper").removeClass("mini-sidebar");

                } else {
                    $("body").trigger("resize");
                    $("#main-wrapper").addClass("mini-sidebar");
                }
            });
            this.isLoading = false;
        });

    }
}
