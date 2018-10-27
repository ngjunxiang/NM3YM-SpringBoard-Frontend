import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Message } from 'primeng/components/common/api';

import { CMService } from '../../../../core/services/cm.service';

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

    // UI Control
    loading = false;
    msgs: Message[] = [];

    // UI Component
    faqAnsweredCount: number;
    faqUnansweredCount: number;
    uncleanedCount: number;
    updatedChecklists: any[];
    mostRecentQns: any[];
    tempDate : string; 

    //Fake Data 
    data1: any;
    data: any;
    years: Year[];
    checklists: checklist[];
    clients: Client[];
    selectedCity: number;
    cols: any[];
    colsDoc: any[];
    frozenCol: any[];

    constructor(
        private cmService: CMService,
        private router: Router
    ) { }

    ngOnInit() {
        this.loading = true;

        this.cmService.retrieveDashboardStats().subscribe(res => {
            if (res.error) {
                this.msgs.push({
                    severity: 'error', summary: 'Error', detail: res.error
                });
                return;
            }

            this.faqAnsweredCount = res.results.answeredCount;
            this.faqUnansweredCount = res.results.unansweredCount;
            this.updatedChecklists = res.updatedChecklists;
            this.mostRecentQns = res.mostRecentQuestions;
            
            this.updatedChecklists.forEach(checklist => {
                this.tempDate = checklist.dateUpdated.slice(0,10)
                checklist.dateUpdated = this.tempDate
            })
        })

        this.cmService.retrieveUncleanedFAQ().subscribe(res => {
            if (res.error) {
                this.msgs.push({
                    severity: 'error', summary: 'Error', detail: res.error
                });
                this.loading = false;
                return;
            }

            if (res.results) {
                this.uncleanedCount = res.numUnclean;
            }

        }, error => {
            this.msgs.push({
                severity: 'error', summary: 'Server Error', detail: error
            });
            this.loading = false;
        });

        this.colsDoc = [
            { field: 'name', header: 'Checklist' },
            { field: 'dateUpdated', header: 'Date Modified' },
        ];


        this.data1 = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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

        
        this.loading = false;
    }

}
