import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './pages/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';

@NgModule({
    imports: [
        ButtonModule,
        CommonModule,
        FormsModule,
        InputTextModule,
        LoginRoutingModule,
        MessageModule,
        MessagesModule,
        PanelModule,
        ReactiveFormsModule
    ],
    declarations: [LoginComponent]
})
export class LoginModule { }
