import { Component, OnInit } from '@angular/core';

import { Message } from 'primeng/components/common/api';
import { environment } from '../../../../../environments/environment';
import { AuthenticationService } from '../../../../core/services/authentication.service';

@Component({
    selector: 'cm-upload-reg51',
    templateUrl: './cm-upload-reg51.component.html',
    styleUrls: ['./cm-upload-reg51.component.css']
})

export class CMUploadReg51Component implements OnInit {

    // UI Control
    loading = false;
    msgs: Message[] = [];

    // UI Component
    uploadUrl: string = environment.host + '/app/cm/upload-reg51';
    inputFiles: any[];
    errorFiles: any[];
    response: any;

    constructor(
        private authService: AuthenticationService
    ) { }

    ngOnInit() {
    }

    onBeforeUpload(event) {
        this.inputFiles = [];
        this.errorFiles = [];
        let authItems = this.authService.authItems;
        event.formData.append('username', authItems.username);
        event.formData.append('userType', authItems.userType);
        event.formData.append('token', authItems.token);
        this.loading = true;
    }

    onUpload(event) {
        if (event.xhr.response) {
            let res = JSON.parse(event.xhr.response);
            if (res.error) {
                for (let file of event.files) {
                    this.errorFiles.push(file);
                }

                if (res.error === 'file is not pdf') {
                    this.msgs.push({
                        severity: 'error', summary: 'File Format Error', detail: 'Please try again with a PDF file'
                    });
                } else if (res.error === 'file may be corrupted, check file format and try again.') {
                    this.msgs.push({
                        severity: 'error', summary: 'Corrupted File Error', detail: 'File may be corrupted. Please check the file and try again'
                    });
                } else {
                    this.msgs.push({
                        severity: 'error', summary: 'File Error', detail: res.error
                    });
                }
                this.loading = false;
                return;
            }
            if (res.results) {
                for (let file of event.files) {
                    this.inputFiles.push(file);
                }

                this.response = res.results;

                this.msgs.push({
                    severity: 'success', summary: 'Success', detail: 'File has been uploaded'
                });

                this.loading = false;
            }
        }
    }

    onError(event) {
        this.errorFiles = [];
        for (let file of event.files) {
            this.errorFiles.push(file);
        }

        this.msgs.push({
            severity: 'error', summary: 'Server Error', detail: 'Please try again later'
        });
        this.loading = false;
    }
}