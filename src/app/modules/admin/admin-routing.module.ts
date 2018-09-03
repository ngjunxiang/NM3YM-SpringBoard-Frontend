import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AdminComponent } from './pages/admin.component';
import { CreateAdminComponent } from './pages/create-admin/create-admin.component';
import { UpdateAdminComponent } from './pages/update-admin/update-admin.component';
import { DeleteAdminComponent } from './pages/delete-admin/delete-admin.component';
import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';

const routes: Routes = [
    {
        path: '',
        component: AdminComponent,
        children: [
            {
                path: 'panel',
                component: AdminPanelComponent,
                data: {
                    title: 'Admin',
                    urls: [{ title: 'Admin Panel' }]
                }
            },
            {
                path: 'usrmgmt/create',
                component: CreateAdminComponent,
                data: {
                    title: 'Admin',
                    urls: [{ title: 'User Management'}, { title: 'Create User Account' }]
                }
            },
            {
                path: 'usrmgmt/update',
                component: UpdateAdminComponent,
                data: {
                    title: 'Admin',
                    urls: [{ title: 'User Management'}, { title: 'Update User Account' }]
                }
            },
            {
                path: 'usrmgmt/delete',
                component: DeleteAdminComponent,
                data: {
                    title: 'Admin',
                    urls: [{ title: 'User Management'}, { title: 'Delete User Account' }]
                }
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
