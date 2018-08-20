import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Message } from 'primeng/components/common/api';

import { OnboardService } from '../../../../core/services/onboard.service';

@Component({
    selector: 'rm-edit-onboard',
    templateUrl: './rm-edit-onboard.component.html',
    styleUrls: ['./rm-edit-onboard.component.css']
})
export class RMEditOnboardComponent implements OnInit {

    // UI Control
    loading = false;
    msgs: Message[] = [];

    // UI Component
    obName: string;

    constructor(
        private fb: FormBuilder,
        private onboardService: OnboardService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.obName = params['name'];
        });

        this.route.snapshot.data['urls'] = [
            { title: 'Checklists' },
            { title: 'Edit', url: '/cm/checklist/manage' },
            { title: this.obName }
        ];

        this.loading = true;

        this.createForm();

        this.retrieveOnboardDetails(this.route.snapshot.paramMap.get('id'));
    }

    createForm() {

    }

    retrieveOnboardDetails(obID) {
        
    }
}
