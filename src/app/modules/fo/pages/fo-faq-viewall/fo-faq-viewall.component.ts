import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Message } from 'primeng/components/common/api';

import { FOService } from '../../../../core/services/fo.service';

@Component({
    selector: 'fo-faq-viewall',
    templateUrl: './fo-faq-viewall.component.html',
    styleUrls: ['./fo-faq-viewall.component.css']
})
export class FOFaqViewAllComponent implements OnInit {

    // UI Control
    loading = false;
    msgs: Message[] = [];

    // UI Components
    faqs: any[];

    constructor(
        private foService: FOService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.loading = true;

        this.retrieveFAQ();
    }

    retrieveFAQ() {
        this.faqs = [];

        this.foService.retrieveAllFaq().subscribe(res => {
            if (res.error) {
                this.msgs.push({
                    severity: 'error', summary: 'Error', detail: res.error
                });
                this.loading = false;
                return;
            }

            if (res.results) {
                this.faqs = res.results;
            }

            this.loading = false;
        }, error => {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: error
            });

            this.loading = false;
        });
    }
}
