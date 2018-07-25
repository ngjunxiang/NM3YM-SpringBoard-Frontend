import { Component, OnInit } from '@angular/core';

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
    blocked = false;
    msgs: Message[] = [];

    // UI Component
    checklistsNames: string[];

    constructor(
        private checklistService: ChecklistService
    ) { }

    ngOnInit() {
        this.loading = true;
        this.loadPage();
    }

    async loadPage() {
        this.checklistsNames = [];
        await this.checklistService.retrieveChecklist().subscribe(data => {
            data.checklists.forEach(checklist => {
                this.checklistsNames.push(checklist.name);
            });
        }, error => {
            this.msgs.push({
                severity: 'error', summary: 'Server Error', detail: error
            });
        });
        this.loading = false;
    }

    edit() {
        this.blocked = true;
    }
}
