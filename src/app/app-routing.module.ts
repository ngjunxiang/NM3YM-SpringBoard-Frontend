import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// PRELOGIN
// import { FOComponent } from './modules/fo/pages/fo.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'ma',
        redirectTo: 'fo',
        pathMatch: 'full'
    },
    {
        path: 'rm',
        redirectTo: 'fo/dashboard',
        pathMatch: 'full'
    },
    // {
    //     path: 'fo',
    //     redirectTo: 'fo/dashboard',
    //     pathMatch: 'full'
    // },
    {
        path: 'login',
        loadChildren: './modules/login/login.module#LoginModule'
    },
    {
        path: 'admin',
        loadChildren: './modules/admin/admin.module#AdminModule'
    },
    {
        path: 'fo',
        loadChildren: './modules/fo/fo.module#FOModule'
    },
    {
        path: 'cm',
        loadChildren: './modules/cm/cm.module#CMModule'
    },
    {
        path: '**',
        loadChildren: './modules/login/login.module#LoginModule'
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forRoot(routes, {
            useHash: true,
            enableTracing: false // <-- debugging purposes only
        })
    ],
    exports: [
        RouterModule
    ],
    declarations: []
})
export class AppRoutingModule { }
