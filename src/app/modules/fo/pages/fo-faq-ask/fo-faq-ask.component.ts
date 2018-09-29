import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Message } from 'primeng/components/common/api';

import { FOService } from '../../../../core/services/fo.service';

@Component({
    selector: 'fo-faq-ask',
    templateUrl: './fo-faq-ask.component.html',
    styleUrls: ['./fo-faq-ask.component.css']
})
export class FOFaqAskComponent implements OnInit {

    // UI Control
    loading = false;
    searched = false;
    showNewQnForm = false;
    msgs: Message[] = [];

    // UI Components
    questionForm: FormGroup;
    newQuestionForm: FormGroup;
    faqs: any[];

    constructor(
        private foService: FOService,
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

        this.faqs = [];

        this.foService.retrieveRMFaq(this.questionForm.get('question').value).subscribe(res => {
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

            this.searched = true;
            this.loading = false;
        }, error => {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: error
            });

            this.searched = true;
            this.loading = false;
        });
    }

    showNewFAQForm() {
        this.newQuestionForm = this.fb.group({
            newQuestion: new FormControl('')
        });

        this.showNewQnForm = true;
    }

    postNewQuestion() {
        let newQuestion = this.newQuestionForm.get('newQuestion').value;
        if (newQuestion !== '') {
            this.loading = true;
            this.foService.addUnansweredQuestion(newQuestion).subscribe(res => {
                if (res.error) {
                    this.msgs.push({
                        severity: 'error', summary: 'Error', detail: res.error
                    });
                    this.loading = false;
                    return;
                }

                if (res.results) {
                    this.msgs.push({
                        severity: 'success', summary: 'Success', detail: 'Your question has been posted'
                    });
                }
                this.loading = false;
            }, error => {
                this.msgs.push({
                    severity: 'error', summary: 'Error', detail: error
                });

                this.loading = false;
            });
            return;
        }

        this.msgs.push({
            severity: 'info', summary: 'Please fill in the question field', detail: ''
        });
    }
}
