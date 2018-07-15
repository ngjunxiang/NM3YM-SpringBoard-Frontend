import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule, PerfectScrollbarConfigInterface, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

import { CMRoutingModule } from './cm-routing.module';
import { CMComponent } from './pages/cm.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { NavigationComponent } from '../../shared/header-navigation/navigation.component';
import { BreadcrumbComponent } from '../../shared/breadcrumb/breadcrumb.component';
import { IdleTimeoutComponent } from '../../core/idletimeout/idle.timeout.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
}

@NgModule({
    imports: [
        CMRoutingModule,
        ButtonModule,
        CommonModule,
        DialogModule,
        NgbModule.forRoot(),
        PerfectScrollbarModule
    ],
    declarations: [
        CMComponent,
        IdleTimeoutComponent,
        BreadcrumbComponent,
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

export class CMModule { }
