import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Message } from 'primeng/components/common/api';

import { OnboardService } from '../../../../core/services/onboard.service';

@Component({
    selector: 'rm-dashboard',
    templateUrl: './rm-dashboard.component.html',
    styleUrls: ['./rm-dashboard.component.scss']
})

export class RMDashboardComponent implements OnInit {

    // UI Control
    loading = false;
    msgs: Message[] = [];

    // UI Components
    obProcesses: any;

    constructor(
        private onboardService: OnboardService,
        private router: Router
    ) { }

    ngOnInit() {
        this.loading = true;
        this.retrieveAllOnboardProcesses();
    }

    toggleUrgent(index: number) {
        this.obProcesses[index].urgent = !this.obProcesses[index].urgent
        // invoke service
    }

    retrieveAllOnboardProcesses() {
        this.obProcesses = [];
        this.onboardService.retrieveAllOnboardProcesses().subscribe(res => {
            if (res.error) {
                this.msgs.push({
                    severity: 'error', summary: 'Error', detail: res.error
                });
                return;
            }
            
            if (res.obLists) {
                res.obLists.forEach(obList => {
                    let requiredFields = [];
                    let type = obList.name;
                    let obID = obList.obID;
                    let conditions = [];
                    let progress = obList.progress;
                    let urgent = obList.urgent;
                    Object.keys(obList.requiredFields).forEach(key => {
                        let rField = obList.requiredFields[key];
                        let fieldName;
                        for (fieldName in rField);
                        requiredFields.push({
                            'fieldName': fieldName,
                            'fieldValue': rField[fieldName]
                        });
                    });

                    obList.conditions.forEach(condition => {
                        conditions.push({
                            'conditionName': condition.conditionName,
                            'conditionValue': condition.conditionOption
                        });
                    });

                    this.obProcesses.push({
                        'obID': obID,
                        'type': type,
                        'requiredFields': requiredFields,
                        'conditions': conditions,
                        'progress': progress,
                        'urgent': urgent
                    });
                });
            }
            this.loading = false;
        });
    }

    editOnboardProcess(index: number) {
        let selectedOnboardID = this.obProcesses[index].obID;
        this.router.navigate(['/rm/onboard/edit', selectedOnboardID], {
            queryParams: {
                name: this.obProcesses[index].type
            }
        });
    }
}
