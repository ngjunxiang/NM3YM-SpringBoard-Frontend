import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AdminComponent } from './pages/admin.component';
import { CreateAdminComponent } from './pages/create-admin/create-admin.component';

const routes: Routes = [
    {
        path: '',
        component: AdminComponent,
        data: {
            title: 'Admin',
            urls: [{ title: 'Dashboard', url: '/dashboard' }]
        },
        children: [
            {
                path: 'usrmgmt/create',
                component: CreateAdminComponent,
                data: {
                    title: 'Admin',
                    urls: [{ title: 'User Management'}, { title: 'Create Users' }]
                }
            }
        ]
    }, {
        path: '**',
        component: AdminComponent,
        data: {
            title: 'Admin',
            urls: [{ title: 'Dashboard', url: '/dashboard' }]
        }
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
