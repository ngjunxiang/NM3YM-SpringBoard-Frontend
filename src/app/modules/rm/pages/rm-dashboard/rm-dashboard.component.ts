import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'rm-dashboard',
    templateUrl: './rm-dashboard.component.html',
    styleUrls: ['./rm-dashboard.component.scss']
})

export class RMDashboardComponent implements OnInit {

    clients = [
        {
            'name': 'Melvin Ng',
            'type': 'Account Opening',
            'accNum': '123-456-789',
            'bookingCentre': 'Singapore',
            'businessCentre': 'Singapore',
            'urgent': false,
            'progress': 85
        },
        {
            'name': 'Jarrett Goh',
            'type': 'Account Opening',
            'accNum': '123-456-789',
            'bookingCentre': 'Hong Kong',
            'businessCentre': 'Hong Kong',
            'urgent': false,
            'progress': 40
        }];

    constructor() { }

    ngOnInit() {
    }

}
