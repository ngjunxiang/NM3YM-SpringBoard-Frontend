import { Component, OnInit } from '@angular/core';

import { Message } from 'primeng/components/common/api';
import { environment } from '../../../../../environments/environment';

@Component({
    selector: 'admin-upload-agmt',
    templateUrl: './upload-agmt.component.html',
    styleUrls: ['./upload-agmt.component.scss']
})
export class UploadAgmtComponent implements OnInit {

    // UI Control
    loading = false;
    msgs: Message[] = [];

    // UI Component
    uploadUrl: string = environment.host + '/app/admin/upload';
    inputFiles: any[];
    progress: number;

    constructor() { }

    ngOnInit() {
    }

    onBeforeUpload(event) {
        this.loading = true;
    }

    onUpload(event) {
        this.inputFiles = [];
        for (let file of event.files) {
            this.inputFiles.push(file);
        }

        this.msgs.push({
            severity: 'success', summary: 'Success', detail: 'File has been uploaded'
        });
    }

    onError(event) {
        this.msgs.push({ 
            severity: 'error', summary: 'Server Error', detail: 'Please try again later' 
        });
        this.loading = false;
    }

    updateProgress(event) {
        this.progress = event.progress;
    }
}
