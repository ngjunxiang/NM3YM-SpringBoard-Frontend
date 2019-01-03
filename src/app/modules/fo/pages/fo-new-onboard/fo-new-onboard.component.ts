import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SelectItem, MessageService } from 'primeng/components/common/api';

import { FOService } from '../../../../core/services/fo.service';

@Component({
    selector: 'fo-new-onboard',
    templateUrl: './fo-new-onboard.component.html',
    styleUrls: ['./fo-new-onboard.component.scss']
})

export class FONewOnboardComponent implements OnInit {

    // UI Control
    loading = false;
    processing = false;
    step = 1;
    isSubmitted = false;

    // UI Component
    complianceCols: any[];
    legalCols: any[];

    checklistNameDropdownData: SelectItem[];
    checklistForm: FormGroup;
    checklistsData: any[];
    selectedChecklistId: string;
    selectedChecklistName: string;
    selectedChecklistVersion: string;
    selectedChecklistData: any;
    processData: any;
    rmNames: SelectItem[];
    maxDateValue = new Date();

    constructor(
        private foService: FOService,
        private fb: FormBuilder,
        private messageService: MessageService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.loading = true;

        this.createForm();
    }

    @HostListener('window:beforeunload')
    canDeactivate(): Promise<boolean> | boolean {
        if (this.isSubmitted) return true;
        if (!this.checklistForm.dirty) {
            return true;
        }
        return confirm('Are you sure you want to continue? Any unsaved changes will be lost.');
    }

    createForm() {
        this.retrieveChecklistNames();
        this.checklistForm = this.fb.group({
            selectedChecklistId: new FormControl('', Validators.required),
            requiredFields: new FormArray([]),
            conditions: new FormArray([]),
            complianceDocuments: this.fb.group({
                mandatory: new FormArray([]),
                optional: new FormArray([])
            }),
            legalDocuments: this.fb.group({
                mandatory: new FormArray([]),
                optional: new FormArray([])
            })
        });
        this.loading = false;
    }

    createChecklistForm() {
        this.checklistForm = this.fb.group({
            selectedChecklistId: new FormControl('', Validators.required),
            requiredFields: new FormArray([]),
            conditions: new FormArray([]),
            complianceDocuments: this.fb.group({
                mandatory: new FormArray([]),
                optional: new FormArray([])
            }),
            legalDocuments: this.fb.group({
                mandatory: new FormArray([]),
                optional: new FormArray([])
            })
        });

        this.route.snapshot.data['urls'] = [
            { title: 'Onboard' },
            { title: 'New' },
            { title: this.selectedChecklistName }
        ];

        this.foService.retrieveAllRMNames().subscribe(res => {
            if (res.error) {
                this.messageService.add({
                    key: 'msgs', severity: 'error', summary: 'Error', detail: res.error
                });
                return;
            }

            if (res.results) {
                this.rmNames = [];
                res.results.forEach(rmName => {
                    this.rmNames.push({
                        'label': rmName,
                        'value': rmName
                    });
                });
            }
        }, error => {
            this.messageService.add({
                key: 'msgs', severity: 'error', summary: 'Error', detail: error
            });
        });

        this.foService.retrieveChecklistDetails(this.selectedChecklistId).subscribe(res => {
            if (res.error) {
                this.messageService.add({
                    key: 'msgs', severity: 'error', summary: 'Error', detail: res.error
                });
                return;
            }

            this.selectedChecklistData = {};

            let requiredFields = [];
            let formArray = <FormArray>this.checklistForm.controls.requiredFields;
            res.requiredFields.forEach(fieldName => {
                requiredFields.push(fieldName);
                formArray.push(this.fb.group({
                    field: new FormControl('', Validators.required),
                }));
            });

            let conditions = [];
            formArray = <FormArray>this.checklistForm.controls.conditions;
            Object.keys(res.conditions).forEach(conditionName => {
                let conditionOptionsArr = [];
                res.conditions[conditionName].forEach(conditionOption => {
                    conditionOptionsArr.push({
                        'label': conditionOption,
                        'value': conditionOption
                    });
                });

                conditions.push({
                    conditionName: conditionName,
                    conditionOptions: conditionOptionsArr
                });
                formArray.push(this.fb.group({
                    conditionOption: new FormControl('', Validators.required)
                }));
            });

            this.selectedChecklistData = {
                requiredFields: requiredFields,
                conditions: conditions,
                complianceDocuments: res.complianceDocuments,
                legalDocuments: res.legalDocuments
            };
            this.loading = false;
        }, error => {
            this.messageService.add({
                key: 'msgs', severity: 'error', summary: 'Error', detail: error
            });
        });
    }

    createDocumentsForm() {
        this.legalCols = [
            { field: 'documentName', header: 'Document Name' },
            { field: 'documentType', header: 'Document Type' },
            { field: 'conditionName', header: 'Condition Name' },
            { field: 'conditionOptions', header: 'Condition Options' },
            { field: 'agmtCode', header: 'Agmt Code' },
            { field: 'remarks', header: 'Remarks' },
            { field: 'signature', header: 'Signature Required' },
            { field: 'canWaiver', header: 'Can be Waivered' }
        ];

        this.complianceCols = [
            { field: 'documentName', header: 'Document Name' },
            { field: 'documentType', header: 'Document Type' },
            { field: 'conditionName', header: 'Condition Name' },
            { field: 'conditionOptions', header: 'Condition Options' },
            { field: 'agmtCode', header: 'Agmt Code' },
            { field: 'remarks', header: 'Remarks' },
            { field: 'signature', header: 'Signature Required' }
        ];

        // Compliance Documents
        let mandatoryDocs = [];
        let formArray = <FormArray>this.checklistForm.get('complianceDocuments')['controls'].mandatory;

        this.selectedChecklistData.complianceDocuments.mandatory.forEach(doc => {
            if (doc.conditions.length > 0) {
                let toAdd = true;
                for (let j = 0; j < doc.conditions.length; j++) {
                    let conditionMet = false;
                    for (let i = 0; i < this.checklistForm.get('conditions')['length']; i++) {
                        let conditionName = this.selectedChecklistData.conditions[i].conditionName;
                        let conditionOption = this.checklistForm.get('conditions').get(i + '').get('conditionOption').value;
                        if (doc.conditions[j].conditionName === conditionName && doc.conditions[j].conditionOption === conditionOption) {
                            conditionMet = true;
                        }
                    }

                    if (!conditionMet) {
                        toAdd = false;
                    }
                }
                if (toAdd) {
                    formArray.push(new FormControl(false));
                    mandatoryDocs.push(doc);
                }
            } else {
                formArray.push(new FormControl(false));
                mandatoryDocs.push(doc);
            }
        });
        this.selectedChecklistData.complianceDocuments.mandatory = mandatoryDocs;

        let optionalDocs = [];
        formArray = <FormArray>this.checklistForm.get('complianceDocuments')['controls'].optional;
        this.selectedChecklistData.complianceDocuments.optional.forEach(doc => {
            if (doc.conditions.length > 0) {
                for (let i = 0; i < this.checklistForm.get('conditions')['length']; i++) {
                    let conditionName = this.selectedChecklistData.conditions[i].conditionName;
                    let conditionOption = this.checklistForm.get('conditions').get(i + '').get('conditionOption').value;
                    if (doc.conditions.length > 0) {
                        for (let j = 0; j < doc.conditions.length; j++) {
                            if (doc.conditions[j].conditionName === conditionName && doc.conditions[j].conditionOption === conditionOption) {
                                formArray.push(new FormControl(false));
                                optionalDocs.push(doc);
                            }
                        }
                    }
                }
            } else {
                formArray.push(new FormControl(false));
                optionalDocs.push(doc);
            }
        });
        this.selectedChecklistData.complianceDocuments.optional = optionalDocs;

        // Legal Documents
        mandatoryDocs = [];
        formArray = <FormArray>this.checklistForm.get('legalDocuments')['controls'].mandatory;
        this.selectedChecklistData.legalDocuments.mandatory.forEach(doc => {
            if (doc.conditions.length > 0) {
                let toAdd = true;
                for (let j = 0; j < doc.conditions.length; j++) {
                    let conditionMet = false;
                    for (let i = 0; i < this.checklistForm.get('conditions')['length']; i++) {
                        let conditionName = this.selectedChecklistData.conditions[i].conditionName;
                        let conditionOption = this.checklistForm.get('conditions').get(i + '').get('conditionOption').value;
                        if (doc.conditions[j].conditionName === conditionName && doc.conditions[j].conditionOption === conditionOption) {
                            conditionMet = true;
                        }
                    }

                    if (!conditionMet) {
                        toAdd = false;
                    }
                }
                if (toAdd) {
                    formArray.push(new FormControl(false));
                    mandatoryDocs.push(doc);
                }
            } else {
                formArray.push(new FormControl(false));
                mandatoryDocs.push(doc);
            }
        });
        this.selectedChecklistData.legalDocuments.mandatory = mandatoryDocs;

        optionalDocs = [];
        formArray = <FormArray>this.checklistForm.get('legalDocuments')['controls'].optional;
        this.selectedChecklistData.legalDocuments.optional.forEach(doc => {
            if (doc.conditions.length > 0) {
                for (let i = 0; i < this.checklistForm.get('conditions')['length']; i++) {
                    let conditionName = this.selectedChecklistData.conditions[i].conditionName;
                    let conditionOption = this.checklistForm.get('conditions').get(i + '').get('conditionOption').value;
                    if (doc.conditions.length > 0) {
                        for (let j = 0; j < doc.conditions.length; j++) {
                            if (doc.conditions[j].conditionName === conditionName && doc.conditions[j].conditionOption === conditionOption) {
                                formArray.push(new FormControl(false));
                                optionalDocs.push(doc);
                            }
                        }
                    }
                }
            } else {
                formArray.push(new FormControl(false));
                optionalDocs.push(doc);
            }
        });
        this.selectedChecklistData.legalDocuments.optional = optionalDocs;

        this.loading = false;
    }

    retrieveChecklistNames() {
        this.checklistNameDropdownData = [];
        this.foService.retrieveChecklistNames().subscribe(data => {
            if (data.error) {
                this.messageService.add({
                    key: 'msgs', severity: 'error', summary: 'Server Error', detail: data.error
                });
            }
            this.checklistsData = data.clNames;
            data.clNames.forEach(cl => {
                this.checklistNameDropdownData.push({
                    'label': cl.name,
                    'value': cl.clID
                });
            });
        }, error => {
            this.messageService.add({
                key: 'msgs', severity: 'error', summary: 'Server Error', detail: error
            });
        });
    }

    submitChecklistName() {
        this.checklistForm.controls.selectedChecklistId.markAsDirty();
        if (this.checklistForm.controls.selectedChecklistId.invalid) {
            this.messageService.add({
                key: 'msgs', severity: 'error', summary: 'Error', detail: 'Please select a checklist'
            });
            return;
        }

        this.loading = true;
        this.selectedChecklistId = this.checklistForm.controls.selectedChecklistId.value;

        this.checklistNameDropdownData.forEach(checklistName => {
            if (checklistName.value === this.selectedChecklistId) {
                this.selectedChecklistName = checklistName.label;
            }
        });

        this.createChecklistForm();
        this.step++;
    }

    submitFieldsConditions() {
        this.checklistForm.get('requiredFields')['controls'].forEach(control => {
            control.get('field').markAsDirty();
        });

        this.checklistForm.get('conditions')['controls'].forEach(control => {
            control.get('conditionOption').markAsDirty();
        });

        let invalidFields = false;
        this.checklistForm.get('requiredFields')['controls'].some(field => {
            if (field.invalid) {
                invalidFields = true;
                return true;
            }
        });

        let invalidConditions = false;
        this.checklistForm.get('conditions')['controls'].some(field => {
            if (field.invalid) {
                invalidConditions = true;
                return true;
            }
        });

        if (invalidFields || invalidConditions) {
            if (invalidFields) {
                document.getElementById('requiredFields').scrollIntoView();
                this.messageService.add({
                    key: 'msgs', severity: 'error', summary: 'Error', detail: 'Please enter all required fields'
                });
            }
            if (invalidConditions) {
                document.getElementById('conditions').scrollIntoView();
                this.messageService.add({
                    key: 'msgs', severity: 'error', summary: 'Error', detail: 'Please enter all condition options'
                });
            }
            return;
        }

        this.loading = true;
        this.createDocumentsForm();
        this.step++;
    }

    back() {
        this.step--;
    }

    createOnboardProcess() {
        this.processing = true;
        this.processData = {};
        this.processData['clID'] = this.selectedChecklistId;
        this.processData['name'] = this.selectedChecklistName;

        this.checklistsData.forEach(checklist => {
            if (checklist.name === this.selectedChecklistName && checklist.clID === this.selectedChecklistId) {
                this.selectedChecklistVersion = checklist.version;
            }
        })

        this.processData['version'] = this.selectedChecklistVersion;

        // Checklist Required Fields
        this.processData['requiredFields'] = [];

        for (let i = 0; i < this.checklistForm.get('requiredFields')['length']; i++) {
            let field = {};
            field[this.selectedChecklistData.requiredFields[i]] = this.checklistForm.get('requiredFields').get(i + '').get('field').value;
            this.processData['requiredFields'].push(field);
        }

        // Checklist Conditions
        this.processData['conditions'] = [];

        for (let i = 0; i < this.checklistForm.get('conditions')['length']; i++) {
            let conditionName = this.selectedChecklistData.conditions[i].conditionName;
            let conditionOption = this.checklistForm.get('conditions').get(i + '').get('conditionOption').value;

            this.processData['conditions'].push({
                'conditionName': conditionName,
                'conditionOption': conditionOption
            });
        }

        // Compliance Documents
        this.processData['complianceDocuments'] = {};

        this.processData['complianceDocuments']['mandatory'] = [];

        for (let i = 0; i < this.selectedChecklistData.complianceDocuments.mandatory.length; i++) {
            let mandatoryDoc = this.selectedChecklistData.complianceDocuments.mandatory[i];
            this.processData['complianceDocuments']['mandatory'].push({
                hasConditions: mandatoryDoc.hasConditions,
                documentName: mandatoryDoc.documentName,
                documentType: mandatoryDoc.documentType,
                conditions: mandatoryDoc.conditions,
                agmtCode: mandatoryDoc.agmtCode,
                signature: mandatoryDoc.signature,
                remarks: mandatoryDoc.remarks,
                checked: this.checklistForm.get('complianceDocuments').get('mandatory').get(i + '').value,
                changed: mandatoryDoc.changed,
                docID: mandatoryDoc.docID
            });
        }

        this.processData['complianceDocuments']['optional'] = [];

        for (let i = 0; i < this.selectedChecklistData.complianceDocuments.optional.length; i++) {
            let optionalDoc = this.selectedChecklistData.complianceDocuments.optional[i];
            this.processData['complianceDocuments']['optional'].push({
                hasConditions: optionalDoc.hasConditions,
                documentName: optionalDoc.documentName,
                documentType: optionalDoc.documentType,
                conditions: optionalDoc.conditions,
                agmtCode: optionalDoc.agmtCode,
                signature: optionalDoc.signature,
                remarks: optionalDoc.remarks,
                checked: this.checklistForm.get('complianceDocuments').get('optional').get(i + '').value,
                changed: optionalDoc.changed,
                docID: optionalDoc.docID
            });
        }

        // Legal Documents
        this.processData['legalDocuments'] = {};

        this.processData['legalDocuments']['mandatory'] = [];

        for (let i = 0; i < this.selectedChecklistData.legalDocuments.mandatory.length; i++) {
            let mandatoryDoc = this.selectedChecklistData.legalDocuments.mandatory[i];
            this.processData['legalDocuments']['mandatory'].push({
                hasConditions: mandatoryDoc.hasConditions,
                documentName: mandatoryDoc.documentName,
                documentType: mandatoryDoc.documentType,
                conditions: mandatoryDoc.conditions,
                agmtCode: mandatoryDoc.agmtCode,
                signature: mandatoryDoc.signature,
                remarks: mandatoryDoc.remarks,
                checked: this.checklistForm.get('legalDocuments').get('mandatory').get(i + '').value,
                changed: mandatoryDoc.changed,
                docID: mandatoryDoc.docID
            });
        }

        this.processData['legalDocuments']['optional'] = [];

        for (let i = 0; i < this.selectedChecklistData.legalDocuments.optional.length; i++) {
            let optionalDoc = this.selectedChecklistData.legalDocuments.optional[i];
            this.processData['legalDocuments']['optional'].push({
                hasConditions: optionalDoc.hasConditions,
                documentName: optionalDoc.documentName,
                documentType: optionalDoc.documentType,
                conditions: optionalDoc.conditions,
                agmtCode: optionalDoc.agmtCode,
                signature: optionalDoc.signature,
                remarks: optionalDoc.remarks,
                checked: this.checklistForm.get('legalDocuments').get('optional').get(i + '').value,
                changed: optionalDoc.changed,
                docID: optionalDoc.docID
            });
        }


        this.foService.createOnboardProcess(this.processData).subscribe(res => {
            if (res.error) {
                this.messageService.add({
                    key: 'msgs', severity: 'error', summary: 'Error', detail: res.error
                });
                this.processing = false;
                return;
            }

            if (res.results) {
                this.messageService.add({
                    key: 'msgs', severity: 'success', summary: 'Success', detail: 'Onboard process created. You will be redirected shortly'
                });
            }

            this.isSubmitted = true;

            setTimeout(() => {
                this.router.navigate(['/fo/onboard/manage']);
            }, 3000);
        }, error => {
            this.messageService.add({
                key: 'msgs', severity: 'error', summary: 'Error', detail: error
            });
            this.processing = false;
        });
    }
}
