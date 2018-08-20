import { Component, OnInit } from '@angular/core';

import { OnboardService } from '../../../../core/services/onboard.service';
import { Message } from 'primeng/components/common/api';

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
        private onboardService: OnboardService
    ) { }

    ngOnInit() {
        this.loading = true;
        this.retrieveAllOnboardProcesses();
    }

    toggleUrgent(index: number) {
        this.obProcesses[index].urgent = !this.obProcesses[index].urgent
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
                console.log(res.obLists)
                res.obLists.forEach(obList => {
                    let clientName;
                    let type = obList.name;
                    let bookingCentre;
                    let businessCentre;
                    let progress = obList.progress;
                    let urgent = obList.urgent;

                    Object.keys(obList.requiredFields).forEach(key => {
                        if (key === 'Client Name') {
                            clientName = obList.requiredFields[key];
                        }
                    });

                    obList.conditions.forEach(condition => {
                        if (condition.conditionName === 'Booking Centre') {
                            bookingCentre = condition.conditionOption;
                        }

                        if (condition.conditionName === 'Business Centre') {
                            businessCentre = condition.conditionOption;
                        }
                    });

                    this.obProcesses.push({
                        'clientName': clientName,
                        'type': type,
                        'bookingCentre': bookingCentre,
                        'businessCentre': businessCentre,
                        'progress': progress,
                        'urgent': urgent
                    });
                })
            }

            this.loading = false;
        })
    }

    click(index: number) {
        console.log(index)
    }
}
