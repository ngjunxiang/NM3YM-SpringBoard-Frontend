import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RMComponent } from './pages/rm.component';
import { RMDashboardComponent } from './pages/rm-dashboard/rm-dashboard.component';
import { RMNewOnboardComponent } from './pages/rm-new-onboard/rm-new-onboard.component';

const routes: Routes = [
    {
        path: '',
        component: RMComponent,
        children: [
            {
                path: 'dashboard',
                component: RMDashboardComponent,
                data: {
                    title: 'Relationship Manager',
                    urls: [{ title: 'Dashboard' }]
                }
            },
            {
                path: 'onboard/create',
                component: RMNewOnboardComponent,
                data: {
                    title: 'Relationship Manager',
                    urls: [{ title: 'Onboard' }, { title: 'Create' }]
                }
            }
            // {
            //     path: 'checklist/create',
            //     component: CMNewChecklistComponent,
            //     data: {
            //         title: 'Client Management',
            //         urls: [{ title: 'Checklist' }, { title: 'New' }]
            //     }
            // }

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