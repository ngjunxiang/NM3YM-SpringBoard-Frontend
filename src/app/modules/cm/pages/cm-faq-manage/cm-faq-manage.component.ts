import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Message, MenuItem } from 'primeng/components/common/api';

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
    loadingEditArea = false;
    showEditArea = false;
    activeTab: number;
    msgs: Message[] = [];

    // UI Components
    faqs: any[];
    editAnswerForm: FormGroup;

    constructor(
        private cmService: CMService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.loading = true;
        this.activeTab = 0;
        this.faqs = [];
        this.cmService.retrieveCMAnsweredFaq().subscribe(res => {
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
                severity: 'error', summary: 'Server Error', detail: error
            });
            this.loading = false;
        });
    }

    changeTab(event) {
        this.loading = true;
        this.faqs = [];
        if (event.index === 0) {
            this.cmService.retrieveCMAnsweredFaq().subscribe(res => {
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
                    severity: 'error', summary: 'Server Error', detail: error
                });
                this.loading = false;
            });
        }

        if (event.index === 1) {
            this.cmService.retrieveCMUnansweredFaq().subscribe(res => {
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
        this.editAnswerForm.get('editedAnswer').setValue('');
        this.showEditArea = false;
    }
}
