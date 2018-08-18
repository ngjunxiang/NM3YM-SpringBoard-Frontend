import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Message, SelectItem } from 'primeng/components/common/api';

import { ChecklistService } from '../../../../core/services/checklist.service';
import { OnboardService } from '../../../../core/services/onboard.service';

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
    checklistsData: any[];
    selectedChecklistId: string;
    selectedChecklistName: string;
    selectedChecklistVersion: string;
    selectedChecklistData: any;
    processData: any;

    constructor(
        private checklistService: ChecklistService,
        private onboardService: OnboardService,
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
            this.checklistsData = data.clNames;
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
                documentName: mandatoryDoc.documentName,
                agmtCode: mandatoryDoc.agmtCode,
                signature: mandatoryDoc.signature,
                remarks: mandatoryDoc.remarks,
                checked: this.checklistForm.get('complianceDocuments').get('mandatory').get(i + '').value
            });
        }
        this.processData['complianceDocuments']['conditional'] = [];

        for (let i = 0; i < this.selectedChecklistData.complianceDocuments.conditional.length; i++) {
            let conditionalDoc = this.selectedChecklistData.complianceDocuments.conditional[i];
            this.processData['complianceDocuments']['conditional'].push({
                documentName: conditionalDoc.documentName,
                conditions: conditionalDoc.conditions,
                agmtCode: conditionalDoc.agmtCode,
                signature: conditionalDoc.signature,
                remarks: conditionalDoc.remarks,
                checked: this.checklistForm.get('complianceDocuments').get('conditional').get(i + '').value
            });
        }

        this.processData['complianceDocuments']['optional'] = [];

        for (let i = 0; i < this.selectedChecklistData.complianceDocuments.optional.length; i++) {
            let optionalDoc = this.selectedChecklistData.complianceDocuments.optional[i];
            this.processData['complianceDocuments']['optional'].push({
                documentName: optionalDoc.documentName,
                agmtCode: optionalDoc.agmtCode,
                signature: optionalDoc.signature,
                remarks: optionalDoc.remarks,
                checked: this.checklistForm.get('complianceDocuments').get('optional').get(i + '').value
            });
        }

        // Legal Documents
        this.processData['legalDocuments'] = {};
        this.processData['legalDocuments']['mandatory'] = [];

        for (let i = 0; i < this.selectedChecklistData.legalDocuments.mandatory.length; i++) {
            let mandatoryDoc = this.selectedChecklistData.legalDocuments.mandatory[i];
            this.processData['legalDocuments']['mandatory'].push({
                documentName: mandatoryDoc.documentName,
                agmtCode: mandatoryDoc.agmtCode,
                signature: mandatoryDoc.signature,
                remarks: mandatoryDoc.remarks,
                canWaiver: mandatoryDoc.canWaiver,
                checked: this.checklistForm.get('legalDocuments').get('mandatory').get(i + '').value
            });
        }
        this.processData['legalDocuments']['conditional'] = [];

        for (let i = 0; i < this.selectedChecklistData.legalDocuments.conditional.length; i++) {
            let conditionalDoc = this.selectedChecklistData.legalDocuments.conditional[i];
            this.processData['legalDocuments']['conditional'].push({
                documentName: conditionalDoc.documentName,
                conditions: conditionalDoc.conditions,
                agmtCode: conditionalDoc.agmtCode,
                signature: conditionalDoc.signature,
                remarks: conditionalDoc.remarks,
                canWaiver: conditionalDoc.canWaiver,
                checked: this.checklistForm.get('legalDocuments').get('conditional').get(i + '').value
            });
        }

        this.processData['legalDocuments']['optional'] = [];

        for (let i = 0; i < this.selectedChecklistData.legalDocuments.optional.length; i++) {
            let optionalDoc = this.selectedChecklistData.legalDocuments.optional[i];
            this.processData['legalDocuments']['optional'].push({
                documentName: optionalDoc.documentName,
                agmtCode: optionalDoc.agmtCode,
                signature: optionalDoc.signature,
                remarks: optionalDoc.remarks,
                canWaiver: optionalDoc.canWaiver,
                checked: this.checklistForm.get('legalDocuments').get('optional').get(i + '').value
            });
        }
        
        this.onboardService.createOnboardProcess(this.processData).subscribe(res => {
            if (res.error) {
                this.msgs.push({
                    severity: 'error', summary: 'Error', detail: res.error
                });
            }

            this.msgs.push({
                severity: 'success', summary: 'Success', detail: 'Onboard process created <br> You will be redirected shortly'
            });

            setTimeout(() => {
                this.router.navigate(['/rm/dashboard']);
            }, 3000);
        }, error => {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: error
            });
        });
    }
}
