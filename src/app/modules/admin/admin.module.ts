import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerfectScrollbarModule, PerfectScrollbarConfigInterface, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './pages/admin.component';
import { IdleTimeoutComponent } from '../../core/idletimeout/idle.timeout.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { NavigationComponent } from '../../shared/header-navigation/navigation.component';
import { BreadcrumbComponent } from '../../shared/breadcrumb/breadcrumb.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
}

@NgModule({
    imports: [
        AdminRoutingModule,
        ButtonModule,
        CommonModule,
        DialogModule,
        NgbModule.forRoot(),
        PerfectScrollbarModule,
    ],
    declarations: [
        AdminComponent,
        BreadcrumbComponent,
        IdleTimeoutComponent,
        NavigationComponent,
        SidebarComponent
    ],
    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        }
    ]
})
export class AdminModule { }
