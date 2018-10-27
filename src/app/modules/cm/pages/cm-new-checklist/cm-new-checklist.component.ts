import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ConfirmationService } from 'primeng/components/common/confirmationservice';
import { Message, SelectItem } from 'primeng/components/common/api';

import { CMService } from '../../../../core/services/cm.service';

@Component({
    selector: 'cm-new-checklist',
    templateUrl: './cm-new-checklist.component.html',
    styleUrls: ['./cm-new-checklist.component.css']
})

export class CMNewChecklistComponent implements OnInit {

    // UI Control
    loading = false;
    processing = false;
    blocked = false;
    msgs: Message[] = [];
    activeTab: number;
    complianceCols: any[];
    legalCols: any[];
    currentAgmtCode: number;
    cInfoDisplay = false;
    docIndex: number;
    editMode = false;
    mDisplay = false;
    mEditDisplay = false;
    oDisplay = false;
    oEditDisplay = false;

    // UI Component
    dropdownData = {
        conditions: [],
        conditionOptions: []
    };
    documentTypeData: SelectItem[];
    newChecklistForm: FormGroup;
    complianceDocumentsForm: FormGroup;
    legalDocumentsForm: FormGroup;
    dialogForm: FormGroup;
    checklistNames: string[] = [];
    checklist: any;
    filteredAgmtCodes: string[];
    agmtDocMappings: any[];

    constructor(
        private cmService: CMService,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router
    ) { }


    // Initialisation
    ngOnInit() {
        this.loading = true;

        this.activeTab = 0;

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

        this.documentTypeData = [
            { label: 'Not Applicable', value: 'Not Applicable' },
            { label: 'Non-Compliant (NC)', value: 'Non-Compliant (NC)' },
            { label: 'Non-Deferrable Mandatory (NDM)', value: 'Non-Deferrable Mandatory (NDM)' },
            { label: 'Both', value: 'Both' }
        ];
        
        this.createForm();
    }

    createForm() {
        this.newChecklistForm = this.fb.group({
            checklistName: new FormControl('', [Validators.required, this.checklistNameExists.bind(this)]),
            requiredFields: this.fb.array([]),
            conditions: this.fb.array([
                this.fb.group({
                    conditionName: new FormControl('', [Validators.required, this.checkDuplicateConditionName.bind(this)]),
                    conditionOptions: new FormControl('', Validators.required)
                })
            ])
        });

        this.retrieveChecklistNames();
        this.retrieveAgmtCodes();

        let control = <FormArray>this.newChecklistForm.controls.requiredFields;
        ['Client Name', 'RM Name', 'Client A/C Number', 'Date of Submission'].forEach(fieldName => {
            control.push(
                this.fb.group({
                    fieldName: new FormControl({ value: fieldName, disabled: true }, Validators.required)
                })
            );
        });

        this.complianceDocumentsForm = this.fb.group({
            mandatory: this.fb.array([]),
            optional: this.fb.array([])
        });

        this.legalDocumentsForm = this.fb.group({
            mandatory: this.fb.array([]),
            optional: this.fb.array([])
        });

        this.dialogForm = this.fb.group({
            hasConditions: new FormControl({ value: false, disabled: true }),
            conditions: new FormArray([]),
            documentName: new FormControl('', Validators.required),
            documentType: new FormControl('', Validators.required),
            agmtCode: new FormControl('', [Validators.required, this.checkDuplicateAgmtCode.bind(this)]),
            signature: new FormControl(false),
            canWaiver: new FormControl(false),
            remarks: new FormControl('')
        });

        this.loading = false;
    }


    // Validator Functions
    retrieveAgmtCodes() {
        this.cmService.retrieveAgmtCodes().subscribe(res => {
            if (res.error) {
                this.msgs.push({
                    severity: 'error', summary: 'Error', detail: res.error
                });
            }

            if (res.results) {
                this.agmtDocMappings = [];
                Object.keys(res.results).forEach(agmtCode => {
                    this.agmtDocMappings[agmtCode] = res.results[agmtCode];
                });
            }
        }, error => {
            this.msgs.push({
                severity: 'error', summary: 'Server Error', detail: error
            });
        });
    }

    searchAgmtCodes(event) {
        let filtered: any[] = [];
        let agmtCodes = Object.keys(this.agmtDocMappings);
        for (let i = 0; i < agmtCodes.length; i++) {
            let agmtCode = agmtCodes[i];
            if (agmtCode.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                filtered.push(agmtCode);
            }
        }
        this.filteredAgmtCodes = filtered;
    }

    updateAgmtDocValues(value) {
        this.dialogForm.get('agmtCode').setValue(value);
        this.dialogForm.get('documentName').setValue(this.agmtDocMappings[value]);
    }

    retrieveChecklistNames() {
        this.cmService.retrieveCMChecklistNames().subscribe(data => {
            data.clNames.forEach(cl => {
                this.checklistNames.push(cl.name);
            });
        }, error => {
            this.msgs.push({
                severity: 'error', summary: 'Server Error', detail: error
            });
        });
    }

    checklistNameExists(control: FormControl): { [key: string]: boolean } | null {
        if (this.checklistNames.includes(control.value)) {
            return {
                checklistNameExists: true
            };
        }
        return null;
    }

    checkDuplicateConditionName(control: FormControl): { [key: string]: boolean } | null {
        let count = 0;
        if (typeof this.newChecklistForm !== 'undefined' && this.newChecklistForm.getRawValue().conditions.length > 1) {
            let rawConditions = this.newChecklistForm.getRawValue().conditions;
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
        let currentConditions = this.newChecklistForm.getRawValue().conditions;

        for (let i = 0; i < currentConditions.length; i++) {
            let condition = currentConditions[i];
            let toDisable = false;

            this.complianceDocumentsForm.getRawValue().mandatory.forEach(mDoc => {
                if (mDoc.conditions.length > 0) {
                    mDoc.conditions.forEach(docCondition => {
                        if (docCondition.conditionName == condition.conditionName
                            && condition.conditionOptions.includes(docCondition.conditionOption)) {
                            toDisable = true;
                        }
                    });
                }
            });

            this.complianceDocumentsForm.getRawValue().optional.forEach(oDoc => {
                if (oDoc.conditions.length > 0) {
                    oDoc.conditions.forEach(docCondition => {
                        if (docCondition.conditionName == condition.conditionName
                            && condition.conditionOptions.includes(docCondition.conditionOption)) {
                            toDisable = true;
                        }
                    });
                }
            });

            this.legalDocumentsForm.getRawValue().mandatory.forEach(mDoc => {
                if (mDoc.conditions.length > 0) {
                    mDoc.conditions.forEach(docCondition => {
                        if (docCondition.conditionName == condition.conditionName
                            && condition.conditionOptions.includes(docCondition.conditionOption)) {
                            toDisable = true;
                        }
                    });
                }
            });

            this.legalDocumentsForm.getRawValue().optional.forEach(oDoc => {
                if (oDoc.conditions.length > 0) {
                    oDoc.conditions.forEach(docCondition => {
                        if (docCondition.conditionName == condition.conditionName
                            && condition.conditionOptions.includes(docCondition.conditionOption)) {
                            toDisable = true;
                        }
                    });
                }
            });

            if (toDisable) {
                this.newChecklistForm.get('conditions').get(i + '').get('conditionName').disable();
                this.newChecklistForm.get('conditions').get(i + '').get('conditionOptions').disable();
            } else {
                this.newChecklistForm.get('conditions').get(i + '').get('conditionName').enable();
                this.newChecklistForm.get('conditions').get(i + '').get('conditionOptions').enable();
            }
        }
    }

    checkDuplicateRequiredField(control: FormControl): { [key: string]: boolean } | null {
        let currentReqFields = this.newChecklistForm.getRawValue().requiredFields;
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
        if (control.value === '-') {
            return null;
        }

        if (this.mEditDisplay || this.oEditDisplay) {
            if (control.value === this.currentAgmtCode) {
                return null;
            }
        }

        if (this.mDisplay || this.mEditDisplay || this.oDisplay || this.oEditDisplay) {
            let agmtCodes = [];
            let currentForm = this.complianceDocumentsForm.getRawValue();

            currentForm.mandatory.filter((mDoc) => mDoc.changed !== '3')
                .map(existingMDoc => agmtCodes.push(existingMDoc.agmtCode));

            currentForm.optional.filter((oDoc) => oDoc.changed !== '3')
                .map(existingODoc => agmtCodes.push(existingODoc.agmtCode));

            currentForm = this.legalDocumentsForm.getRawValue();

            currentForm.mandatory.filter((mDoc) => mDoc.changed !== '3')
                .map(existingMDoc => agmtCodes.push(existingMDoc.agmtCode));

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

    checkDuplicateDocumentCondition(control: FormControl): { [key: string]: boolean } | null {
        if (this.mDisplay || this.mEditDisplay || this.oDisplay || this.oEditDisplay) {
            if (typeof this.dialogForm !== 'undefined' && this.dialogForm.get('hasConditions').value) {
                let currPos = (this.dialogForm.get('conditions')['length'] - 1) + '';
                for (let i = 0; i < this.dialogForm.get('conditions')['length'] - 1; i++) {
                    let condition = (<FormArray>this.dialogForm.controls.conditions).value[i];
                    if (control.touched && condition.conditionName === this.dialogForm.get('conditions').get(currPos).get('conditionName').value
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


    // Checklist Functions
    showCInfoDialog() {
        this.cInfoDisplay = true;
    }

    addNewCondition() {
        let i = (+this.newChecklistForm.get('conditions')['length'] - 1) + '';

        this.newChecklistForm.get('conditions').get(i).get('conditionName').markAsDirty();
        this.newChecklistForm.get('conditions').get(i).get('conditionOptions').markAsDirty();

        if (this.newChecklistForm.get('conditions').get(i).get('conditionName').invalid ||
            this.newChecklistForm.get('conditions').get(i).get('conditionOptions').invalid) {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: 'Please correct the condition name and options highlighted before adding another condition'
            });
            return;
        }

        let control = <FormArray>this.newChecklistForm.controls.conditions;
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
                let control = <FormArray>this.newChecklistForm.controls.conditions;
                control.removeAt(index);
                control.patchValue(control.value);
            },
            reject: () => {
                return;
            }
        });
    }

    addNewField() {
        let i = (+this.newChecklistForm.get('requiredFields')['length'] - 1) + '';

        this.newChecklistForm.get('requiredFields').get(i).get('fieldName').markAsDirty();

        if (this.newChecklistForm.get('requiredFields').get(i).get('fieldName').invalid) {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: 'Please fill in the field name before adding another field'
            });
            return;
        }

        let control = <FormArray>this.newChecklistForm.controls.requiredFields;
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
                let control = <FormArray>this.newChecklistForm.controls.requiredFields;
                control.removeAt(index);
                control.patchValue(control.value);
            },
            reject: () => {
                return;
            }
        });
    }

    toggleDocumentConditions(checked) {
        if (checked) {
            let array = <FormArray>this.dialogForm.get('conditions');
            array.push(
                this.fb.group({
                    conditionName: new FormControl('', Validators.required),
                    conditionOption: new FormControl({ value: '', disabled: true }, [Validators.required, this.checkDuplicateDocumentCondition.bind(this)])
                })
            );

            return;
        }

        this.dialogForm.setControl('conditions', new FormArray([]));
    }

    showDialog(docType: string) {
        this.dialogForm.patchValue({
            hasConditions: false,
            documentName: '',
            documentType: '',
            agmtCode: '',
            signature: false,
            canWaiver: false,
            remarks: ''
        });
        this.dialogForm.setControl('conditions', new FormArray([]));

        this.retrieveDocumentConditions();

        if (this.dropdownData.conditions.length > 0) {
            this.dialogForm.get('hasConditions').enable();
        }

        this.blocked = true;

        docType === 'mandatory' ? this.mDisplay = true : this.oDisplay = true;
    }

    retrieveDocumentConditions() {
        let conditions: SelectItem[] = [];
        for (let i = 0; i < this.newChecklistForm.get('conditions')['length']; i++) {
            if (this.newChecklistForm.get('conditions').get(i + '').get('conditionName').value !== '') {
                conditions.push({
                    'label': this.newChecklistForm.get('conditions').get(i + '').get('conditionName').value,
                    'value': this.newChecklistForm.get('conditions').get(i + '').get('conditionName').value
                });
            }
        }
        this.dropdownData['conditions'] = conditions;
    }

    onDocumentConditionNameSelect(conditionName: string, index: number) {
        let conditionOptions: SelectItem[] = [];
        for (let i = 0; i < this.newChecklistForm.get('conditions')['length']; i++) {
            if (conditionName === this.newChecklistForm.get('conditions').get(i + '').get('conditionName').value) {
                let options = this.newChecklistForm.get('conditions').get(i + '').get('conditionOptions').value;
                options.forEach(option => {
                    conditionOptions.push({
                        'label': option.trim(),
                        'value': option.trim()
                    });
                });
            }
        }

        let lastPos = this.dialogForm.get('conditions')['length'] - 1;
        this.dialogForm.get('conditions').get(lastPos + '').get('conditionOption').enable();
        this.dropdownData['conditionOptions'][index] = conditionOptions;
    }

    reloadDocumentConditionOptions(docType: string, index: number) {
        let form = this.complianceDocumentsForm;

        if (this.activeTab === 1) {
            form = this.legalDocumentsForm;
        }

        for (let i = 0; i < form.get(docType).get(index + '').get('conditions')['length']; i++) {
            let control = form.get(docType).get(index + '').get('conditions').get(i + '');
            this.onDocumentConditionNameSelect(control.get('conditionName').value, i);
        }
    }

    addNewDocumentCondition() {
        let i = (+this.dialogForm.get('conditions')['length'] - 1) + '';

        this.dialogForm.get('conditions').get(i).get('conditionName').markAsDirty();
        this.dialogForm.get('conditions').get(i).get('conditionOption').markAsDirty();

        if (this.dialogForm.get('conditions').get(i).get('conditionName').invalid ||
            this.dialogForm.get('conditions').get(i).get('conditionOption').invalid) {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: 'Please fill in the condition name and options using the dropdown menu before adding another condition'
            });
            return;
        }

        let control = <FormArray>this.dialogForm.get('conditions');
        control.push(
            this.fb.group({
                conditionName: new FormControl('', Validators.required),
                conditionOption: new FormControl({ value: '', disabled: true }, [Validators.required, this.checkDuplicateDocumentCondition.bind(this)])
            })
        );
    }

    deleteDocumentCondition(index) {
        this.confirmationService.confirm({
            message: 'Do you want to delete this condition?',
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                let control = <FormArray>this.dialogForm.get('conditions');
                control.removeAt(index);
            },
            reject: () => {
                return;
            }
        });
    }

    addNewDocument(docType: string) {
        let i = (+this.dialogForm.get('conditions')['length'] - 1) + '';

        if (+i > 0 && this.dialogForm.get('conditions').get(i).get('conditionName').value === ''
            && this.dialogForm.get('conditions').get(i).get('conditionOption').value === '') {
            let control = <FormArray>this.dialogForm.get('conditions');
            control.removeAt(+i);
            i = +i - 1 + '';

            this.dialogForm.get('conditions').get(i).get('conditionName').markAsDirty();
            this.dialogForm.get('conditions').get(i).get('conditionOption').markAsDirty();
        }

        this.dialogForm.get('documentName').markAsDirty();
        this.dialogForm.get('documentType').markAsDirty();
        this.dialogForm.get('agmtCode').markAsDirty();

        if ((+i > 0 && (this.dialogForm.get('conditions').get(i).get('conditionName').invalid ||
            this.dialogForm.get('conditions').get(i).get('conditionOption').invalid)) ||
            this.dialogForm.get('documentName').invalid ||
            this.dialogForm.get('documentType').invalid ||
            this.dialogForm.get('agmtCode').invalid) {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: 'Please correct the invalid fields highlighted'
            });
            return;
        }

        let control = <FormArray>this.complianceDocumentsForm.get(docType);

        if (this.activeTab === 1) {
            control = <FormArray>this.legalDocumentsForm.get(docType);
        }

        let rawForm = this.dialogForm.getRawValue();

        if (this.editMode) {
            (<FormGroup>control.get(this.docIndex + '')).setControl('conditions', new FormArray([]));
            let conditions = <FormArray>control.get(this.docIndex + '').get('conditions');

            rawForm.conditions.forEach(condition => {
                conditions.push(
                    this.fb.group({
                        conditionName: new FormControl(condition.conditionName),
                        conditionOption: new FormControl(condition.conditionOption)
                    })
                );
            });

            this.checkConditionInUse();

            control.get(this.docIndex + '').get('hasConditions').setValue(rawForm.hasConditions);
            control.get(this.docIndex + '').get('documentName').setValue(rawForm.documentName);
            control.get(this.docIndex + '').get('documentType').setValue(rawForm.documentType);
            control.get(this.docIndex + '').get('agmtCode').setValue(rawForm.agmtCode);
            control.get(this.docIndex + '').get('signature').setValue(rawForm.signature);
            control.get(this.docIndex + '').get('canWaiver').setValue(rawForm.canWaiver);
            control.get(this.docIndex + '').get('remarks').setValue(rawForm.remarks);

            this.editMode = false;
            this.blocked = false;
            this.mEditDisplay = false;
            this.oEditDisplay = false;

            this.dialogForm.patchValue({
                hasConditions: false,
                documentName: '',
                documentType: '',
                agmtCode: '',
                signature: false,
                canWaiver: false,
                remarks: ''
            });

            this.dialogForm.setControl('conditions', new FormArray([]));
            this.dialogForm.reset();
            return;
        }

        control.push(
            this.fb.group({
                hasConditions: new FormControl(rawForm.hasConditions),
                conditions: new FormArray([]),
                documentName: new FormControl(rawForm.documentName),
                documentType: new FormControl(rawForm.documentType),
                agmtCode: new FormControl(rawForm.agmtCode),
                signature: new FormControl(rawForm.signature),
                canWaiver: new FormControl(rawForm.canWaiver),
                remarks: new FormControl(rawForm.remarks)
            })
        );
        
        let array = <FormArray>control.get(control.controls['length'] - 1 + '').get('conditions');

        rawForm.conditions.forEach(condition => {
            array.push(
                this.fb.group({
                    conditionName: new FormControl(condition.conditionName),
                    conditionOption: new FormControl(condition.conditionOption)
                })
            );
        });

        this.checkConditionInUse();

        this.dropdownData.conditionOptions = [];
        this.blocked = false;
        this.mDisplay = false;
        this.oDisplay = false;

        this.dialogForm.patchValue({
            hasConditions: false,
            documentName: '',
            documentType: '',
            agmtCode: '',
            signature: false,
            canWaiver: false,
            remarks: ''
        });
        this.dialogForm.setControl('conditions', new FormArray([]));
        this.dialogForm.reset();
    }

    cancelAddNewDocument() {
        this.editMode = false;
        this.dropdownData.conditionOptions = [];
        this.mDisplay = false;
        this.oDisplay = false;
        this.mEditDisplay = false;
        this.oEditDisplay = false;
        this.blocked = false;

        this.dialogForm.patchValue({
            hasConditions: false,
            documentName: '',
            documentType: '',
            agmtCode: '',
            signature: false,
            canWaiver: false,
            remarks: ''
        });

        this.dialogForm.setControl('conditions', new FormArray([]));
        this.dialogForm.reset();
    }

    editDocument(docType: string, index: number) {
        let form = this.complianceDocumentsForm;

        if (this.activeTab === 1) {
            form = this.legalDocumentsForm;
        }

        let rawForm = form.getRawValue();

        this.dialogForm.patchValue({
            hasConditions: rawForm[docType][index].hasConditions,
            documentName: rawForm[docType][index].documentName,
            documentType: rawForm[docType][index].documentType,
            agmtCode: rawForm[docType][index].agmtCode,
            signature: rawForm[docType][index].signature,
            canWaiver: rawForm[docType][index].canWaiver,
            remarks: rawForm[docType][index].remarks
        });
        this.dialogForm.setControl('conditions', new FormArray([]));

        rawForm[docType][index].conditions.forEach(condition => {
            let arr = <FormArray>this.dialogForm.get('conditions');
            arr.push(
                this.fb.group({
                    conditionName: new FormControl(condition.conditionName, Validators.required),
                    conditionOption: new FormControl(condition.conditionOption, [Validators.required, this.checkDuplicateDocumentCondition.bind(this)])
                })
            );
        });

        this.retrieveDocumentConditions();
        this.reloadDocumentConditionOptions(docType, index);

        if (this.dropdownData.conditions.length > 0) {
            this.dialogForm.get('hasConditions').enable();
        } else {
            this.dialogForm.get('hasConditions').disable();
        }

        this.currentAgmtCode = form.get(docType).get(index + '').get('agmtCode').value;
        this.docIndex = index;
        this.editMode = true;
        this.blocked = true;

        docType === 'mandatory' ? this.mEditDisplay = true : this.oEditDisplay = true;
    }

    deleteDocument(docType: string, index: number) {
        this.confirmationService.confirm({
            message: 'Do you want to delete this ' + docType + ' document?',
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                let form = this.complianceDocumentsForm;

                if (this.activeTab === 1) {
                    form = this.legalDocumentsForm;
                }

                let control = <FormArray>form.get(docType);
                control.removeAt(index);

                this.checkConditionInUse();
            },
            reject: () => {
                return;
            }
        });
    }

    changeTab(event) {
        this.activeTab = event.index;
    }

    createChecklist() {
        this.processing = true;

        this.newChecklistForm.get('checklistName').markAsDirty();

        for (let control of this.newChecklistForm.get('conditions')['controls']) {
            control.get('conditionName').markAsDirty();
            control.get('conditionOptions').markAsDirty();
        }

        if (this.newChecklistForm.controls.checklistName.invalid) {
            document.getElementById('checklistName').scrollIntoView();
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: 'Please enter/correct the checklist name'
            });
            this.processing = false;
            return;
        }

        let i = (+this.newChecklistForm.get('conditions')['length'] - 1) + '';

        if (this.newChecklistForm.get('conditions').get(i).get('conditionName').invalid ||
            this.newChecklistForm.get('conditions').get(i).get('conditionOptions').invalid) {
            document.getElementById('conditions').scrollIntoView();
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: 'Please correct the invalid fields highlighted'
            });
            this.processing = false;
            return;
        }

        this.checklist = {};

        // Checklist Name
        this.checklist['name'] = this.newChecklistForm.get('checklistName').value;

        // Checklist Required Fields
        this.checklist['requiredFields'] = [];

        for (let i = 0; i < this.newChecklistForm.get('requiredFields')['length']; i++) {
            if (!(this.newChecklistForm.get('requiredFields')['length'] - 1 === i
                && this.newChecklistForm.get('requiredFields').get(i + '').get('fieldName').value === '')) {
                this.checklist['requiredFields'].push(this.newChecklistForm.get('requiredFields').get(i + '').get('fieldName').value);
            }
        }

        // Checklist Conditions
        this.checklist['conditions'] = {};

        for (let i = 0; i < this.newChecklistForm.get('conditions')['length']; i++) {
            if (!(this.newChecklistForm.get('conditions')['length'] - 1 === i
                && (this.newChecklistForm.get('conditions').get(i + '').get('conditionName').value === ''
                    || this.newChecklistForm.get('conditions').get(i + '').get('conditionOptions').value === ''))) {
                let conditionName = this.newChecklistForm.get('conditions').get(i + '').get('conditionName').value;
                let conditionOptionsArr = this.newChecklistForm.get('conditions').get(i + '').get('conditionOptions').value;
                this.checklist['conditions'][conditionName] = [];
                conditionOptionsArr.forEach(option => {
                    this.checklist['conditions'][conditionName].push(option.trim());
                });
            }
        }

        // Documents
        this.checklist['complianceDocuments'] = this.complianceDocumentsForm.getRawValue();
        this.checklist['legalDocuments'] = this.legalDocumentsForm.getRawValue();

        this.cmService.createCMChecklist(this.checklist).subscribe(res => {
            if (res.error) {
                this.msgs.push({
                    severity: 'error', summary: 'Error', detail: res.error
                });
                this.processing = false;
                return;
            }

            this.msgs.push({
                severity: 'success', summary: 'Success', detail: 'Checklist created <br> You will be redirected shortly'
            });

            setTimeout(() => {
                this.router.navigate(['/cm/checklist/manage']);
            }, 3000);
        }, error => {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: error
            });
            this.processing = false;
            return;
        });
    }
}