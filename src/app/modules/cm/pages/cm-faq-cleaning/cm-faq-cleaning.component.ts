import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

import { MessageService } from 'primeng/components/common/api';

import { CMService } from '../../../../core/services/cm.service';

interface intent {
    label: string,
    value: string
}

interface entity {
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
    selectedText = [];
    expand = [];
    highlighted = [];
    addEntity = false;

    // UI Components
    faqs: any[];
    numFAQs: number;
    faqTrainerForm: FormGroup;
    intents: intent[];
    entitiesOptions: entity[];
    entitiesIndex: string[];
    synonyms: any[];
    synonymsOptions: any[];
    numUncleaned = 0;

    //Model Trainer
    trainingModel = false;

    constructor(
        private cmService: CMService,
        private fb: FormBuilder,
        private messageService: MessageService,
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
                this.messageService.add({
                    key: 'msgs', severity: 'error', summary: 'Error', detail: res.error
                });
                this.loading = false;
                return;
            }

            if (res.results) {
                this.faqs = res.results;
                this.numFAQs = this.faqs.length;
                this.numUncleaned = res.numUnclean;
            }

            this.createForm();
        }, error => {
            this.messageService.add({
                key: 'msgs', severity: 'error', summary: 'Server Error', detail: error
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
        this.retrieveEntities();
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
                this.messageService.add({
                    key: 'msgs', severity: 'error', summary: 'Error', detail: res.error
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
            this.messageService.add({
                key: 'msgs', severity: 'error', summary: 'Server Error', detail: error
            });
            this.loading = false;
        });
    }

    retrieveEntities() {
        this.cmService.retrieveEntities().subscribe(res => {
            if (res.error) {
                this.messageService.add({
                    key: 'msgs', severity: 'error', summary: 'Error', detail: res.error
                });
                return;
            }

            if (res.results) {
                this.entitiesOptions = [];
                this.entitiesIndex = [];
                this.synonyms = [];
                let keys = Object.keys(res.results);
                keys.forEach(key => {
                    let objValues = res.results[key];
                    this.entitiesOptions.push({
                        label: key, value: key
                    })
                    this.entitiesIndex.push(key);

                    let dropDownValues = [];

                    objValues.forEach(value => {
                        dropDownValues.push({
                            label: value, value: value
                        })
                    })

                    this.synonyms.push({
                        entity: key, synonyms: dropDownValues
                    })
                })
            }

        }, error => {
            this.messageService.add({
                key: 'msgs', severity: 'error', summary: 'Server Error', detail: error
            });
            this.loading = false;
        });
    }

    createRephrasedFAQ() {
        this.numFAQs++;
        let control = <FormArray>this.faqTrainerForm['controls'].questions;

        control.push(
            this.fb.group({
                question: new FormControl(this.faqs[0].question, Validators.required),
                intent: new FormControl('', Validators.required),
                entities: this.fb.array([])
            })
        );
    }

    deleteRephrasedFAQ(qnsIndex) {
        let control = <FormArray>this.faqTrainerForm['controls'].questions;
        control.removeAt(qnsIndex);
    }

    expandFAQ(index) {
        if (this.expand[index]) {
            this.expand[index] = false;
        } else {
            this.expand[index] = true;
        }
    }

    expandInvalidFAQ(invalidFAQs) {
        invalidFAQs.forEach(index => {
            this.expand[index] = true;
        });
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
            this.messageService.add({
                key: 'msgs', severity: 'info', summary: 'Hold On!', detail: 'Please select or create an intent'
            });
            return;
        }

        let entityControl = (<FormArray>this.faqTrainerForm.controls['questions']).at(index).get('entities') as FormArray;
        let entityLength = entityControl.length;
        let prevEntityIndex = entityLength - 1;

        //Checking if the previous entity is valid with all forms filled. 
        if (entityLength > 0) {
            this.faqTrainerForm.get('questions').get(index + '').get('entities').get(prevEntityIndex + '').get('value').markAsDirty;
            this.faqTrainerForm.get('questions').get(index + '').get('entities').get(prevEntityIndex + '').get('entity').markAsDirty;

            if (this.faqTrainerForm.get('questions').get(index + '').get('entities').get(prevEntityIndex + '').get('value').invalid ||
                this.faqTrainerForm.get('questions').get(index + '').get('entities').get(prevEntityIndex + '').get('entity').invalid) {
                this.messageService.add({
                    key: 'msgs', severity: 'info', summary: 'Hold On!', detail: 'Please fill all fields in the previous entity'
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
        );

        let entityIndex = entityControl.length - 1;

        this.faqTrainerForm.get('questions').get(index + '').get('entities').get(entityIndex + '').get('word').setValue(this.selectedText[index]);
        this.highlighted[index] = false;
        this.addEntity = true;
    }

    retrieveSynonymsOptions(qnIndex, entityIndex) {
        this.synonymsOptions = this.synonyms[this.entitiesIndex.indexOf(this.faqTrainerForm.get('questions').get(qnIndex + '').get('entities').get(entityIndex + '').get('entity').value)]['synonyms']
    }

    deleteEntity(qnsIndex, entityIndex) {
        let control = (<FormArray>this.faqTrainerForm.controls['questions']).at(qnsIndex).get('entities') as FormArray
        control.removeAt(entityIndex);
    }

    submitCleanedFAQ() {
        //Invalid FormControlName Controls
        let invalidCount = 0;
        let emptyEntityCount = 0;
        let unfilledFAQ = [];

        //Check for dirty and invalid FormControlName
        for (let i = 0; i < this.numFAQs; i++) {
            this.faqTrainerForm.get('questions').get(i + '').get('intent').markAsDirty();
            if (this.faqTrainerForm.get('questions').get(i + '').get('intent').invalid || this.faqTrainerForm.get('questions').get(i + '').get('question').invalid) {
                invalidCount++;
            }

            let entityControl = (<FormArray>this.faqTrainerForm.controls['questions']).at(i).get('entities') as FormArray
            let entityLength = entityControl.length;

            if (entityLength == 0) {
                emptyEntityCount++;
            }

            for (let j = 0; j < entityLength; j++) {
                entityControl.get(j + '').get('entity').markAsDirty();
                entityControl.get(j + '').get('value').markAsDirty();
                entityControl.get(j + '').get('word').markAsDirty();
                if (entityControl.get(j + '').get('entity').invalid || entityControl.get(j + '').get('value').invalid || entityControl.get(j + '').get('word').invalid) {
                    invalidCount++;
                }
            }

            if (emptyEntityCount > 0 || invalidCount > 0) {
                unfilledFAQ.push(i);
            }
        }

        if (invalidCount > 0 || emptyEntityCount > 0) {
            this.expandInvalidFAQ(unfilledFAQ);
            this.messageService.add({
                key: 'msgs', severity: 'error', summary: 'Error', detail: 'Please create intents and entities for all FAQ!'
            });
            return;
        }

        //storing the values into faqs 
        for (let i = 0; i < this.numFAQs; i++) {
            this.faqs[i].question = this.faqTrainerForm.get('questions').get(i + '').get('question').value;
            this.faqs[i].intent = this.faqTrainerForm.get('questions').get(i + '').get('intent').value;
            this.faqs[i].entities = [];


            let entityControl = (<FormArray>this.faqTrainerForm.controls['questions']).at(i).get('entities') as FormArray;
            let entityLength = entityControl.length;

            for (let j = 0; j < entityLength; j++) {
                this.faqs[i].entities.push({
                    entity: entityControl.get(j + '').get('entity').value,
                    value: entityControl.get(j + '').get('value').value,
                    word: entityControl.get(j + '').get('word').value
                });
            }
        };

        this.cmService.returnCleanedFAQ(this.faqs).subscribe(res => {
            if (res.error) {
                this.messageService.add({
                    key: 'msgs', severity: 'error', summary: 'Error', detail: res.error
                });
                return;
            }

            if (res.results) {
                let successCount = res.results.StoredCount
                let failedCount = res.results.failedQnNums
                this.messageService.add({
                    key: 'msgs', severity: 'success', summary: 'Success', detail: successCount + ' FAQ have been cleaned.'
                });

                this.loading = true;
                this.retrieveUncleanedFAQ();
                
            }
        }, error => {
            this.messageService.add({
                key: 'msgs', severity: 'error', summary: 'Server Error', detail: error
            });
            this.loading = false;
        });
    }

    trainModel() {
        //Invalid FormControlName Controls
        let invalidCount = 0;
        let emptyEntityCount = 0;
        let unfilledFAQ = [];

        //Check for dirty and invalid FormControlName
        for (let i = 0; i < this.numFAQs; i++) {
            this.faqTrainerForm.get('questions').get(i + '').get('intent').markAsDirty();
            if (this.faqTrainerForm.get('questions').get(i + '').get('intent').invalid || this.faqTrainerForm.get('questions').get(i + '').get('question').invalid) {
                invalidCount++;
            }

            let entityControl = (<FormArray>this.faqTrainerForm.controls['questions']).at(i).get('entities') as FormArray
            let entityLength = entityControl.length;

            if (entityLength == 0) {
                emptyEntityCount++;
            }

            for (let j = 0; j < entityLength; j++) {
                entityControl.get(j + '').get('entity').markAsDirty();
                entityControl.get(j + '').get('value').markAsDirty();
                entityControl.get(j + '').get('word').markAsDirty();
                if (entityControl.get(j + '').get('entity').invalid || entityControl.get(j + '').get('value').invalid || entityControl.get(j + '').get('word').invalid) {
                    invalidCount++;
                }
            }

            if (emptyEntityCount > 0 || invalidCount > 0) {
                unfilledFAQ.push(i);
            }
        }

        if (invalidCount > 0 || emptyEntityCount > 0) {
            this.expandInvalidFAQ(unfilledFAQ);
            this.messageService.add({
                key: 'msgs', severity: 'error', summary: 'Error', detail: 'Please create intents and entities for all FAQ!'
            });
            return;
        }

        //storing the values into faqs 
        for (let i = 0; i < this.numFAQs; i++) {
            this.faqs[i].question = this.faqTrainerForm.get('questions').get(i + '').get('question').value;
            this.faqs[i].intent = this.faqTrainerForm.get('questions').get(i + '').get('intent').value;
            this.faqs[i].entities = [];


            let entityControl = (<FormArray>this.faqTrainerForm.controls['questions']).at(i).get('entities') as FormArray;
            let entityLength = entityControl.length;

            for (let j = 0; j < entityLength; j++) {
                this.faqs[i].entities.push({
                    entity: entityControl.get(j + '').get('entity').value,
                    value: entityControl.get(j + '').get('value').value,
                    word: entityControl.get(j + '').get('word').value
                });
            }
        };

        this.cmService.returnCleanedFAQ(this.faqs).subscribe(res => {
            if (res.error) {
                this.messageService.add({
                    key: 'msgs', severity: 'error', summary: 'Error', detail: res.error
                });
                return;
            }

            if (res.results) {
                let successCount = res.results.StoredCount
                let failedCount = res.results.failedQnNums
                this.messageService.add({
                    key: 'msgs', severity: 'success', summary: 'Success', detail: successCount + ' FAQ have been cleaned.'
                });
            }
        }, error => {
            this.messageService.add({
                key: 'msgs', severity: 'error', summary: 'Server Error', detail: error
            });
            this.loading = false;
        });

        this.trainingModel = true;

        this.cmService.trainModel().subscribe(res => {
            if (res.error) {
                this.messageService.add({
                    key: 'msgs', severity: 'error', summary: 'Error', detail: res.error
                });
                this.loading = false;
                return;
            }

            if (res.results) {
                this.messageService.add({
                    key: 'msgs', severity: 'success', summary: 'Completed', detail: "NLU model has been trained"
                });

                this.trainingModel = false;
                this.retrieveUncleanedFAQ();
            }

            this.loading = false;

        }, error => {
            this.messageService.add({
                key: 'msgs', severity: 'error', summary: 'Server Error', detail: error
            });
            this.loading = false;
            this.trainingModel = false;
        });
    }
}

