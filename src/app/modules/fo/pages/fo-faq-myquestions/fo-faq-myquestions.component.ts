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
    processing = false;
    loadingEditArea = false;
    showAnsEditArea = false;
    showQnsEditArea = false;
    selectedFAQ: string;
    activeTab: number;
    msgs: Message[] = [];
    answeredDialog = false;
    historyDialog = false;
    unansweredDialog = false;
    currentIndex: number;
    disableLoadMore = false;
    LoadMoreClicks: number;
    searched = false;
    disable: boolean;

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
        this.route.queryParams.subscribe(params => {
            this.activeTab = params['activeTab'];
        });

        if (!this.activeTab) {
            this.activeTab = 0;
        }

        this.questionForm = this.fb.group({
            question: new FormControl('', Validators.required)
        });

        this.retrieveFAQ();
    }

    retrieveFAQ() {
        this.faqs = [];

        this.foService.retrieveUserFAQ().subscribe(res => {
            if (res.error) {
                this.msgs.push({
                    severity: 'error', summary: 'Error', detail: res.error
                });
                this.loading = false;
                return;
            }

            if (res.results && this.activeTab === 0) {
                this.faqs = res.results.answered;
            } else {
                this.faqs = res.results.unanswered;
            }

            this.checkLoadMore()
            this.loading = false;
        }, error => {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: error
            });

            this.loading = false;
        });
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

            this.checkLoadMore()
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

    stopShowingLoadMore() {
        this.LoadMoreClicks += 10
        if (this.faqs.length <= this.LoadMoreClicks) {
            this.disableLoadMore = true;
        }
    }

    checkLoadMore() {
        this.disableLoadMore = false;
        this.LoadMoreClicks = 10;

        if (this.faqs.length <= this.LoadMoreClicks) {
            this.disableLoadMore = true;
        }
    }
}
