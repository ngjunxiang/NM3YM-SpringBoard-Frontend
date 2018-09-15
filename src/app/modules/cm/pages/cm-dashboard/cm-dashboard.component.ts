import { Component, OnInit } from '@angular/core';

interface Client {
    name: string;
    type: string;
}

interface checklist {
    name: string;
    modifiedDate: string;
}

interface Year {
    label: string;
    value: number;
}

@Component({
    selector: 'cm-dashboard',
    templateUrl: './cm-dashboard.component.html',
    styleUrls: ['./cm-dashboard.component.css']
})

export class CMDashboardComponent implements OnInit {

    data1: any;
    data: any;
    years: Year[];
    checklists: checklist[];
    clients: Client[];
    selectedCity: number;
    cols: any[];
    colsDoc: any[];
    frozenCol: any[];

    constructor() { }

    ngOnInit() {
        this.data1 = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug','Sep','Oct','Nov','Dec'],
            datasets: [
                {
                    label: '2018',
                    data: [65, 59, 80, 81, 56, 55, 40, 43, 30, 21, 15, 10],
                    fill: false,
                    borderColor: '#4bc0c0'
                },
                {
                    label: '2017',
                    data: [28, 48, 40, 19, 86, 27, 90, 60, 40, 32, 21, 12],
                    fill: false,
                    borderColor: '#565656'
                },
            ]
        }


        this.years = [
            { label: "2018", value: 2018 },
            { label: "2017", value: 2017 },
            { label: "2016", value: 2016 },
        ];

        this.checklists = [
            { name: "Individual Onboard Checklist", modifiedDate: "15/9/2018" },
            { name: "Corporate Onboard Checklist", modifiedDate: "10/9/2018" },
            { name: "Individual Review Checklist", modifiedDate: "30/8/2018" },
            { name: "Corporate Review Checklist", modifiedDate: "21/8/2018" },
            { name: "Individual Onboard Checklist", modifiedDate: "15/9/2018" },
            { name: "Corporate Onboard Checklist", modifiedDate: "10/9/2018" },
            { name: "Individual Review Checklist", modifiedDate: "30/8/2018" },
            { name: "Corporate Review Checklist", modifiedDate: "21/8/2018" },
        ];

        this.colsDoc = [
            { field: 'name', header: 'Checklist' },
            { field: 'modifiedDate', header: 'Modified Date' },
        ];


        this.clients = [
            { name: "Jarrett", type: "Individual" },
            { name: "Melissa", type: "Corporate" },
            { name: "Joel", type: "Individual" },
            { name: "Lindsay", type: "Corporate" },
            { name: "Jarrett", type: "Individual" },
            { name: "Melissa", type: "Corporate" },
            { name: "Joel", type: "Individual" },
            { name: "Lindsay", type: "Corporate" },
            { name: "Jarrett", type: "Individual" },
            { name: "Melissa", type: "Corporate" },
            { name: "Joel", type: "Individual" },
            { name: "Lindsay", type: "Corporate" },
            { name: "Jarrett", type: "Individual" },
            { name: "Melissa", type: "Corporate" },
            { name: "Joel", type: "Individual" },
            { name: "Lindsay", type: "Corporate" },
        ]

        this.cols = [
            { field: 'name', header: 'Client' },
            { field: 'type', header: 'Type' }
        ];
    }
}
