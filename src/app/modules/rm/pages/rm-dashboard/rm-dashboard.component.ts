import { Component, OnInit } from '@angular/core';

import { Message } from 'primeng/components/common/api';

import { RMService } from '../../../../core/services/rm.service';

interface Client {
    name: string;
    type: string;
}

interface Document {
    name: string;
    changes: string;
    date: string;
}

interface Year {
    label: string;
    value: number;
}

@Component({
    selector: 'rm-dashboard',
    templateUrl: './rm-dashboard.component.html',
    styleUrls: ['./rm-dashboard.component.css']
})

export class RMDashboardComponent implements OnInit {

    // UI Control
    loading = false;
    msgs: Message[] = [];

    //Dummy Variables for Dashboard
    data1: any;
    data: any;
    years: Year[];
    documents: Document[];
    clients: Client[];
    selectedCity: number;
    cols: any[];
    colsDoc: any[];
    frozenCol: any[];

    //Actual Variable for Dashboard
    completedClients: number;
    pendingClients: number;
    onboardingClients: any[];

    constructor(
        private rmService: RMService,
    ) { }

    ngOnInit() {
        this.loading = true
        //Calling from endpoints
        this.rmService.retrieveDashboardStats().subscribe(res => {
            if (res.error) {
                this.msgs.push({
                    severity: 'error', summary: 'Error', detail: res.error
                });
                return;
            }

            if (res.results) {
                this.completedClients = res.results.completedCount;
                this.pendingClients = res.results.pendingCount;
                this.onboardingClients = res.results.onBoardedClients;
                console.log(res.results)
            }
            this.loading = false;
        }, error => {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: error
            });
        })

        //Fake data for dashboard 
        this.data1 = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August'],
            datasets: [
                {
                    label: '2018',
                    data: [65, 59, 80, 81, 56, 55, 40, 43],
                    fill: false,
                    borderColor: '#4bc0c0'
                },
                {
                    label: '2017',
                    data: [28, 48, 40, 19, 86, 27, 90, 60],
                    fill: false,
                    borderColor: '#565656'
                },
            ]
        }

        this.data = {
            labels: ['Individual', 'Corporate'],
            datasets: [
                {
                    data: [100, 50],
                    backgroundColor: [
                        "#45B39D",
                        "#F4D03F",
                    ],
                    hoverBackgroundColor: [
                        "#45B39D",
                        "#F4D03F",
                    ]
                }
            ]
        };

        this.years = [
            { label: "2018", value: 2018 },
            { label: "2017", value: 2017 },
            { label: "2016", value: 2016 },
        ];

        this.documents = [
            { name: "SOL", changes: "Modified", date: "12-04-2018" },
            { name: "SOL", changes: "New", date: "12-04-2018" },
            { name: "SOL", changes: "Deleted", date: "12-04-2018" },
            { name: "SOL", changes: "Modified", date: "12-04-2018" }
        ];

        this.colsDoc = [
            { field: 'name', header: 'Client' },
            { field: 'changes', header: 'Changes' },
            { field: 'date', header: 'Date' }
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
