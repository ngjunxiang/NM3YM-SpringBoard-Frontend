import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AdminComponent } from './pages/admin.component';
import { AdminCreateUserComponent } from './pages/admin-create-user/admin-create-user.component';
import { AdminUpdateUserComponent } from './pages/admin-update-user/admin-update-user.component';
import { AdminDeleteUserComponent } from './pages/admin-delete-user/admin-delete-user.component';
import { AdminViewAllComponent } from './pages/admin-view-all/admin-view-all.component';
import { AdminAuthGuard } from '../../core/guard/admin-auth.guard';

const routes: Routes = [
    { 
        path: '', 
        redirectTo: 'panel/viewall', 
        pathMatch: 'full' 
    },
    {
        path: '',
        component: AdminComponent,
        children: [
            {
                path: 'panel/viewall',
                component: AdminViewAllComponent,
                data: {
                    title: 'Admin',
                    urls: [{ title: 'Admin Panel' }, { title: 'View All Users' }]
                }, 
                canActivate: [AdminAuthGuard] 
            },
            {
                path: 'panel/create',
                component: AdminCreateUserComponent,
                data: {
                    title: 'Admin',
                    urls: [{ title: 'Admin Panel'}, { title: 'Create User Account' }]
                }, 
                canActivate: [AdminAuthGuard] 
            },
            {
                path: 'panel/update',
                component: AdminUpdateUserComponent,
                data: {
                    title: 'Admin',
                    urls: [{ title: 'Admin Panel'}, { title: 'Update User Account' }]
                }, 
                canActivate: [AdminAuthGuard] 
            },
            {
                path: 'panel/delete',
                component: AdminDeleteUserComponent,
                data: {
                    title: 'Admin',
                    urls: [{ title: 'Admin Panel'}, { title: 'Delete User Account' }]
                }, 
                canActivate: [AdminAuthGuard] 
            }
        ]
    }, 
    {
        path: '**',
        redirectTo: 'panel', 
        pathMatch: 'full' 
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

export class AdminRoutingModule { }
