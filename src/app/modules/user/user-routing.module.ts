import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './pages/user.component';

const routes: Routes = [
    {
        path: '',
        component: UserComponent,
        data: {
            title: 'User',
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

export class UserRoutingModule { }
