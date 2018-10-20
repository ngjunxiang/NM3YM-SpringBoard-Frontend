import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import { Message } from 'primeng/components/common/api';

import { FOService } from '../../../../core/services/fo.service';

@Component({
    selector: 'fo-faq-myquestions',
    templateUrl: './fo-faq-myquestions.component.html',
    styleUrls: ['./fo-faq-myquestions.component.css']
})
export class FOFaqMyQuestionsComponent implements OnInit {

    // UI Control
    loading = false;
    msgs: Message[] = [];
    answerDialog = false;
    currentIndex: number;
    activeTab: number;

    // UI Components
    questionForm: FormGroup;
    faqs: any[];
    displayFAQs: any[];

    constructor(
        private foService: FOService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router

    ) { }

    ngOnInit() {
        this.loading = true;
        this.activeTab = 0;
        this.questionForm = this.fb.group({
            question: new FormControl('', Validators.required)
        });

        this.retrieveFAQ();
    }

    retrieveFAQ() {
        this.faqs = [];

        if (this.activeTab === 0) {
            //Retrieve answered question 
            this.foService.retrieveUserFAQ().subscribe(res => {
                if (res.error) {
                    this.msgs.push({
                        severity: 'error', summary: 'Error', detail: res.error
                    });
                    this.loading = false;
                    return;
                }

                if (res.results) {
                    this.faqs = res.results.answered;
                }

                this.loading = false;
            }, error => {
                this.msgs.push({
                    severity: 'error', summary: 'Error', detail: error
                });

                this.loading = false;
            });
        } else {
            //Retrieve unanswered question 
            this.foService.retrieveUserFAQ().subscribe(res => {
                if (res.error) {
                    this.msgs.push({
                        severity: 'error', summary: 'Error', detail: res.error
                    });
                    this.loading = false;
                    return;
                }

                if (res.results) {
                    this.faqs = res.results.unanswered;
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

    changeTab(event) {
        this.loading = true;
        this.faqs = [];
        this.activeTab = event.index
        this.retrieveFAQ()
    }

    searchFAQ() {
        this.questionForm.get('question').markAsDirty();

        if (this.questionForm.get('question').invalid) {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: 'Please ask a question'
            });
            return;
        }

        this.loading = true;

        this.faqs = [];

        this.foService.retrieveFaq(this.questionForm.get('question').value).subscribe(res => {
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



    showAnswerDialog(index) {
        this.currentIndex = index
        this.answerDialog = true;


        /*
         this.foService.increaseView().subscribe(res => {
            if (res.error) {
                this.msgs.push({
                    severity: 'error', summary: 'Error', detail: res.error
                });
                return;
            }

        }, error => {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: error
            });
        });
        */
    }
}
