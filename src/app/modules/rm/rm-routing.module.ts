import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { RMComponent } from './pages/rm.component';
import { RMDashboardComponent } from './pages/rm-dashboard/rm-dashboard.component';
import { RMNewOnboardComponent } from './pages/rm-new-onboard/rm-new-onboard.component';
import { RMEditOnboardComponent } from './pages/rm-edit-onboard/rm-edit-onboard.component';

const routes: Routes = [
    {
        path: '',
        component: RMComponent,
        children: [
            {
                path: 'dashboard',
                component: RMDashboardComponent,
                data: {
                    title: 'Marketing Assistant',
                    urls: [{ title: 'Dashboard' }]
                }
            },
            {
                path: 'onboard/create',
                component: RMNewOnboardComponent,
                data: {
                    title: 'Marketing Assistant',
                    urls: [{ title: 'Onboard' }, { title: 'New' }]
                }
            },
            {
                path: 'onboard/edit/:id',
                component: RMEditOnboardComponent,
                data: {
                    title: 'Marketing Assistant',
                    urls: [{ title: 'Onboard' }, { title: 'Edit' }]
                }
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'dashboard',
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

export class RMRoutingModule { }