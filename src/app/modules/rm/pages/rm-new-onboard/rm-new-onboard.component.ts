import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Message, SelectItem } from 'primeng/components/common/api';

import { ChecklistService } from '../../../../core/services/checklist.service';

@Component({
    selector: 'rm-new-onboard',
    templateUrl: './rm-new-onboard.component.html',
    styleUrls: ['./rm-new-onboard.component.scss']
})

export class RMNewOnboardComponent implements OnInit {

    // UI Control
    loading = false;
    blocked = false;
    msgs: Message[] = [];
    step = 1;

    // UI Component
    complianceMOCols: any[];
    complianceCCols: any[];
    legalMOCols: any[];
    legalCCols: any[];

    checklistNameDropdownData: SelectItem[];
    checklistForm: FormGroup;

    selectedChecklistId: string;
    selectedChecklistName: string;
    selectedChecklistData: any;
    processData: any;

    constructor(
        private checklistService: ChecklistService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.loading = true;

        this.createForm();
    }

    createForm() {
        this.retrieveChecklistNames();
        this.checklistForm = this.fb.group({
            selectedChecklistId: new FormControl('', Validators.required),
            requiredFields: new FormArray([]),
            conditions: new FormArray([]),
            complianceDocuments: this.fb.group({
                mandatory: new FormArray([]),
                conditional: new FormArray([]),
                optional: new FormArray([])
            }),
            legalDocuments: this.fb.group({
                mandatory: new FormArray([]),
                conditional: new FormArray([]),
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
                conditional: new FormArray([]),
                optional: new FormArray([])
            }),
            legalDocuments: this.fb.group({
                mandatory: new FormArray([]),
                conditional: new FormArray([]),
                optional: new FormArray([])
            })
        });

        this.route.snapshot.data['urls'] = [
            { title: 'Onboard' },
            { title: 'New' },
            { title: this.selectedChecklistName }
        ];

        this.checklistService.retrieveRMChecklistDetails(this.selectedChecklistId).subscribe(res => {
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
        }, error => {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: error
            });
        });
        this.loading = false;
    }

    createDocumentsForm() {
        this.legalMOCols = [
            { field: 'documentName', header: 'Document Name' },
            { field: 'agmtCode', header: 'Agmt Code' },
            { field: 'remarks', header: 'Remarks' },
            { field: 'signature', header: 'Signature Required' },
            { field: 'canWaiver', header: 'Can be Waivered' }
        ];

        this.legalCCols = [
            { field: 'documentName', header: 'Document Name' },
            { field: 'conditionName', header: 'Condition Name' },
            { field: 'conditionOptions', header: 'Condition Options' },
            { field: 'agmtCode', header: 'Agmt Code' },
            { field: 'remarks', header: 'Remarks' },
            { field: 'signature', header: 'Signature Required' },
            { field: 'canWaiver', header: 'Can be Waivered' }
        ];

        this.complianceMOCols = [
            { field: 'documentName', header: 'Document Name' },
            { field: 'agmtCode', header: 'Agmt Code' },
            { field: 'remarks', header: 'Remarks' },
            { field: 'signature', header: 'Signature Required' }
        ];

        this.complianceCCols = [
            { field: 'documentName', header: 'Document Name' },
            { field: 'conditionName', header: 'Condition Name' },
            { field: 'conditionOptions', header: 'Condition Options' },
            { field: 'agmtCode', header: 'Agmt Code' },
            { field: 'remarks', header: 'Remarks' },
            { field: 'signature', header: 'Signature Required' }
        ];

        // Compliance Documents
        let formArray = <FormArray>this.checklistForm.get('complianceDocuments')['controls'].mandatory;
        this.selectedChecklistData.complianceDocuments.mandatory.forEach(doc => {
            formArray.push(new FormControl(false));
        });

        let conditionalDocs = [];
        formArray = <FormArray>this.checklistForm.get('complianceDocuments')['controls'].conditional;
        this.selectedChecklistData.complianceDocuments.conditional.forEach(doc => {
            for (let i = 0; i < this.checklistForm.get('conditions')['length']; i++) {
                let conditionName = this.selectedChecklistData.conditions[i].conditionName;
                let conditionOption = this.checklistForm.get('conditions').get(i + '').get('conditionOption').value;
                for (let j = 0; j < doc.conditions.length; j++) {
                    if (doc.conditions[j].conditionName === conditionName && doc.conditions[j].conditionOption === conditionOption) {
                        formArray.push(new FormControl(false));
                        conditionalDocs.push(doc);
                    }
                }
            }
        });
        this.selectedChecklistData.complianceDocuments.conditional = conditionalDocs;

        formArray = <FormArray>this.checklistForm.get('complianceDocuments')['controls'].optional;
        this.selectedChecklistData.complianceDocuments.optional.forEach(doc => {
            formArray.push(new FormControl(false));
        });

        // Legal Documents
        formArray = <FormArray>this.checklistForm.get('legalDocuments')['controls'].mandatory;
        this.selectedChecklistData.legalDocuments.mandatory.forEach(doc => {
            formArray.push(new FormControl(false));
        });

        conditionalDocs = [];
        formArray = <FormArray>this.checklistForm.get('legalDocuments')['controls'].conditional;
        this.selectedChecklistData.legalDocuments.conditional.forEach(doc => {
            for (let i = 0; i < this.checklistForm.get('conditions')['length']; i++) {
                let conditionName = this.selectedChecklistData.conditions[i].conditionName;
                let conditionOption = this.checklistForm.get('conditions').get(i + '').get('conditionOption').value;
                for (let j = 0; j < doc.conditions.length; j++) {
                    if (doc.conditions[j].conditionName === conditionName && doc.conditions[j].conditionOption === conditionOption) {
                        formArray.push(new FormControl(false));
                        conditionalDocs.push(doc);
                    }
                }
            }
        });
        this.selectedChecklistData.legalDocuments.conditional = conditionalDocs;

        formArray = <FormArray>this.checklistForm.get('legalDocuments')['controls'].optional;
        this.selectedChecklistData.legalDocuments.optional.forEach(doc => {
            formArray.push(new FormControl(false));
        });

        this.loading = false;
    }

    retrieveChecklistNames() {
        this.checklistNameDropdownData = [];
        this.checklistService.retrieveRMChecklistNames().subscribe(data => {
            if (data.error) {
                this.msgs.push({
                    severity: 'error', summary: 'Server Error', detail: data.error
                });
            }
            data.clNames.forEach(cl => {
                this.checklistNameDropdownData.push({
                    'label': cl.name,
                    'value': cl.clID
                });
            });
        }, error => {
            this.msgs.push({
                severity: 'error', summary: 'Server Error', detail: error
            });
        });
    }

    submitChecklistName() {
        this.checklistForm.controls.selectedChecklistId.markAsDirty();
        if (this.checklistForm.controls.selectedChecklistId.invalid) {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: 'Please select a checklist'
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
            control.markAsDirty();
        });

        this.checklistForm.get('conditions')['controls'].forEach(control => {
            control.markAsDirty();
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
                this.msgs.push({
                    severity: 'error', summary: 'Error', detail: 'Please enter all required fields'
                });
            }
            if (invalidConditions) {
                document.getElementById('conditions').scrollIntoView();
                this.msgs.push({
                    severity: 'error', summary: 'Error', detail: 'Please enter all condition options'
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
        this.processData = {};
        this.processData['name'] = this.selectedChecklistName;

        // Checklist Required Fields
        this.processData['requiredFields'] = [];

        for (let i = 0; i < this.checklistForm.get('requiredFields')['length']; i++) {
            this.processData['requiredFields'].push({
                'fieldName': this.selectedChecklistData.requiredFields[i],
                'fieldValue': this.checklistForm.get('requiredFields').get(i + '').get('field').value
            });
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


        // // Compliance Documents
        // this.checklist['complianceDocuments'] = {};
        // this.checklist['complianceDocuments']['mandatory'] = [];

        // for (let i = 0; i < this.complianceDocumentsForm.get('mandatory')['length']; i++) {
        //     let mandatoryDoc = this.complianceDocumentsForm.get('mandatory').get(i + '');
        //     this.checklist['complianceDocuments']['mandatory'].push({
        //         documentName: mandatoryDoc.get('documentName').value,
        //         agmtCode: mandatoryDoc.get('agmtCode').value,
        //         signature: mandatoryDoc.get('signature').value,
        //         remarks: mandatoryDoc.get('remarks').value
        //     });
        // }

        // this.checklist['complianceDocuments']['conditional'] = [];

        // for (let i = 0; i < this.complianceDocumentsForm.get('conditional')['length']; i++) {
        //     let conditionalDoc = this.complianceDocumentsForm.get('conditional').get(i + '');
        //     let conditions = [];
        //     for (let j = 0; j < this.complianceDocumentsForm.get('conditional').get(i + '').get('conditions')['length']; j++) {
        //         let condition = this.complianceDocumentsForm.get('conditional').get(i + '').get('conditions').get(j + '');
        //         conditions.push({
        //             conditionName: condition.get('conditionName').value,
        //             conditionOption: condition.get('conditionOption').value
        //         })
        //     }
        //     this.checklist['complianceDocuments']['conditional'].push({
        //         conditions: conditions,
        //         documentName: conditionalDoc.get('documentName').value,
        //         agmtCode: conditionalDoc.get('agmtCode').value,
        //         signature: conditionalDoc.get('signature').value,
        //         remarks: conditionalDoc.get('remarks').value
        //     });
        // }

        // this.checklist['complianceDocuments']['optional'] = [];

        // for (let i = 0; i < this.complianceDocumentsForm.get('optional')['length']; i++) {
        //     let optionalDoc = this.complianceDocumentsForm.get('optional').get(i + '');
        //     this.checklist['complianceDocuments']['optional'].push({
        //         documentName: optionalDoc.get('documentName').value,
        //         agmtCode: optionalDoc.get('agmtCode').value,
        //         signature: optionalDoc.get('signature').value,
        //         remarks: optionalDoc.get('remarks').value
        //     });
        // }

        // // Legal Documents
        // this.checklist['legalDocuments'] = {};
        // this.checklist['legalDocuments']['mandatory'] = [];

        // for (let i = 0; i < this.legalDocumentsForm.get('mandatory')['length']; i++) {
        //     let mandatoryDoc = this.legalDocumentsForm.get('mandatory').get(i + '');
        //     this.checklist['legalDocuments']['mandatory'].push({
        //         documentName: mandatoryDoc.get('documentName').value,
        //         agmtCode: mandatoryDoc.get('agmtCode').value,
        //         signature: mandatoryDoc.get('signature').value,
        //         canWaiver: mandatoryDoc.get('canWaiver').value,
        //         remarks: mandatoryDoc.get('remarks').value
        //     });
        // }

        // this.checklist['legalDocuments']['conditional'] = [];

        // for (let i = 0; i < this.legalDocumentsForm.get('conditional')['length']; i++) {
        //     let conditionalDoc = this.legalDocumentsForm.get('conditional').get(i + '');
        //     let conditions = [];
        //     for (let j = 0; j < this.legalDocumentsForm.get('conditional').get(i + '').get('conditions')['length']; j++) {
        //         let condition = this.legalDocumentsForm.get('conditional').get(i + '').get('conditions').get(j + '');
        //         conditions.push({
        //             conditionName: condition.get('conditionName').value,
        //             conditionOption: condition.get('conditionOption').value
        //         })
        //     }
        //     this.checklist['legalDocuments']['conditional'].push({
        //         conditions: conditions,
        //         documentName: conditionalDoc.get('documentName').value,
        //         agmtCode: conditionalDoc.get('agmtCode').value,
        //         signature: conditionalDoc.get('signature').value,
        //         canWaiver: conditionalDoc.get('canWaiver').value,
        //         remarks: conditionalDoc.get('remarks').value
        //     });
        // }

        // this.checklist['legalDocuments']['optional'] = [];

        // for (let i = 0; i < this.legalDocumentsForm.get('optional')['length']; i++) {
        //     let optionalDoc = this.legalDocumentsForm.get('optional').get(i + '');
        //     this.checklist['legalDocuments']['optional'].push({
        //         documentName: optionalDoc.get('documentName').value,
        //         agmtCode: optionalDoc.get('agmtCode').value,
        //         signature: optionalDoc.get('signature').value,
        //         canWaiver: optionalDoc.get('canWaiver').value,
        //         remarks: optionalDoc.get('remarks').value
        //     });
        // }

        console.log(this.processData)
    }
}
