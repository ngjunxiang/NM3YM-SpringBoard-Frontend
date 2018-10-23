import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Message, MenuItem } from 'primeng/components/common/api';

import { CMService } from '../../../../core/services/cm.service';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { AdminService } from '../../../../core/services/admin.service';

interface intent {
    label: string,
    value: string
}

@Component({
    selector: 'cm-faq-cleaning',
    templateUrl: './cm-faq-cleaning.component.html',
    styleUrls: ['./cm-faq-cleaning.component.css']
})


export class CMFaqCleaningComponent implements OnInit {

    // UI Control
    loading = false;
    msgs: Message[] = [];
    selectedText = [];
    expand = [];
    highlighted = [];
    addEntity = false;

    // UI Components
    faqs: any[];
    intents: intent[];
    faqTrainerForm: FormGroup;

    constructor(
        private cmService: CMService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.loading = true;
        this.retrieveUncleanedFAQ();
    }

    retrieveUncleanedFAQ() {
        this.cmService.retrieveUncleanedFAQ().subscribe(res => {
            if (res.error) {
                this.msgs.push({
                    severity: 'error', summary: 'Error', detail: res.error
                });
                this.loading = false;
                return;
            }

            if (res.results) {
                this.faqs = res.results
            }

            this.createForm();
        }, error => {
            this.msgs.push({
                severity: 'error', summary: 'Server Error', detail: error
            });
            this.loading = false;
        });
    }

    createForm() {
        this.faqTrainerForm = this.fb.group({
            questions: this.fb.array([])
        });

        let control = <FormArray>this.faqTrainerForm['controls'].questions;

        this.faqs.forEach(faq => {
            control.push(
                this.fb.group({
                    question: new FormControl(faq.question, Validators.required),
                    intent: new FormControl('', Validators.required),
                    entities: this.fb.array([])
                })
            );
        });

        this.UIControls();
        this.retrieveIntents();
        this.loading = false;
    }

    async UIControls() {
        this.faqs.forEach(faq => {
            this.expand.push(false);
            this.selectedText.push('');
            this.highlighted.push('');
        });
    }

    retrieveIntents() {
        this.cmService.retrieveIntents().subscribe(res => {
            if (res.error) {
                this.msgs.push({
                    severity: 'error', summary: 'Error', detail: res.error
                });
                return;
            }

            if (res.results) {
                this.intents = [];
                res.results.forEach(intent => {
                    this.intents.push({
                        label: intent, value: intent
                    });
                });
            }
        }, error => {
            this.msgs.push({
                severity: 'error', summary: 'Server Error', detail: error
            });
            this.loading = false;
        });
    }

    expandFAQ(index) {
        if (this.expand[index]) {
            this.expand[index] = false;
        } else {
            this.expand[index] = true;
        }
    }

    showHighlightedText(index) {
        let highlightedText = "";

        if (window.getSelection) {
            highlightedText = window.getSelection().toString().trim();

            if (highlightedText != "") {
                this.selectedText[index] = highlightedText;
                this.highlighted[index] = true;
            }
        }
    }

    createEntity(index) {
        //Checking if intent has been filled. 
        this.faqTrainerForm.get('questions').get(index + '').get('intent').markAsDirty;
        if (this.faqTrainerForm.get('questions').get(index + '').get('intent').invalid) {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: 'Please select or create an intent'
            });
            return;
        }
        
        let entityControl = (<FormArray>this.faqTrainerForm.controls['questions']).at(index).get('entities') as FormArray
        let entityLength = entityControl.length;
        let prevEntityIndex = entityLength - 1

        //Checking if the previous entity is valid with all forms filled. 
        if (entityLength > 0) {
            this.faqTrainerForm.get('questions').get(index + '').get('entities').get(prevEntityIndex + '').get('value').markAsDirty;
            this.faqTrainerForm.get('questions').get(index + '').get('entities').get(prevEntityIndex + '').get('entity').markAsDirty;

            if (this.faqTrainerForm.get('questions').get(index + '').get('entities').get(prevEntityIndex + '').get('value').invalid ||
                this.faqTrainerForm.get('questions').get(index + '').get('entities').get(prevEntityIndex + '').get('entity').invalid) {
                this.msgs.push({
                    severity: 'error', summary: 'Error', detail: 'Please fill all fields in the previous entity'
                });
                return;
            }
        }

        entityControl.push(
            this.fb.group({
                entity: new FormControl('', Validators.required),
                value: new FormControl('', Validators.required),
                word: new FormControl({ value: '', disabled: true }, Validators.required),
            })
        )

        let entityIndex = entityControl.length - 1;

        this.faqTrainerForm.get('questions').get(index + '').get('entities').get(entityIndex + '').get('word').setValue(this.selectedText[index]);
        this.highlighted[index] = false;
        this.addEntity = true;
    }

    returnCleanedFAQ() {

    }
}
