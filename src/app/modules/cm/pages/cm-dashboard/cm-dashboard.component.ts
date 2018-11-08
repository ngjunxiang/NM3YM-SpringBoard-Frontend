import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/components/common/api';

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

    // UI Component
    faqAnsweredCount: number;
    faqUnansweredCount: number;
    uncleanedCount: number;
    updatedChecklists: any[];
    mostRecentQns: any[];
    tempDate: string;

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
        private messageService: MessageService,
        private router: Router
    ) { }

    ngOnInit() {
        this.loading = true;

        this.cmService.retrieveDashboardStats().subscribe(res => {
            if (res.error) {
                this.messageService.add({
                    key: 'msgs', severity: 'error', summary: 'Error', detail: res.error
                });
                return;
            }

            this.faqAnsweredCount = res.results.answeredCount;
            this.faqUnansweredCount = res.results.unansweredCount;
            this.updatedChecklists = res.updatedChecklists;
            this.mostRecentQns = res.mostRecentQuestions;

            this.updatedChecklists.forEach(checklist => {
                this.tempDate = checklist.dateUpdated.slice(0, 10)
                checklist.dateUpdated = this.tempDate
            })
        })

        this.cmService.retrieveUncleanedFAQ().subscribe(res => {
            if (res.error) {
                this.messageService.add({
                    key: 'msgs', severity: 'error', summary: 'Error', detail: res.error
                });
                this.loading = false;
                return;
            }

            if (res.results) {
                this.uncleanedCount = res.numUnclean;
            }

        }, error => {
            this.messageService.add({
                key: 'msgs', severity: 'error', summary: 'Server Error', detail: error
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


        this.loading = false;
    }

    redirectAnswered() {
        this.router.navigate(['cm/faq/manage'], {
            queryParams: {
                activeTab: 1
            }
        });
    }

    redirectUnanswered() {
        this.router.navigate(['cm/faq/manage'], {
            queryParams: {
                activeTab: 0
            }
        });
    }

    redirectCleanData() {
        this.router.navigate(['cm/faq/clean']);
    }

}
