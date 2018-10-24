import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Message, MenuItem } from 'primeng/components/common/api';

import { CMService } from '../../../../core/services/cm.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Dialog } from 'primeng/dialog';

@Component({
    selector: 'cm-faq-create',
    templateUrl: './cm-faq-create.component.html',
    styleUrls: ['./cm-faq-create.component.css']
})
export class CMFaqCreateComponent implements OnInit {

    // UI Control
    loading = false;
    msgs: Message[] = [];

    // UI Components
    faqForm: FormGroup;


    constructor(
        private cmService: CMService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.loading = true;

        this.faqForm = this.fb.group({
            question: new FormControl('', Validators.required),
            answer: new FormControl('', Validators.required)
        });

        this.loading = false;
    }

    postFAQ() {

        this.faqForm.get('question').markAsDirty();
        this.faqForm.get('answer').markAsDirty();

        if (this.faqForm.get('question').invalid || this.faqForm.get('answer').invalid) {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: 'Please fill in all fields'
            });
            return;
        }

        let answer = this.faqForm.get("question").value
        let question = this.faqForm.get("answer").value
        if (answer !== '' && question !== '') {
            this.loading = true;
            this.cmService.createFAQ(answer, question).subscribe(res => {
                if (res.error) {
                    this.msgs.push({
                        severity: 'error', summary: 'Error', detail: res.error
                    });
                    this.loading = false;
                    return;
                }

                if (res.results) {
                    this.msgs.push({
                        severity: 'success', summary: 'Success', detail: 'FAQ has been created. You will be redirected shortly.'
                    });
                    this.faqForm.get("question").setValue("")
                    this.faqForm.get("answer").setValue("")


                    setTimeout(() => {
                        this.router.navigate(['cm/faq/manage'], {
                            queryParams: {
                                activeTab: 1
                            }
                        });
                    }, 1500);
                }

                this.loading = false;
            }, error => {
                this.msgs.push({
                    severity: 'error', summary: 'Error', detail: error
                });

                this.loading = false;
            });
            return;
        }
    }
}
