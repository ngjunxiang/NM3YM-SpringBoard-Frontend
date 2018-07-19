import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { CommonModule } from '@angular/common';
import { LoginForgotPwComponent } from './pages/login-forgot-pw/login-forgot-pw.component';

const routes: Routes = [
    { 
        path: '', 
        component: LoginComponent
    },
    {
        path: 'forgotpw',
        component: LoginForgotPwComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ],
    declarations: []
})

export class LoginRoutingModule { }
