import { Component, OnInit } from '@angular/core';

import { Message } from 'primeng/components/common/api';

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
    inputFile: any;

    constructor() { }

    ngOnInit() {
    }

    onUpload(event) {
        for (let file of event.files) {
            this.inputFile = file;
        }
        console.log('a');
    }

    uploadFile() {

    }
}
