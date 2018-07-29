import { Component, OnInit } from '@angular/core';
import { Message, SelectItem } from 'primeng/components/common/api';
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
    mDisplay: boolean = false;
    cDisplay: boolean = false;
    oDisplay: boolean = false;

    // UI Component
    newChecklistForm: FormGroup;
    documentsForm: FormGroup;
    documentName = "";
    agmtCode = "";
    signature = true;
    remarks = "";
    checklist: any;
    conditions: SelectItem[];
    conditionOptions: SelectItem[];

    constructor(
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.loading = true;

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

        this.documentsForm = this.fb.group({
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
                severity: 'error', summary: 'Error', detail: 'Please fill in the condition name options before adding another condition'
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
        let control = <FormArray>this.documentsForm.get('mandatory');
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
        let i = (+this.documentsForm.get('mandatory').get('length') - 1) + '';

        this.documentsForm.get('mandatory').get(i).get('documentName').markAsDirty();
        this.documentsForm.get('mandatory').get(i).get('agmtCode').markAsDirty();
        this.documentsForm.get('mandatory').get(i).get('signature').markAsDirty();
        this.documentsForm.get('mandatory').get(i).get('canWaiver').markAsDirty();
        this.documentsForm.get('mandatory').get(i).get('remarks').markAsDirty();

        if (this.documentsForm.get('mandatory').get(i).get('documentName').invalid ||
            this.documentsForm.get('mandatory').get(i).get('agmtCode').invalid ||
            this.documentsForm.get('mandatory').get(i).get('signature').invalid ||
            this.documentsForm.get('mandatory').get(i).get('canWaiver').invalid ||
            this.documentsForm.get('mandatory').get(i).get('remarks').invalid) {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: 'Please correct the invalid fields highlighted'
            });
            return;
        }

        this.mDisplay = false;
    }

    cancelAddNewMandatory() {
        let i = +this.documentsForm.get('mandatory').get('length') - 1;
        let control = <FormArray>this.documentsForm.get('mandatory');
        control.removeAt(i);

        this.mDisplay = false;
    }

    showCDialog() {
        let control = <FormArray>this.documentsForm.get('conditional');
        control.push(
            this.fb.group({
                conditions: new FormArray([]),
                documentName: new FormControl('', Validators.required),
                agmtCode: new FormControl('', Validators.required),
                signature: new FormControl(true),
                canWaiver: new FormControl(false),
                remarks: new FormControl('')
            })
        );
        this.addNewConditionalCondition();
        this.retrieveConditionalOptions();
        this.cDisplay = true;
    }

    retrieveConditionalOptions() {
        let i: number;
        this.conditions = [];
        this.conditionOptions = [];
        for (i = 0; i < this.newChecklistForm.get('conditions')['length']; i++) {
            this.conditions.push({
                "label": this.newChecklistForm.get('conditions').get(i + "").get('conditionName').value,
                "value": this.newChecklistForm.get('conditions').get(i + "").get('conditionName').value
            });

            let options = this.newChecklistForm.get('conditions').get(i + "").get('conditionOptions').value.split(',');
            options.forEach(option => {
                this.conditionOptions.push({
                    "label": option.trim(),
                    "value": option.trim()
                });
            });
        }
    }

    addNewConditionalCondition() {
        let i = (+this.documentsForm.get('conditional').get('length') - 1) + "";
        let control = <FormArray>this.documentsForm.get('conditional').get(i).get('conditions');
        control.push(
            this.fb.group({
                conditionName: new FormControl('', Validators.required),
                conditionOption: new FormControl('', Validators.required)
            })
        );
    }

    deleteConditionalCondition(index) {
        let i = (+this.documentsForm.get('conditional').get('length') - 1) + "";
        let control = <FormArray>this.documentsForm.get('conditional').get(i).get('conditions');
        control.removeAt(index);
    }

    addNewConditional() {
        let i = (+this.documentsForm.get('conditional').get('length') - 1) + '';
        console.log(this.documentsForm);
        this.documentsForm.get('conditional').get(i).get('documentName').markAsDirty();
        this.documentsForm.get('conditional').get(i).get('agmtCode').markAsDirty();
        this.documentsForm.get('conditional').get(i).get('signature').markAsDirty();
        this.documentsForm.get('conditional').get(i).get('canWaiver').markAsDirty();
        this.documentsForm.get('conditional').get(i).get('remarks').markAsDirty();

        if (this.documentsForm.get('conditional').get(i).get('documentName').invalid ||
            this.documentsForm.get('conditional').get(i).get('agmtCode').invalid ||
            this.documentsForm.get('conditional').get(i).get('signature').invalid ||
            this.documentsForm.get('conditional').get(i).get('canWaiver').invalid ||
            this.documentsForm.get('conditional').get(i).get('remarks').invalid) {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: 'Please correct the invalid fields highlighted'
            });
            return;
        }

        this.cDisplay = false;
    }

    cancelAddNewConditional() {
        let i = +this.documentsForm.get('conditional').get('length') - 1;
        let control = <FormArray>this.documentsForm.get('conditional');
        control.removeAt(i);

        this.cDisplay = false;
    }

    showODialog() {
        let control = <FormArray>this.documentsForm.get('optional');
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
        let i = (+this.documentsForm.get('optional').get('length') - 1) + '';

        this.documentsForm.get('optional').get(i).get('documentName').markAsDirty();
        this.documentsForm.get('optional').get(i).get('agmtCode').markAsDirty();
        this.documentsForm.get('optional').get(i).get('signature').markAsDirty();
        this.documentsForm.get('optional').get(i).get('canWaiver').markAsDirty();
        this.documentsForm.get('optional').get(i).get('remarks').markAsDirty();

        if (this.documentsForm.get('optional').get(i).get('documentName').invalid ||
            this.documentsForm.get('optional').get(i).get('agmtCode').invalid ||
            this.documentsForm.get('optional').get(i).get('signature').invalid ||
            this.documentsForm.get('optional').get(i).get('canWaiver').invalid ||
            this.documentsForm.get('optional').get(i).get('remarks').invalid) {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: 'Please correct the invalid fields highlighted'
            });
            return;
        }

        this.oDisplay = false;
    }

    cancelAddNewOptional() {
        let i = +this.documentsForm.get('optional').get('length') - 1;
        let control = <FormArray>this.documentsForm.get('optional');
        control.removeAt(i);

        this.oDisplay = false;
    }

    saveConditions() {
        this.checklist['name'] = this.newChecklistForm.controls.checklistName.value;
        // this.checklist['conditions'] = 
    }
}
