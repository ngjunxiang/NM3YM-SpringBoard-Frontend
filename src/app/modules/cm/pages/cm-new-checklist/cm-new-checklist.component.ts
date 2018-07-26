import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';
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

    // UI Component
    newChecklistForm: FormGroup;
    tempMandatoryForm: FormGroup;
    documentName = "";
    agentCode = "";
    signature = true;
    remarks = "";
    checklist: any;

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
            required_fields: this.fb.array([
                this.fb.group({
                    fieldName: new FormControl('', Validators.required),
                })
            ]),
            conditions: this.fb.array([
                this.fb.group({
                    conditionName: new FormControl('', Validators.required),
                    conditionOptions: new FormControl('', Validators.required)
                })
            ]),
            documents: this.fb.group({
                mandatory: this.fb.array([])
            })
        });

        this.loading = false;
    }

    addNewCondition() {
        let control = <FormArray>this.newChecklistForm.controls.conditions;
        control.push(
            this.fb.group({
                conditionName: new FormControl('', Validators.required),
                conditionOptions: new FormControl('', Validators.required)
            })
        );
        console.log(this.newChecklistForm);
    }

    deleteCondition(index) {
        let control = <FormArray>this.newChecklistForm.controls.conditions;
        control.removeAt(index);
    }

    addNewField() {
        let control = <FormArray>this.newChecklistForm.controls.required_fields;
        control.push(
            this.fb.group({
                fieldName: new FormControl('', Validators.required)
            })
        );
    }

    deleteField(index) {
        let control = <FormArray>this.newChecklistForm.controls.required_fields;
        control.removeAt(index);
    }

    showMDialog() {
        let control = <FormArray>this.newChecklistForm.controls.documents.get('mandatory');
        control.push(
            this.fb.group({
                documentName: new FormControl('', Validators.required),
                agentCode: new FormControl('', Validators.required),
                signature: new FormControl(true, Validators.required),
                remarks: new FormControl('')
            })
        );
        this.mDisplay = true;
    }

    addNewMandatory() {
        let i = (+this.newChecklistForm.controls.documents.get('mandatory').get('length') - 1) + '';

        this.newChecklistForm.controls.documents.get('mandatory').get(i).get('documentName').markAsDirty();
        this.newChecklistForm.controls.documents.get('mandatory').get(i).get('agentCode').markAsDirty();
        this.newChecklistForm.controls.documents.get('mandatory').get(i).get('signature').markAsDirty();
        this.newChecklistForm.controls.documents.get('mandatory').get(i).get('remarks').markAsDirty();

        if (this.newChecklistForm.controls.documents.get('mandatory').get(i).get('documentName').invalid ||
            this.newChecklistForm.controls.documents.get('mandatory').get(i).get('agentCode').invalid ||
            this.newChecklistForm.controls.documents.get('mandatory').get(i).get('signature').invalid ||
            this.newChecklistForm.controls.documents.get('mandatory').get(i).get('remarks').invalid) {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: 'Please correct the invalid fields highlighted'
            });
            return;
        }

        this.mDisplay = false;
    }

    saveConditions() {
        this.checklist['name'] = this.newChecklistForm.controls.checklistName.value;
        // this.checklist['conditions'] = 
    }
}
