import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ConfirmationService } from 'primeng/components/common/confirmationservice';
import { Message } from 'primeng/components/common/api';

import { CMService } from '../../../../core/services/cm.service';

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
        private cmService: CMService,
        private confirmationService: ConfirmationService,
        private router: Router
    ) { }

    ngOnInit() {
        this.loadPage();
    }

    loadPage() {
        this.loading = true;
        this.checklistNames = [];
        this.cmService.retrieveCMChecklistNames().subscribe(data => {
            data.clNames.forEach(cl => {
                this.checklistNames.push({
                    'name': cl.name,
                    'clID': cl.clID,
                    'version': cl.version,
                    'updatedBy': cl.updatedBy,
                    'dateCreated': cl.dateCreated
                });
            });
            this.loading = false;
        }, error => {
            this.msgs.push({
                severity: 'error', summary: 'Server Error', detail: error
            });
            this.loading = false;
        });
    }

    editChecklist(index: number) {
        let selectedChecklistId = this.checklistNames[index].clID;
        this.router.navigate(['/cm/checklist/manage/edit', selectedChecklistId], {
            queryParams: {
                name: this.checklistNames[index].name
            }
        });
    }

    deleteChecklist(index: number) {
        this.confirmationService.confirm({
            message: 'Do you want to delete this checklist?',
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                let selectedChecklist = this.checklistNames[index].clID;
                this.cmService.deleteCMChecklist(selectedChecklist).subscribe(res => {
                    if (res.error) {
                        this.msgs.push({
                            severity: 'error', summary: 'Error', detail: res.error
                        });
                        return;
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
