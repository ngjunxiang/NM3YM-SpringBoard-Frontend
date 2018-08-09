import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'rm-dashboard',
    templateUrl: './rm-dashboard.component.html',
    styleUrls: ['./rm-dashboard.component.scss']
})

export class RMDashboardComponent implements OnInit {

    clients = ["Testing 1", "Testing 2"];

    constructor() { }

    ngOnInit() {
    }

}
