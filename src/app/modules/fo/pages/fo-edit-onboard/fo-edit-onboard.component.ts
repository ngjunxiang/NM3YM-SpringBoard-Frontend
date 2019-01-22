import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Pipe, PipeTransform } from '@angular/core';

import { environment } from '../../../../../environments/environment';

import { MessageService } from 'primeng/components/common/api';
import { FOService } from '../../../../core/services/fo.service';

import { SpringboardService } from '../../../../core/services/springboard.service';
import { Subscription } from 'rxjs';

@Pipe({ name: 'changeToNA' })
export class changeToNA implements PipeTransform {
    transform(value: string): string {
        if (value === 'Not Applicable') {
            return 'N/A';
        }
        return value;
      }
}

@Component({
    selector: 'fo-edit-onboard',
    templateUrl: './fo-edit-onboard.component.html',
    styleUrls: ['./fo-edit-onboard.component.scss']
})
export class FOEditOnboardComponent implements OnInit {

    public complianceTableHeaders = {
        cDocName: false,
        cDocType: false,
        cCondName: false,
        cCondOption: false,
        cAgmtCode: false,
        cRemark: false,
        cComments: false,
        cUploadFile: false,
        cSignature: false
    };

    public legalTableHeaders = {
        lDocName: false,
        lDocType: false,
        lCondName: false,
        lCondOption: false,
        lAgmtCode: false,
        lRemark: false,
        lComments: false,
        lUploadFile: false,
        lSignature: false,
        lWaiver: false
    };
    public colorLegend = {
        addedDoc: false,
        removedDoc: false,
        modifiedDoc: false,
    }

    public docChange = {
        'deleted-field': false,
        'new-field': false,
        'edited-field': false,
    }

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

    selectedComplianceManCols: any[];
    selectedComplianceOptCols: any[];
    selectedLegalManCols: any[];
    selectedLegalOptCols: any[];

    private subscription: Subscription;

    private checkboxBool = {
        cdm: true,
        cdo: true,
        ldm: true,
        ldo: true
    }

    constructor(
        private fb: FormBuilder,
        private foService: FOService,
        private messageService: MessageService,
        private route: ActivatedRoute,
        private router: Router,
        private springboardService: SpringboardService) { }

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

        this.subscription = this.springboardService.getUploadingDoc().subscribe(this.onFileUploaded());

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

        this.complianceCols = [
            { field: 'documentName', header: 'Name' },
            { field: 'documentType', header: 'Type' },
            { field: 'conditionName', header: 'Condition' },
            { field: 'conditionOptions', header: 'Option' },
            { field: 'agmtCode', header: 'Code' },
            { field: 'remarks', header: 'Remarks' },
            { field: 'comments', header: 'Comments' },
            { field: 'uploadFiles', header: 'File' },
            { field: 'signature', header: 'Sign' }
        ];

        this.legalCols = [
            { field: 'documentName', header: 'Name' },
            { field: 'documentType', header: 'Type' },
            { field: 'conditionName', header: 'Condition' },
            { field: 'conditionOptions', header: 'Option' },
            { field: 'agmtCode', header: 'Code' },
            { field: 'remarks', header: 'Remarks' },
            { field: 'comments', header: 'Comments' },
            { field: 'uploadFiles', header: 'File' },
            { field: 'signature', header: 'Sign' },
            { field: 'canWaiver', header: 'Waiver' }
        ];

        this.selectedComplianceManCols = this.complianceCols;
        this.selectedComplianceOptCols = this.complianceCols;

        this.selectedLegalManCols = this.legalCols;
        this.selectedLegalOptCols = this.legalCols;

    }

    @HostListener('window:beforeunload')
    canDeactivate(): Promise<boolean> | boolean {
        if (this.isSubmitted) return true;
        if (!this.documentsForm.dirty) {
            return true;
        }
        return confirm('Are you sure you want to continue? Any unsaved changes will be lost.');
    }

    complianceTableHeadersClass(field) {
        this.complianceTableHeaders = {
            cDocName: field === 'documentName' ? true : false,
            cDocType: field === 'documentType' ? true : false,
            cCondName: field === 'conditionName' ? true : false,
            cCondOption: field === 'conditionOptions' ? true : false,
            cAgmtCode: field === 'agmtCode' ? true : false,
            cRemark: field === 'remarks' ? true : false,
            cComments: field === 'comments' ? true : false,
            cUploadFile: field === 'uploadFile' ? true : false,
            cSignature: field === 'signature' ? true : false
        };

        return this.complianceTableHeaders;
    }
    legalTableHeadersClass(field) {
        this.legalTableHeaders = {
            lDocName: field === 'documentName' ? true : false,
            lDocType: field === 'documentType' ? true : false,
            lCondName: field === 'conditionName' ? true : false,
            lCondOption: field === 'conditionOptions' ? true : false,
            lAgmtCode: field === 'agmtCode' ? true : false,
            lRemark: field === 'remarks' ? true : false,
            lComments: field === 'comments' ? true : false,
            lUploadFile: field === 'uploadFile' ? true : false,
            lSignature: field === 'signature' ? true : false,
            lWaiver: field === 'canWaiver' ? true : false
        };

        return this.legalTableHeaders;
    }

    getColorLegend(field) {
        this.colorLegend = {
            addedDoc: field === 'Green' ? true : false,
            removedDoc: field === 'Red' ? true : false,
            modifiedDoc: field === 'Yellow' ? true : false
        };
        return this.colorLegend;
    }

    getDocChange(field) {
        this.docChange = {
            'deleted-field': field === '3' ? true : false,
            'new-field': field === '2' ? true : false,
            'edited-field': field === '1' ? true : false,
        };
        return this.docChange;
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
                formArray.push(new FormGroup({ 'comments': new FormControl({ value: "" }), 'chkbox': new FormControl({ value: false, disabled: true }) }));
            } else {
                formArray.push(new FormGroup({ 'comments': new FormControl(mandatoryDoc.comments), 'chkbox': new FormControl(mandatoryDoc.checked) }));
            }
        });

        this.obDetails.complianceDocuments.optional.forEach(optionalDoc => {
            formArray = <FormArray>this.documentsForm.get('complianceDocuments').get('optional');
            if (optionalDoc.changed === '3') {
                formArray.push(new FormGroup({ 'comments': new FormControl({ value: "" }), 'chkbox': new FormControl({ value: false, disabled: true }) }));
                // formArray.push(new FormControl({ value: "" }));
                // formArray.push(new FormControl({ value: false, disabled: true }));
            } else {
                formArray.push(new FormGroup({ 'comments': new FormControl(optionalDoc.comments), 'chkbox': new FormControl(optionalDoc.checked) }));
                // formArray.push(new FormControl(optionalDoc.comments));
                // formArray.push(new FormControl(optionalDoc.checked));
            }
        });

        this.obDetails.legalDocuments.mandatory.forEach(mandatoryDoc => {
            formArray = <FormArray>this.documentsForm.get('legalDocuments').get('mandatory');
            if (mandatoryDoc.changed === '3') {
                formArray.push(new FormGroup({ 'comments': new FormControl({ value: "" }), 'chkbox': new FormControl({ value: false, disabled: true }) }));
                // formArray.push(new FormControl({ value: "" }));
                // formArray.push(new FormControl({ value: false, disabled: true }));
            } else {
                formArray.push(new FormGroup({ 'comments': new FormControl(mandatoryDoc.comments), 'chkbox': new FormControl(mandatoryDoc.checked) }));
                // formArray.push(new FormControl(mandatoryDoc.comments));
                // formArray.push(new FormControl(mandatoryDoc.checked));
            }
        });

        this.obDetails.legalDocuments.optional.forEach(optionalDoc => {
            formArray = <FormArray>this.documentsForm.get('legalDocuments').get('optional');
            if (optionalDoc.changed === '3') {
                formArray.push(new FormGroup({ 'comments': new FormControl({ value: "" }), 'chkbox': new FormControl({ value: false, disabled: true }) }));
                // formArray.push(new FormControl({ value: "" }));
                // formArray.push(new FormControl({ value: false, disabled: true }));
            } else {
                formArray.push(new FormGroup({ 'comments': new FormControl(optionalDoc.comments), 'chkbox': new FormControl(optionalDoc.checked) }));
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
                uploadFiles: mandatoryDoc.uploadFiles,
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
                uploadFiles: optionalDoc.uploadFiles,
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
                uploadFiles: mandatoryDoc.uploadFiles,
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
                uploadFiles: optionalDoc.uploadFiles,
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

    fileDeleteHandler(uploadIndex, index, whichObj) {
        switch (whichObj) {
            case 'cdm':
                let complianceDocMandatory = this.obDetails.complianceDocuments.mandatory[index];
                complianceDocMandatory.uploadFiles.splice(uploadIndex, 1);
                break;
            case 'cdo':
                let complianceDocOptional = this.obDetails.complianceDocuments.optional[index];
                complianceDocOptional.uploadFiles.splice(uploadIndex, 1);
                break;

            case 'ldm':
                let legalDocMandatory = this.obDetails.legalDocuments.mandatory[index];
                legalDocMandatory.uploadFiles.splice(uploadIndex, 1);
                break;
            case 'ldo':
                let legalDocOptional = this.obDetails.legalDocuments.optional[index];
                legalDocOptional.uploadFiles.splice(uploadIndex, 1);
                break;
        }

        //console.log('fileDeleteHandler', uploadIndex, index);
    }
    fileViewHandler(uploadIndex, index, whichObj) {
        console.log('fileViewHandler', uploadIndex, index, whichObj);
        // OPEN FILE
        switch (whichObj) {
            case 'cdm':
                let complianceDocMandatory = this.obDetails.complianceDocuments.mandatory[index];
                window.open(environment.host + '/app/document/' + complianceDocMandatory.uploadFiles[uploadIndex]);
                break;
            case 'cdo':
                let complianceDocOptional = this.obDetails.complianceDocuments.optional[index];
                window.open(environment.host + '/app/document/' + complianceDocOptional.uploadFiles[uploadIndex]);
                break;

            case 'ldm':
                let legalDocMandatory = this.obDetails.legalDocuments.mandatory[index];
                window.open(environment.host + '/app/document/' + legalDocMandatory.uploadFiles[uploadIndex]);
                break;
            case 'ldo':
                let legalDocOptional = this.obDetails.legalDocuments.optional[index];
                window.open(environment.host + '/app/document/' + legalDocOptional.uploadFiles[uploadIndex]);
                break;
        }
    }

    onFileUploaded() {
        return (function () {
            return function (message) {
                let mandatoryDoc = this.obDetails.complianceDocuments.mandatory[this.springboardService.pdfDataInput.formArray];
                mandatoryDoc.uploadFiles.push(this.springboardService.pdfDataInput.returnFileName);
            }
        })().bind(this);
    }

    allCheckboxLoop(whichObj) {
        switch (whichObj) {
            case 'cdm':
                for (let i = 0; i < this.obDetails.complianceDocuments.mandatory.length; i++) {
                    this.documentsForm.get('complianceDocuments').get('mandatory').get(i + '').get('chkbox').setValue(this.checkboxBool.cdm);
                }
                this.checkboxBool.cdm = !this.checkboxBool.cdm;
                break;
            case 'cdo':
                for (let i = 0; i < this.obDetails.complianceDocuments.optional.length; i++) {
                    this.documentsForm.get('complianceDocuments').get('optional').get(i + '').get('chkbox').setValue(this.checkboxBool.cdo);
                }
                this.checkboxBool.cdo = !this.checkboxBool.cdo;
                break;
            case 'ldm':
                for (let i = 0; i < this.obDetails.legalDocuments.mandatory.length; i++) {
                    this.documentsForm.get('legalDocuments').get('mandatory').get(i + '').get('chkbox').setValue(this.checkboxBool.ldm);
                }
                this.checkboxBool.ldm = !this.checkboxBool.ldm;
                break;
            case 'ldo':
                for (let i = 0; i < this.obDetails.legalDocuments.optional.length; i++) {
                    this.documentsForm.get('legalDocuments').get('optional').get(i + '').get('chkbox').setValue(this.checkboxBool.ldo);
                }
                this.checkboxBool.ldo = !this.checkboxBool.ldo;
                break;
        }
    }

    ngOnDestroy() {
        this.springboardService.clearData();
        this.subscription.unsubscribe();
    }
}

