import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'cm-dashboard',
    templateUrl: './cm-dashboard.component.html',
    styleUrls: ['./cm-dashboard.component.scss']
})
export class CMDashboardComponent implements OnInit {
    
    clients = ["Ali", "Baba"];

    constructor() { }

    ngOnInit() {
    }

}
