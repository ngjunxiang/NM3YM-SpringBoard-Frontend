import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/components/common/api';

import { CMService } from '../../../../core/services/cm.service';

@Component({
    selector: 'cm-view-checklist-logs',
    templateUrl: './cm-view-checklist-logs.component.html',
    styleUrls: ['./cm-view-checklist-logs.component.css']
})

export class CMViewChecklistLogsComponent implements OnInit {

    // UI Control
    loading = false;
    searched = false;
    totalVersions: number;
    deletedChecklists: string[];

    // UI Components
    checklistNameVersionData: any[];
    checklistNameData: string[];
    checklistVersionData: string[];
    checklistLogData: any;
    checklistLogForm: FormGroup;
    complianceCols: any[];
    legalCols: any[];

    // For Colour Legend Table 
    docChanges: any[];
    tableCols: any[];

    constructor(
        private cmService: CMService,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder,
        private messageService: MessageService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.loading = true;

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

        this.checklistLogForm = this.fb.group({
            clID: new FormControl('', Validators.required),
            version: new FormControl({ value: '', disabled: true }, Validators.required)
        });

        this.retrieveChecklistNamesAndVersions();

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

    reloadVersions(event) {
        let selectedClID = this.checklistLogForm.get('clID').value;

        if (selectedClID) {
            this.checklistNameVersionData.forEach(cl => {
                if (cl.clID === selectedClID) {
                    this.checklistVersionData = cl.versions;
                }
            });
            this.checklistLogForm.get('version').enable();
        }
    }

    retrieveChecklistNamesAndVersions() {
        this.cmService.retrieveCMChecklistLogNames().subscribe(res => {
            if (res.error) {
                this.messageService.add({ 
                    key: 'msgs', severity: 'error', summary: 'Server Error', detail: res.error
                });
            }
            if (res.results) {
                this.deletedChecklists = [];
                this.checklistNameVersionData = [];
                res.results['current'].forEach(cl => {
                    let clData = {};
                    clData['clID'] = cl.clID;
                    clData['name'] = {
                        'label': cl.name,
                        'value': cl.clID
                    };
                    clData['versions'] = [];
                    cl.versions.forEach(version => {
                        clData['versions'].push({
                            'label': version,
                            'value': version
                        });
                    });
                    this.checklistNameVersionData.push(clData);
                });

                res.results['deleted'].forEach(cl => {
                    let clData = {};
                    clData['clID'] = cl.clID;
                    clData['name'] = {
                        'label': cl.name + ' (Deleted)',
                        'value': cl.clID
                    };
                    clData['versions'] = [];
                    cl.versions.forEach(version => {
                        clData['versions'].push({
                            'label': version,
                            'value': version
                        });
                    });
                    this.checklistNameVersionData.push(clData);
                    this.deletedChecklists.push(cl.name);
                });

                this.checklistNameVersionData.sort((a, b) => (a > b ? 1 : -1));
                this.checklistNameVersionData.forEach(cl => {
                    cl.versions.sort((a, b) => a.label - b.label);
                });

                this.checklistNameData = [];
                this.checklistNameVersionData.forEach(cl => {
                    this.checklistNameData.push(cl.name);
                });

                this.reloadVersions(Event);
                this.loading = false;
            }
        }, error => {
            this.messageService.add({ 
                key: 'msgs', severity: 'error', summary: 'Server Error', detail: error
            });
        });
    }

    retrieveChecklistDetails() {
        this.checklistLogForm.get('clID').markAsDirty();
        this.checklistLogForm.get('version').markAsDirty();

        if (this.checklistLogForm.get('clID').invalid || this.checklistLogForm.get('version').invalid) {
            this.messageService.add({ 
                key: 'msgs', severity: 'error', summary: 'Error', detail: 'Please select a checklist name and version'
            });
            return;
        }
        let selectedClID = this.checklistLogForm.get('clID').value;
        let selectedVersion = this.checklistLogForm.get('version').value;

        this.cmService.retrieveCMChecklistLogDetails(selectedClID, selectedVersion).subscribe(res => {
            if (res.error) {
                this.messageService.add({ 
                    key: 'msgs', severity: 'error', summary: 'Server Error', detail: res.error
                });
                return;
            }

            if (res.results) {
                this.checklistLogData = res.results;
                let conditions = [];
                let conditionNames = Object.keys(res.results['conditions']);
                conditionNames.forEach(conditionName => {
                    conditions.push({
                        conditionName: conditionName,
                        conditionOptions: this.checklistLogData['conditions'][conditionName]
                    });
                });
                
                this.checklistLogData['conditions'] = conditions;
                this.totalVersions = this.checklistVersionData.length;
                this.searched = true;
            }
        }, error => {
            this.messageService.add({ 
                key: 'msgs', severity: 'error', summary: 'Server Error', detail: error
            });
            return;
        });
    }

    revertChecklist() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to revert ' + this.checklistLogData.name + ' to version ' + this.checklistLogData.version + '?',
            header: 'Revert Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.cmService.revertChecklist(this.checklistLogData.clID, this.checklistLogData.version).subscribe(res => {
                    if (res.error) {
                        this.messageService.add({ 
                            key: 'msgs', severity: 'error', summary: 'Server Error', detail: res.error
                        });
                        return;
                    }
        
                    if (res.results) {
                        this.messageService.add({
                            key: 'msgs', severity: 'success', summary: 'Success', detail: 'Checklist reverted'
                        });

                        this.loading = true;
                        this.retrieveChecklistNamesAndVersions();
                        this.searched = false;
                    }
                }, error => {
                    this.messageService.add({ 
                        key: 'msgs', severity: 'error', summary: 'Server Error', detail: error
                    });
                    return;
                });
            },
            reject: () => {
                return;
            }
        });
    }
}
