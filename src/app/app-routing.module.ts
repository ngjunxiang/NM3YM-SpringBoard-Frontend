import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AdminAuthGuard } from './core/guard/admin-auth.guard';
import { RMAuthGuard } from './core/guard/rm-auth.guard';
import { CMAuthGuard } from './core/guard/cm-auth.guard';

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
        loadChildren: './modules/admin/admin.module#AdminModule', 
        canActivate: [AdminAuthGuard] 
    },
    {
        path: 'rm',
        loadChildren: './modules/rm/rm.module#RMModule',
        canActivate: [RMAuthGuard]
    },
    {
        path: 'cm',
        loadChildren: './modules/cm/cm.module#CMModule',
        canActivate: [CMAuthGuard]
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ],
    declarations: []
})
export class AppRoutingModule { }
