import { Component, OnInit } from '@angular/core';
import { Message } from '../../../../../../node_modules/primeng/components/common/api';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '../../../../../../node_modules/@angular/forms';
import {DialogModule} from 'primeng/dialog';
import {CheckboxModule} from 'primeng/checkbox';

@Component({
    selector: 'cm-new-checklist',
    templateUrl: './cm-new-checklist.component.html',
    styleUrls: ['./cm-new-checklist.component.scss']
})

export class CMNewChecklistComponent implements OnInit {

    // UI Control
    loading = false;
    msgs: Message[] = [];

    // UI Component
    newChecklistForm: FormGroup;
    checked: boolean = true;

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
                mandatory: this.fb.array([
                    this.fb.group({
                        documentName: new FormControl('', Validators.required),
                        agentCode: new FormControl('', Validators.required),
                        // signature: this.checked,
                        remarks: new FormControl('', Validators.required)
                    })
                ])
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
        )
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
        )
    }

    deleteField(index) {
        let control = <FormArray>this.newChecklistForm.controls.required_fields;
        control.removeAt(index);
    }

    mDisplay: boolean = false;
    
    showMDialog() {
            this.mDisplay = true;
    }
    
    addNewMandatory() {
        let control = <FormArray>this.newChecklistForm.controls.mandatory;
        control.push(
            this.fb.group({
                documentName: new FormControl('', Validators.required),
                agentCode: new FormControl('', Validators.required),
                signature: this.checked,
                remarks: new FormControl('', Validators.required)
            })
        )
    }
    
}
