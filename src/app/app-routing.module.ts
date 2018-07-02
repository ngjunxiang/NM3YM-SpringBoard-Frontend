import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AdminAuthGuard } from './core/guard/admin-auth.guard';
import { UserAuthGuard } from './core/guard/user-auth.guard';

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
        path: 'user',
        loadChildren: './modules/user/user.module#UserModule',
        canActivate: [UserAuthGuard]
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
