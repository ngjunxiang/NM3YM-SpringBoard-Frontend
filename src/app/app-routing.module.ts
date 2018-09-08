import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
    { 
        path: '', 
        redirectTo: 'login', 
        pathMatch: 'full' 
    },
    { 
        path: 'login', 
        loadChildren: './modules/login/login.module#LoginModule' 
    },
    { 
        path: 'admin', 
        loadChildren: './modules/admin/admin.module#AdminModule'
    },
    {
        path: 'rm',
        loadChildren: './modules/rm/rm.module#RMModule'
    },
    {
        path: 'cm',
        loadChildren: './modules/cm/cm.module#CMModule'
    },
    {
        path: 'compliance',
        loadChildren: './modules/compliance/compliance.module#ComplianceModule'
    },
    {
        path: '**',
        loadChildren: './modules/login/login.module#LoginModule' 
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forRoot(routes, { useHash: true })
    ],
    exports: [
        RouterModule
    ],
    declarations: []
})
export class AppRoutingModule { }
