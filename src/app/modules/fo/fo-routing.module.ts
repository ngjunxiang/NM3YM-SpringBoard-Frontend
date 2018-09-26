import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { FOAuthGuard } from '../../core/guard/fo-auth.guard';
import { FOComponent } from './pages/fo.component';
import { FODashboardComponent } from './pages/fo-dashboard/fo-dashboard.component';
import { FOManageOnboardComponent } from './pages/fo-manage-onboard/fo-manage-onboard.component';
import { FONewOnboardComponent } from './pages/fo-new-onboard/fo-new-onboard.component';
import { FOEditOnboardComponent } from './pages/fo-edit-onboard/fo-edit-onboard.component';
import { FOFaqComponent } from './pages/fo-faq/fo-faq.component';

const routes: Routes = [
    { 
        path: '', 
        redirectTo: 'dashboard', 
        pathMatch: 'full' 
    },
    {
        path: '',
        component: FOComponent,
        children: [
            {
                path: 'dashboard',
                component: FODashboardComponent,
                data: {
                    title: 'Front Office',
                    urls: [{ title: 'Dashboard' }]
                }, 
                canActivate: [FOAuthGuard] 
            },
            {
                path: 'onboard/manage',
                component: FOManageOnboardComponent,
                data: {
                    title: 'Front Office',
                    urls: [{ title: 'Onboard' }, { title: 'Manage' }]
                }, 
                canActivate: [FOAuthGuard] 
            },
            {
                path: 'onboard/create',
                component: FONewOnboardComponent,
                data: {
                    title: 'Front Office',
                    urls: [{ title: 'Onboard' }, { title: 'New' }]
                }, 
                canActivate: [FOAuthGuard] 
            },
            {
                path: 'onboard/edit/:id',
                component: FOEditOnboardComponent,
                data: {
                    title: 'Front Office',
                    urls: [{ title: 'Onboard' }, { title: 'Edit' }]
                }, 
                canActivate: [FOAuthGuard] 
            },
            {
                path: 'faq',
                component: FOFaqComponent,
                data: {
                    title: 'Front Office',
                    urls: [{ title: 'FAQ' }]
                }, 
                canActivate: [FOAuthGuard] 
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

export class FORoutingModule { }