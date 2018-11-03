import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from 'primeng/components/common/api';

import { CMService } from '../../../../core/services/cm.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'cm-faq-create',
    templateUrl: './cm-faq-create.component.html',
    styleUrls: ['./cm-faq-create.component.css']
})

export class CMFaqCreateComponent implements OnInit {

    // UI Control
    loading = false;

    //UI Controls for PDF Reference
    pdfPages: any[] = [];
    includePDF: boolean;
    selectedPage: number[];
    link: string;
    referenceAdded = false;

    // UI Components
    faqForm: FormGroup;

    constructor(
        private cmService: CMService,
        private fb: FormBuilder,
        private messageService: MessageService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.loading = true;

        this.faqForm = this.fb.group({
            question: new FormControl('', Validators.required),
            answer: new FormControl('', Validators.required)
        });

        for (let i = 0; i < 72; i++) {
            this.pdfPages.push({
                label: i,
                value: i
            });
        }

        this.loading = false;
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

    addPDFReference() {
        //<a (click)="openPDF()" href="javascript:void(0)">View Reg 51</a>
        if (this.referenceAdded) {
            //replace link
            let newLink = "<div><a (click)='openPDF("+ this.selectedPage + ")' href='javascript:void(0)'>" + this.selectedPage + " of Reg51</a></div>";
            let answer = this.faqForm.get('answer').value.replace(this.link, newLink);
            if (answer == this.faqForm.get('answer').value) {
                answer = this.faqForm.get('answer').value + newLink;
                this.faqForm.get('answer').setValue(answer);
                this.link = newLink;
            } else {
                this.link = newLink;
                this.faqForm.get('answer').setValue(answer);
            }
        }

        if (this.includePDF && !this.referenceAdded) {
            this.link = "<div (click)='openPDF(" + this.selectedPage + ")'><a href='javascript:void(0)'> Refer to " + this.selectedPage + " of Reg51</a></div>";
            let answer = this.faqForm.get('answer').value + this.link;
            this.faqForm.get('answer').setValue(answer);
            this.referenceAdded = true;
        }
    }

    postFAQ() {
        this.faqForm.get('question').markAsDirty();
        this.faqForm.get('answer').markAsDirty();

        if (this.faqForm.get('question').invalid || this.faqForm.get('answer').invalid) {
            this.messageService.add({ 
                key: 'msgs', severity: 'error', summary: 'Error', detail: 'Please fill in all fields'
            });
            return;
        }

        let answer = this.faqForm.get("question").value;
        let question = this.faqForm.get("answer").value;
        if (answer !== '' && question !== '') {
            this.loading = true;
            this.cmService.createFAQ(answer, question, this.includePDF).subscribe(res => {
                if (res.error) {
                    this.messageService.add({ 
                        key: 'msgs', severity: 'error', summary: 'Error', detail: res.error
                    });
                    this.loading = false;
                    return;
                }

                if (res.results) {
                    this.messageService.add({ 
                        key: 'msgs', severity: 'success', summary: 'Success', detail: 'FAQ has been created. <br>You will be redirected shortly.'
                    });
                    this.faqForm.get("question").setValue("");
                    this.faqForm.get("answer").setValue("");

                    this.includePDF = false;
                    this.referenceAdded = false;
                    this.link = "";

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
                this.messageService.add({ 
                    key: 'msgs', severity: 'error', summary: 'Error', detail: error
                });

                this.loading = false;
            });
        }
    }
}
