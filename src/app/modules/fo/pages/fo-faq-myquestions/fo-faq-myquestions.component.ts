import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import { MessageService } from 'primeng/components/common/api';

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
    activeTab: number;
    answerDialog = false;
    currentIndex: number;

    // UI Components
    questionForm: FormGroup;
    faqs: any[];
    displayFAQs: any[];

    // Paginator Controls
    numFAQs: number;
    firstIndex: number;
    lastIndex: number;
    pageNumber: number;

    constructor(
        private foService: FOService,
        private fb: FormBuilder,
        private messageService: MessageService,
        private route: ActivatedRoute,
        private router: Router

    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.activeTab = params['activeTab'];
        });

        if (!this.activeTab) {
            this.activeTab = 0;
        }

        this.questionForm = this.fb.group({
            question: new FormControl('', Validators.required)
        });

        this.loadPage();
    }

    loadPage() {
        this.faqs = [];
        this.firstIndex = 0;
        this.lastIndex = 10;

        this.foService.retrieveUserFAQ().subscribe(res => {
            if (res.error) {
                this.messageService.add({ 
                    key: 'msgs', severity: 'error', summary: 'Error', detail: res.error
                });
                this.loading = false;
                return;
            }

            if (res.results && this.activeTab === 0) {
                this.faqs = res.results.answered;
            } else {
                this.faqs = res.results.unanswered;
            }

            this.numFAQs = this.faqs.length;
            this.loading = false;
        }, error => {
            this.messageService.add({ 
                key: 'msgs', severity: 'error', summary: 'Error', detail: error
            });

            this.loading = false;
        });
    }

    changeTab(event) {
        this.loading = true;
        this.faqs = [];
        this.activeTab = event.index
        this.loadPage()
    }

    searchFAQ() {
        this.questionForm.get('question').markAsDirty();

        if (this.questionForm.get('question').invalid) {
            this.messageService.add({ 
                key: 'msgs', severity: 'error', summary: 'Error', detail: 'Please ask a question'
            });
            return;
        }

        this.loading = true;

        this.faqs = [];

        this.foService.retrieveFaq(this.questionForm.get('question').value).subscribe(res => {
            if (res.error) {
                this.messageService.add({ 
                    key: 'msgs', severity: 'error', summary: 'Error', detail: res.error
                });
                this.loading = false;
                return;
            }

            if (res.results) {
                this.faqs = res.results;
            }

            this.loading = false;
        }, error => {
            this.messageService.add({ 
                key: 'msgs', severity: 'error', summary: 'Error', detail: error
            });

            this.loading = false;
        });
    }

    showAnswerDialog(index) {
        this.currentIndex = index
        this.answerDialog = true;
    }

    paginate(event) {
        //First index of the FormArray that will appear on the page  
        this.firstIndex = event.first;

        //Last index of the FormArray that will appears on the page  
        this.lastIndex = this.firstIndex + 10;
        let el = document.getElementById("scrollHere")
        el.scrollIntoView();
    }
}
