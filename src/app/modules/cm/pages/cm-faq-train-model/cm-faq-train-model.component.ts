import { Component, OnInit } from '@angular/core';

import { Message } from 'primeng/components/common/api';
import { environment } from '../../../../../environments/environment';

import { CMService } from '../../../../core/services/cm.service';

@Component({
    selector: 'cm-faq-train-model',
    templateUrl: './cm-faq-train-model.component.html',
    styleUrls: ['./cm-faq-train-model.component.scss']
})
export class CMFAQTrainModelComponent implements OnInit {

    // UI Control
    loading = false;
    msgs: Message[] = [];

    // UI Component
    response: any;

    constructor(
        private cmService: CMService,
    ) { }

    ngOnInit() {
    }

    trainModel() {
        this.loading = true;
        this.cmService.trainModel().subscribe(res => {
            if (res.error) {
                this.msgs.push({
                    severity: 'error', summary: 'Error', detail: res.error
                });
                this.loading = false;
                return;
            }

            if (res.results) {
                // show results?
                this.msgs.push({
                    severity: 'success', summary: 'Completed', detail: "NLU model has been trained"
                });
            }

            this.loading = false;

        }, error => {
            this.msgs.push({
                severity: 'error', summary: 'Server Error', detail: error
            });
            this.loading = false;
        });
    }
}
