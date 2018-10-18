import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Message, MenuItem, ConfirmationService } from 'primeng/components/common/api';

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
    selectedFAQ: string;
    activeTab: number;
    msgs: Message[] = [];
    answeredDialog = false;
    unansweredDialog = false;
    currentIndex: number;

    // UI Components
    faqs: any[];
    answerForm: FormGroup;

    constructor(
        private cmService: CMService,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.activeTab = 0;
        this.loadPage();
    }

    showDialogMaximized(event, dialog: Dialog) {
        dialog.maximized = false;
        dialog.toggleMaximize(event);
    }

    loadPage() {
        this.loading = true;
        this.faqs = [];

        if (this.activeTab === 0) {
            this.cmService.retrieveAnsweredFAQ().subscribe(res => {
                if (res.error) {
                    this.msgs.push({
                        severity: 'error', summary: 'Error', detail: res.error
                    });
                    this.loading = false;
                    return;
                }

                if (res.results) {
                    for (let i = 0; i < res.results.length; i++) {
                        let faq = res.results[i];
                        let selected = false;
                        if (faq.question === this.selectedFAQ) {
                            selected = true;
                        }

                        this.faqs.push({
                            qnID: faq.qnID,
                            question: faq.question,
                            answer: faq.answer,
                            selected: selected
                        });
                    }
                }
                this.loading = false;
            }, error => {
                this.msgs.push({
                    severity: 'error', summary: 'Server Error', detail: error
                });
                this.loading = false;
            });
        } else {
            this.cmService.retrieveUnansweredFAQ().subscribe(res => {
                if (res.error) {
                    this.msgs.push({
                        severity: 'error', summary: 'Error', detail: res.error
                    });
                    this.loading = false;
                    return;
                }

                if (res.results) {
                    res.results.forEach(faq => {
                        this.faqs.push({
                            qnID: faq.qnID,
                            question: faq.question,
                            selected: false
                        });
                    });
                }
                this.loading = false;
            }, error => {
                this.msgs.push({
                    severity: 'error', summary: 'Server Error', detail: error
                });
                this.loading = false;
            });
        }
    }

    changeTab(event) {
        this.loading = true;
        this.faqs = [];

        if (event.index === 0) {
            this.cmService.retrieveAnsweredFAQ().subscribe(res => {
                if (res.error) {
                    this.msgs.push({
                        severity: 'error', summary: 'Error', detail: res.error
                    });
                    this.loading = false;
                    return;
                }

                if (res.results) {
                    for (let i = 0; i < res.results.length; i++) {
                        let faq = res.results[i];
                        let selected = false;
                        if (faq.question === this.selectedFAQ) {
                            selected = true;
                        }

                        this.faqs.push({
                            qnID: faq.qnID,
                            question: faq.question,
                            answer: faq.answer,
                            selected: selected
                        });
                    }
                }
                this.loading = false;
            }, error => {
                this.msgs.push({
                    severity: 'error', summary: 'Server Error', detail: error
                });
                this.loading = false;
            });
        }

        if (event.index === 1) {
            this.cmService.retrieveUnansweredFAQ().subscribe(res => {
                if (res.error) {
                    this.msgs.push({
                        severity: 'error', summary: 'Error', detail: res.error
                    });
                    this.loading = false;
                    return;
                }

                if (res.results) {
                    res.results.forEach(faq => {
                        this.faqs.push({
                            qnID: faq.qnID,
                            question: faq.question,
                            selected: false
                        });
                    });
                }
                this.loading = false;
            }, error => {
                this.msgs.push({
                    severity: 'error', summary: 'Server Error', detail: error
                });
                this.loading = false;
            });
        }

        this.activeTab = event.index;
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
    }

    hideEditQuestionArea() {
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
    }

    deleteAnsweredQuestion(index: number) {
        this.confirmationService.confirm({
            message: 'Do you want to delete this question?',
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.processing = true;
                this.cmService.deleteAnsweredFAQ(this.faqs[index].question).subscribe(res => {
                    if (res.error) {
                        this.msgs.push({
                            severity: 'error', summary: 'Error', detail: res.error
                        });
                        return;
                    }

                    if (res.results) {
                        this.loadPage();
                        this.faqs.map(faq => {
                            faq.selected = false;
                        });
                        this.msgs.push({
                            severity: 'success', summary: 'Success', detail: 'Question deleted'
                        });
                    }

                    this.processing = false;
                    this.answeredDialog = false;
                }, error => {
                    this.msgs.push({
                        severity: 'error', summary: 'Error', detail: error
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
                this.cmService.deleteUnansweredFAQ(this.faqs[index].question).subscribe(res => {
                    if (res.error) {
                        this.msgs.push({
                            severity: 'error', summary: 'Error', detail: res.error
                        });
                        return;
                    }

                    if (res.results) {
                        this.loadPage();
                        this.msgs.push({
                            severity: 'success', summary: 'Success', detail: 'Question deleted'
                        });
                    }

                    this.processing = false;
                    this.unansweredDialog = false;
                }, error => {
                    this.msgs.push({
                        severity: 'error', summary: 'Error', detail: error
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
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: 'Please fill in the answer field'
            });
            return;
        }

        this.cmService.updateAnsweredFAQ(this.faqs[index].qnID, this.faqs[index].question, this.answerForm.get('editedAnswer').value).subscribe(res => {
            this.processing = true;
            this.selectedFAQ = this.faqs[index].question;
            if (res.error) {
                this.msgs.push({
                    severity: 'error', summary: 'Error', detail: res.error
                });
                return;
            }

            if (res.results) {
                this.loadPage();
                this.msgs.push({
                    severity: 'success', summary: 'Success', detail: 'Answer updated'
                });
            }

            this.hideAnsEditArea();

            this.processing = false;
        }, error => {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: error
            });
            this.processing = false;
        });
    }

    saveUnansweredQuestion(index: number) {
        this.answerForm.controls.addedAnswer.markAsDirty();

        if (this.answerForm.controls.addedAnswer.invalid) {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: 'Please fill in the answer field'
            });
            return;
        }

        this.cmService.updateUnansweredFAQ(this.faqs[index].qnID, this.faqs[index].question, this.answerForm.get('addedAnswer').value).subscribe(res => {
            this.processing = true;

            if (res.error) {
                this.msgs.push({
                    severity: 'error', summary: 'Error', detail: res.error
                });
                return;
            }

            if (res.results) {
                this.loadPage();
                this.msgs.push({
                    severity: 'success', summary: 'Success', detail: 'Question has been answered'
                });
            }

            this.hideAnsEditArea();
            this.unansweredDialog = false;

            this.processing = false;
        }, error => {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: error
            });
            this.processing = false;
            this.unansweredDialog = false;
        });
    }

    showAnsweredDialog(index) {
        this.currentIndex = index;
        this.answeredDialog = true;


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

    showUnansweredDialog(index) {
        this.currentIndex = index;
        this.unansweredDialog = true;


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
