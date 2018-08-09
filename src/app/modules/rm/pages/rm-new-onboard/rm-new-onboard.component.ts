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
    checklistNameDropdownData: SelectItem[];
    checklistForm: FormGroup;

    selectedChecklistName: string;
    selectedChecklistData: any;

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
            selectedChecklistName: new FormControl('', Validators.required),
            requiredFields: this.fb.array([]),
            conditions: this.fb.array([])
        });
        this.loading = false;
    }

    createChecklistForm() {
        this.checklistForm = this.fb.group({
            selectedChecklistName: new FormControl('', Validators.required),
            requiredFields: this.fb.array([]),
            conditions: this.fb.array([])
        });

        this.route.snapshot.data['urls'] = [
            { title: 'Onboard' },
            { title: 'New' },
            { title: this.selectedChecklistName }
        ];

        this.checklistService.retrieveRMChecklistDetails(this.selectedChecklistName).subscribe(res => {
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

            console.log(this.selectedChecklistData)
        }, error => {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: error
            });
        });
        this.loading = false;
    }

    retrieveChecklistNames() {
        this.checklistNameDropdownData = [];
        this.checklistService.retrieveRMChecklistNames().subscribe(data => {
            data.clNames.forEach(cl => {
                this.checklistNameDropdownData.push({
                    'label': cl.name,
                    'value': cl.name
                });
            });
        }, error => {
            this.msgs.push({
                severity: 'error', summary: 'Server Error', detail: error
            });
        });
    }

    submitChecklistName() {
        this.checklistForm.controls.selectedChecklistName.markAsDirty();
        if (this.checklistForm.controls.selectedChecklistName.invalid) {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: 'Please select a checklist'
            });
            return;
        }

        this.loading = true;
        this.selectedChecklistName = this.checklistForm.controls.selectedChecklistName.value;
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

        this.checklistForm.get('requiredFields')['controls'].forEach(field => {
            if (field.invalid) {
                document.getElementById('requiredFields').scrollIntoView();
                this.msgs.push({
                    severity: 'error', summary: 'Error', detail: 'Please enter all required fields'
                });
                return;
            }
        });

        this.checklistForm.get('conditions')['controls'].forEach(field => {
            if (field.invalid) {
                document.getElementById('conditions').scrollIntoView();
                this.msgs.push({
                    severity: 'error', summary: 'Error', detail: 'Please enter all condition options'
                });
                return;
            }
        });
    }

    back() {
        this.step--;
    }
}
