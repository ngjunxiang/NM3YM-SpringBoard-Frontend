import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Message, MenuItem, ConfirmationService, MessageService } from 'primeng/components/common/api';

import { CMService } from '../../../../core/services/cm.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Dialog } from 'primeng/dialog';

@Component({
    selector: 'cm-faq-manage',
    templateUrl: './cm-faq-manage.component.html',
    styleUrls: ['./cm-faq-manage.component.css']
})
export class CMFaqManageComponent implements OnInit {

    // UI Control
    loading = false;
    processing = false;
    loadingEditArea = false;
    showAnsEditArea = false;
    showQnsEditArea = false;
    activeTab: number;
    answeredDialog = false;
    historyDialog = false;
    unansweredDialog = false;
    currentIndex: number;
    selectedSimilarFaq: number = -1;
    searched = false;
    disable: boolean;

    //UI Controls for PDF Reference
    pdfPages: any[] = [];
    includePDF: boolean;
    selectedPages: any[];

    // UI Components
    faqs: any[];
    currentSearch: string;
    categoryOptions: any[];
    sortByOptions: any[];
    selectedCategory: string = '';
    selectedSortBy: string = '';
    answerForm: FormGroup;
    questionForm: FormGroup;
    searchForm: FormGroup;
    similarFaqs: any[];
    similarQn: any;

    // Paginator Controls
    numFAQs: number;
    firstIndex: number;
    lastIndex: number;
    pageNumber: number;

    constructor(
        private cmService: CMService,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder,
        private messageService: MessageService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        //rerouted from create faq page
        this.route.queryParams.subscribe(params => {
            this.activeTab = params['activeTab'];
        });


        if (!this.activeTab) {
            this.activeTab = 0;
        }

        this.loadPage();

        //Inititalizing Search Form
        this.searchForm = this.fb.group({
            question: new FormControl('', Validators.required),
        });

        //Initializing Categories and Options 
        this.retrieveIntents();
        this.sortByOptions = [
            { value: "date", label: "Date" },
            { value: "views", label: "Views" },
        ]

        //Showing First 10 in the page 
        this.firstIndex = 0;
        this.lastIndex = 10;

        this.selectedPages = [];

        //initialize PDF pages
        for (let i = 1; i < 72; i++) {
            this.pdfPages.push({
                label: i,
                value: i
            });
        }
    }

    showDialogMaximized(event, dialog: Dialog) {
        dialog.maximized = false;
        dialog.toggleMaximize(event);
    }

    loadPage() {
        this.loading = true;
        this.faqs = [];
        this.selectedCategory = '';
        this.selectedSortBy = '';

        if (this.activeTab == 0) {
            this.disable = true;
            this.cmService.retrieveUnansweredFAQ().subscribe(res => {
                if (res.error) {
                    this.messageService.add({
                        key: 'msgs', severity: 'error', summary: 'Error', detail: res.error
                    });
                    this.loading = false;
                    return;
                }

                if (res.results) {
                    res.results.forEach(faq => {
                        this.faqs.push({
                            username: faq.username,
                            qnID: faq.qnID,
                            question: faq.question,
                            dateAsked: faq.dateAsked,
                        });
                    });
                }

                this.numFAQs = this.faqs.length
                this.loading = false;
            }, error => {
                this.messageService.add({
                    key: 'msgs', severity: 'error', summary: 'Server Error', detail: error
                });
                this.loading = false;
            });

        } else {
            this.disable = false;
            this.cmService.retrieveAnsweredFAQ().subscribe(res => {

                if (res.error) {
                    this.messageService.add({
                        key: 'msgs', severity: 'error', summary: 'Error', detail: res.error
                    });
                    this.loading = false;
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
                            intent: faq.intent,
                            refPages: faq.refPages,
                            qnIDRef: faq.qnIDRef
                        });
                    }
                }

                this.numFAQs = this.faqs.length
                this.loading = false;
            }, error => {
                this.messageService.add({
                    key: 'msgs', severity: 'error', summary: 'Server Error', detail: error
                });
                this.loading = false;
            });
        }
    }

    changeTab(event) {
        this.activeTab = event.index;
        this.loadPage();
        this.includePDF = false;
        this.firstIndex = 0;
        this.lastIndex = 10;
    }

    searchFAQ() {
        this.searchForm.get('question').markAsDirty();

        if (this.searchForm.get('question').invalid) {
            this.messageService.add({
                key: 'msgs', severity: 'error', summary: 'Error', detail: 'Please ask a question'
            });
            return;
        }

        this.loading = true;

        this.currentSearch = this.searchForm.get('question').value;
        this.faqs = [];

        this.cmService.retrieveFaq(this.currentSearch).subscribe(res => {
            if (res.error) {
                this.messageService.add({
                    key: 'msgs', severity: 'error', summary: 'Error', detail: res.error
                });
                this.loading = false;
                return;
            }

            if (res.results) {
                this.searched = true;
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
                        intent: faq.intent,
                        refPages: faq.refPages,
                        qnIDRef: faq.qnIDRef
                    });
                }
            }

            this.loading = false;
        }, error => {
            this.messageService.add({
                key: 'msgs', severity: 'error', summary: 'Error', detail: error
            });

            this.loading = false;
        });
    }

    retrieveIntents() {
        this.cmService.retrieveIntents().subscribe(res => {
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

        this.cmService.retrieveFAQByCategoryAndSort(this.selectedCategory, this.selectedSortBy).subscribe(res => {
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
                        intent: faq.intent,
                        qnIDRef: faq.qnIDRef
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

    exitResult() {
        this.searched = false;
        this.loadPage();
    }

    showEditAnswerArea(index) {
        if (this.showAnsEditArea) {
            return;
        }
        this.loadingEditArea = true;

        this.answerForm = this.fb.group({
            addedAnswer: new FormControl('', Validators.required),
            editedAnswer: new FormControl('', Validators.required)
        });

        this.answerForm.get('editedAnswer').setValue(this.faqs[index].answer);

        this.cmService.retrieveSimilarFaq(this.faqs[this.currentIndex].question, 4).subscribe(res => {
            if (res.error) {
                this.messageService.add({
                    key: 'msgs', severity: 'error', summary: 'Error', detail: res.error
                });
                return;
            }

            if (res.results) {
                this.similarFaqs = [];

                let i = 0;
                res.results.forEach(similarFaq => {
                    if (similarFaq.qnID !== this.faqs[this.currentIndex].qnID && !similarFaq.qnIDRef) {
                        this.similarFaqs.push(similarFaq);
                    } else {
                        i--;
                    }
                    if (this.similarQn && similarFaq.qnID === this.similarQn.qnID) {
                        this.selectedSimilarFaq = i;
                    }
                    i++;
                });

                if (this.similarFaqs.length === 0) {
                    this.similarFaqs = null;
                }

                this.loadingEditArea = false;
                this.showAnsEditArea = true;
            }
        }, error => {
            this.messageService.add({
                key: 'msgs', severity: 'error', summary: 'Error', detail: error
            });
        });
    }

    showEditQuestionArea() {
        this.showQnsEditArea = true;
        this.questionForm = this.fb.group({
            refinedQns: new FormControl('', Validators.required),
        });

        this.questionForm.get("refinedQns").setValue(this.faqs[this.currentIndex].question);
    }

    refineQuestion() {
        this.questionForm.controls.refinedQns.markAsDirty();

        if (this.questionForm.controls.refinedQns.invalid) {
            this.messageService.add({
                key: 'msgs', severity: 'error', summary: 'Error', detail: 'Please fill in the question field'
            });
            return;
        }

        this.faqs[this.currentIndex].question = this.questionForm.get('refinedQns').value;

        this.hideEditQuestionArea();
    }

    hideEditQuestionArea() {
        if (this.questionForm) {
            this.questionForm.get('refinedQns').setValue('');
        }
        this.showQnsEditArea = false;
        //end point to change question. 
    }

    showAddAnswerArea() {
        if (this.showAnsEditArea) {
            return;
        }

        this.loadingEditArea = true;

        this.answerForm = this.fb.group({
            addedAnswer: new FormControl('', Validators.required),
            editedAnswer: new FormControl('', Validators.required)
        });

        this.cmService.retrieveSimilarFaq(this.faqs[this.currentIndex].question, 3).subscribe(res => {
            if (res.error) {
                this.messageService.add({
                    key: 'msgs', severity: 'error', summary: 'Error', detail: res.error
                });
                return;
            }

            if (res.results) {
                this.similarFaqs = [];
                console.log(res.results)
                res.results.forEach(similarFaq => {
                    if (similarFaq.qnID !== this.faqs[this.currentIndex].qnID && !similarFaq.qnIDRef) {
                        this.similarFaqs.push(similarFaq);
                    }
                });

                this.loadingEditArea = false;
                this.showAnsEditArea = true;
            }
        }, error => {
            this.messageService.add({
                key: 'msgs', severity: 'error', summary: 'Error', detail: error
            });
        });
    }

    hideAnswerDialog() {
        this.includePDF = false;
        this.selectedPages = [];
        this.hideAnsEditArea();
    }


    hideAnsEditArea() {
        this.selectedSimilarFaq = -1;
        this.similarFaqs = null;
        if (this.answerForm) {
            this.answerForm.get('addedAnswer').setValue('');
            this.answerForm.get('editedAnswer').setValue('');
        }
        this.showAnsEditArea = false;
        this.hideEditQuestionArea();
        this.historyDialog = false;
    }

    deleteAnsweredQuestion(index: number) {
        this.confirmationService.confirm({
            message: 'Do you want to delete this question?',
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.processing = true;
                this.cmService.deleteAnsweredFAQ(this.faqs[index].qnID, this.faqs[index].question).subscribe(res => {
                    if (res.error) {
                        this.messageService.add({
                            key: 'msgs', severity: 'error', summary: 'Error', detail: res.error
                        });
                        return;
                    }

                    if (res.results) {
                        this.loadPage();
                        this.faqs.map(faq => {
                            faq.selected = false;
                        });
                        this.messageService.add({
                            key: 'msgs', severity: 'success', summary: 'Success', detail: 'Question deleted'
                        });
                    }

                    this.processing = false;
                    this.answeredDialog = false;
                    this.selectedSimilarFaq = -1;
                    this.similarFaqs = null;
                    this.similarQn = null;
                }, error => {
                    this.messageService.add({
                        key: 'msgs', severity: 'error', summary: 'Error', detail: error
                    });
                    this.processing = false;
                    this.answeredDialog = false;
                    this.selectedSimilarFaq = -1;
                    this.similarFaqs = null;
                    this.similarQn = null;
                });
            },
            reject: () => {
                return;
            }
        });
    }

    deleteUnansweredQuestion(index: number) {
        this.confirmationService.confirm({
            message: 'Do you want to delete this question?',
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.processing = true;
                this.cmService.deleteUnansweredFAQ(this.faqs[index].qnID, this.faqs[index].question).subscribe(res => {
                    if (res.error) {
                        this.messageService.add({
                            key: 'msgs', severity: 'error', summary: 'Error', detail: res.error
                        });
                        return;
                    }

                    if (res.results) {
                        this.loadPage();
                        this.messageService.add({
                            key: 'msgs', severity: 'success', summary: 'Success', detail: 'Question deleted'
                        });
                    }

                    this.processing = false;
                    this.unansweredDialog = false;
                }, error => {
                    this.messageService.add({
                        key: 'msgs', severity: 'error', summary: 'Error', detail: error
                    });
                    this.processing = false;
                    this.unansweredDialog = false;
                });
            },
            reject: () => {
                return;
            }
        });
    }

    saveAnsweredQuestion(index: number) {
        this.answerForm.controls.editedAnswer.markAsDirty();

        if (this.selectedSimilarFaq === -1 && this.answerForm.controls.editedAnswer.invalid) {
            this.messageService.add({
                key: 'msgs', severity: 'error', summary: 'Error', detail: 'Please fill in the answer field'
            });
            return;
        }

        let updatedFaq = {
            'qnID': this.faqs[index].qnID,
            'question': this.faqs[index].question,
            'answer': this.answerForm.get('editedAnswer').value.replace(/&nbsp;/g, ' ').trim(),
            'PDFPages': this.selectedPages,
            'qnIDRef': null
        };

        if (this.selectedSimilarFaq !== -1) {
            updatedFaq['qnIDRef'] = this.similarFaqs[this.selectedSimilarFaq].qnID
            updatedFaq['answer'] = '';
        }

        this.cmService.updateAnsweredFAQ(updatedFaq).subscribe(res => {
            this.processing = true;
            if (res.error) {
                this.messageService.add({
                    key: 'msgs', severity: 'error', summary: 'Error', detail: res.error
                });
                return;
            }

            if (res.results) {
                this.loadPage();
                this.messageService.add({
                    key: 'msgs', severity: 'success', summary: 'Success', detail: 'Answer updated'
                });
            }

            this.hideAnsEditArea();
            this.loadPage();

            if (updatedFaq.qnIDRef) {
                this.loadSimilarFaq(updatedFaq.qnIDRef);
            }

            this.processing = false;
        }, error => {
            this.messageService.add({
                key: 'msgs', severity: 'error', summary: 'Error', detail: error
            });
            this.processing = false;
        });
    }

    saveUnansweredQuestion(index: number) {
        this.answerForm.controls.addedAnswer.markAsDirty();

        if (this.selectedSimilarFaq === -1 && this.answerForm.controls.addedAnswer.invalid) {
            this.messageService.add({
                key: 'msgs', severity: 'error', summary: 'Error', detail: 'Please fill in the answer field'
            });
            return;
        }

        let updatedFaq = {
            'qnID': this.faqs[index].qnID,
            'question': this.faqs[index].question,
            'answer': this.answerForm.get('addedAnswer').value.replace(/&nbsp;/g, ' ').trim(),
            'PDFPages': this.selectedPages,
            'username': this.faqs[index].username,
            'qnIDRef': null
        };

        if (this.selectedSimilarFaq !== -1) {
            updatedFaq['qnIDRef'] = this.similarFaqs[this.selectedSimilarFaq].qnID
        }

        this.cmService.updateUnansweredFAQ(updatedFaq).subscribe(res => {
            this.processing = true;

            if (res.error) {
                this.messageService.add({
                    key: 'msgs', severity: 'error', summary: 'Error', detail: res.error
                });
                return;
            }

            if (res.results) {
                this.loadPage();
                this.messageService.add({
                    key: 'msgs', severity: 'success', summary: 'Success', detail: 'Question has been answered'
                });
                this.includePDF = false;
                this.selectedPages = [];
            }

            this.hideAnsEditArea();
            this.selectedSimilarFaq = -1;
            this.unansweredDialog = false;
            this.processing = false;

        }, error => {
            this.messageService.add({
                key: 'msgs', severity: 'error', summary: 'Error', detail: error
            });
            this.processing = false;
            this.selectedSimilarFaq = -1;
            this.unansweredDialog = false;
        });
    }

    openPDF(page) {
        this.cmService.retrievePdf().subscribe((res: any) => {
            let blob = new Blob([res], { type: 'application/pdf' });
            let url = window.URL.createObjectURL(blob);
            let pwa = window.open(url + "#page=" + page);
            if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
                alert('Please disable your pop-up blocker and try again.');
            }
        });
    }

    showAnsweredDialog(index) {
        if (this.faqs[index].refPages && this.faqs[index].refPages.length > 0) {
            this.includePDF = true;
            this.selectedPages = this.faqs[index].refPages;
        } else {
            this.includePDF = false;
            this.selectedPages = [];
        }
        this.currentIndex = index;
        console.log(this.faqs[this.currentIndex])
        if (this.faqs[this.currentIndex].qnIDRef) {
            this.loadSimilarFaq(this.faqs[this.currentIndex].qnIDRef);
        }

        this.answeredDialog = true;
    }

    showHistoryDialog() {
        this.historyDialog = true;
    }

    showUnansweredDialog(index) {
        this.currentIndex = index;
        this.unansweredDialog = true;
    }

    paginate(event) {
        //First index of the FormArray that will appear on the page  
        this.firstIndex = event.first;

        //Last index of the FormArray that will appears on the page  
        this.lastIndex = this.firstIndex + 10;
        let el = document.getElementById("scrollHere")
        el.scrollIntoView();
    }

    selectSimilarFaq(index: number) {
        this.selectedSimilarFaq = index;
        this.showAnsEditArea = false;
    }

    deselectSimilarFaq() {
        this.showAnsEditArea = true;
        this.selectedSimilarFaq = -1;
    }

    loadSimilarFaq(qnID) {
        this.cmService.retrieveSelectedAnsweredFAQ(qnID).subscribe(res => {
            if (res.error) {
                this.messageService.add({
                    key: 'msgs', severity: 'error', summary: 'Error', detail: res.error
                });
                return;
            }

            if (res.results) {
                this.similarQn = res.results;
            }
        }, error => {
            this.messageService.add({
                key: 'msgs', severity: 'error', summary: 'Error', detail: error
            });
        });
    }
}
