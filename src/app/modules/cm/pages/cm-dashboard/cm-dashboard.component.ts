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
    mostViewedQns: any[];
    tempDate: string;
    recentSimilarQn: any;
    mostViewedSimilarQn: any;
    checklists: checklist[];
    clients: Client[];
    colsDoc: any[];

    constructor(
        private cmService: CMService,
        private messageService: MessageService,
        private router: Router
    ) { }

    ngOnInit() {
        this.loading = true;

        this.colsDoc = [
            { field: 'name', header: 'Checklist' },
            { field: 'dateUpdated', header: 'Date Modified' },
        ];

        this.cmService.retrieveUncleanedFAQ().subscribe(res => {
            if (res.error) {
                this.messageService.add({
                    key: 'msgs', severity: 'error', summary: 'Error', detail: res.error
                });
                return;
            }

            if (res.results) {
                this.uncleanedCount = res.numUnclean;
            }

        }, error => {
            this.messageService.add({
                key: 'msgs', severity: 'error', summary: 'Server Error', detail: error
            });
        });

        this.cmService.retrieveDashboardStats().subscribe(res => {
            if (res.error) {
                this.messageService.add({
                    key: 'msgs', severity: 'error', summary: 'Error', detail: res.error
                });
                this.loading = false;
                return;
            }

            if (res.results) {
                this.faqAnsweredCount = res.results.answeredCount;
                this.faqUnansweredCount = res.results.unansweredCount;
                this.updatedChecklists = res.updatedChecklists;
                this.mostRecentQns = res.mostRecentQuestions;
                this.mostViewedQns = res.mostPopularQuestions;
                
                this.updatedChecklists.forEach(checklist => {
                    this.tempDate = checklist.dateUpdated.slice(0, 10)
                    checklist.dateUpdated = this.tempDate
                });
                this.loading = false;
            }
        }, error => {
            this.messageService.add({
                key: 'msgs', severity: 'error', summary: 'Server Error', detail: error
            });
            this.loading = false;
        });
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

    loadMostViewedSimilarQn(event) {
        if (this.mostViewedQns[event.index].qnIDRef) {
            this.cmService.retrieveSelectedAnsweredFAQ(this.mostViewedQns[event.index].qnIDRef).subscribe(res => {
                if (res.error) {
                    this.messageService.add({
                        key: 'msgs', severity: 'error', summary: 'Error', detail: res.error
                    });
                    return;
                }

                if (res.results) {
                    this.mostViewedSimilarQn = res.results;
                }
            }, error => {
                this.messageService.add({
                    key: 'msgs', severity: 'error', summary: 'Error', detail: error
                });
            });
        }
    }

    setMostViewedSimilarQnToNull(event) {
        this.mostViewedSimilarQn = null;
    }

    loadRecentSimilarQn(event) {
        console.log(this.mostRecentQns[event.index])
        if (this.mostRecentQns[event.index].qnIDRef) {
            this.cmService.retrieveSelectedAnsweredFAQ(this.mostRecentQns[event.index].qnIDRef).subscribe(res => {
                if (res.error) {
                    this.messageService.add({
                        key: 'msgs', severity: 'error', summary: 'Error', detail: res.error
                    });
                    return;
                }

                if (res.results) {
                    this.recentSimilarQn = res.results;
                }
            }, error => {
                this.messageService.add({
                    key: 'msgs', severity: 'error', summary: 'Error', detail: error
                });
            });
        }
    }

    setRecentSimilarQnToNull(event) {
        this.recentSimilarQn = null;
    }
}
