import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CMComponent } from './pages/cm.component';

const routes: Routes = [
    {
        path: '',
        component: CMComponent,
        data: {
            title: 'Client Management',
            urls: [{ title: 'Main Page', url: '/dashboard' }, { title: 'Clients' }]
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

export class CMRoutingModule { }