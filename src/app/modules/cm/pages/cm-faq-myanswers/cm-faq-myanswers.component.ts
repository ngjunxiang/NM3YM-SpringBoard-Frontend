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
    selectedPage: number;
    link: string;
    referenceAdded = false;

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
        this.includePDF = false;
        this.referenceAdded = false;
        this.link = "";

        if (this.answerForm.controls.editedAnswer.invalid) {
            this.messageService.add({ 
                key: 'msgs', severity: 'error', summary: 'Error', detail: 'Please fill in the answer field'
            });
            return;
        }

        this.cmService.updateAnsweredFAQ(this.faqs[index].qnID, this.faqs[index].question, this.answerForm.get('editedAnswer').value.replace(/&nbsp;/g, ' ').trim()).subscribe(res => {
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

    editPDFReference() {
        if (this.referenceAdded) {
            //replace link
            let newLink = "<div><u><a #ref href='assets/pdf/reg51.pdf#page=" + this.selectedPage + "' target='_blank'>Refer to page " + this.selectedPage + " of Reg51</a></u><div>"
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
            this.link = "<div><u><a #ref href='assets/pdf/reg51.pdf#page=" + this.selectedPage + "' target='_blank'>Refer to page " + this.selectedPage + " of Reg51</a></u><div>"
            let answer = this.answerForm.get('editedAnswer').value + this.link
            this.answerForm.get('editedAnswer').setValue(answer);
            this.referenceAdded = true;
        }
    }

    showAnsweredDialog(index) {
        this.currentIndex = index;
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

    paginate(event) {
        //First index of the FormArray that will appear on the page  
        this.firstIndex = event.first;

        //Last index of the FormArray that will appears on the page  
        this.lastIndex = this.firstIndex + 10;
        let el = document.getElementById("scrollHere")
        el.scrollIntoView();
    }
}
