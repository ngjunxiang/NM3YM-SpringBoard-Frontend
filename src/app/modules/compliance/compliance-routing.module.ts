import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ComplianceAuthGuard } from '../../core/guard/compliance-auth.guard';
import { ComplianceComponent } from './pages/compliance.component';
import { ComplianceChecklistComponent } from './pages/compliance-checklist/compliance-checklist.component';
import { ComplianceNewChecklistComponent } from './pages/compliance-new-checklist/compliance-new-checklist.component';
import { ComplianceEditChecklistComponent } from './pages/compliance-edit-checklist/compliance-edit-checklist.component';
import { ComplianceViewChecklistLogsComponent } from './pages/compliance-view-checklist-logs/compliance-view-checklist-logs.component';

const routes: Routes = [
    { 
        path: '', 
        redirectTo: 'checklist/manage', 
        pathMatch: 'full' 
    },
    {
        path: '',
        component: ComplianceComponent,
        children: [
            {
                path: 'checklist/manage/edit/:id',
                component: ComplianceEditChecklistComponent,
                data: {
                    title: 'Compliance',
                    urls: [{ title: 'Checklists' }, { title: 'Edit' }]
                }, 
                canActivate: [ComplianceAuthGuard] 
            },
            {
                path: 'checklist/manage',
                component: ComplianceChecklistComponent,
                data: {
                    title: 'Compliance',
                    urls: [{ title: 'Checklists' }, { title: 'Manage' }]
                }, 
                canActivate: [ComplianceAuthGuard] 
            },
            {
                path: 'checklist/create',
                component: ComplianceNewChecklistComponent,
                data: {
                    title: 'Compliance',
                    urls: [{ title: 'Checklists' }, { title: 'New' }]
                }, 
                canActivate: [ComplianceAuthGuard] 
            },
            {
                path: 'checklist/logs',
                component: ComplianceViewChecklistLogsComponent,
                data: {
                    title: 'Compliance',
                    urls: [{ title: 'Checklists' }, { title: 'View Logs' }]
                }, 
                canActivate: [ComplianceAuthGuard] 
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'checklist/manage',
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

export class ComplianceRoutingModule { }