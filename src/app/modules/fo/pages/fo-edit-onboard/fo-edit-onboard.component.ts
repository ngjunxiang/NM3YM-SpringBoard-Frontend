import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Message } from 'primeng/components/common/api';

import { FOService } from '../../../../core/services/fo.service';

@Component({
    selector: 'fo-edit-onboard',
    templateUrl: './fo-edit-onboard.component.html',
    styleUrls: ['./fo-edit-onboard.component.css']
})
export class FOEditOnboardComponent implements OnInit {

    // UI Control
    loading = false;
    processing = false;
    msgs: Message[] = [];

    // UI Component
    complianceMOCols: any[];
    complianceCCols: any[];
    legalMOCols: any[];
    legalCCols: any[];

    obName: string;
    obDetails: any;
    documentsForm: FormGroup;

    // For Colour Legend Table 
    docChanges: any[];
    tableCols: any[];


    constructor(
        private fb: FormBuilder,
        private foService: FOService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.loading = true;

        this.route.queryParams.subscribe(params => {
            this.obName = params['name'];
        });

        this.route.snapshot.data['urls'] = [
            { title: 'Onboard List', url: '/fo/onboard/manage' },
            { title: 'Edit' },
            { title: this.obName }
        ];

        this.createForm();

        this.retrieveOnboardDetails(this.route.snapshot.paramMap.get('id'));

        //Generating data for Colour Legend Table
        this.tableCols = [
            { field: 'typeOfChange', header: 'Type of Change' },
            { field: 'cellColour', header: 'Cell Colour' },
        ];

        this.docChanges = [
            { typeOfChange: "Document Modified", cellColour: "Yellow" },
            { typeOfChange: "Document Added", cellColour: "Green" },
            { typeOfChange: "Document Removed", cellColour: "Red" }
        ];
    }

    createForm() {
        this.documentsForm = this.fb.group({
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
            { field: 'documentName', header: 'Document Name'},
            { field: 'agmtCode', header: 'Agmt Code'},
            { field: 'remarks', header: 'Remarks'},
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
    }

    initForm() {
        let formArray;
        this.obDetails.complianceDocuments.mandatory.forEach(mandatoryDoc => {
            formArray = <FormArray>this.documentsForm.get('complianceDocuments').get('mandatory');
            if (mandatoryDoc.changed === '3') {
                formArray.push(new FormControl({ value: false, disabled: true }));
            } else {
                formArray.push(new FormControl(mandatoryDoc.checked));
            }
        });

        this.obDetails.complianceDocuments.conditional.forEach(conditionalDoc => {
            formArray = <FormArray>this.documentsForm.get('complianceDocuments').get('conditional');
            if (conditionalDoc.changed === '3') {
                formArray.push(new FormControl({ value: false, disabled: true }));
            } else {
                formArray.push(new FormControl(conditionalDoc.checked));
            }
        });

        this.obDetails.complianceDocuments.optional.forEach(optionalDoc => {
            formArray = <FormArray>this.documentsForm.get('complianceDocuments').get('optional');
            if (optionalDoc.changed === '3') {
                formArray.push(new FormControl({ value: false, disabled: true }));
            } else {
                formArray.push(new FormControl(optionalDoc.checked));
            }
        });

        this.obDetails.legalDocuments.mandatory.forEach(mandatoryDoc => {
            formArray = <FormArray>this.documentsForm.get('legalDocuments').get('mandatory');
            if (mandatoryDoc.changed === '3') {
                formArray.push(new FormControl({ value: false, disabled: true }));
            } else {
                formArray.push(new FormControl(mandatoryDoc.checked));
            }
        });

        this.obDetails.legalDocuments.conditional.forEach(conditionalDoc => {
            formArray = <FormArray>this.documentsForm.get('legalDocuments').get('conditional');
            if (conditionalDoc.changed === '3') {
                formArray.push(new FormControl({ value: false, disabled: true }));
            } else {
                formArray.push(new FormControl(conditionalDoc.checked));
            }
        });

        this.obDetails.legalDocuments.optional.forEach(optionalDoc => {
            formArray = <FormArray>this.documentsForm.get('legalDocuments').get('optional');
            if (optionalDoc.changed === '3') {
                formArray.push(new FormControl({ value: false, disabled: true }));
            } else {
                formArray.push(new FormControl(optionalDoc.checked));
            }
        });
    }

    retrieveOnboardDetails(obID) {
        this.loading = true;
        this.foService.retrieveOnboardProcessDetails(obID).subscribe(res => {
            if (res.error) {
                this.msgs.push({
                    severity: 'error', summary: 'Error', detail: res.error
                });
                return;
            }

            this.obDetails = {
                clID: res.clID,
                complianceDocuments: res.complianceDocuments,
                conditions: res.conditions,
                dateCreated: res.dateCreated,
                legalDocuments: res.legalDocuments,
                name: res.name,
                obID: res.obID,
                progress: res.progress,
                version: res.version
            };

            this.obDetails['requiredFields'] = [];
            Object.keys(res.requiredFields).forEach(requiredField => {
                let fieldName;
                for (fieldName in res.requiredFields[requiredField]);
                this.obDetails['requiredFields'].push({
                    'fieldName': fieldName,
                    'fieldValue': res.requiredFields[requiredField][fieldName]
                });
            });

            this.initForm();

            this.loading = false;
        }, error => {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: error
            });
        });
    }

    updateOnboardProcess() {
        this.processing = true;
        let processData = Object.assign({}, this.obDetails);

        // Required Fields
        processData['requiredFields'] = [];

        this.obDetails.requiredFields.forEach(requiredField => {
            let field = {};
            field[requiredField.fieldName] = requiredField.fieldValue;
            processData['requiredFields'].push(field);
        });

        // Compliance Documents
        processData['complianceDocuments'] = {};
        processData['complianceDocuments']['mandatory'] = [];

        for (let i = 0; i < this.obDetails.complianceDocuments.mandatory.length; i++) {
            let mandatoryDoc = this.obDetails.complianceDocuments.mandatory[i];
            processData['complianceDocuments']['mandatory'].push({
                documentName: mandatoryDoc.documentName,
                agmtCode: mandatoryDoc.agmtCode,
                signature: mandatoryDoc.signature,
                remarks: mandatoryDoc.remarks,
                checked: this.documentsForm.get('complianceDocuments').get('mandatory').get(i + '').value,
                changed: mandatoryDoc.changed,
                docID: mandatoryDoc.docID
            });
        }

        processData['complianceDocuments']['conditional'] = [];

        for (let i = 0; i < this.obDetails.complianceDocuments.conditional.length; i++) {
            let conditionalDoc = this.obDetails.complianceDocuments.conditional[i];
            processData['complianceDocuments']['conditional'].push({
                documentName: conditionalDoc.documentName,
                conditions: conditionalDoc.conditions,
                agmtCode: conditionalDoc.agmtCode,
                signature: conditionalDoc.signature,
                remarks: conditionalDoc.remarks,
                checked: this.documentsForm.get('complianceDocuments').get('conditional').get(i + '').value,
                changed: conditionalDoc.changed,
                docID: conditionalDoc.docID
            });
        }

        processData['complianceDocuments']['optional'] = [];

        for (let i = 0; i < this.obDetails.complianceDocuments.optional.length; i++) {
            let optionalDoc = this.obDetails.complianceDocuments.optional[i];
            processData['complianceDocuments']['optional'].push({
                documentName: optionalDoc.documentName,
                agmtCode: optionalDoc.agmtCode,
                signature: optionalDoc.signature,
                remarks: optionalDoc.remarks,
                checked: this.documentsForm.get('complianceDocuments').get('optional').get(i + '').value,
                changed: optionalDoc.changed,
                docID: optionalDoc.docID
            });
        }

        // Legal Documents
        processData['legalDocuments'] = {};
        processData['legalDocuments']['mandatory'] = [];

        for (let i = 0; i < this.obDetails.legalDocuments.mandatory.length; i++) {
            let mandatoryDoc = this.obDetails.legalDocuments.mandatory[i];
            processData['legalDocuments']['mandatory'].push({
                documentName: mandatoryDoc.documentName,
                agmtCode: mandatoryDoc.agmtCode,
                signature: mandatoryDoc.signature,
                remarks: mandatoryDoc.remarks,
                canWaiver: mandatoryDoc.canWaiver,
                checked: this.documentsForm.get('legalDocuments').get('mandatory').get(i + '').value,
                changed: mandatoryDoc.changed,
                docID: mandatoryDoc.docID
            });
        }
        processData['legalDocuments']['conditional'] = [];

        for (let i = 0; i < this.obDetails.legalDocuments.conditional.length; i++) {
            let conditionalDoc = this.obDetails.legalDocuments.conditional[i];
            processData['legalDocuments']['conditional'].push({
                documentName: conditionalDoc.documentName,
                conditions: conditionalDoc.conditions,
                agmtCode: conditionalDoc.agmtCode,
                signature: conditionalDoc.signature,
                remarks: conditionalDoc.remarks,
                canWaiver: conditionalDoc.canWaiver,
                checked: this.documentsForm.get('legalDocuments').get('conditional').get(i + '').value,
                changed: conditionalDoc.changed,
                docID: conditionalDoc.docID
            });
        }

        processData['legalDocuments']['optional'] = [];

        for (let i = 0; i < this.obDetails.legalDocuments.optional.length; i++) {
            let optionalDoc = this.obDetails.legalDocuments.optional[i];
            processData['legalDocuments']['optional'].push({
                documentName: optionalDoc.documentName,
                agmtCode: optionalDoc.agmtCode,
                signature: optionalDoc.signature,
                remarks: optionalDoc.remarks,
                canWaiver: optionalDoc.canWaiver,
                checked: this.documentsForm.get('legalDocuments').get('optional').get(i + '').value,
                changed: optionalDoc.changed,
                docID: optionalDoc.docID
            });
        }

        this.foService.updateOnboardProcess(processData).subscribe(res => {
            if (res.error) {
                this.msgs.push({
                    severity: 'error', summary: 'Error', detail: res.error
                });
                this.processing = false;
                return;
            }

            if (res.results) {
                this.msgs.push({
                    severity: 'success', summary: 'Success', detail: 'Onboard process updated <br> You will be redirected shortly'
                });
            }

            setTimeout(() => {
                this.router.navigate(['/fo/onboard/manage']);
            }, 3000);
        }, error => {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: error
            });
            this.processing = false;
        });
    }
}
