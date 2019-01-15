import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FileUploadModule } from 'primeng/fileupload';

import { UploadFormComponent } from './upload-form/upload-form.component';

@NgModule({
  imports: [
    CommonModule,
    FileUploadModule
  ],
  declarations: [
    UploadFormComponent
  ],
  exports: [
    UploadFormComponent
  ]
})
export class UiModule { }
