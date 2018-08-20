import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { CMComponent } from './pages/cm.component';
import { CMDashboardComponent } from './pages/cm-dashboard/cm-dashboard.component';
import { CMChecklistComponent } from './pages/cm-checklist/cm-checklist.component';
import { CMNewChecklistComponent } from './pages/cm-new-checklist/cm-new-checklist.component';
import { CMEditChecklistComponent } from './pages/cm-edit-checklist/cm-edit-checklist.component';
import { CMViewChecklistLogsComponent } from './pages/cm-view-checklist-logs/cm-view-checklist-logs.component';

const routes: Routes = [
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
                }
            },
            {
                path: 'checklist/manage/edit/:id',
                component: CMEditChecklistComponent,
                data: {
                    title: 'Client Management',
                    urls: [{ title: 'Checklists' }, { title: 'Edit' }]
                }
            },
            {
                path: 'checklist/manage',
                component: CMChecklistComponent,
                data: {
                    title: 'Client Management',
                    urls: [{ title: 'Checklists' }, { title: 'Manage' }]
                }
            },
            {
                path: 'checklist/create',
                component: CMNewChecklistComponent,
                data: {
                    title: 'Client Management',
                    urls: [{ title: 'Checklists' }, { title: 'New' }]
                }
            },
            {
                path: 'checklist/logs',
                component: CMViewChecklistLogsComponent,
                data: {
                    title: 'Client Management',
                    urls: [{ title: 'Checklists' }, { title: 'View Logs' }]
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

export class CMRoutingModule { }