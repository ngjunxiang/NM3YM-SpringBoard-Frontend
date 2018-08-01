import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerfectScrollbarModule, PerfectScrollbarConfigInterface, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { GrowlModule } from 'primeng/growl';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { SharedModule } from '../../shared/shared.module';

import { RMRoutingModule } from './rm-routing.module';
import { RMComponent } from './pages/rm.component';
import { RMDashboardComponent } from './pages/rm-dashboard/rm-dashboard.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
}

@NgModule({
    imports: [
        RMRoutingModule,
        ButtonModule,
        CommonModule,
        DialogModule,
        GrowlModule,
        MessageModule,
        MessagesModule,
        NgbModule.forRoot(),
        PerfectScrollbarModule,
        SharedModule
    ],
    declarations: [
        RMComponent,
        RMDashboardComponent
    ],
    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        }
    ]
})

export class RMModule { }
