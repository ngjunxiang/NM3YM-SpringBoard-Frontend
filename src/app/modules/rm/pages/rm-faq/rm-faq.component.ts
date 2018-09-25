import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Message } from 'primeng/components/common/api';

import { RMService } from '../../../../core/services/rm.service';

@Component({
    selector: 'rm-faq',
    templateUrl: './rm-faq.component.html',
    styleUrls: ['./rm-faq.component.css']
})
export class RMFaqComponent implements OnInit {

    // UI Control
    loading = false;
    searched = false;
    msgs: Message[] = [];

    // UI Components
    questionForm: FormGroup;
    faqs: any[];

    constructor(
        private rmService: RMService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.loading = true;

        this.questionForm = this.fb.group({
            question: new FormControl('', Validators.required)
        });

        this.loading = false;
    }

    retrieveFAQ() {
        this.questionForm.get('question').markAsDirty();

        if (this.questionForm.get('question').invalid) {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: 'Please ask a question'
            });
            return;
        }

        this.loading = true;

        this.rmService.retrieveRMFaq(this.questionForm.get('question').value).subscribe(res => {
            if (res.error) {
                this.msgs.push({
                    severity: 'error', summary: 'Error', detail: res.error
                });
            }

            if (res.results) {
                this.faqs = res.results;
            }

            this.loading = false;
        }, error => {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: error
            });
        });

        this.searched = true;
        this.loading = false;
    }
}