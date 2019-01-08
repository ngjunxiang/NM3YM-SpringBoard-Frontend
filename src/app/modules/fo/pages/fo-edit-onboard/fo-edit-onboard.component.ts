import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from 'primeng/components/common/api';

import { FOService } from '../../../../core/services/fo.service';

@Component({
    selector: 'fo-edit-onboard',
    templateUrl: './fo-edit-onboard.component.html',
    styleUrls: ['./fo-edit-onboard.component.scss']
})
export class FOEditOnboardComponent implements OnInit {

    // UI Control
    loading = false;
    processing = false;
    isSubmitted = false;

    // UI Component
    complianceCols: any[];
    legalCols: any[];

    obName: string;
    obDetails: any;
    documentsForm: FormGroup;

    // For Colour Legend Table 
    docChanges: any[];
    tableCols: any[];

    selectedColumns: any[];


    constructor(
        private fb: FormBuilder,
        private foService: FOService,
        private messageService: MessageService,
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


        this.legalCols = [
            { field: 'documentName', header: 'Doc Name' },
            { field: 'documentType', header: 'Doc Type' },
            { field: 'conditionName', header: 'Condition' },
            { field: 'conditionOptions', header: 'Opt' },
            { field: 'agmtCode', header: 'Code' },
            { field: 'remarks', header: 'Remarks' },
            { field: 'comments', header: 'Comments' },
            { field: 'uploadFiles', header: 'File' },
            { field: 'signature', header: 'Sign Req' },
            { field: 'canWaiver', header: 'Waiver Allow' }
        ];

        this.complianceCols = [
            { field: 'documentName', header: 'Doc Name' },
            { field: 'documentType', header: 'Doc Type' },
            { field: 'conditionName', header: 'Condition' },
            { field: 'conditionOptions', header: 'Opt' },
            { field: 'agmtCode', header: 'Code' },
            { field: 'remarks', header: 'Remarks' },
            { field: 'comments', header: 'Comments' },
            { field: 'uploadFiles', header: 'File' },
            { field: 'signature', header: 'Sign Req' }
        ];

        this.selectedColumns  = this.complianceCols;
 
    }

    @HostListener('window:beforeunload')
    canDeactivate(): Promise<boolean> | boolean {
        if (this.isSubmitted) return true;
        if (!this.documentsForm.dirty) {
            return true;
        }
        return confirm('Are you sure you want to continue? Any unsaved changes will be lost.');
    }

    createForm() {
        
        this.documentsForm = this.fb.group({
            complianceDocuments: this.fb.group({
                mandatory: new FormArray([]),
                optional: new FormArray([])
            }),
            legalDocuments: this.fb.group({
                mandatory: new FormArray([]),
                optional: new FormArray([])
            })
        });
    }


    initForm() {
        let formArray;
  
        this.obDetails.complianceDocuments.mandatory.forEach(mandatoryDoc => {
            formArray = <FormArray>this.documentsForm.get('complianceDocuments').get('mandatory');
            if (mandatoryDoc.changed === '3') {
                formArray.push(new FormGroup({ 'comments': new FormControl({ value: "" }), 'chkbox': new FormControl({ value: false, disabled: true })}));
            } else {
                formArray.push(new FormGroup({ 'comments': new FormControl(mandatoryDoc.comments), 'chkbox': new FormControl(mandatoryDoc.checked)}));
            }
        });

        this.obDetails.complianceDocuments.optional.forEach(optionalDoc => {
            formArray = <FormArray>this.documentsForm.get('complianceDocuments').get('optional');
            if (optionalDoc.changed === '3') {
                formArray.push(new FormGroup({ 'comments': new FormControl({ value: "" }), 'chkbox': new FormControl({ value: false, disabled: true })}));
                // formArray.push(new FormControl({ value: "" }));
                // formArray.push(new FormControl({ value: false, disabled: true }));
            } else {
                formArray.push(new FormGroup({ 'comments': new FormControl(optionalDoc.comments), 'chkbox': new FormControl(optionalDoc.checked)}));
                // formArray.push(new FormControl(optionalDoc.comments));
                // formArray.push(new FormControl(optionalDoc.checked));
            }
        });

        this.obDetails.legalDocuments.mandatory.forEach(mandatoryDoc => {
            formArray = <FormArray>this.documentsForm.get('legalDocuments').get('mandatory');
            if (mandatoryDoc.changed === '3') {
                formArray.push(new FormGroup({ 'comments': new FormControl({ value: "" }), 'chkbox': new FormControl({ value: false, disabled: true })}));
                // formArray.push(new FormControl({ value: "" }));
                // formArray.push(new FormControl({ value: false, disabled: true }));
            } else {
                formArray.push(new FormGroup({ 'comments': new FormControl(mandatoryDoc.comments), 'chkbox': new FormControl(mandatoryDoc.checked)}));
                // formArray.push(new FormControl(mandatoryDoc.comments));
                // formArray.push(new FormControl(mandatoryDoc.checked));
            }
        });

        this.obDetails.legalDocuments.optional.forEach(optionalDoc => {
            formArray = <FormArray>this.documentsForm.get('legalDocuments').get('optional');
            if (optionalDoc.changed === '3') {
                formArray.push(new FormGroup({ 'comments': new FormControl({ value: "" }), 'chkbox': new FormControl({ value: false, disabled: true })}));
                // formArray.push(new FormControl({ value: "" }));
                // formArray.push(new FormControl({ value: false, disabled: true }));
            } else {
                formArray.push(new FormGroup({ 'comments': new FormControl(optionalDoc.comments), 'chkbox': new FormControl(optionalDoc.checked)}));
                // formArray.push(new FormControl(optionalDoc.comments));
                // formArray.push(new FormControl(optionalDoc.checked));
            }
        });
    }

    retrieveOnboardDetails(obID) {
        this.loading = true;
        this.foService.retrieveOnboardProcessDetails(obID).subscribe(res => {
            if (res.error) {
                this.messageService.add({ 
                    key: 'msgs', severity: 'error', summary: 'Error', detail: res.error
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
            this.messageService.add({ 
                key: 'msgs', severity: 'error', summary: 'Error', detail: error
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
                hasConditions: mandatoryDoc.hasConditions,
                documentName: mandatoryDoc.documentName,
                documentType: mandatoryDoc.documentType,
                conditions: mandatoryDoc.conditions,
                agmtCode: mandatoryDoc.agmtCode,
                signature: mandatoryDoc.signature,
                remarks: mandatoryDoc.remarks,
                comments: this.documentsForm.get('complianceDocuments').get('mandatory').get(i + '').get('comments').value,
                uploadFiles: ['a', 'b', 'c'],
                checked: this.documentsForm.get('complianceDocuments').get('mandatory').get(i + '').get('chkbox').value,
                changed: mandatoryDoc.changed,
                docID: mandatoryDoc.docID
            });
        }

        processData['complianceDocuments']['optional'] = [];

        for (let i = 0; i < this.obDetails.complianceDocuments.optional.length; i++) {
            let optionalDoc = this.obDetails.complianceDocuments.optional[i];
            processData['complianceDocuments']['optional'].push({
                hasConditions: optionalDoc.hasConditions,
                documentName: optionalDoc.documentName,
                documentType: optionalDoc.documentType,
                conditions: optionalDoc.conditions,
                agmtCode: optionalDoc.agmtCode,
                signature: optionalDoc.signature,
                remarks: optionalDoc.remarks,
                comments: this.documentsForm.get('complianceDocuments').get('optional').get(i + '').get('comments').value,
                uploadFiles: ['a', 'b', 'c'],
                checked: this.documentsForm.get('complianceDocuments').get('optional').get(i + '').get('chkbox').value,
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
                hasConditions: mandatoryDoc.hasConditions,
                documentName: mandatoryDoc.documentName,
                documentType: mandatoryDoc.documentType,
                conditions: mandatoryDoc.conditions,
                agmtCode: mandatoryDoc.agmtCode,
                signature: mandatoryDoc.signature,
                remarks: mandatoryDoc.remarks,
                comments: this.documentsForm.get('legalDocuments').get('mandatory').get(i + '').get('comments').value,
                uploadFiles: ['a', 'b', 'c'],
                checked: this.documentsForm.get('legalDocuments').get('mandatory').get(i + '').get('chkbox').value,
                changed: mandatoryDoc.changed,
                docID: mandatoryDoc.docID
            });
        }

        processData['legalDocuments']['optional'] = [];

        for (let i = 0; i < this.obDetails.legalDocuments.optional.length; i++) {
            let optionalDoc = this.obDetails.legalDocuments.optional[i];
            processData['legalDocuments']['optional'].push({
                hasConditions: optionalDoc.hasConditions,
                documentName: optionalDoc.documentName,
                documentType: optionalDoc.documentType,
                conditions: optionalDoc.conditions,
                agmtCode: optionalDoc.agmtCode,
                signature: optionalDoc.signature,
                remarks: optionalDoc.remarks,
                comments: this.documentsForm.get('legalDocuments').get('optional').get(i + '').get('comments').value,
                uploadFiles: ['a', 'b', 'c'],
                checked: this.documentsForm.get('legalDocuments').get('optional').get(i + '').get('chkbox').value,
                changed: optionalDoc.changed,
                docID: optionalDoc.docID
            });
        }

        this.foService.updateOnboardProcess(processData).subscribe(res => {
            if (res.error) {
                this.messageService.add({ 
                    key: 'msgs', severity: 'error', summary: 'Error', detail: res.error
                });
                this.processing = false;
                return;
            }

            if (res.results) {
                this.messageService.add({ 
                    key: 'msgs', severity: 'success', summary: 'Success', detail: 'Onboard process updated. You will be redirected shortly'
                });
            }

            this.isSubmitted = true;

            setTimeout(() => {
                this.router.navigate(['/fo/onboard/manage']);
            }, 3000);
        }, error => {
            this.messageService.add({ 
                key: 'msgs', severity: 'error', summary: 'Error', detail: error
            });
            this.processing = false;
        });
    }
}
