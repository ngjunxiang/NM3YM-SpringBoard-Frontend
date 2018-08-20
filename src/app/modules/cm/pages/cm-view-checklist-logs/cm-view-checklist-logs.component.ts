import { Component, OnInit } from '@angular/core';

import { SelectItem, Message } from 'primeng/components/common/api';
import { ChecklistService } from '../../../../core/services/checklist.service';

@Component({
    selector: 'cm-view-checklist-logs',
    templateUrl: './cm-view-checklist-logs.component.html',
    styleUrls: ['./cm-view-checklist-logs.component.scss']
})

export class CMViewChecklistLogsComponent implements OnInit {

    // UI Control
    loading = false;
    msgs: Message[] = [];

    // UI Components
    checklistNameDropdownData: SelectItem[];
    complianceMOCols: any[];
    complianceCCols: any[];
    legalMOCols: any[];
    legalCCols: any[];

    constructor(
        checklistService: ChecklistService
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

        this.retrieveChecklistNames();
    }

    retrieveChecklistNames() {

    }
}
