import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { RMAuthGuard } from '../../core/guard/rm-auth.guard';
import { RMComponent } from './pages/rm.component';
import { RMDashboardComponent } from './pages/rm-dashboard/rm-dashboard.component';
import { RMManageOnboardComponent } from './pages/rm-manage-onboard/rm-manage-onboard.component';
import { RMNewOnboardComponent } from './pages/rm-new-onboard/rm-new-onboard.component';
import { RMEditOnboardComponent } from './pages/rm-edit-onboard/rm-edit-onboard.component';
import { RMFaqComponent } from './pages/rm-faq/rm-faq.component';

const routes: Routes = [
    { 
        path: '', 
        redirectTo: 'dashboard', 
        pathMatch: 'full' 
    },
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
                }, 
                canActivate: [RMAuthGuard] 
            },
            {
                path: 'onboard/manage',
                component: RMManageOnboardComponent,
                data: {
                    title: 'Marketing Assistant',
                    urls: [{ title: 'Onboard' }, { title: 'Manage' }]
                }, 
                canActivate: [RMAuthGuard] 
            },
            {
                path: 'onboard/create',
                component: RMNewOnboardComponent,
                data: {
                    title: 'Marketing Assistant',
                    urls: [{ title: 'Onboard' }, { title: 'New' }]
                }, 
                canActivate: [RMAuthGuard] 
            },
            {
                path: 'onboard/edit/:id',
                component: RMEditOnboardComponent,
                data: {
                    title: 'Marketing Assistant',
                    urls: [{ title: 'Onboard' }, { title: 'Edit' }]
                }, 
                canActivate: [RMAuthGuard] 
            },
            {
                path: 'faq',
                component: RMFaqComponent,
                data: {
                    title: 'Marketing Assistant',
                    urls: [{ title: 'FAQ' }]
                }, 
                canActivate: [RMAuthGuard] 
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