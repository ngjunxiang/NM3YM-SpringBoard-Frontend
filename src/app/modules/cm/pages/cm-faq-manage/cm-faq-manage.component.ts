import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Message, MenuItem, ConfirmationService, MessageService } from 'primeng/components/common/api';

import { CMService } from '../../../../core/services/cm.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { DomSanitizer } from '@angular/platform-browser';

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
    searched = false;
    disable: boolean;

    //UI Controls for PDF Reference
    pdfPages: any[] = [];
    includePDF: boolean;
    selectedPage: number;
    link: string;
    referenceAdded = false;

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

    // Paginator Controls
    numFAQs: number;
    firstIndex: number;
    lastIndex: number;
    pageNumber: number;

    constructor(
        private cmService: CMService,
        private confirmationService: ConfirmationService,
        private sanitizer: DomSanitizer,
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

        //initialize PDF pages
        for (let i = 0; i < 72; i++) {
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

        if (this.activeTab === 0) {
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
                console.log(res)
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
                            intent: faq.intent
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
        this.loading = true;
        this.faqs = [];
        this.includePDF = false;
        this.referenceAdded = false;
        this.link = "";
        this.firstIndex = 0;
        this.lastIndex = 10;

        if (event.index === 0) {
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
        }

        if (event.index === 1) {
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
                            intent: faq.intent
                        });
                    }
                    this.numFAQs = this.faqs.length
                }
                this.loading = false;
            }, error => {
                this.messageService.add({ 
                    key: 'msgs', severity: 'error', summary: 'Server Error', detail: error
                });
                this.loading = false;
            });
        }

        this.activeTab = event.index;
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
                        intent: faq.intent
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
                        intent: faq.intent
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

        this.loadingEditArea = false;
        this.showAnsEditArea = true;
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

        this.loadingEditArea = false;
        this.showAnsEditArea = true;
    }

    hideAnsEditArea() {
        if (this.answerForm) {
            this.answerForm.get('addedAnswer').setValue('');
            this.answerForm.get('editedAnswer').setValue('');
        }

        this.showAnsEditArea = false;
        this.historyDialog = false;
        this.includePDF = false;
        this.referenceAdded = false;
        this.link = "";
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
                }, error => {
                    this.messageService.add({ 
                        key: 'msgs', severity: 'error', summary: 'Error', detail: error
                    });
                    this.processing = false;
                    this.answeredDialog = false;
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

        if (this.answerForm.controls.editedAnswer.invalid) {
            this.messageService.add({ 
                key: 'msgs', severity: 'error', summary: 'Error', detail: 'Please fill in the answer field'
            });
            return;
        }

        this.cmService.updateAnsweredFAQ(this.faqs[index].qnID, this.faqs[index].question, this.includePDF, this.answerForm.get('editedAnswer').value.replace(/&nbsp;/g, ' ').trim()).subscribe(res => {
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
                this.includePDF = false;
                this.referenceAdded = false;
                this.link = "";
            }

            this.hideAnsEditArea();
            this.processing = false;
        }, error => {
            this.messageService.add({ 
                key: 'msgs', severity: 'error', summary: 'Error', detail: error
            });
            this.processing = false;
            this.hideAnsEditArea();
        });
    }

    saveUnansweredQuestion(index: number) {
        this.answerForm.controls.addedAnswer.markAsDirty();
        this.unansweredDialog = false;

        if (this.answerForm.controls.addedAnswer.invalid) {
            this.messageService.add({ 
                key: 'msgs', severity: 'error', summary: 'Error', detail: 'Please fill in the answer field'
            });
            return;
        }

        this.cmService.updateUnansweredFAQ(this.faqs[index].qnID, this.faqs[index].question, this.includePDF, this.answerForm.get('addedAnswer').value.replace(/&nbsp;/g, ' ').trim(), this.faqs[index].username).subscribe(res => {
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
                this.referenceAdded = false;
                this.link = "";
            }

            this.hideAnsEditArea();
            this.unansweredDialog = false;
            this.processing = false;

        }, error => {
            this.messageService.add({ 
                key: 'msgs', severity: 'error', summary: 'Error', detail: error
            });
            this.processing = false;
            this.unansweredDialog = false;
            this.hideAnsEditArea();
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

    editPDFReference() {
        if (this.referenceAdded) {
            //replace link
            let newLink = "<div><u><a href='assets/pdf/reg51.pdf#page=" + this.selectedPage + "' target='_blank'>Refer to page " + this.selectedPage + " of Reg51</a></u><div>"
            let answer = this.answerForm.get('editedAnswer').value.replace(this.link, newLink);
            if (answer == this.answerForm.get('editedAnswer').value) {
                answer = this.answerForm.get('editedAnswer').value + newLink
                this.answerForm.get('editedAnswer').setValue(answer);
                this.link = newLink;
            } else {
                this.link = newLink;
                this.answerForm.get('editedAnswer').setValue(answer);
            }
        }

        if (this.includePDF && !this.referenceAdded) {
            this.link = "<div><u><a href='assets/pdf/reg51.pdf#page=" + this.selectedPage + "' target='_blank'>Refer to page " + this.selectedPage + " of Reg51</a></u><div>"
            let answer = this.answerForm.get('editedAnswer').value + this.link
            this.answerForm.get('editedAnswer').setValue(answer);
            this.referenceAdded = true;
        }
    }

    addPDFReference() {
        if (this.referenceAdded) {
            //replace link
            let newLink = "<div><u><a href='assets/pdf/reg51.pdf#page=" + this.selectedPage + "' target='_blank'>Refer to page " + this.selectedPage + " of Reg51</a></u><div>"
            let answer = this.answerForm.get('addedAnswer').value.replace(this.link, newLink);
            if (answer == this.answerForm.get('addedAnswer').value) {
                answer = this.answerForm.get('addedAnswer').value + newLink
                this.answerForm.get('addedAnswer').setValue(answer);
                this.link = newLink;
            } else {
                this.link = newLink;
                this.answerForm.get('addedAnswer').setValue(answer);
            }
        }

        if (this.includePDF && !this.referenceAdded) {
            this.link = "<div><u><a href='assets/pdf/reg51.pdf#page=" + this.selectedPage + "' target='_blank'>Refer to page " + this.selectedPage + " of Reg51</a></u><div>"
            let answer = this.answerForm.get('addedAnswer').value + this.link
            this.answerForm.get('addedAnswer').setValue(answer);
            this.referenceAdded = true;
        }
    }

    showAnsweredDialog(index) {
        this.currentIndex = index;
        this.answeredDialog = true;
        this.faqs[index].answer = this.sanitizer.bypassSecurityTrustHtml(this.faqs[index].answer);
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
}
