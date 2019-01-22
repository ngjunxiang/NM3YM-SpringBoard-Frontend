import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { CMAuthGuard } from '../../core/guard/cm-auth.guard';
import { CMComponent } from './pages/cm.component';
import { CMDashboardComponent } from './pages/cm-dashboard/cm-dashboard.component';
import { CMChecklistComponent } from './pages/cm-checklist/cm-checklist.component';
import { CMEditChecklistComponent } from './pages/cm-edit-checklist/cm-edit-checklist.component';
import { CMViewChecklistLogsComponent } from './pages/cm-view-checklist-logs/cm-view-checklist-logs.component';
import { CMNewChecklistComponent } from './pages/cm-new-checklist/cm-new-checklist.component';
import { CMFaqManageComponent } from './pages/cm-faq-manage/cm-faq-manage.component';
import { CMFaqCreateComponent } from './pages/cm-faq-create/cm-faq-create.component';
import { CMFaqMyAnswersComponent } from './pages/cm-faq-myanswers/cm-faq-myanswers.component';
import { CMFAQTrainModelComponent } from './pages/cm-faq-train-model/cm-faq-train-model.component';
import { CMFaqCleaningComponent } from './pages/cm-faq-cleaning/cm-faq-cleaning.component';
import { CMFaqSynonymComponent } from './pages/cm-faq-synonym/cm-faq-synonym.component';
import { CMUploadAgmtComponent } from './pages/cm-upload-agmt/cm-upload-agmt.component';
import { CMUploadReg51Component } from './pages/cm-upload-reg51/cm-upload-reg51.component';
import { CanDeactivateGuard } from '../../core/can-deactivate/can-deactivate.guard';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: '',
        component: CMComponent,
        children: [
            {
                path: 'dashboard',
                component: CMDashboardComponent,
                data: {
                    title: 'Client Management',
                    urls: [{ title: 'Dashboard' }]
                },
                canActivate: [CMAuthGuard]
            },
            {
                path: 'checklist/manage/edit/:id',
                component: CMEditChecklistComponent,
                data: {
                    title: 'Client Management',
                    urls: [{ title: 'Checklists' }, { title: 'Edit' }]
                },
                canActivate: [CMAuthGuard],
                canDeactivate: [CanDeactivateGuard]
            },
            {
                path: 'checklist/manage',
                component: CMChecklistComponent,
                data: {
                    title: 'Client Management',
                    urls: [{ title: 'Checklists' }, { title: 'Manage' }]
                },
                canActivate: [CMAuthGuard]
            },
            {
                path: 'checklist/create',
                component: CMNewChecklistComponent,
                data: {
                    title: 'Client Management',
                    urls: [{ title: 'Checklists' }, { title: 'New' }]
                },
                canActivate: [CMAuthGuard],
                canDeactivate: [CanDeactivateGuard]
            },
            {
                path: 'checklist/logs',
                component: CMViewChecklistLogsComponent,
                data: {
                    title: 'Client Management',
                    urls: [{ title: 'Checklists' }, { title: 'View Logs' }]
                },
                canActivate: [CMAuthGuard]
            },
            {
                path: 'faq/clean',
                component: CMFaqCleaningComponent,
                data: {
                    title: 'Client Management',
                    urls: [{ title: 'FAQ' }, { title: 'Clean Data' }]
                },
                canActivate: [CMAuthGuard]
            },
            {
                path: 'faq/createFAQ',
                component: CMFaqCreateComponent,
                data: {
                    title: 'Client Management',
                    urls: [{ title: 'FAQ' }, { title: 'Create FAQ' }]
                },
                canActivate: [CMAuthGuard]
            },
            {
                path: 'faq/manage',
                component: CMFaqManageComponent,
                data: {
                    title: 'Client Management',
                    urls: [{ title: 'FAQ' }, { title: 'Manage' }]
                },
                canActivate: [CMAuthGuard]
            },
            {
                path: 'faq/myAnswers',
                component: CMFaqMyAnswersComponent,
                data: {
                    title: 'Client Management',
                    urls: [{ title: 'FAQ' }, { title: 'My Answers' }]
                },
                canActivate: [CMAuthGuard]
            },
            {
                path: 'faq/synonym',
                component: CMFaqSynonymComponent,
                data: {
                    title: 'Client Management',
                    urls: [{ title: 'FAQ' }, { title: 'Synonyms' }]
                },
                canActivate: [CMAuthGuard]
            },
            {
                path: 'faq/trainModel',
                component: CMFAQTrainModelComponent,
                data: {
                    title: 'Client Management',
                    urls: [{ title: 'FAQ' }, { title: 'Clean Data' }]
                },
                canActivate: [CMAuthGuard]
            },
            {
                path: 'upload/agmtDoc',
                component: CMUploadAgmtComponent,
                data: {
                    title: 'Client Management',
                    urls: [{ title: 'Upload' }, { title: 'Agmt - Doc Mapping' }]
                },
                canActivate: [CMAuthGuard]
            },
            {
                path: 'upload/reg51',
                component: CMUploadReg51Component,
                data: {
                    title: 'Client Management',
                    urls: [{ title: 'Upload' }, { title: 'Reg51' }]
                },
                canActivate: [CMAuthGuard]
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

export class CMRoutingModule { }