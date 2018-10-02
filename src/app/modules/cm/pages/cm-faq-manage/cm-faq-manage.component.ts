import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Message, MenuItem, ConfirmationService } from 'primeng/components/common/api';

import { CMService } from '../../../../core/services/cm.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

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
    showEditArea = false;
    selectedFAQIndex: number;
    activeTab: number;
    msgs: Message[] = [];

    // UI Components
    faqs: any[];
    editAnswerForm: FormGroup;

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
                        if (i === this.selectedFAQIndex) {
                            selected = true;
                        }

                        this.faqs.push({
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
                        if (i === this.selectedFAQIndex) {
                            selected = true;
                        }

                        this.faqs.push({
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
        if (this.showEditArea) {
            return;
        }
        this.loadingEditArea = true;

        this.editAnswerForm = this.fb.group({
            editedAnswer: new FormControl('', Validators.required)
        });

        this.editAnswerForm.get('editedAnswer').setValue(this.faqs[index].answer);

        this.loadingEditArea = false;
        this.showEditArea = true;
    }

    hideEditArea() {
        this.faqs.map(faq => {
            faq.selected = false;
        });

        this.editAnswerForm.get('editedAnswer').setValue('');
        this.showEditArea = false;
    }

    deleteAnsweredQuestion(index: number) {
        this.confirmationService.confirm({
            message: 'Do you want to delete this checklist?',
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
                        this.msgs.push({
                            severity: 'success', summary: 'Success', detail: 'Question deleted'
                        });
                    }

                    this.processing = false;
                }, error => {
                    this.msgs.push({
                        severity: 'error', summary: 'Error', detail: error
                    });
                    this.processing = false;
                });
            },
            reject: () => {
                return;
            }
        });
    }

    saveAnsweredQuestion(index: number) {
        this.editAnswerForm.controls.editedAnswer.markAsDirty();

        if (this.editAnswerForm.controls.editedAnswer.invalid) {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: 'Please fill in the answer field'
            });
            return;
        }

        this.cmService.updateAnsweredFAQ(this.faqs[index].question, this.editAnswerForm.get('editedAnswer').value).subscribe(res => {
            this.processing = true;
            this.selectedFAQIndex = index;
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

            this.processing = false;
        }, error => {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: error
            });
            this.processing = false;
        });
    }
}
