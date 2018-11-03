import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';

import { MessageService } from 'primeng/api';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { AuthenticationService } from '../../core/services/authentication.service';
import { LoginForgotPwComponent } from './pages/login-forgot-pw/login-forgot-pw.component';

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
        ReactiveFormsModule,
        ToastModule
    ],
    declarations: [
        LoginComponent, 
        LoginForgotPwComponent
    ],
    providers: [
        AuthenticationService,
        MessageService
    ]
})
export class LoginModule { }
