import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CMComponent } from './pages/cm.component';
import { CMDashboardComponent } from './pages/cm-dashboard/cm-dashboard.component';
import { CMChecklistComponent } from './pages/cm-checklist/cm-checklist.component';
import { CMNewChecklistComponent } from './pages/cm-new-checklist/cm-new-checklist.component';

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
                    urls: [{ title: 'Checklist' }, { title: 'New' }]
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