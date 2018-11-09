import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ConfirmationService } from 'primeng/components/common/confirmationservice';
import { SelectItem, MessageService } from 'primeng/components/common/api';

import { CMService } from '../../../../core/services/cm.service';
import { fakeAsync } from '@angular/core/testing';
import { Observable, Observer } from 'rxjs';

@Component({
    selector: 'cm-edit-checklist',
    templateUrl: './cm-edit-checklist.component.html',
    styleUrls: ['./cm-edit-checklist.component.css']
})

export class CMEditChecklistComponent implements OnInit {

    // UI Control
    loading = false;
    processing = false;
    blocked = false;
    activeTab: number;
    complianceCols: any[];
    legalCols: any[];
    docIndex: number;
    currentAgmtCode: number;
    editMode = false;
    mDisplay = false;
    mEditDisplay = false;
    cInfoDisplay = false;
    oDisplay = false;
    oEditDisplay = false;
    isSubmitted = false;
    isDirty = false;

    // UI Component
    clName: string;
    dropdownData = {
        conditions: [],
        conditionOptions: []
    };
    documentTypeData: SelectItem[];
    currentChecklistForm: FormGroup;
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
        private messageService: MessageService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.clName = params['name'];
        });

        this.route.snapshot.data['urls'] = [
            { title: 'Checklists' },
            { title: 'Edit', url: '/cm/checklist/manage' },
            { title: this.clName }
        ];

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

        this.retrieveChecklistDetails(this.route.snapshot.paramMap.get('id'));

        this.retrieveChecklistNames();

        this.retrieveAgmtCodes();
    }

    createForm() {
        this.currentChecklistForm = this.fb.group({
            checklistName: new FormControl('', [Validators.required, this.checklistNameExists.bind(this)]),
            requiredFields: this.fb.array([]),
            conditions: this.fb.array([])
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
            remarks: new FormControl(''),
            docID: new FormControl(''),
            changed: new FormControl('2')
        });

        this.loading = false;
    }

    @HostListener('window:beforeunload')
    canDeactivate(): Promise<boolean> | boolean {
        if (this.isSubmitted) return true;
        if (!this.currentChecklistForm.dirty && !this.isDirty) {
            return true;
        }
        return confirm('Are you sure you want to continue? Any unsaved changes will be lost.');
    }

    // Get Num Docs
    get numMandatoryDocs(): number {
        let formArray = <FormArray>this.complianceDocumentsForm.get('mandatory');

        if (this.activeTab === 1) {
            formArray = <FormArray>this.legalDocumentsForm.get('mandatory');
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

    // Validator Functions
    retrieveAgmtCodes() {
        this.cmService.retrieveAgmtCodes().subscribe(res => {
            if (res.error) {
                this.messageService.add({
                    key: 'msgs', severity: 'error', summary: 'Error', detail: res.error
                });
            }

            if (res.results) {
                this.agmtDocMappings = [];
                Object.keys(res.results).forEach(agmtCode => {
                    this.agmtDocMappings[agmtCode] = res.results[agmtCode];
                });
            }
        }, error => {
            this.messageService.add({
                key: 'msgs', severity: 'error', summary: 'Server Error', detail: error
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
                if (cl.name !== this.clName) {
                    this.checklistNames.push(cl.name);
                }
            });
        }, error => {
            this.messageService.add({
                key: 'msgs', severity: 'error', summary: 'Server Error', detail: error
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

    retrieveChecklistDetails(checklistId) {
        this.loading = true;
        this.cmService.retrieveCMChecklistDetails(checklistId).subscribe(res => {
            if (res.error) {
                this.messageService.add({
                    key: 'msgs', severity: 'error', summary: 'Error', detail: res.error
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

            this.retrieveDocumentConditions()

            // Update Compliance Documents
            Object.keys(res.complianceDocuments['mandatory']).forEach(mandatoryDoc => {
                let conditionsArr = [];
                res.complianceDocuments['mandatory'][mandatoryDoc]['conditions'].forEach(condition => {
                    conditionsArr.push(
                        this.fb.group({
                            conditionName: new FormControl(condition.conditionName),
                            conditionOption: new FormControl(condition.conditionOption)
                        })
                    );
                });

                let complianceMandatoryArr = <FormArray>this.complianceDocumentsForm.controls.mandatory;
                complianceMandatoryArr.push(
                    this.fb.group({
                        hasConditions: new FormControl(res.complianceDocuments['mandatory'][mandatoryDoc]['hasConditions']),
                        conditions: new FormArray(conditionsArr),
                        documentName: new FormControl(res.complianceDocuments['mandatory'][mandatoryDoc]['documentName']),
                        documentType: new FormControl(res.complianceDocuments['mandatory'][mandatoryDoc]['documentType']),
                        agmtCode: new FormControl(res.complianceDocuments['mandatory'][mandatoryDoc]['agmtCode']),
                        signature: new FormControl(res.complianceDocuments['mandatory'][mandatoryDoc]['signature']),
                        canWaiver: new FormControl(res.complianceDocuments['mandatory'][mandatoryDoc]['canWaiver']),
                        remarks: new FormControl(res.complianceDocuments['mandatory'][mandatoryDoc]['remarks']),
                        docID: new FormControl(res.complianceDocuments['mandatory'][mandatoryDoc]['docID']),
                        changed: new FormControl(res.complianceDocuments['mandatory'][mandatoryDoc]['changed'])
                    })
                );
            });

            Object.keys(res.complianceDocuments['optional']).forEach(optionalDoc => {
                let conditionsArr = [];
                res.complianceDocuments['optional'][optionalDoc]['conditions'].forEach(condition => {
                    conditionsArr.push(
                        this.fb.group({
                            conditionName: new FormControl(condition.conditionName),
                            conditionOption: new FormControl(condition.conditionOption)
                        })
                    );
                });

                let complianceOptionalArr = <FormArray>this.complianceDocumentsForm.controls.optional;
                complianceOptionalArr.push(
                    this.fb.group({
                        hasConditions: new FormControl(res.complianceDocuments['optional'][optionalDoc]['hasConditions']),
                        conditions: new FormArray(conditionsArr),
                        documentName: new FormControl(res.complianceDocuments['optional'][optionalDoc]['documentName']),
                        documentType: new FormControl(res.complianceDocuments['optional'][optionalDoc]['documentType']),
                        agmtCode: new FormControl(res.complianceDocuments['optional'][optionalDoc]['agmtCode']),
                        signature: new FormControl(res.complianceDocuments['optional'][optionalDoc]['signature']),
                        canWaiver: new FormControl(res.legalDocuments['optional'][optionalDoc]['canWaiver']),
                        remarks: new FormControl(res.complianceDocuments['optional'][optionalDoc]['remarks']),
                        docID: new FormControl(res.complianceDocuments['optional'][optionalDoc]['docID']),
                        changed: new FormControl(res.complianceDocuments['optional'][optionalDoc]['changed'])
                    })
                );
            });


            // Update Legal Documents
            Object.keys(res.legalDocuments['mandatory']).forEach(mandatoryDoc => {
                let conditionsArr = [];
                res.legalDocuments['mandatory'][mandatoryDoc]['conditions'].forEach(condition => {
                    conditionsArr.push(
                        this.fb.group({
                            conditionName: new FormControl(condition.conditionName),
                            conditionOption: new FormControl(condition.conditionOption)
                        })
                    );
                });

                let legalMandatoryArr = <FormArray>this.legalDocumentsForm.controls.mandatory;
                legalMandatoryArr.push(
                    this.fb.group({
                        hasConditions: new FormControl(res.legalDocuments['mandatory'][mandatoryDoc]['hasConditions']),
                        conditions: new FormArray(conditionsArr),
                        documentName: new FormControl(res.legalDocuments['mandatory'][mandatoryDoc]['documentName']),
                        documentType: new FormControl(res.legalDocuments['mandatory'][mandatoryDoc]['documentType']),
                        agmtCode: new FormControl(res.legalDocuments['mandatory'][mandatoryDoc]['agmtCode']),
                        signature: new FormControl(res.legalDocuments['mandatory'][mandatoryDoc]['signature']),
                        canWaiver: new FormControl(res.legalDocuments['mandatory'][mandatoryDoc]['canWaiver']),
                        remarks: new FormControl(res.legalDocuments['mandatory'][mandatoryDoc]['remarks']),
                        docID: new FormControl(res.legalDocuments['mandatory'][mandatoryDoc]['docID']),
                        changed: new FormControl(res.legalDocuments['mandatory'][mandatoryDoc]['changed'])
                    })
                );
            });

            Object.keys(res.legalDocuments['optional']).forEach(optionalDoc => {
                let conditionsArr = [];
                res.legalDocuments['optional'][optionalDoc]['conditions'].forEach(condition => {
                    conditionsArr.push(
                        this.fb.group({
                            conditionName: new FormControl(condition.conditionName),
                            conditionOption: new FormControl(condition.conditionOption)
                        })
                    );
                });

                let legalOptionalArr = <FormArray>this.legalDocumentsForm.controls.optional;
                legalOptionalArr.push(
                    this.fb.group({
                        hasConditions: new FormControl(res.legalDocuments['optional'][optionalDoc]['hasConditions']),
                        conditions: new FormArray(conditionsArr),
                        documentName: new FormControl(res.legalDocuments['optional'][optionalDoc]['documentName']),
                        documentType: new FormControl(res.legalDocuments['optional'][optionalDoc]['documentType']),
                        agmtCode: new FormControl(res.legalDocuments['optional'][optionalDoc]['agmtCode']),
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
            this.messageService.add({
                key: 'msgs', severity: 'error', summary: 'Error', detail: error
            });
        });
    }

    addNewCondition() {
        let i = (+this.currentChecklistForm.get('conditions')['length'] - 1) + '';

        this.currentChecklistForm.get('conditions').get(i).get('conditionName').markAsDirty();
        this.currentChecklistForm.get('conditions').get(i).get('conditionOptions').markAsDirty();

        if (this.currentChecklistForm.get('conditions').get(i).get('conditionName').invalid ||
            this.currentChecklistForm.get('conditions').get(i).get('conditionOptions').invalid) {
            this.messageService.add({
                key: 'msgs', severity: 'error', summary: 'Error', detail: 'Please correct the condition name and options highlighted before adding another condition'
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
            this.messageService.add({
                key: 'msgs', severity: 'error', summary: 'Error', detail: 'Please fill in the field name before adding another field'
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
            remarks: '',
            docID: '',
            changed: '2'
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

    onDocumentConditionNameSelect(conditionName: string, index: number) {
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
            this.messageService.add({
                key: 'msgs', severity: 'error', summary: 'Error', detail: 'Please fill in the condition name and options using the dropdown menu before adding another condition'
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

        this.dialogForm.get('changed').setValue('1');
    }

    deleteDocumentCondition(index) {
        this.confirmationService.confirm({
            message: 'Do you want to delete this condition?',
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                let control = <FormArray>this.dialogForm.get('conditions');
                control.removeAt(index);
                this.dialogForm.get('changed').setValue('3');
            },
            reject: () => {
                return;
            }
        });
    }

    addNewDocument(docType: string) {
        let i = (+this.dialogForm.get('conditions')['length'] - 1) + '';

        if (this.dialogForm.get('hasConditions').value &&
            this.dialogForm.get('conditions').get(i).get('conditionName').value === ''
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

        if ((this.dialogForm.get('hasConditions').value
            && this.dialogForm.get('conditions').get('0').get('conditionName').value !== ''
            && this.dialogForm.get('conditions').get('0').get('conditionOption').value === '') ||
            (+i > 0 && (this.dialogForm.get('conditions').get(i).get('conditionName').invalid ||
                this.dialogForm.get('conditions').get(i).get('conditionOption').invalid)) ||
            this.dialogForm.get('documentName').invalid ||
            this.dialogForm.get('documentType').invalid ||
            this.dialogForm.get('agmtCode').invalid) {
            this.messageService.add({
                key: 'msgs', severity: 'error', summary: 'Error', detail: 'Please correct the invalid fields highlighted'
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

            if (control.get(this.docIndex + '').get('changed').value !== '2') {
                if (control.get(this.docIndex + '').get('hasConditions').value !== rawForm.hasConditions) {
                    control.get(this.docIndex + '').get('hasConditions').setValue(rawForm.hasConditions);
                    control.get(this.docIndex + '').get('changed').setValue('1');
                }

                if (control.get(this.docIndex + '').get('documentName').value !== rawForm.documentName) {
                    control.get(this.docIndex + '').get('documentName').setValue(rawForm.documentName);
                    control.get(this.docIndex + '').get('changed').setValue('1');
                }

                if (control.get(this.docIndex + '').get('documentType').value !== rawForm.documentType) {
                    control.get(this.docIndex + '').get('documentType').setValue(rawForm.documentType);
                    control.get(this.docIndex + '').get('changed').setValue('1');
                }

                if (control.get(this.docIndex + '').get('agmtCode').value !== rawForm.agmtCode) {
                    control.get(this.docIndex + '').get('agmtCode').setValue(rawForm.agmtCode);
                    control.get(this.docIndex + '').get('changed').setValue('1');
                }

                if (control.get(this.docIndex + '').get('signature').value !== rawForm.signature) {
                    control.get(this.docIndex + '').get('signature').setValue(rawForm.signature);
                    control.get(this.docIndex + '').get('changed').setValue('1');
                }

                if (control.get(this.docIndex + '').get('canWaiver').value !== rawForm.canWaiver) {
                    control.get(this.docIndex + '').get('canWaiver').setValue(rawForm.canWaiver);
                    control.get(this.docIndex + '').get('changed').setValue('1');
                }

                if (control.get(this.docIndex + '').get('remarks').value !== rawForm.remarks) {
                    control.get(this.docIndex + '').get('remarks').setValue(rawForm.remarks);
                    control.get(this.docIndex + '').get('changed').setValue('1');
                }
            }

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
                remarks: '',
                docID: '',
                changed: '2'
            });

            this.dialogForm.setControl('conditions', new FormArray([]));
            this.dialogForm.reset();
            this.isDirty = true;
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
                remarks: new FormControl(rawForm.remarks),
                docID: new FormControl(rawForm.docID),
                changed: new FormControl(rawForm.changed)
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
            remarks: '',
            docID: '',
            changed: '2'
        });
        this.dialogForm.setControl('conditions', new FormArray([]));
        this.dialogForm.reset();
        this.isDirty = true;
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
            remarks: '',
            docID: '',
            changed: '2'
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
            remarks: rawForm[docType][index].remarks,
            docID: rawForm[docType][index].docID,
            changed: rawForm[docType][index].changed
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
                control.get(index + '').get('changed').setValue('3');

                this.checkConditionInUse();
                this.isDirty = true;
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
            this.messageService.add({
                key: 'msgs', severity: 'error', summary: 'Error', detail: 'Please enter/correct the checklist name'
            });
            this.processing = false;
            return;
        }

        let i = (+this.currentChecklistForm.get('conditions')['length'] - 1) + '';

        if (this.currentChecklistForm.get('conditions').get(i).get('conditionName').invalid ||
            this.currentChecklistForm.get('conditions').get(i).get('conditionOptions').invalid) {
            document.getElementById('conditions').scrollIntoView();
            this.messageService.add({
                key: 'msgs', severity: 'error', summary: 'Error', detail: 'Please correct the invalid fields highlighted'
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

        // Documents
        this.checklist['complianceDocuments'] = this.complianceDocumentsForm.getRawValue();
        this.checklist['legalDocuments'] = this.legalDocumentsForm.getRawValue();


        this.cmService.updateCMChecklist(this.route.snapshot.paramMap.get('id'), this.checklist).subscribe(res => {
            if (res.error) {
                this.messageService.add({
                    key: 'msgs', severity: 'error', summary: 'Error', detail: res.error
                });
                this.processing = false;
                return;
            }

            if (res.results) {
                this.isSubmitted = true;

                this.messageService.add({
                    key: 'msgs', severity: 'success', summary: 'Success', detail: 'Checklist updated. You will be redirected shortly'
                });

                setTimeout(() => {
                    this.router.navigate(['/cm/checklist/manage']);
                }, 3000);
            }
        }, error => {
            this.messageService.add({
                key: 'msgs', severity: 'error', summary: 'Error', detail: error
            });
            this.processing = false;
            return;
        });
    }
}