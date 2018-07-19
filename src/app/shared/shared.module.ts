import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { SpinnerComponent } from './spinner.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { NavigationComponent } from './header-navigation/navigation.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { IdleTimeoutComponent } from '../core/idletimeout/idle.timeout.component';

@NgModule({
    imports: [
        ButtonModule,
        CommonModule,
        DialogModule,
        RouterModule,
        NgbModule.forRoot(),
        PerfectScrollbarModule
    ],
    exports: [
        BreadcrumbComponent,
        IdleTimeoutComponent,
        NavigationComponent,
        SidebarComponent,
        SpinnerComponent
    ],
    declarations: [
        BreadcrumbComponent,
        IdleTimeoutComponent,
        NavigationComponent,
        SidebarComponent,
        SpinnerComponent
    ]
})
export class SharedModule { }
