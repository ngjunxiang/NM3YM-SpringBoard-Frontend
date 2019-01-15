import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { FOAuthGuard } from '../../core/guard/fo-auth.guard';
import { FOComponent } from './pages/fo.component';
import { FODashboardComponent } from './pages/fo-dashboard/fo-dashboard.component';
import { FOManageOnboardComponent } from './pages/fo-manage-onboard/fo-manage-onboard.component';
import { FONewOnboardComponent } from './pages/fo-new-onboard/fo-new-onboard.component';
import { FOEditOnboardComponent } from './pages/fo-edit-onboard/fo-edit-onboard.component';
import { FOFaqViewAllComponent } from './pages/fo-faq-viewall/fo-faq-viewall.component';
import { FOFaqMyQuestionsComponent } from './pages/fo-faq-myquestions/fo-faq-myquestions.component';
import { FOViewPDFComponent } from './pages/fo-view-pdf/fo-view-pdf.component';
import { CanDeactivateGuard } from '../../core/can-deactivate/can-deactivate.guard';

const routes: Routes = [
    { 
        path: '', 
        redirectTo: 'dashboard/', 
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
                canActivate: [FOAuthGuard],
                canDeactivate: [CanDeactivateGuard]
            },
            {
                path: 'onboard/edit/:id',
                component: FOEditOnboardComponent,
                data: {
                    title: 'Front Office',
                    urls: [{ title: 'Onboard' }, { title: 'Edit' }]
                }, 
                canActivate: [FOAuthGuard],
                canDeactivate: [CanDeactivateGuard]
            },
            {
                path: 'faq/myquestions',
                component: FOFaqMyQuestionsComponent,
                data: {
                    title: 'Front Office',
                    urls: [{ title: 'FAQ' }, { title: 'My Questions' }]
                }, 
                canActivate: [FOAuthGuard] 
            },
            {
                path: 'faq/viewall',
                component: FOFaqViewAllComponent,
                data: {
                    title: 'Front Office',
                    urls: [{ title: 'FAQ' }, { title: 'View All' }]
                }, 
                canActivate: [FOAuthGuard] 
            },
            {
                path: 'viewpdf',
                component: FOViewPDFComponent,
                data: {
                    title: 'Front Office',
                    urls: [{ title: 'FAQ' }, { title: 'View PDF' }]
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