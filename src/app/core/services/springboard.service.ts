import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


interface UserInformation {
  hasSelectedRM?: boolean;
  hasSubmitCM?: boolean;
}
interface IPdfDataInput {
  prefix?: string;
  returnFileName?: string;
  fileName?: string;
  docID?: Number;
  formArray?: Number;
}


@Injectable({
  providedIn: 'root'
})
export class SpringboardService {

  public status = 'prelogin';
  public user: UserInformation;
  public pdfDataInput: IPdfDataInput;

  private subject = new Subject<any>();
  private uploadDocData = new Subject<any>();
  private editMode = new Subject<any>();

  constructor() {
    this.pdfDataInput = {
      prefix: 'doc', 
      returnFileName: 'ERROR'
    };
  }

  sendUploadingDoc(message: string) {
    this.uploadDocData.next(message);
  }
  clearUploadingDoc() {
    this.uploadDocData.next();
  }
  getUploadingDoc(): Observable<any> {
    return this.uploadDocData.asObservable();
  }

  sendData(message: string) {
    this.subject.next(message);
  }
  clearData() {
    this.subject.next();
  }
  getData(): Observable<any> {
    return this.subject.asObservable();
  }

  sendEditModeData(message: string) {
    this.editMode.next(message);
  }
  clearEditModeData() {
    this.editMode.next();
  }
  getEditModeData(): Observable<any> {
    return this.editMode.asObservable();
  }
}



