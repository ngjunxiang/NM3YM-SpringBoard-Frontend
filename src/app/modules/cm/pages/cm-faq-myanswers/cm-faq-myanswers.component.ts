import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ConfirmationService, MessageService } from 'primeng/components/common/api';

import { CMService } from '../../../../core/services/cm.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Dialog } from 'primeng/dialog';

@Component({
    selector: 'cm-faq-myanswers',
    templateUrl: './cm-faq-myanswers.component.html',
    styleUrls: ['./cm-faq-myanswers.component.css']
})

export class CMFaqMyAnswersComponent implements OnInit {

    // UI Control
    loading = false;
    processing = false;
    loadingEditArea = false;
    showAnsEditArea = false;
    showQnsEditArea = false;
    selectedFAQ: string;
    activeTab: number;
    answeredDialog = false;
    historyDialog = false;
    OHistoryDialog = false;
    OAnsweredDialog = false;
    currentIndex: number;

    //UI Controls for PDF Reference
    pdfPages: any[] = [];
    includePDF: boolean;
    selectedPages: any[];

    // UI Components
    faqs: any[];
    categoryOptions: any[];
    sortByOptions: any[];
    selectedCategory: string = '';
    selectedSortBy: string = '';
    answerForm: FormGroup;
    questionForm: FormGroup;

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
        this.route.queryParams.subscribe(params => {
            this.activeTab = params['activeTab'];
        });

        if (!this.activeTab) {
            this.activeTab = 0;
        }

        this.loadPage();

        //initialize PDF pages
        this.retrievePDFLength();
    }

    loadPage() {
        this.loading = true;
        this.faqs = [];
        this.firstIndex = 0;
        this.lastIndex = 10;

        //Retrieve answered question 
        this.cmService.retrieveCMFAQ().subscribe(res => {
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
                this.faqs = res.results.prevAnswered;
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
        this.activeTab = event.index;
        this.loadPage();
    }

    showDialogMaximized(event, dialog: Dialog) {
        dialog.maximized = false;
        dialog.toggleMaximize(event);
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

    hideAnswerDialog() {
        if (this.activeTab === 0) {
            this.answeredDialog = false;
        } else {
            this.OAnsweredDialog = false;
        }
        this.includePDF = false;
        this.selectedPages = [];
        this.hideAnsEditArea();
    }

    hideAnsEditArea() {
        if (this.answerForm) {
            this.answerForm.get('addedAnswer').setValue('');
            this.answerForm.get('editedAnswer').setValue('');
        }

        if (this.activeTab === 0) {
            this.historyDialog = false;
        } else {
            this.OHistoryDialog = false;
        }

        this.showAnsEditArea = false;
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

                    if (this.activeTab === 0) {
                        this.answeredDialog = false;
                    } else {
                        this.OAnsweredDialog = false;
                    }


                }, error => {
                    this.messageService.add({
                        key: 'msgs', severity: 'error', summary: 'Error', detail: error
                    });
                    this.processing = false;
                    if (this.activeTab === 0) {
                        this.answeredDialog = false;
                    } else {
                        this.OAnsweredDialog = false;
                    }
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

        let updatedFaq = {
            'qnID': this.faqs[index].qnID,
            'question': this.faqs[index].question,
            'answer': this.answerForm.get('editedAnswer').value.replace(/&nbsp;/g, ' ').trim(),
            'PDFPages': this.selectedPages,
            'qnIDRef': null
        };

        this.cmService.updateAnsweredFAQ(updatedFaq).subscribe(res => {
            this.processing = true;
            this.selectedFAQ = this.faqs[index].question;
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
            this.includePDF = false;
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


    showAnsweredDialog(index) {
        this.currentIndex = index;
        if (this.faqs[index].refPages.length > 0) {
            this.includePDF = true;
            this.selectedPages = this.faqs[index].refPages;
        } else {
            this.includePDF = false;
            this.selectedPages = [];
        }

        if (this.activeTab === 0) {
            this.answeredDialog = true;
        } else {
            this.OAnsweredDialog = true;
        }
    }

    showHistoryDialog() {
        if (this.activeTab === 0) {
            this.historyDialog = true;
        } else {
            this.OHistoryDialog = true;
        }
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

    retrievePDFLength() {
        this.cmService.retrievePdfLength().subscribe(res => {
            if (res.error) {
                this.messageService.add({
                    key: 'msgs', severity: 'error', summary: 'Error', detail: res.error
                });
                return;
            }

            if (res.results) {
                let numPages = res.results.pageCount;
                for (let i = 1; i <= numPages; i++) {
                    this.pdfPages.push({
                        label: "" + i,
                        value: i
                    });
                }
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
