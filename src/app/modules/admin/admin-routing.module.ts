import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './pages/admin.component';
import { CommonModule } from '@angular/common';

const routes: Routes = [
    {
        path: '',
        component: AdminComponent,
        data: {
            title: 'Admin',
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

export class AdminRoutingModule { }
