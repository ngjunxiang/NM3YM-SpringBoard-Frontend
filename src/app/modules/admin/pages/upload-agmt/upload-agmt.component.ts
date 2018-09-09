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
    inputFile: any;

    constructor() { }

    ngOnInit() {
    }

    onUpload(event) {
        for (let file of event.files) {
            this.inputFile = file;
        }
    }
}
