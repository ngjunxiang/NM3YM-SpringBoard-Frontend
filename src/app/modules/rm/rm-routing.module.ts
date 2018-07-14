import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RMComponent } from './pages/rm.component';

const routes: Routes = [
    {
        path: '',
        component: RMComponent,
        data: {
            title: 'Relationship Manager',
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

export class RMRoutingModule { }