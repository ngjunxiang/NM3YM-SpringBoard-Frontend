import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

import { MessageService } from 'primeng/components/common/api';

import { CMService } from '../../../../core/services/cm.service';
import { AuthenticationService } from '../../../../core/services/authentication.service';

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
    intentsOptions: intent[]; //UI Dropdown must be in {label: x, value: x}
    entitiesOptions: entity[]; //UI Dropdown must be in {label: x, value: x}
    entitiesIndex: string[];
    synonyms: any[];
    synonymsOptions: any[]; //Populated when user uses entity 
    numUncleaned = 0;
    createdNewFAQ = false;

    //Model Trainer
    trainingModel = false;

    constructor(
        private authService: AuthenticationService,
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
                this.intentsOptions = [];
                res.results.forEach(intent => {
                    this.intentsOptions.push({
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

    createNewFAQ() {
        this.faqs.push({
            qnID: ""
        })

        this.createdNewFAQ = true; 

        let control = <FormArray>this.faqTrainerForm['controls'].questions;

        control.push(
            this.fb.group({
                question: new FormControl('', Validators.required),
                intent: new FormControl('', Validators.required),
                entities: this.fb.array([])
            })
        );

    }

    createRephrasedFAQ() {
        if(this.createdNewFAQ){
            this.faqs[0].question = this.faqTrainerForm.get('questions').get(0 + '').get('question').value;
            this.createdNewFAQ = false;
        }

        //Checking if new intentsOptions or entities have been created
        if (this.faqs.length < 2) {
            //checking for intent
            let orginalIntent = this.faqTrainerForm.get('questions').get(0 + '').get('intent').value;
            let intentIsUnique = true;

            this.intentsOptions.forEach(intent => {
                if (intent.label == orginalIntent) {
                    intentIsUnique = false;
                }
            });

            if (intentIsUnique) {
                this.intentsOptions.push({
                    label: orginalIntent, value: orginalIntent
                });
            }

            //checking for entities
            let entityControl = (<FormArray>this.faqTrainerForm.controls['questions']).at(0).get('entities') as FormArray;
            let entityLength = entityControl.length;

            for (let i = 0; i < entityLength; i++) {
                let originalEntity = this.faqTrainerForm.get('questions').get(0 + '').get('entities').get(i + '').get('entity').value;
                let originalValue = this.faqTrainerForm.get('questions').get(0 + '').get('entities').get(i + '').get('value').value;
                if (!this.entitiesIndex.includes(originalEntity)) {
                    this.entitiesIndex.push(originalEntity);
                    this.entitiesOptions.push({
                        label: originalEntity, value: originalEntity
                    })
                    let dropDownValues = []
                    dropDownValues.push({
                        label: originalValue, value: originalValue
                    });

                    this.synonyms.push({
                        entity: originalEntity, synonyms: dropDownValues
                    })
                } else {
                    let synonymsOptions = this.synonyms[(this.entitiesIndex.indexOf(originalEntity))]["synonyms"];
                    let synIsUnique = true;

                    synonymsOptions.forEach(synonym => {
                        if (synonym.label == originalValue) {
                            synIsUnique = false;
                        }
                    });

                    if (synIsUnique) {
                        this.synonyms[(this.entitiesIndex.indexOf(originalEntity))]["synonyms"].push({
                            label: originalValue, value: originalValue
                        });
                    }

                }
            }
        }

        //create new element to store rephrased question 
        this.faqs.push({
            qnID: ""
        })

        let control = <FormArray>this.faqTrainerForm['controls'].questions;

        control.push(
            this.fb.group({
                question: new FormControl(this.faqs[0].question, Validators.required),
                intent: new FormControl('', Validators.required),
                entities: this.fb.array([])
            })
        );

        this.synonymsOptions = [];
    }

    deleteRephrasedFAQ(qnsIndex) {
        let control = <FormArray>this.faqTrainerForm['controls'].questions;
        control.removeAt(qnsIndex);
        this.faqs.pop();
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
        // Refresh token
        this.authService.authenticate('CM').then(res => {
            if (res.newToken && localStorage.getItem('USERTYPE') === 'CM') {
                this.authService.setLocalStorage(localStorage.getItem('USERNAME'), res.newToken, localStorage.getItem('USERTYPE'));
            }

            if (res.error === 'Invalid Token' || res.error === 'Token has expired') {
                this.router.navigate(['/login'], {
                    queryParams: {
                        err: 'auth001'
                    }
                });
                return;
            }

            if (res.error === 'Invalid userType') {
                this.router.navigate(['/' + localStorage.getItem('USERTYPE').toLowerCase() + '/dashboard'], {
                    queryParams: {
                        err: 'auth001'
                    }
                });
                return;
            }
        });

        //Invalid FormControlName Controls
        let invalidCount = 0;
        let emptyEntityCount = 0;
        let unfilledFAQ = [];

        //Check for dirty and invalid FormControlName
        for (let i = 0; i < this.faqs.length; i++) {
            this.faqTrainerForm.get('questions');
            this.faqTrainerForm.get('questions').get(i + '')
            this.faqTrainerForm.get('questions').get(i + '').get('intent')
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
                key: 'msgs', severity: 'error', summary: 'Error', detail: 'Please create intentsOptions and entities for all FAQ!'
            });
            return;
        }

        //storing the values into faqs 
        for (let i = 0; i < this.faqs.length; i++) {
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
        for (let i = 0; i < this.faqs.length; i++) {
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
                key: 'msgs', severity: 'error', summary: 'Error', detail: 'Please create intentsOptions and entities for all FAQ!'
            });
            return;
        }

        //storing the values into faqs 
        for (let i = 0; i < this.faqs.length; i++) {
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

