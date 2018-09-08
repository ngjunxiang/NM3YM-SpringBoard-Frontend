import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Message } from 'primeng/components/common/api';

import { CMService } from '../../../../core/services/cm.service';

@Component({
    selector: 'cm-view-checklist-logs',
    templateUrl: './cm-view-checklist-logs.component.html',
    styleUrls: ['./cm-view-checklist-logs.component.scss']
})

export class CMViewChecklistLogsComponent implements OnInit {

    // UI Control
    loading = false;
    searched = false;
    msgs: Message[] = [];

    // UI Components
    checklistNameVersionData: any[];
    checklistNameData: string[];
    checklistVersionData: string[];
    checklistLogData: any;
    checklistLogForm: FormGroup;
    complianceMOCols: any[];
    complianceCCols: any[];
    legalMOCols: any[];
    legalCCols: any[];

    constructor(
        private cmService: CMService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.loading = true;

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
            { field: 'documentName', header: 'Document Name' },
            { field: 'agmtCode', header: 'Agmt Code' },
            { field: 'remarks', header: 'Remarks' },
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

        this.checklistLogForm = this.fb.group({
            clID: new FormControl('', Validators.required),
            version: new FormControl({ value: '' , disabled: true }, Validators.required)
        });

        this.retrieveChecklistNamesAndVersions();
    }

    reloadVersions(event) {
        let selectedClID = this.checklistLogForm.get('clID').value;
        this.checklistNameVersionData.forEach(cl => {
            if (cl.clID === selectedClID) {
                this.checklistVersionData = cl.versions;
            }
        });
        this.checklistLogForm.get('version').enable();
    }

    retrieveChecklistNamesAndVersions() {
        this.cmService.retrieveCMChecklistLogNames().subscribe(res => {
            if (res.error) {
                this.msgs.push({
                    severity: 'error', summary: 'Server Error', detail: res.error
                });
            }
            if (res.results) {
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
                });

                this.checklistNameVersionData.sort((a, b) => (a > b ? 1 : -1));
                this.checklistNameVersionData.forEach(cl => {
                    cl.versions.sort((a, b) => a.label - b.label);
                });

                this.checklistNameData = [];
                this.checklistNameVersionData.forEach(cl => {
                    this.checklistNameData.push(cl.name);
                });
                this.loading = false;
            }
        }, error => {
            this.msgs.push({
                severity: 'error', summary: 'Server Error', detail: error
            });
        });
    }

    retrieveChecklistDetails() {
        this.checklistLogForm.get('clID').markAsDirty();
        this.checklistLogForm.get('version').markAsDirty();

        if (this.checklistLogForm.get('clID').invalid || this.checklistLogForm.get('version').invalid) {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: 'Please select a checklist name and version'
            });
            return;
        }
        let selectedClID = this.checklistLogForm.get('clID').value;
        let selectedVersion = this.checklistLogForm.get('version').value;

        this.cmService.retrieveCMChecklistLogDetails(selectedClID, selectedVersion).subscribe(res => {
            if (res.error) {
                this.msgs.push({
                    severity: 'error', summary: 'Server Error', detail: res.error
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
                this.searched = true;
            }
        }, error => {
            this.msgs.push({
                severity: 'error', summary: 'Server Error', detail: error
            });
            return;
        });
    }
}
