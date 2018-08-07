import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ConfirmationService } from 'primeng/components/common/confirmationservice';
import { Message } from 'primeng/components/common/api';

import { ChecklistService } from '../../../../core/cm/checklist.service';

@Component({
    selector: 'cm-checklist',
    templateUrl: './cm-checklist.component.html',
    styleUrls: ['./cm-checklist.component.scss']
})

export class CMChecklistComponent implements OnInit {

    // UI Control
    loading = false;
    msgs: Message[] = [];

    // UI Component
    checklistNames: any[];

    constructor(
        private checklistService: ChecklistService,
        private confirmationService: ConfirmationService,
        private router: Router
    ) { }

    ngOnInit() {
        this.loading = true;
        this.loadPage();
    }

    loadPage() {
        this.checklistNames = [];
        this.checklistService.retrieveChecklistNames().subscribe(data => {
            data.clNames.forEach(cl => {
                this.checklistNames.push({
                    'name': cl.name,
                    'dateCreated': cl.dateCreated
                });
            });
            console.log(this.checklistNames)
        }, error => {
            this.msgs.push({
                severity: 'error', summary: 'Server Error', detail: error
            });
        });
        this.loading = false;
    }

    editChecklist(index: number) {
        let selectedChecklist = this.checklistNames[index].name;
        this.router.navigate(['/cm/checklist/manage/edit', selectedChecklist]);
    }

    deleteChecklist(index: number) {
        this.confirmationService.confirm({
            message: 'Do you want to delete this checklist?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            accept: () => {
                let selectedChecklist = this.checklistNames[index].name;
                this.checklistService.deleteChecklist(selectedChecklist).subscribe(res => {
                    if (res.error) {
                        this.msgs.push({
                            severity: 'error', summary: 'Error', detail: res.error
                        });
                    }
                    
                    if (res.results) {
                        this.loadPage();
                        this.msgs.push({
                            severity: 'success', summary: 'Success', detail: 'Checklist deleted'
                        });
                    }
                }, error => {
                    this.msgs.push({
                        severity: 'error', summary: 'Error', detail: error
                    });
                });
            },
            reject: () => {
                return;
            }
        });
    }
}
