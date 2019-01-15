import { Component, OnInit, Input } from '@angular/core';

import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../../core/services/authentication.service';

import { MessageService } from 'primeng/components/common/api';
import { SpringboardService } from '../../core/services/springboard.service';


interface IPdfDataInput {
  prefix?: string;
  returnFileName?: string;
  fileName?: string;
  docID?: Number;
  formArray?: Number;
}

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.scss']
})

export class UploadFormComponent implements OnInit {
  @Input() loopData;
 
  // UI Control
  public loading = false;
  public uploading = false;

  // UI Component
  public uploadUrl: string = environment.host + '/app/fo/upload-document';
  public inputFiles: any[];
  public errorFiles: any[];
  public response: any;

  public pdfDataInput:IPdfDataInput = { prefix: 'doc' };

  constructor(
    private authService: AuthenticationService,
    private messageService: MessageService,
    private springboardService: SpringboardService) {
  }

  ngOnInit() {
  }

  onBeforeUpload(event) {
    this.inputFiles = [];
    this.errorFiles = [];
    let authItems = this.authService.authItems;
    event.formData.append('username', authItems.username);
    event.formData.append('userType', authItems.userType);
    event.formData.append('token', authItems.token);
    event.formData.append('documentFileName', this.pdfDataInput.returnFileName);
    this.uploading = true;
  }

  onSelect(event) {
    console.log('this.loopData.docID', this.loopData.docID);
    console.log('this.loopData.formArray', this.loopData.formArray);
    console.log('event.files[0].name', event.files[0].name);
    var timestamp = new Date().getUTCMilliseconds();

    this.pdfDataInput.docID = this.loopData.docID;
    this.pdfDataInput.formArray = this.loopData.formArray;
    this.pdfDataInput.fileName = event.files[0].name;
    this.pdfDataInput.returnFileName = this.pdfDataInput.prefix 
                                      + this.loopData.docCat 
                                      + this.pdfDataInput.formArray 
                                      + this.pdfDataInput.docID 
                                      + timestamp.toString() + '-' + this.pdfDataInput.fileName;
  }

  onUpload(event) {
    if (event.xhr.response) {
      let res = JSON.parse(event.xhr.response);

      if (res.error) {
        for (let file of event.files) {
          this.errorFiles.push(file);
        }

        if (res.error === 'file is not pdf') {
          this.messageService.add({ key: 'msgs', severity: 'error', summary: 'File Format Error', detail: 'Please try again with a PDF file' });
        } else if (res.error === 'file may be corrupted, check file format and try again.') {
          this.messageService.add({ key: 'msgs', severity: 'error', summary: 'Corrupted File Error', detail: 'File may be corrupted. Please check the file and try again' });
        } else {
          this.messageService.add({ key: 'msgs', severity: 'error', summary: 'File Error', detail: res.error });
        }
        this.uploading = false;
        return;
      }

      if (res.results) {
        for (let file of event.files) {
          this.inputFiles.push(file);
          // GETTING RESPONSE
          console.log('this.pdfDataInput', this.pdfDataInput);
          this.springboardService.pdfDataInput.returnFileName = this.pdfDataInput.returnFileName;
          this.springboardService.pdfDataInput.formArray = this.pdfDataInput.formArray;
          
          this.springboardService.sendUploadingDoc('uploaded');
          
        }
        this.response = res.results;
        this.messageService.add({ key: 'msgs', severity: 'success', summary: 'Success', detail: 'File has been uploaded' });
        this.uploading = false;
      }
    }
  }

  onError(event) {
    this.errorFiles = [];
    for (let file of event.files) {
      this.errorFiles.push(file);
    }

    this.messageService.add({
      key: 'msgs', severity: 'error', summary: 'Server Error', detail: 'Please try again later'
    });
    this.loading = false;
  }

  ngOnDestroy() {
    this.springboardService.clearData();
  }

}



