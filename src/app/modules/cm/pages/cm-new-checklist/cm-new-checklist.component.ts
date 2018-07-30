import { Component, OnInit } from '@angular/core';
import { Message, SelectItem, MenuItem } from 'primeng/components/common/api';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

@Component({
    selector: 'cm-new-checklist',
    templateUrl: './cm-new-checklist.component.html',
    styleUrls: ['./cm-new-checklist.component.scss']
})

export class CMNewChecklistComponent implements OnInit {

    // UI Control
    loading = false;
    msgs: Message[] = [];
    tabs: MenuItem[] = [];
    activeTab = 'Compliance';
    conditions: SelectItem[];
    conditionOptions: SelectItem[];
    mDisplay: boolean = false;
    cDisplay: boolean = false;
    oDisplay: boolean = false;

    // UI Component
    newChecklistForm: FormGroup;
    complianceDocumentsForm: FormGroup;
    legalDocumentsForm: FormGroup;
    checklist: any;

    constructor(
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.loading = true;

        this.tabs = [
            {label: 'Compliance', icon: 'fa fa-fw fa-bar-chart', command: (event) => {
                this.activeTab = event['item']['label'];
            }},
            {label: 'Legal', icon: 'fa fa-fw fa-calendar', command: (event) => {
                this.activeTab = event['item']['label'];
            }}
        ];

        this.createForm();
    }

    createForm() {
        this.newChecklistForm = this.fb.group({
            checklistName: new FormControl('', [Validators.required]),
            requiredFields: this.fb.array([
                this.fb.group({
                    fieldName: new FormControl('', Validators.required),
                })
            ]),
            conditions: this.fb.array([
                this.fb.group({
                    conditionName: new FormControl('', Validators.required),
                    conditionOptions: new FormControl('', Validators.required)
                })
            ])
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

        this.loading = false;
    }

    addNewCondition() {
        let i = (+this.newChecklistForm.get('conditions')['length'] - 1) + '';

        this.newChecklistForm.get('conditions').get(i).get('conditionName').markAsDirty();
        this.newChecklistForm.get('conditions').get(i).get('conditionOptions').markAsDirty();

        if (this.newChecklistForm.get('conditions').get(i).get('conditionName').invalid ||
            this.newChecklistForm.get('conditions').get(i).get('conditionOptions').invalid) {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: 'Please fill in the condition name and options before adding another condition'
            });
            return;
        }

        let control = <FormArray>this.newChecklistForm.controls.conditions;
        control.push(
            this.fb.group({
                conditionName: new FormControl('', Validators.required),
                conditionOptions: new FormControl('', Validators.required)
            })
        );
    }

    deleteCondition(index) {
        let control = <FormArray>this.newChecklistForm.controls.conditions;
        control.removeAt(index);
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
                fieldName: new FormControl('', Validators.required)
            })
        );
    }

    deleteField(index) {
        let control = <FormArray>this.newChecklistForm.controls.requiredFields;
        control.removeAt(index);
    }

    showMDialog() {
        let control = <FormArray>this.complianceDocumentsForm.get('mandatory');

        if (this.activeTab === 'Legal') {
            control = <FormArray>this.legalDocumentsForm.get('mandatory');
        }

        control.push(
            this.fb.group({
                documentName: new FormControl('', Validators.required),
                agmtCode: new FormControl('', Validators.required),
                signature: new FormControl(true),
                canWaiver: new FormControl(false),
                remarks: new FormControl('')
            })
        );
        this.mDisplay = true;
    }

    addNewMandatory() {
        let form = this.complianceDocumentsForm;
        
        if (this.activeTab === 'Legal') {
            form = this.legalDocumentsForm;
        }

        let i = (+form.get('mandatory')['length'] - 1) + '';

        form.get('mandatory').get(i).get('documentName').markAsDirty();
        form.get('mandatory').get(i).get('agmtCode').markAsDirty();

        if (form.get('mandatory').get(i).get('documentName').invalid ||
            form.get('mandatory').get(i).get('agmtCode').invalid) {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: 'Please correct the invalid fields highlighted'
            });
            return;
        }

        this.mDisplay = false;
    }

    cancelAddNewMandatory() {
        let form = this.complianceDocumentsForm;
        
        if (this.activeTab === 'Legal') {
            form = this.legalDocumentsForm;
        }

        let i = +form.get('mandatory')['length'] - 1;
        let control = <FormArray>form.get('mandatory');
        control.removeAt(i);

        this.mDisplay = false;
    }

    showCDialog() {
        if (this.newChecklistForm.get('conditions')['length'] === 1
            && (this.newChecklistForm.get('conditions').get('0').get('conditionName').value == ''
                || this.newChecklistForm.get('conditions').get('0').get('conditionOptions').value == '')) {
            this.newChecklistForm.get('conditions').get('0').get('conditionName').markAsDirty();
            this.newChecklistForm.get('conditions').get('0').get('conditionOptions').markAsDirty();
            document.getElementById('conditions').scrollIntoView();
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: 'Please add a condition and condition options before adding new conditional document'
            });
            return;
        }

        let form = this.complianceDocumentsForm;
        
        if (this.activeTab === 'Legal') {
            form = this.legalDocumentsForm;
        }

        let control = <FormArray>form.get('conditional');
        control.push(
            this.fb.group({
                conditions: new FormArray([
                    this.fb.group({
                        conditionName: new FormControl('', Validators.required),
                        conditionOption: new FormControl('', Validators.required)
                    })
                ]),
                documentName: new FormControl('', Validators.required),
                agmtCode: new FormControl('', Validators.required),
                signature: new FormControl(true),
                canWaiver: new FormControl(false),
                remarks: new FormControl('')
            })
        );

        this.retrieveConditionalConditions();

        this.cDisplay = true;
    }

    retrieveConditionalConditions() {
        let i: number;
        this.conditions = [];
        for (i = 0; i < this.newChecklistForm.get('conditions')['length']; i++) {
            if (this.newChecklistForm.get('conditions').get(i + '').get('conditionName').value !== '') {
                this.conditions.push({
                    'label': this.newChecklistForm.get('conditions').get(i + '').get('conditionName').value,
                    'value': this.newChecklistForm.get('conditions').get(i + '').get('conditionName').value
                });
            }
        }
    }

    onConditionNameSelect(conditionName: string) {
        let i: number;
        this.conditionOptions = [];
        for (i = 0; i < this.newChecklistForm.get('conditions')['length']; i++) {
            if (conditionName === this.newChecklistForm.get('conditions').get(i + '').get('conditionName').value) {
                let options = this.newChecklistForm.get('conditions').get(i + '').get('conditionOptions').value.split(',');
                options.forEach(option => {
                    this.conditionOptions.push({
                        'label': option.trim(),
                        'value': option.trim()
                    });
                });
            }
        }
    }

    addNewConditionalCondition() {
        let form = this.complianceDocumentsForm;
        
        if (this.activeTab === 'Legal') {
            form = this.legalDocumentsForm;
        }

        let i = (+form.get('conditional')['length'] - 1) + '';
        let j = (+form.get('conditional').get(i).get('conditions')['length'] - 1) + '';

        form.get('conditional').get(i).get('conditions').get(j).get('conditionName').markAsDirty();
        form.get('conditional').get(i).get('conditions').get(j).get('conditionOption').markAsDirty();

        if (form.get('conditional').get(i).get('conditions').get(j).get('conditionName').invalid ||
            form.get('conditional').get(i).get('conditions').get(j).get('conditionOption').invalid) {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: 'Please fill in the condition name and options using the dropdown menu before adding another condition'
            });
            return;
        }

        let control = <FormArray>form.get('conditional').get(i).get('conditions');
        control.push(
            this.fb.group({
                conditionName: new FormControl('', Validators.required),
                conditionOption: new FormControl('', Validators.required)
            })
        );
    }

    deleteConditionalCondition(index) {
        let form = this.complianceDocumentsForm;
        
        if (this.activeTab === 'Legal') {
            form = this.legalDocumentsForm;
        }

        let i = (+form.get('conditional')['length'] - 1) + '';
        let control = <FormArray>form.get('conditional').get(i).get('conditions');
        control.removeAt(index);
    }

    addNewConditional() {
        let form = this.complianceDocumentsForm;
        
        if (this.activeTab === 'Legal') {
            form = this.legalDocumentsForm;
        }

        let i = (+form.get('conditional')['length'] - 1) + '';
        let j = (+form.get('conditional').get(i).get('conditions')['length'] - 1) + '';

        form.get('conditional').get(i).get('conditions').get(j).get('conditionName').markAsDirty();
        form.get('conditional').get(i).get('conditions').get(j).get('conditionOption').markAsDirty();
        form.get('conditional').get(i).get('documentName').markAsDirty();
        form.get('conditional').get(i).get('agmtCode').markAsDirty();

        if (form.get('conditional').get(i).get('conditions').get(j).get('conditionName').invalid ||
            form.get('conditional').get(i).get('conditions').get(j).get('conditionOption').invalid ||
            form.get('conditional').get(i).get('documentName').invalid ||
            form.get('conditional').get(i).get('agmtCode').invalid) {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: 'Please correct the invalid fields highlighted'
            });
            return;
        }

        this.cDisplay = false;
    }

    cancelAddNewConditional() {
        let form = this.complianceDocumentsForm;
        
        if (this.activeTab === 'Legal') {
            form = this.legalDocumentsForm;
        }

        let i = +form.get('conditional')['length'] - 1;
        let control = <FormArray>form.get('conditional');
        control.removeAt(i);

        this.cDisplay = false;
    }

    showODialog() {
        let form = this.complianceDocumentsForm;
        
        if (this.activeTab === 'Legal') {
            form = this.legalDocumentsForm;
        }

        let control = <FormArray>form.get('optional');
        control.push(
            this.fb.group({
                documentName: new FormControl('', Validators.required),
                agmtCode: new FormControl('', Validators.required),
                signature: new FormControl(true),
                canWaiver: new FormControl(false),
                remarks: new FormControl('')
            })
        );
        this.oDisplay = true;
    }

    addNewOptional() {
        let form = this.complianceDocumentsForm;
        
        if (this.activeTab === 'Legal') {
            form = this.legalDocumentsForm;
        }

        let i = (+form.get('optional')['length'] - 1) + '';

        form.get('optional').get(i).get('documentName').markAsDirty();
        form.get('optional').get(i).get('agmtCode').markAsDirty();
        form.get('optional').get(i).get('signature').markAsDirty();

        if (form.get('optional').get(i).get('documentName').invalid ||
            form.get('optional').get(i).get('agmtCode').invalid) {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: 'Please correct the invalid fields highlighted'
            });
            return;
        }

        this.oDisplay = false;
    }

    cancelAddNewOptional() {
        let form = this.complianceDocumentsForm;
        
        if (this.activeTab === 'Legal') {
            form = this.legalDocumentsForm;
        }

        let i = +form.get('optional')['length'] - 1;
        let control = <FormArray>form.get('optional');
        control.removeAt(i);

        this.oDisplay = false;
    }

    createChecklist() {
        this.checklist = [];
        if (this.newChecklistForm.controls.checklistName.invalid) {
            document.getElementById('checklistName').scrollIntoView();
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: 'Please enter the checklist name'
            });
            return;
        }

        this.checklist['name'] = this.newChecklistForm.get('checklistName').value;
        this.checklist['requiredFields'] = [];

        for (let i = 0; i < this.newChecklistForm.get('requiredFields')['length']; i++) {
            if (!(this.newChecklistForm.get('requiredFields')['length'] - 1 === i
                && this.newChecklistForm.get('requiredFields').get(i + '').get('fieldName').value === '')) {
                this.checklist['requiredFields'].push(this.newChecklistForm.get('requiredFields').get(i + '').get('fieldName').value);
            }
        }

        this.checklist['conditions'] = [];

        for (let i = 0; i < this.newChecklistForm.get('conditions')['length']; i++) {
            if (!(this.newChecklistForm.get('conditions')['length'] - 1 === i
                && (this.newChecklistForm.get('conditions').get(i + '').get('conditionName').value === ''
                    || this.newChecklistForm.get('conditions').get(i + '').get('conditionOptions').value === ''))) {
                let conditionName = this.newChecklistForm.get('conditions').get(i + '').get('conditionName').value;
                let conditionOptionsArr = this.newChecklistForm.get('conditions').get(i + '').get('conditionOptions').value.split(',');
                this.checklist['conditions'][conditionName] = [];
                conditionOptionsArr.forEach(option => {
                    this.checklist['conditions'][conditionName].push(option.trim());
                });
            }
        }
    }
}