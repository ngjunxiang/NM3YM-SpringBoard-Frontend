import { Component, OnInit } from '@angular/core';

import { Message } from 'primeng/components/common/api';

import { FOService } from '../../../../core/services/fo.service';

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
    selector: 'fo-dashboard',
    templateUrl: './fo-dashboard.component.html',
    styleUrls: ['./fo-dashboard.component.css']
})

export class FODashboardComponent implements OnInit {

    // UI Control
    loading = false;
    msgs: Message[] = [];

    //Dummy Variables for Dashboard
    data1: any;
    data: any;
    years: Year[];
    documents: Document[];
    clients: Client[];
    cols: any[];
    colsDoc: any[];

    //Actual Variable for Dashboard
    completedClients: number;
    pendingClients: number;
    onboardingClients: any[];

    constructor(
        private foService: FOService,
    ) { }

    ngOnInit() {
        this.loading = true
        //Calling from endpoints
        this.foService.retrieveDashboardStats().subscribe(res => {
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
            }
            this.loading = false;
        }, error => {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: error
            });
        })


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
