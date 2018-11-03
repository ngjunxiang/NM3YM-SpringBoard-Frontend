import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import { MessageService } from 'primeng/components/common/api';

import { FOService } from '../../../../core/services/fo.service';

@Component({
    selector: 'fo-faq-viewall',
    templateUrl: './fo-faq-viewall.component.html',
    styleUrls: ['./fo-faq-viewall.component.css']
})
export class FOFaqViewAllComponent implements OnInit {

    // UI Control
    loading = false;
    searched = false; //show "Result", hide buttons 
    showNewQnForm = false;
    answerDialog = false;
    askDialog = false;
    confirmDialog = false;
    currentIndex: number;

    // UI Components
    currentSearch: string;
    categoryOptions: any[];
    sortByOptions: any[];
    selectedCategory: string = '';
    selectedSortBy: string = '';
    questionForm: FormGroup;
    newQuestionForm: FormGroup;
    faqs: any[];

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
        this.questionForm = this.fb.group({
            question: new FormControl('', Validators.required)
        });

        this.newQuestionForm = this.fb.group({
            newQuestion: new FormControl('', Validators.required),
        });

        //Initializing Categories and Options 
        this.retrieveIntents();
        this.sortByOptions = [
            { value: "date", label: "Date" },
            { value: "views", label: "Views" },
        ]

        this.loadPage();
    }

    loadPage() {
        this.loading = true;
        this.faqs = [];
        this.selectedCategory = '';
        this.selectedSortBy = '';
        this.firstIndex = 0;
        this.lastIndex = 10;

        this.foService.retrieveAllFaq().subscribe(res => {
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

            this.numFAQs = this.faqs.length;

            this.loading = false;
        }, error => {
            this.messageService.add({ 
                key: 'msgs', severity: 'error', summary: 'Error', detail: error
            });

            this.loading = false;
        });
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

        this.currentSearch = this.questionForm.get('question').value;

        this.foService.retrieveFaq(this.currentSearch).subscribe(res => {
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

            this.numFAQs = this.faqs.length;

            this.loading = false;
            this.searched = true;
        }, error => {
            this.messageService.add({ 
                key: 'msgs', severity: 'error', summary: 'Error', detail: error
            });

            this.loading = false;
            this.searched = true;
        });
    }

    exitResult() {
        this.searched = false;
        this.loadPage();
    }

    retrieveIntents() {
        this.foService.retrieveIntents().subscribe(res => {
            if (res.error) {
                this.messageService.add({ 
                    key: 'msgs', severity: 'error', summary: 'Error', detail: res.error
                });
                return;
            }

            if (res.results) {
                this.categoryOptions = [];
                res.results.forEach(intent => {
                    this.categoryOptions.push({
                        label: intent, value: intent
                    });
                });
            }
        }, error => {
            this.messageService.add({ 
                key: 'msgs', severity: 'error', summary: 'Server Error', detail: error
            });
            this.loading = false;
        });
    }

    filterAndSortBy() {
        this.loading = true;
        this.faqs = [];

        this.foService.retrieveFAQByCategoryAndSort(this.selectedCategory, this.selectedSortBy).subscribe(res => {
            if (res.error) {
                this.messageService.add({ 
                    key: 'msgs', severity: 'error', summary: 'Error', detail: res.error
                });
                return;
            }

            if (res.results) {
                for (let i = 0; i < res.results.length; i++) {
                    let faq = res.results[i];

                    this.faqs.push({
                        qnID: faq.qnID,
                        username: faq.username,
                        question: faq.question,
                        dateAsked: faq.dateAsked,
                        views: faq.views,
                        answer: faq.answer,
                        dateAnswered: faq.dateAnswered,
                        CMusername: faq.CMusername,
                        prevAnswer: faq.prevAnswer,
                    });
                }

                this.numFAQs = this.faqs.length;
                this.loading = false;
            }
        }, error => {
            this.messageService.add({ 
                key: 'msgs', severity: 'error', summary: 'Server Error', detail: error
            });
            this.loading = false;
        });
    }

    categoriseBy() {
        this.loading = true;
        this.faqs = [];

        this.foService.retrieveFAQByIntent(this.selectedCategory).subscribe(res => {
            if (res.error) {
                this.messageService.add({ 
                    key: 'msgs', severity: 'error', summary: 'Error', detail: res.error
                });
                return;
            }

            if (res.results) {
                for (let i = 0; i < res.results.length; i++) {
                    let faq = res.results[i];
                    this.faqs.push({
                        qnID: faq.qnID,
                        username: faq.username,
                        question: faq.question,
                        dateAsked: faq.dateAsked,
                        views: faq.views,
                        answer: faq.answer,
                        dateAnswered: faq.dateAnswered,
                        CMusername: faq.CMusername,
                        prevAnswer: faq.prevAnswer,
                    });
                }
                this.numFAQs = this.faqs.length;
                this.loading = false;
            }
        }, error => {
            this.messageService.add({ 
                key: 'msgs', severity: 'error', summary: 'Server Error', detail: error
            });
            this.loading = false;
        });
    }


    showConfirmDialog() {
        this.confirmDialog = true;
    }

    hideConfirmDialog() {
        this.confirmDialog = false;
    }

    showAskDialog() {
        this.askDialog = true;

        if (this.questionForm.get('question').value && this.searched) {
            this.newQuestionForm.get("newQuestion").setValue(this.questionForm.get('question').value)
        }

        this.hideConfirmDialog();
    }

    hideAskDialog() {
        this.askDialog = false;

        if (this.newQuestionForm.get('newQuestion')) {
            this.newQuestionForm.get("newQuestion").setValue('')
        }
    }

    postNewQuestion() {
        let newQuestion = this.newQuestionForm.get('newQuestion').value;
        if (newQuestion !== '') {
            this.loading = true;
            this.foService.createUnansweredQuestion(newQuestion).subscribe(res => {
                if (res.error) {
                    this.messageService.add({ 
                        key: 'msgs', severity: 'error', summary: 'Error', detail: res.error
                    });
                    this.loading = false;
                    this.hideAskDialog()
                    return;
                }

                if (res.results) {
                    setTimeout(() => {
                        this.router.navigate(['fo/faq/myquestions'], {
                            queryParams: {
                                activeTab: 1
                            }
                        });
                    }, 1500);
                    this.messageService.add({ 
                        key: 'msgs', severity: 'success', summary: 'Success', detail: 'Your question has been posted. You will be redirected shortly.'
                    });
                }
                this.loading = false;
            }, error => {
                this.messageService.add({ 
                    key: 'msgs', severity: 'error', summary: 'Error', detail: error
                });

                this.loading = false;
            });
            this.hideAskDialog()
            return;
        }
        this.messageService.add({ 
            key: 'msgs', severity: 'error', summary: 'Error', detail: 'Please fill in the question field'
        });
    }

    showAnswerDialog(index) {
        this.currentIndex = index;
        this.answerDialog = true;
        let qnID = this.faqs[index].qnID

        this.foService.increaseView(qnID).subscribe(res => {
            if (res.error) {
                this.messageService.add({ 
                    key: 'msgs', severity: 'error', summary: 'Error', detail: res.error
                });
                return;
            }

        }, error => {
            this.messageService.add({ 
                key: 'msgs', severity: 'error', summary: 'Error', detail: error
            });
        });
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
