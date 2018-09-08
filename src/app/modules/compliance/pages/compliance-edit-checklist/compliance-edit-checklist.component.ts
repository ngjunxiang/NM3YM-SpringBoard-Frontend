import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ConfirmationService } from 'primeng/components/common/confirmationservice';
import { Message, SelectItem, MenuItem } from 'primeng/components/common/api';

import { ChecklistService } from '../../../../core/services/checklist.service';

@Component({
    selector: 'compliance-edit-checklist',
    templateUrl: './compliance-edit-checklist.component.html',
    styleUrls: ['./compliance-edit-checklist.component.scss']
})

export class ComplianceEditChecklistComponent implements OnInit {

    // UI Control
    loading = false;
    processing = false;
    blocked = false;
    msgs: Message[] = [];
    tabs: MenuItem[];
    activeTab: number;
    dropdownData = {
        conditions: [],
        conditionOptions: []
    };
    complianceMOCols: any[];
    complianceCCols: any[];
    legalMOCols: any[];
    legalCCols: any[];
    docIndex: number;
    editMode = false;
    mDisplay = false;
    mEditDisplay = false;
    cDisplay = false;
    cEditDisplay = false;
    oDisplay = false;
    oEditDisplay = false;

    // UI Component
    clName: string;
    currentChecklistForm: FormGroup;
    complianceDocumentsForm: FormGroup;
    legalDocumentsForm: FormGroup;
    dialogForm: FormGroup;
    cDialogForm: FormGroup;
    checklistNames: string[] = [];
    checklist: any;

    constructor(
        private checklistService: ChecklistService,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.clName = params['name'];
        });

        this.route.snapshot.data['urls'] = [
            { title: 'Checklists' },
            { title: 'Edit', url: '/compliance/checklist/manage' },
            { title: this.clName }
        ];

        this.loading = true;

        this.activeTab = 0;

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

        this.createForm();

        this.retrieveChecklistDetails(this.route.snapshot.paramMap.get('id'));

        this.retrieveChecklistNames();
    }

    createForm() {
        this.currentChecklistForm = this.fb.group({
            checklistName: new FormControl('', [Validators.required, this.checklistNameExists.bind(this)]),
            requiredFields: this.fb.array([]),
            conditions: this.fb.array([])
        });

        this.complianceDocumentsForm = this.fb.group({
            mandatory: this.fb.array([]),
            conditional: this.fb.array([]),
            optional: this.fb.array([])
        });

        this.legalDocumentsForm = this.fb.group({
            mandatory: this.fb.array([]),
            conditional: this.fb.array([]),
            optional: this.fb.array([])
        });

        this.dialogForm = this.fb.group({
            documentName: new FormControl('', Validators.required),
            agmtCode: new FormControl('', [Validators.required, this.checkDuplicateAgmtCode.bind(this)]),
            signature: new FormControl(true),
            canWaiver: new FormControl(false),
            remarks: new FormControl(''),
            docID: new FormControl(''),
            changed: new FormControl('2')
        });

        this.cDialogForm = this.fb.group({
            conditions: new FormArray([
                this.fb.group({
                    conditionName: new FormControl('', Validators.required),
                    conditionOption: new FormControl({ value: '', disabled: '' }, [Validators.required, this.checkDuplicateConditionalCondition.bind(this)])
                })
            ]),
            documentName: new FormControl('', Validators.required),
            agmtCode: new FormControl('', [Validators.required, this.checkDuplicateAgmtCode.bind(this)]),
            signature: new FormControl(true),
            canWaiver: new FormControl(false),
            remarks: new FormControl(''),
            docID: new FormControl(''),
            changed: new FormControl('2')
        });

        this.loading = false;
    }

    checklistNameExists(control: FormControl): { [key: string]: boolean } | null {
        if (this.checklistNames.includes(control.value) && control.value !== this.currentChecklistForm.get('checklistName').value) {
            return {
                checklistNameExists: true
            };
        }
        return null;
    }

    checkDuplicateConditionName(control: FormControl): { [key: string]: boolean } | null {
        let count = 0;
        if (typeof this.currentChecklistForm !== 'undefined' && this.currentChecklistForm.getRawValue().conditions.length > 1) {
            let rawConditions = this.currentChecklistForm.getRawValue().conditions;
            for (let i = 0; i < rawConditions.length; i++) {
                let condition = rawConditions[i];
                if (condition.conditionName === control.value) {
                    count++;
                }
            }
        }

        if (count > 1) {
            return {
                isDuplicate: true
            };
        }
        
        return null;
    }

    checkConditionInUse() {
        let currentConditions = this.currentChecklistForm.getRawValue().conditions;

        for (let i = 0; i < currentConditions.length; i++) {
            let condition = currentConditions[i];
            let toDisable = false;
            this.complianceDocumentsForm.getRawValue().conditional.forEach(cDoc => {
                cDoc.conditions.forEach(docCondition => {
                    if (docCondition.conditionName == condition.conditionName
                        && condition.conditionOptions.includes(docCondition.conditionOption)) {
                        toDisable = true;
                    }
                });
            });
            this.legalDocumentsForm.getRawValue().conditional.forEach(cDoc => {
                cDoc.conditions.forEach(docCondition => {
                    if (docCondition.conditionName == condition.conditionName
                        && condition.conditionOptions.includes(docCondition.conditionOption)) {
                        toDisable = true;
                    }
                });
            });

            if (toDisable) {
                this.currentChecklistForm.get('conditions').get(i + '').get('conditionName').disable();
                this.currentChecklistForm.get('conditions').get(i + '').get('conditionOptions').disable();
            } else {
                this.currentChecklistForm.get('conditions').get(i + '').get('conditionName').enable();
                this.currentChecklistForm.get('conditions').get(i + '').get('conditionOptions').enable();
            }
        }
    }

    checkDuplicateRequiredField(control: FormControl): { [key: string]: boolean } | null {
        let currentReqFields = this.currentChecklistForm.getRawValue().requiredFields;
        for (let i = 0; i < currentReqFields.length - 1; i++) {
            let requiredField = currentReqFields[i];
            if (requiredField.fieldName === control.value) {
                return {
                    isDuplicate: true
                };
            }
        }
        return null;
    }

    checkDuplicateAgmtCode(control: FormControl): { [key: string]: boolean } | null {
        if (this.mDisplay || this.mEditDisplay || this.cDisplay || this.cEditDisplay || this.oDisplay
            || this.oEditDisplay) {
            let agmtCodes = [];
            let currentForm = this.complianceDocumentsForm.getRawValue();

            currentForm.mandatory.filter((mDoc) => mDoc.changed !== '3')
                .map(existingMDoc => agmtCodes.push(existingMDoc.agmtCode));

            currentForm.conditional.filter((cDoc) => cDoc.changed !== '3')
                .map(existingCDoc => agmtCodes.push(existingCDoc.agmtCode));

            currentForm.optional.filter((oDoc) => oDoc.changed !== '3')
                .map(existingODoc => agmtCodes.push(existingODoc.agmtCode));

            currentForm = this.legalDocumentsForm.getRawValue();

            currentForm.mandatory.filter((mDoc) => mDoc.changed !== '3')
                .map(existingMDoc => agmtCodes.push(existingMDoc.agmtCode));

            currentForm.conditional.filter((cDoc) => cDoc.changed !== '3')
                .map(existingCDoc => agmtCodes.push(existingCDoc.agmtCode));

            currentForm.optional.filter((oDoc) => oDoc.changed !== '3')
                .map(existingODoc => agmtCodes.push(existingODoc.agmtCode));

            if (agmtCodes.includes(control.value)) {
                return {
                    isDuplicate: true
                }
            }
        }
        return null;
    }

    checkDuplicateConditionalCondition(control: FormControl): { [key: string]: boolean } | null {
        if (this.cDisplay || this.cEditDisplay) {
            if (typeof this.cDialogForm !== 'undefined' && this.cDialogForm.get('conditions')['length'] > 1) {
                let currPos = (this.cDialogForm.get('conditions')['length'] - 1) + '';
                for (let i = 0; i < this.cDialogForm.get('conditions')['length'] - 1; i++) {
                    let condition = (<FormArray>this.cDialogForm.controls.conditions).value[i];
                    if (control.touched && condition.conditionName === this.cDialogForm.get('conditions').get(currPos).get('conditionName').value
                        && condition.conditionOption === control.value) {
                        return {
                            isDuplicate: true
                        };
                    }
                }
            }
        }
        return null;
    }

    retrieveChecklistNames() {
        this.checklistService.retrieveComplianceChecklistNames().subscribe(data => {
            data.clNames.forEach(cl => {
                this.checklistNames.push(cl.name);
            });
        }, error => {
            this.msgs.push({
                severity: 'error', summary: 'Server Error', detail: error
            });
        });
    }

    retrieveChecklistDetails(checklistName) {
        this.loading = true;
        this.checklistService.retrieveComplianceChecklistDetails(checklistName).subscribe(res => {
            if (res.error) {
                this.msgs.push({
                    severity: 'error', summary: 'Error', detail: res.error
                });
                return;
            }

            // Update Checklist Name
            this.currentChecklistForm.get('checklistName').setValue(res.name);

            // Update Required Fields
            for (let i = 0; i < res.requiredFields.length; i++) {
                let requiredField = res.requiredFields[i];
                let rFArr = <FormArray>this.currentChecklistForm.controls.requiredFields
                if (i < 4) {
                    rFArr.push(
                        this.fb.group({
                            fieldName: new FormControl({ value: requiredField, disabled: true }, Validators.required)
                        })
                    );
                } else {
                    rFArr.push(
                        this.fb.group({
                            fieldName: new FormControl(requiredField, Validators.required)
                        })
                    );
                }
            }

            // Update Conditions
            Object.keys(res.conditions).forEach(conditionName => {
                let conditionOptionsArr = res.conditions[conditionName];
                let conditionsArr = <FormArray>this.currentChecklistForm.controls.conditions
                conditionsArr.push(
                    this.fb.group({
                        conditionName: new FormControl(conditionName, [Validators.required, this.checkDuplicateConditionName.bind(this)]),
                        conditionOptions: new FormControl(conditionOptionsArr, Validators.required)
                    })
                );
            });

            this.retrieveConditionalConditions()

            // Update Compliance Documents
            Object.keys(res.complianceDocuments['mandatory']).forEach(mandatoryDoc => {
                let complianceMandatoryArr = <FormArray>this.complianceDocumentsForm.controls.mandatory;
                complianceMandatoryArr.push(
                    this.fb.group({
                        documentName: new FormControl(res.complianceDocuments['mandatory'][mandatoryDoc]['documentName'], Validators.required),
                        agmtCode: new FormControl(res.complianceDocuments['mandatory'][mandatoryDoc]['agmtCode'], Validators.required),
                        signature: new FormControl(res.complianceDocuments['mandatory'][mandatoryDoc]['signature']),
                        canWaiver: new FormControl(false),
                        remarks: new FormControl(res.complianceDocuments['mandatory'][mandatoryDoc]['remarks']),
                        docID: new FormControl(res.complianceDocuments['mandatory'][mandatoryDoc]['docID']),
                        changed: new FormControl(res.complianceDocuments['mandatory'][mandatoryDoc]['changed'])
                    })
                );
            });

            Object.keys(res.complianceDocuments['conditional']).forEach(conditionalDoc => {
                let conditionsArr = [];
                res.complianceDocuments['conditional'][conditionalDoc]['conditions'].forEach(condition => {
                    conditionsArr.push(
                        this.fb.group({
                            conditionName: new FormControl(condition.conditionName, Validators.required),
                            conditionOption: new FormControl(condition.conditionOption, [Validators.required, this.checkDuplicateConditionalCondition.bind(this)])
                        })
                    );
                });
                let complianceConditionalArr = <FormArray>this.complianceDocumentsForm.controls.conditional;
                complianceConditionalArr.push(
                    this.fb.group({
                        conditions: new FormArray(conditionsArr),
                        documentName: new FormControl(res.complianceDocuments['conditional'][conditionalDoc]['documentName'], Validators.required),
                        agmtCode: new FormControl(res.complianceDocuments['conditional'][conditionalDoc]['agmtCode'], Validators.required),
                        signature: new FormControl(res.complianceDocuments['conditional'][conditionalDoc]['signature']),
                        canWaiver: new FormControl(false),
                        remarks: new FormControl(res.complianceDocuments['conditional'][conditionalDoc]['remarks']),
                        docID: new FormControl(res.complianceDocuments['conditional'][conditionalDoc]['docID']),
                        changed: new FormControl(res.complianceDocuments['conditional'][conditionalDoc]['changed'])
                    })
                );
            });

            Object.keys(res.complianceDocuments['optional']).forEach(optionalDoc => {
                let complianceOptionalArr = <FormArray>this.complianceDocumentsForm.controls.optional;
                complianceOptionalArr.push(
                    this.fb.group({
                        documentName: new FormControl(res.complianceDocuments['optional'][optionalDoc]['documentName'], Validators.required),
                        agmtCode: new FormControl(res.complianceDocuments['optional'][optionalDoc]['agmtCode'], Validators.required),
                        signature: new FormControl(res.complianceDocuments['optional'][optionalDoc]['signature']),
                        canWaiver: new FormControl(false),
                        remarks: new FormControl(res.complianceDocuments['optional'][optionalDoc]['remarks']),
                        docID: new FormControl(res.complianceDocuments['optional'][optionalDoc]['docID']),
                        changed: new FormControl(res.complianceDocuments['optional'][optionalDoc]['changed'])
                    })
                );
            });


            // Update Legal Documents
            Object.keys(res.legalDocuments['mandatory']).forEach(mandatoryDoc => {
                let legalMandatoryArr = <FormArray>this.legalDocumentsForm.controls.mandatory;
                legalMandatoryArr.push(
                    this.fb.group({
                        documentName: new FormControl(res.legalDocuments['mandatory'][mandatoryDoc]['documentName'], Validators.required),
                        agmtCode: new FormControl(res.legalDocuments['mandatory'][mandatoryDoc]['agmtCode'], Validators.required),
                        signature: new FormControl(res.legalDocuments['mandatory'][mandatoryDoc]['signature']),
                        canWaiver: new FormControl(res.legalDocuments['mandatory'][mandatoryDoc]['canWaiver']),
                        remarks: new FormControl(res.legalDocuments['mandatory'][mandatoryDoc]['remarks']),
                        docID: new FormControl(res.legalDocuments['mandatory'][mandatoryDoc]['docID']),
                        changed: new FormControl(res.legalDocuments['mandatory'][mandatoryDoc]['changed'])
                    })
                );
            });

            Object.keys(res.legalDocuments['conditional']).forEach(conditionalDoc => {
                let conditionsArr = [];
                res.legalDocuments['conditional'][conditionalDoc]['conditions'].forEach(condition => {
                    conditionsArr.push(
                        this.fb.group({
                            conditionName: new FormControl(condition.conditionName, Validators.required),
                            conditionOption: new FormControl(condition.conditionOption, [Validators.required, this.checkDuplicateConditionalCondition.bind(this)])
                        })
                    );
                });
                let legalConditionalArr = <FormArray>this.legalDocumentsForm.controls.conditional;
                legalConditionalArr.push(
                    this.fb.group({
                        conditions: new FormArray(conditionsArr),
                        documentName: new FormControl(res.legalDocuments['conditional'][conditionalDoc]['documentName'], Validators.required),
                        agmtCode: new FormControl(res.legalDocuments['conditional'][conditionalDoc]['agmtCode'], Validators.required),
                        signature: new FormControl(res.legalDocuments['conditional'][conditionalDoc]['signature']),
                        canWaiver: new FormControl(res.legalDocuments['conditional'][conditionalDoc]['canWaiver']),
                        remarks: new FormControl(res.legalDocuments['conditional'][conditionalDoc]['remarks']),
                        docID: new FormControl(res.legalDocuments['conditional'][conditionalDoc]['docID']),
                        changed: new FormControl(res.legalDocuments['conditional'][conditionalDoc]['changed'])
                    })
                );
            });

            Object.keys(res.legalDocuments['optional']).forEach(optionalDoc => {
                let legalOptionalArr = <FormArray>this.legalDocumentsForm.controls.optional;
                legalOptionalArr.push(
                    this.fb.group({
                        documentName: new FormControl(res.legalDocuments['optional'][optionalDoc]['documentName'], Validators.required),
                        agmtCode: new FormControl(res.legalDocuments['optional'][optionalDoc]['agmtCode'], Validators.required),
                        signature: new FormControl(res.legalDocuments['optional'][optionalDoc]['signature']),
                        canWaiver: new FormControl(res.legalDocuments['optional'][optionalDoc]['canWaiver']),
                        remarks: new FormControl(res.legalDocuments['optional'][optionalDoc]['remarks']),
                        docID: new FormControl(res.legalDocuments['optional'][optionalDoc]['docID']),
                        changed: new FormControl(res.legalDocuments['optional'][optionalDoc]['changed'])
                    })
                );
            });

            this.checkConditionInUse();
            
            this.loading = false;
        }, error => {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: error
            });
        });
    }

    addNewCondition() {
        let i = (+this.currentChecklistForm.get('conditions')['length'] - 1) + '';

        this.currentChecklistForm.get('conditions').get(i).get('conditionName').markAsDirty();
        this.currentChecklistForm.get('conditions').get(i).get('conditionOptions').markAsDirty();

        if (this.currentChecklistForm.get('conditions').get(i).get('conditionName').invalid ||
            this.currentChecklistForm.get('conditions').get(i).get('conditionOptions').invalid) {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: 'Please correct the condition name and options highlighted before adding another condition'
            });
            return;
        }

        let control = <FormArray>this.currentChecklistForm.controls.conditions;
        control.push(
            this.fb.group({
                conditionName: new FormControl('', [Validators.required, this.checkDuplicateConditionName.bind(this)]),
                conditionOptions: new FormControl('', Validators.required)
            })
        );
    }

    deleteCondition(index) {
        this.confirmationService.confirm({
            message: 'Do you want to delete this condition?',
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                let control = <FormArray>this.currentChecklistForm.controls.conditions;
                control.removeAt(index);
                control.patchValue(control.value);
            },
            reject: () => {
                return;
            }
        });
    }

    addNewField() {
        let i = (+this.currentChecklistForm.get('requiredFields')['length'] - 1) + '';

        this.currentChecklistForm.get('requiredFields').get(i).get('fieldName').markAsDirty();

        if (this.currentChecklistForm.get('requiredFields').get(i).get('fieldName').invalid) {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: 'Please fill in the field name before adding another field'
            });
            return;
        }

        let control = <FormArray>this.currentChecklistForm.controls.requiredFields;
        control.push(
            this.fb.group({
                fieldName: new FormControl('', [Validators.required, this.checkDuplicateRequiredField.bind(this)])
            })
        );
    }

    deleteField(index) {
        this.confirmationService.confirm({
            message: 'Do you want to delete this required field?',
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                let control = <FormArray>this.currentChecklistForm.controls.requiredFields;
                control.removeAt(index);
                control.patchValue(control.value);
            },
            reject: () => {
                return;
            }
        });
    }

    showMDialog() {
        this.dialogForm = this.fb.group({
            documentName: new FormControl('', Validators.required),
            agmtCode: new FormControl('', [Validators.required, this.checkDuplicateAgmtCode.bind(this)]),
            signature: new FormControl(true),
            canWaiver: new FormControl(false),
            remarks: new FormControl(''),
            docID: new FormControl(''),
            changed: new FormControl('2')
        });

        this.blocked = true;
        this.mDisplay = true;
    }

    addNewMandatory() {
        this.dialogForm.get('documentName').markAsDirty();
        this.dialogForm.get('agmtCode').markAsDirty();

        if (this.dialogForm.get('documentName').invalid ||
            this.dialogForm.get('agmtCode').invalid) {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: 'Please correct the invalid fields highlighted'
            });
            return;
        }

        let control = <FormArray>this.complianceDocumentsForm.get('mandatory');

        if (this.activeTab === 1) {
            control = <FormArray>this.legalDocumentsForm.get('mandatory');
        }

        if (this.editMode) {
            if (control.get(this.docIndex + '').get('documentName').value !== this.dialogForm.get('documentName').value) {
                control.get(this.docIndex + '').get('documentName').setValue(this.dialogForm.get('documentName').value);
                control.get(this.docIndex + '').get('changed').setValue('1');
            }
            if (control.get(this.docIndex + '').get('agmtCode').value !== this.dialogForm.get('agmtCode').value) {
                control.get(this.docIndex + '').get('agmtCode').setValue(this.dialogForm.get('agmtCode').value);
                control.get(this.docIndex + '').get('changed').setValue('1');
            }
            if (control.get(this.docIndex + '').get('signature').value !== this.dialogForm.get('signature').value) {
                control.get(this.docIndex + '').get('signature').setValue(this.dialogForm.get('signature').value);
                control.get(this.docIndex + '').get('changed').setValue('1');
            }
            if (control.get(this.docIndex + '').get('canWaiver').value !== this.dialogForm.get('canWaiver').value) {
                control.get(this.docIndex + '').get('canWaiver').setValue(this.dialogForm.get('canWaiver').value);
                control.get(this.docIndex + '').get('changed').setValue('1');
            }
            if (control.get(this.docIndex + '').get('remarks').value !== this.dialogForm.get('remarks').value) {
                control.get(this.docIndex + '').get('remarks').setValue(this.dialogForm.get('remarks').value);
                control.get(this.docIndex + '').get('changed').setValue('1');
            }

            this.editMode = false;
            this.blocked = false;
            this.mEditDisplay = false;
            return;
        }

        control.push(this.dialogForm);

        this.blocked = false;
        this.mDisplay = false;
    }

    cancelAddNewMandatory() {
        this.editMode = false;
        this.mDisplay = false;
        this.blocked = false;
        this.mEditDisplay = false;
    }

    editMandatoryDoc(index: number) {
        let form = this.complianceDocumentsForm;

        if (this.activeTab === 1) {
            form = this.legalDocumentsForm;
        }

        this.dialogForm = this.fb.group({
            documentName: new FormControl(form.get('mandatory').get(index + '').get('documentName').value, Validators.required),
            agmtCode: new FormControl(form.get('mandatory').get(index + '').get('agmtCode').value, [Validators.required, this.checkDuplicateAgmtCode.bind(this)]),
            signature: new FormControl(form.get('mandatory').get(index + '').get('signature').value),
            canWaiver: new FormControl(form.get('mandatory').get(index + '').get('canWaiver').value),
            remarks: new FormControl(form.get('mandatory').get(index + '').get('remarks').value),
            docID: new FormControl(form.get('mandatory').get(index + '').get('docID').value),
            changed: new FormControl(form.get('mandatory').get(index + '').get('changed').value)
        });

        this.editMode = true;
        this.docIndex = index;
        this.blocked = true;
        this.mEditDisplay = true;
    }

    deleteMandatoryDoc(index: number) {
        this.confirmationService.confirm({
            message: 'Do you want to delete this mandatory document?',
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                let form = this.complianceDocumentsForm;

                if (this.activeTab === 1) {
                    form = this.legalDocumentsForm;
                }

                let control = <FormArray>form.get('mandatory');
                control.get(index + '').get('changed').setValue('3');
            },
            reject: () => {
                return;
            }
        });
    }

    showCDialog() {
        if (this.currentChecklistForm.get('conditions')['length'] === 1
            && (this.currentChecklistForm.get('conditions').get('0').get('conditionName').value == ''
                || this.currentChecklistForm.get('conditions').get('0').get('conditionOptions').value == '')) {
            this.currentChecklistForm.get('conditions').get('0').get('conditionName').markAsDirty();
            this.currentChecklistForm.get('conditions').get('0').get('conditionOptions').markAsDirty();
            document.getElementById('conditions').scrollIntoView();
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: 'Please add a condition and condition options before adding new conditional document'
            });
            return;
        }

        this.cDialogForm = this.fb.group({
            conditions: new FormArray([
                this.fb.group({
                    conditionName: new FormControl('', Validators.required),
                    conditionOption: new FormControl({ value: '', disabled: '' }, [Validators.required, this.checkDuplicateConditionalCondition.bind(this)])
                })
            ]),
            documentName: new FormControl('', Validators.required),
            agmtCode: new FormControl('', [Validators.required, this.checkDuplicateAgmtCode.bind(this)]),
            signature: new FormControl(true),
            canWaiver: new FormControl(false),
            remarks: new FormControl(''),
            docID: new FormControl(''),
            changed: new FormControl('2')
        });

        this.retrieveConditionalConditions();

        this.blocked = true;
        this.cDisplay = true;
    }

    retrieveConditionalConditions() {
        let conditions: SelectItem[] = [];
        for (let i = 0; i < this.currentChecklistForm.get('conditions')['length']; i++) {
            if (this.currentChecklistForm.get('conditions').get(i + '').get('conditionName').value !== '') {
                conditions.push({
                    'label': this.currentChecklistForm.get('conditions').get(i + '').get('conditionName').value,
                    'value': this.currentChecklistForm.get('conditions').get(i + '').get('conditionName').value
                });
            }
        }
        this.dropdownData['conditions'] = conditions;
    }

    onConditionNameSelect(conditionName: string, index: number) {
        let conditionOptions: SelectItem[] = [];
        for (let i = 0; i < this.currentChecklistForm.get('conditions')['length']; i++) {
            if (conditionName === this.currentChecklistForm.get('conditions').get(i + '').get('conditionName').value) {
                let options = this.currentChecklistForm.get('conditions').get(i + '').get('conditionOptions').value;
                options.forEach(option => {
                    conditionOptions.push({
                        'label': option.trim(),
                        'value': option.trim()
                    });
                });
            }
        }

        let lastPos = this.cDialogForm.get('conditions')['length'] - 1;
        this.cDialogForm.get('conditions').get(lastPos + '').get('conditionOption').enable();
        this.dropdownData['conditionOptions'][index] = conditionOptions;
    }

    reloadConditionalConditionOptions(index: number) {
        let form = this.complianceDocumentsForm;

        if (this.activeTab === 1) {
            form = this.legalDocumentsForm;
        }

        for (let i = 0; i < form.get('conditional').get(index + '').get('conditions')['length']; i++) {
            let control = form.get('conditional').get(index + '').get('conditions').get(i + '');
            this.onConditionNameSelect(control.get('conditionName').value, i);
        }
    }

    addNewConditionalCondition() {
        let i = (+this.cDialogForm.get('conditions')['length'] - 1) + '';

        this.cDialogForm.get('conditions').get(i).get('conditionName').markAsDirty();
        this.cDialogForm.get('conditions').get(i).get('conditionOption').markAsDirty();

        if (this.cDialogForm.get('conditions').get(i).get('conditionName').invalid ||
            this.cDialogForm.get('conditions').get(i).get('conditionOption').invalid) {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: 'Please fill in the condition name and options using the dropdown menu before adding another condition'
            });
            return;
        }

        let control = <FormArray>this.cDialogForm.get('conditions');
        control.push(
            this.fb.group({
                conditionName: new FormControl('', Validators.required),
                conditionOption: new FormControl({ value: '', disabled: '' }, [Validators.required, this.checkDuplicateConditionalCondition.bind(this)])
            })
        );
        this.cDialogForm.get('changed').setValue('1');
    }

    deleteConditionalCondition(index) {
        this.confirmationService.confirm({
            message: 'Do you want to delete this condition?',
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                let control = <FormArray>this.cDialogForm.get('conditions');
                control.removeAt(index);
                this.cDialogForm.get('changed').setValue('1');
            },
            reject: () => {
                return;
            }
        });
    }

    addNewConditional() {
        let i = (+this.cDialogForm.get('conditions')['length'] - 1) + '';

        if (+i > 0 && this.cDialogForm.get('conditions').get(i).get('conditionName').value === ''
            && this.cDialogForm.get('conditions').get(i).get('conditionOption').value === '') {
            let control = <FormArray>this.cDialogForm.get('conditions');
            control.removeAt(+i);
            i = +i - 1 + '';
        }

        this.cDialogForm.get('conditions').get(i).get('conditionName').markAsDirty();
        this.cDialogForm.get('conditions').get(i).get('conditionOption').markAsDirty();

        if (this.cDialogForm.get('conditions').get(i).get('conditionName').invalid ||
            this.cDialogForm.get('conditions').get(i).get('conditionOption').invalid) {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: 'Please correct the invalid fields highlighted'
            });
            return;
        }

        let control = <FormArray>this.complianceDocumentsForm.get('conditional');

        if (this.activeTab === 1) {
            control = <FormArray>this.legalDocumentsForm.get('conditional');
        }

        if (this.editMode) {
            if (control.get(this.docIndex + '').get('conditions').value !== this.cDialogForm.get('conditions').value) {
                let conditions = <FormArray>control.get(this.docIndex + '').get('conditions');
                while (conditions.length != 0) {
                    conditions.removeAt(0);
                }
                this.cDialogForm.get('conditions').value.forEach(condition => {
                    conditions.push(this.fb.group({
                        conditionName: condition.conditionName,
                        conditionOption: condition.conditionOption
                    }));
                });
                control.get(this.docIndex + '').get('changed').setValue('1');
            }

            if (control.get(this.docIndex + '').get('documentName').value !== this.cDialogForm.get('documentName').value) {
                control.get(this.docIndex + '').get('documentName').setValue(this.cDialogForm.get('documentName').value);
                control.get(this.docIndex + '').get('changed').setValue('1');
            }
            if (control.get(this.docIndex + '').get('agmtCode').value !== this.cDialogForm.get('agmtCode').value) {
                control.get(this.docIndex + '').get('agmtCode').setValue(this.cDialogForm.get('agmtCode').value);
                control.get(this.docIndex + '').get('changed').setValue('1');
            }
            if (control.get(this.docIndex + '').get('signature').value !== this.cDialogForm.get('signature').value) {
                control.get(this.docIndex + '').get('signature').setValue(this.cDialogForm.get('signature').value);
                control.get(this.docIndex + '').get('changed').setValue('1');
            }
            if (control.get(this.docIndex + '').get('canWaiver').value !== this.cDialogForm.get('canWaiver').value) {
                control.get(this.docIndex + '').get('canWaiver').setValue(this.cDialogForm.get('canWaiver').value);
                control.get(this.docIndex + '').get('changed').setValue('1');
            }
            if (control.get(this.docIndex + '').get('remarks').value !== this.cDialogForm.get('remarks').value) {
                control.get(this.docIndex + '').get('remarks').setValue(this.cDialogForm.get('remarks').value);
                control.get(this.docIndex + '').get('changed').setValue('1');
            }

            this.editMode = false;
            this.blocked = false;
            this.cEditDisplay = false;
            return;
        }

        control.push(this.cDialogForm);

        this.dropdownData.conditionOptions = [];
        this.blocked = false;
        this.cDisplay = false;
    }

    cancelAddNewConditional() {
        this.editMode = false;
        this.dropdownData.conditionOptions = [];
        this.cEditDisplay = false;
        this.blocked = false;
        this.cDisplay = false;
    }

    editConditionalDoc(index: number) {
        let form = this.complianceDocumentsForm;

        if (this.activeTab === 1) {
            form = this.legalDocumentsForm;
        }

        this.cDialogForm = this.fb.group({
            conditions: new FormArray([]),
            documentName: new FormControl(form.get('conditional').get(index + '').get('documentName').value, Validators.required),
            agmtCode: new FormControl(form.get('conditional').get(index + '').get('agmtCode').value, [Validators.required, this.checkDuplicateAgmtCode.bind(this)]),
            signature: new FormControl(form.get('conditional').get(index + '').get('signature').value),
            canWaiver: new FormControl(form.get('conditional').get(index + '').get('canWaiver').value),
            remarks: new FormControl(form.get('conditional').get(index + '').get('remarks').value),
            docID: new FormControl(form.get('conditional').get(index + '').get('docID').value),
            changed: new FormControl(form.get('conditional').get(index + '').get('changed').value)
        });

        form.get('conditional').get(index + '').get('conditions')['controls'].forEach(control => {
            let arr = <FormArray>this.cDialogForm.get('conditions');
            arr.push(
                this.fb.group({
                    conditionName: new FormControl(control.get('conditionName').value, Validators.required),
                    conditionOption: new FormControl(control.get('conditionOption').value, [Validators.required, this.checkDuplicateConditionalCondition.bind(this)])
                })
            );
        });

        this.retrieveConditionalConditions();
        this.reloadConditionalConditionOptions(index);

        this.docIndex = index;
        this.editMode = true;
        this.blocked = true;
        this.cEditDisplay = true;
    }

    deleteConditionalDoc(index: number) {
        this.confirmationService.confirm({
            message: 'Do you want to delete this conditional document?',
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                let form = this.complianceDocumentsForm;

                if (this.activeTab === 1) {
                    form = this.legalDocumentsForm;
                }

                let control = <FormArray>form.get('conditional');
                control.get(index + '').get('changed').setValue('3');

                this.checkConditionInUse();
            },
            reject: () => {
                return;
            }
        });
    }

    showODialog() {
        this.dialogForm = this.fb.group({
            documentName: new FormControl('', Validators.required),
            agmtCode: new FormControl('', [Validators.required, this.checkDuplicateAgmtCode.bind(this)]),
            signature: new FormControl(true),
            canWaiver: new FormControl(false),
            remarks: new FormControl(''),
            docID: new FormControl(''),
            changed: new FormControl('2')
        });

        this.blocked = true;
        this.oDisplay = true;
    }

    addNewOptional() {
        this.dialogForm.get('documentName').markAsDirty();
        this.dialogForm.get('agmtCode').markAsDirty();

        if (this.dialogForm.get('documentName').invalid ||
            this.dialogForm.get('agmtCode').invalid) {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: 'Please correct the invalid fields highlighted'
            });
            return;
        }

        let control = <FormArray>this.complianceDocumentsForm.get('optional');

        if (this.activeTab === 1) {
            control = <FormArray>this.legalDocumentsForm.get('optional');
        }

        if (this.editMode) {
            if (control.get(this.docIndex + '').get('documentName').value !== this.dialogForm.get('documentName').value) {
                control.get(this.docIndex + '').get('documentName').setValue(this.dialogForm.get('documentName').value);
                control.get(this.docIndex + '').get('changed').setValue('1');
            }
            if (control.get(this.docIndex + '').get('agmtCode').value !== this.dialogForm.get('agmtCode').value) {
                control.get(this.docIndex + '').get('agmtCode').setValue(this.dialogForm.get('agmtCode').value);
                control.get(this.docIndex + '').get('changed').setValue('1');
            }
            if (control.get(this.docIndex + '').get('signature').value !== this.dialogForm.get('signature').value) {
                control.get(this.docIndex + '').get('signature').setValue(this.dialogForm.get('signature').value);
                control.get(this.docIndex + '').get('changed').setValue('1');
            }
            if (control.get(this.docIndex + '').get('canWaiver').value !== this.dialogForm.get('canWaiver').value) {
                control.get(this.docIndex + '').get('canWaiver').setValue(this.dialogForm.get('canWaiver').value);
                control.get(this.docIndex + '').get('changed').setValue('1');
            }
            if (control.get(this.docIndex + '').get('remarks').value !== this.dialogForm.get('remarks').value) {
                control.get(this.docIndex + '').get('remarks').setValue(this.dialogForm.get('remarks').value);
                control.get(this.docIndex + '').get('changed').setValue('1');
            }

            this.editMode = false;
            this.blocked = false;
            this.oEditDisplay = false;
            return;
        }

        control.push(this.dialogForm);

        this.blocked = false;
        this.oDisplay = false;
    }

    cancelAddNewOptional() {
        this.editMode = false;
        this.oDisplay = false;
        this.blocked = false;
        this.oEditDisplay = false;
    }

    editOptionalDoc(index: number) {
        let form = this.complianceDocumentsForm;

        if (this.activeTab === 1) {
            form = this.legalDocumentsForm;
        }

        this.dialogForm = this.fb.group({
            documentName: new FormControl(form.get('optional').get(index + '').get('documentName').value, Validators.required),
            agmtCode: new FormControl(form.get('optional').get(index + '').get('agmtCode').value, [Validators.required, this.checkDuplicateAgmtCode.bind(this)]),
            signature: new FormControl(form.get('optional').get(index + '').get('signature').value),
            canWaiver: new FormControl(form.get('optional').get(index + '').get('canWaiver').value),
            remarks: new FormControl(form.get('optional').get(index + '').get('remarks').value),
            docID: new FormControl(form.get('optional').get(index + '').get('docID').value),
            changed: new FormControl(form.get('optional').get(index + '').get('changed').value)
        });

        this.editMode = true;
        this.docIndex = index;
        this.blocked = true;
        this.oEditDisplay = true;
    }

    deleteOptionalDoc(index: number) {
        this.confirmationService.confirm({
            message: 'Do you want to delete this optional document?',
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                let form = this.complianceDocumentsForm;

                if (this.activeTab === 1) {
                    form = this.legalDocumentsForm;
                }

                let control = <FormArray>form.get('optional');
                control.get(index + '').get('changed').setValue('3');
            },
            reject: () => {
                return;
            }
        });
    }

    changeTab(event) {
        this.activeTab = event.index;
    }

    updateChecklist() {
        this.processing = true;

        this.currentChecklistForm.get('checklistName').markAsDirty();

        for (let control of this.currentChecklistForm.get('conditions')['controls']) {
            control.get('conditionName').markAsDirty();
            control.get('conditionOptions').markAsDirty();
        }

        if (this.currentChecklistForm.controls.checklistName.invalid) {
            document.getElementById('checklistName').scrollIntoView();
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: 'Please enter/correct the checklist name'
            });
            this.processing = false;
            return;
        }

        let i = (+this.currentChecklistForm.get('conditions')['length'] - 1) + '';

        if (this.currentChecklistForm.get('conditions').get(i).get('conditionName').invalid ||
            this.currentChecklistForm.get('conditions').get(i).get('conditionOptions').invalid) {
            document.getElementById('conditions').scrollIntoView();
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: 'Please correct the invalid fields highlighted'
            });
            this.processing = false;
            return;
        }

        this.checklist = {};

        // Checklist Name
        this.checklist['name'] = this.currentChecklistForm.get('checklistName').value;

        // Checklist Required Fields
        this.checklist['requiredFields'] = [];

        for (let i = 0; i < this.currentChecklistForm.get('requiredFields')['length']; i++) {
            if (!(this.currentChecklistForm.get('requiredFields')['length'] - 1 === i
                && this.currentChecklistForm.get('requiredFields').get(i + '').get('fieldName').value === '')) {
                this.checklist['requiredFields'].push(this.currentChecklistForm.get('requiredFields').get(i + '').get('fieldName').value);
            }
        }

        // Checklist Conditions
        this.checklist['conditions'] = {};
        
        for (let i = 0; i < this.currentChecklistForm.get('conditions')['length']; i++) {
            if (!(this.currentChecklistForm.get('conditions')['length'] - 1 === i
                && (this.currentChecklistForm.get('conditions').get(i + '').get('conditionName').value === ''
                    || this.currentChecklistForm.get('conditions').get(i + '').get('conditionOptions').value === ''))) {
                let conditionName = this.currentChecklistForm.get('conditions').get(i + '').get('conditionName').value;
                let conditionOptionsArr = this.currentChecklistForm.get('conditions').get(i + '').get('conditionOptions').value;
                this.checklist['conditions'][conditionName] = [];
                conditionOptionsArr.forEach(option => {
                    this.checklist['conditions'][conditionName].push(option.trim());
                });
            }
        }


        // Compliance Documents
        this.checklist['complianceDocuments'] = {};
        this.checklist['complianceDocuments']['mandatory'] = [];

        for (let i = 0; i < this.complianceDocumentsForm.get('mandatory')['length']; i++) {
            let mandatoryDoc = this.complianceDocumentsForm.get('mandatory').get(i + '');
            this.checklist['complianceDocuments']['mandatory'].push({
                documentName: mandatoryDoc.get('documentName').value,
                agmtCode: mandatoryDoc.get('agmtCode').value,
                signature: mandatoryDoc.get('signature').value,
                remarks: mandatoryDoc.get('remarks').value,
                docID: mandatoryDoc.get('docID').value,
                changed: mandatoryDoc.get('changed').value
            });
        }

        this.checklist['complianceDocuments']['conditional'] = [];

        for (let i = 0; i < this.complianceDocumentsForm.get('conditional')['length']; i++) {
            let conditionalDoc = this.complianceDocumentsForm.get('conditional').get(i + '');
            let conditions = [];
            for (let j = 0; j < this.complianceDocumentsForm.get('conditional').get(i + '').get('conditions')['length']; j++) {
                let condition = this.complianceDocumentsForm.get('conditional').get(i + '').get('conditions').get(j + '');
                conditions.push({
                    conditionName: condition.get('conditionName').value,
                    conditionOption: condition.get('conditionOption').value
                })
            }
            this.checklist['complianceDocuments']['conditional'].push({
                conditions: conditions,
                documentName: conditionalDoc.get('documentName').value,
                agmtCode: conditionalDoc.get('agmtCode').value,
                signature: conditionalDoc.get('signature').value,
                remarks: conditionalDoc.get('remarks').value,
                docID: conditionalDoc.get('docID').value,
                changed: conditionalDoc.get('changed').value
            });
        }

        this.checklist['complianceDocuments']['optional'] = [];

        for (let i = 0; i < this.complianceDocumentsForm.get('optional')['length']; i++) {
            let optionalDoc = this.complianceDocumentsForm.get('optional').get(i + '');
            this.checklist['complianceDocuments']['optional'].push({
                documentName: optionalDoc.get('documentName').value,
                agmtCode: optionalDoc.get('agmtCode').value,
                signature: optionalDoc.get('signature').value,
                remarks: optionalDoc.get('remarks').value,
                docID: optionalDoc.get('docID').value,
                changed: optionalDoc.get('changed').value
            });
        }

        // Legal Documents
        this.checklist['legalDocuments'] = {};
        this.checklist['legalDocuments']['mandatory'] = [];

        for (let i = 0; i < this.legalDocumentsForm.get('mandatory')['length']; i++) {
            let mandatoryDoc = this.legalDocumentsForm.get('mandatory').get(i + '');
            this.checklist['legalDocuments']['mandatory'].push({
                documentName: mandatoryDoc.get('documentName').value,
                agmtCode: mandatoryDoc.get('agmtCode').value,
                signature: mandatoryDoc.get('signature').value,
                canWaiver: mandatoryDoc.get('canWaiver').value,
                remarks: mandatoryDoc.get('remarks').value,
                docID: mandatoryDoc.get('docID').value,
                changed: mandatoryDoc.get('changed').value
            });
        }

        this.checklist['legalDocuments']['conditional'] = [];

        for (let i = 0; i < this.legalDocumentsForm.get('conditional')['length']; i++) {
            let conditionalDoc = this.legalDocumentsForm.get('conditional').get(i + '');
            let conditions = [];
            for (let j = 0; j < this.legalDocumentsForm.get('conditional').get(i + '').get('conditions')['length']; j++) {
                let condition = this.legalDocumentsForm.get('conditional').get(i + '').get('conditions').get(j + '');
                conditions.push({
                    conditionName: condition.get('conditionName').value,
                    conditionOption: condition.get('conditionOption').value
                })
            }
            this.checklist['legalDocuments']['conditional'].push({
                conditions: conditions,
                documentName: conditionalDoc.get('documentName').value,
                agmtCode: conditionalDoc.get('agmtCode').value,
                signature: conditionalDoc.get('signature').value,
                canWaiver: conditionalDoc.get('canWaiver').value,
                remarks: conditionalDoc.get('remarks').value,
                docID: conditionalDoc.get('docID').value,
                changed: conditionalDoc.get('changed').value
            });
        }

        this.checklist['legalDocuments']['optional'] = [];

        for (let i = 0; i < this.legalDocumentsForm.get('optional')['length']; i++) {
            let optionalDoc = this.legalDocumentsForm.get('optional').get(i + '');
            this.checklist['legalDocuments']['optional'].push({
                documentName: optionalDoc.get('documentName').value,
                agmtCode: optionalDoc.get('agmtCode').value,
                signature: optionalDoc.get('signature').value,
                canWaiver: optionalDoc.get('canWaiver').value,
                remarks: optionalDoc.get('remarks').value,
                docID: optionalDoc.get('docID').value,
                changed: optionalDoc.get('changed').value
            });
        }

        this.checklistService.updateComplianceChecklist(this.route.snapshot.paramMap.get('id'), this.checklist).subscribe(res => {
            if (res.error) {
                this.msgs.push({
                    severity: 'error', summary: 'Error', detail: res.error
                });
                this.processing = false;
                return;
            }

            if (res.results) {
                this.msgs.push({
                    severity: 'success', summary: 'Success', detail: 'Checklist updated <br> You will be redirected shortly'
                });

                setTimeout(() => {
                    this.router.navigate(['/compliance/checklist/manage']);
                }, 3000);
            }
        }, error => {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: error
            });
            this.processing = false;
            return;
        });
    }

    get numMandatoryDocs(): number {
        let formArray = <FormArray>this.complianceDocumentsForm.get('mandatory');

        if (this.activeTab === 1) {
            formArray = <FormArray>this.legalDocumentsForm.get('mandatory');
        }
        return formArray.value.filter(doc => doc.changed !== '3').length;
    }

    get numConditionalDocs(): number {
        let formArray = <FormArray>this.complianceDocumentsForm.get('conditional');

        if (this.activeTab === 1) {
            formArray = <FormArray>this.legalDocumentsForm.get('conditional');
        }
        return formArray.value.filter(doc => doc.changed !== '3').length;
    }

    get numOptionalDocs(): number {
        let formArray = <FormArray>this.complianceDocumentsForm.get('optional');

        if (this.activeTab === 1) {
            formArray = <FormArray>this.legalDocumentsForm.get('optional');
        }
        return formArray.value.filter(doc => doc.changed !== '3').length;
    }
}