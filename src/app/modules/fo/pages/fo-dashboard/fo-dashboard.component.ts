import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/components/common/api';

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

    // Variables for Dashboard
    documents: Document[];
    clients: Client[];
    cols: any[];
    colsDoc: any[];
    faqs: any[];
    similarQn: any;

    // UI Component
    completedClients: number;
    pendingClients: number;
    totalChecklist: number;
    docChanges: any[];
    clientsAffected: any[];
    tempDate: string;

    constructor(
        private foService: FOService,
        private messageService: MessageService,
        private router: Router
    ) { }

    ngOnInit() {
        this.loading = true;

        //Calling from endpoints
        this.getDashboardStats();

        this.colsDoc = [
            { field: 'name', header: 'Document' },
            { field: 'changes', header: 'Changes' },
            { field: 'date', header: 'Date' }
        ];

        this.cols = [
            { field: 'Client', header: 'Client' },
            { field: 'DocName', header: 'Checklist Name' }
        ];
    }

    getDashboardStats() {
        this.foService.retrieveDashboardStats().subscribe(res => {
            if (res.error) {
                this.messageService.add({
                    key: 'msgs', severity: 'error', summary: 'Error', detail: res.error
                });
                return;
            }

            this.docChanges = [];

            if (res.results) {
                this.completedClients = res.results.completedCount;
                this.pendingClients = res.results.pendingCount;
                this.totalChecklist = this.completedClients + this.pendingClients;
                this.clientsAffected = res.clientsAffected;
                this.faqs = res.recentlyAnswerQuestions;

                res.docChanges.notifications.forEach(docChange => {
                    this.tempDate = docChange.dateCreated.slice(0, 10)
                    docChange.dateCreated = this.tempDate

                    var typeOfChange: string;
                    if (docChange.type.changed == "1") {
                        typeOfChange = "Modified"
                    } else if (docChange.type.changed == "2") {
                        typeOfChange = "Added"
                    } else {
                        typeOfChange = "Deleted"
                    }
                    this.docChanges.push({
                        name: docChange.type.documentName, changes: typeOfChange, date: docChange.dateCreated
                    });
                });

                this.loading = false;
            }
        }, error => {
            this.messageService.add({
                key: 'msgs', severity: 'error', summary: 'Error', detail: error
            });
        });
    }

    redirectPending() {
        this.router.navigate(['fo/onboard/manage'], {
            queryParams: {
                filterby: "pending"
            }
        });
    }

    redirectCompleted() {
        this.router.navigate(['fo/onboard/manage'], {
            queryParams: {
                filterby: "completed"
            }
        });
    }

    redirectAffectedClient(id: number, docName: String) {
        this.router.navigate(['/fo/onboard/edit', id], {
            queryParams: {
                name: docName
            }
        });
    }

    loadSimilarQn(event) {
        if (this.faqs[event.index].qnIDRef) {
            this.foService.retrieveSelectedAnsweredFAQ(this.faqs[event.index].qnIDRef).subscribe(res => {
                if (res.error) {
                    this.messageService.add({
                        key: 'msgs', severity: 'error', summary: 'Error', detail: res.error
                    });
                    return;
                }

                if (res.results) {
                    this.similarQn = res.results;
                }
            }, error => {
                this.messageService.add({
                    key: 'msgs', severity: 'error', summary: 'Error', detail: error
                });
            });
        }
    }

    setSimilarQnToNull(event) {
        this.similarQn = null;
    }
}
