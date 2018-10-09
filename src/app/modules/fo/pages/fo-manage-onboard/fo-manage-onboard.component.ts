import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ConfirmationService } from 'primeng/components/common/confirmationservice';
import { Message } from 'primeng/components/common/api';

import { FOService } from '../../../../core/services/fo.service';

@Component({
    selector: 'fo-manage-onboard',
    templateUrl: './fo-manage-onboard.component.html',
    styleUrls: ['./fo-manage-onboard.component.scss']
})

export class FOManageOnboardComponent implements OnInit {

    // UI Control
    loading = false;
    msgs: Message[] = [];

    // UI Components
    obProcesses: any;
    sortOptions: any[];
    filterOptions: any[];
    selectedSortOpt: string;
    selectedFilterOpt: string;

    // Temporary storage of return processes from backend
    allProcesses: any;
    filteredProcesses: any;

    constructor(
        private confirmationService: ConfirmationService,
        private foService: FOService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.selectedFilterOpt = params['filterby'];
        });

        if (this.selectedFilterOpt === undefined) {
            this.selectedFilterOpt = 'none';
        }

        this.selectedSortOpt = 'none';

        this.retrieveAllOnboardProcesses();

        this.sortOptions = [
            { label: 'No Selection', value: 'none' },
            { label: 'Checklist Name', value: 'name' },
            { label: 'Client Name', value: 'Client Name' },
            { label: 'Date', value: 'date' },
            { label: 'Progress', value: 'progress' }

        ];

        this.filterOptions = [
            { label: 'No Selection', value: 'none' },
            { label: 'Completed', value: 'completed' },
            { label: 'Pending', value: 'pending' }
        ];
    }

    onSortChange() {
        this.retrieveSortedOnboardProcesses();
    }

    onFilterChange() {
        this.retrieveFilterOnboardProcesses();
    }

    toggleUrgent(index: number) {
        this.obProcesses[index].urgent = !this.obProcesses[index].urgent
        // invoke service
    }

    retrieveAllOnboardProcesses() {
        this.loading = true;
        this.obProcesses = [];

        this.foService.retrieveAllOnboardProcesses().subscribe(res => {
            if (res.error) {
                this.msgs.push({
                    severity: 'error', summary: 'Error', detail: res.error
                });
                return;
            }

            if (res.results) {
                this.allProcesses = res.results.obLists;
                this.filteredProcesses = res.results.obLists;
                res.results.obLists.forEach(obList => {
                    let requiredFields = [];
                    let type = obList.name;
                    let obID = obList.obID;
                    let conditions = [];
                    let progress = obList.progress;
                    let urgent = obList.urgent;
                    Object.keys(obList.requiredFields).forEach(key => {
                        let fieldName;
                        for (fieldName in obList.requiredFields[key]);
                        requiredFields.push({
                            'fieldName': fieldName,
                            'fieldValue': obList.requiredFields[key][fieldName]
                        });
                    });

                    obList.conditions.forEach(condition => {
                        conditions.push({
                            'conditionName': condition.conditionName,
                            'conditionValue': condition.conditionOption
                        });
                    });

                    this.obProcesses.push({
                        'obID': obID,
                        'type': type,
                        'requiredFields': requiredFields,
                        'conditions': conditions,
                        'progress': progress,
                        'urgent': urgent
                    });
                });
            }
            if (this.selectedFilterOpt !== "none") {
                this.retrieveFilterOnboardProcesses();
            }

            this.loading = false;
        }, error => {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: error
            });
        });
    }

    retrieveSortedOnboardProcesses() {
        this.loading = true;

        this.foService.retrieveSortedOnboardProcesses(this.selectedSortOpt, this.filteredProcesses).subscribe(res => {
            if (res.error) {
                this.msgs.push({
                    severity: 'error', summary: 'Error', detail: res.error
                });
                return;
            }

            this.obProcesses = [];
            if (res.results.obLists) {
                res.results.obLists.forEach(obList => {
                    let requiredFields = [];
                    let type = obList.name;
                    let obID = obList.obID;
                    let conditions = [];
                    let progress = obList.progress;
                    let urgent = obList.urgent;
                    Object.keys(obList.requiredFields).forEach(key => {
                        let fieldName;
                        for (fieldName in obList.requiredFields[key]);
                        requiredFields.push({
                            'fieldName': fieldName,
                            'fieldValue': obList.requiredFields[key][fieldName]
                        });
                    });

                    obList.conditions.forEach(condition => {
                        conditions.push({
                            'conditionName': condition.conditionName,
                            'conditionValue': condition.conditionOption
                        });
                    });

                    this.obProcesses.push({
                        'obID': obID,
                        'type': type,
                        'requiredFields': requiredFields,
                        'conditions': conditions,
                        'progress': progress,
                        'urgent': urgent
                    });

                });
            }
            this.loading = false;
        }, error => {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: error
            });
        });
    }

    retrieveFilterOnboardProcesses() {
        this.loading = true;
        this.obProcesses = [];

        this.foService.retrieveFilteredOnboardProcesses(this.selectedFilterOpt, this.allProcesses).subscribe(res => {
            if (res.error) {
                this.msgs.push({
                    severity: 'error', summary: 'Error', detail: res.error
                });
                return;
            }

            if (res.results.obLists) {
                this.filteredProcesses = res.results.obLists;
                res.results.obLists.forEach(obList => {
                    let requiredFields = [];
                    let type = obList.name;
                    let obID = obList.obID;
                    let conditions = [];
                    let progress = obList.progress;
                    let urgent = obList.urgent;
                    Object.keys(obList.requiredFields).forEach(key => {
                        let fieldName;
                        for (fieldName in obList.requiredFields[key]);
                        requiredFields.push({
                            'fieldName': fieldName,
                            'fieldValue': obList.requiredFields[key][fieldName]
                        });
                    });

                    obList.conditions.forEach(condition => {
                        conditions.push({
                            'conditionName': condition.conditionName,
                            'conditionValue': condition.conditionOption
                        });
                    });

                    this.obProcesses.push({
                        'obID': obID,
                        'type': type,
                        'requiredFields': requiredFields,
                        'conditions': conditions,
                        'progress': progress,
                        'urgent': urgent
                    });
                });
            }

            if (this.selectedSortOpt != 'none') {
                this.retrieveSortedOnboardProcesses()
            }

            this.loading = false;
        }, error => {
            this.msgs.push({
                severity: 'error', summary: 'Error', detail: error
            });
        });
    }

    editOnboardProcess(index: number) {
        let selectedOnboardID = this.obProcesses[index].obID;
        this.router.navigate(['/fo/onboard/edit', selectedOnboardID], {
            queryParams: {
                name: this.obProcesses[index].type
            }
        });
    }

    deleteOnboardProcess(index: number) {
        this.confirmationService.confirm({
            message: 'Do you want to delete this onboard process?',
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                let selectedOnboardID = this.obProcesses[index].obID;
                this.foService.deleteOnboardProcess(selectedOnboardID).subscribe(res => {
                    if (res.error) {
                        this.msgs.push({
                            severity: 'error', summary: 'Error', detail: res.error
                        });
                        return;
                    }

                    if (res.results) {
                        this.retrieveAllOnboardProcesses();
                        this.msgs.push({
                            severity: 'success', summary: 'Success', detail: 'Onboard process deleted'
                        });
                    }
                }, error => {
                    this.msgs.push({
                        severity: 'error', summary: 'Error', detail: error
                    });
                });
            },
            reject: () => {
                return;
            }
        });
    }
}
