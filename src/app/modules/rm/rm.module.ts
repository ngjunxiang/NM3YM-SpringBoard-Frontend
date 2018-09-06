import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { PerfectScrollbarModule, PerfectScrollbarConfigInterface, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { GrowlModule } from 'primeng/growl';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PanelModule } from 'primeng/panel';
import { ProgressBarModule } from 'primeng/progressbar';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SharedModule } from '../../shared/shared.module';
import { TableModule } from 'primeng/table';

import { RMRoutingModule } from './rm-routing.module';
import { RMComponent } from './pages/rm.component';
import { RMDashboardComponent } from './pages/rm-dashboard/rm-dashboard.component';
import { RMEditOnboardComponent } from './pages/rm-edit-onboard/rm-edit-onboard.component';
import { RMManageOnboardComponent } from './pages/rm-manage-onboard/rm-manage-onboard.component';
import { RMNewOnboardComponent } from './pages/rm-new-onboard/rm-new-onboard.component';
import { ChecklistService } from '../../core/services/checklist.service';
import { OnboardService } from '../../core/services/onboard.service';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
}

@NgModule({
    imports: [
        RMRoutingModule,
        AccordionModule,
        ButtonModule,
        CardModule,
        ChartModule,
        CheckboxModule,
        CommonModule,
        ConfirmDialogModule,
        DialogModule,
        DropdownModule,
        FormsModule,
        GrowlModule,
        InputTextModule,
        MessageModule,
        MessagesModule,
        NgbModule.forRoot(),
        OverlayPanelModule,
        PanelModule,
        PerfectScrollbarModule,
        ProgressBarModule,
        ReactiveFormsModule,
        ScrollPanelModule,
        SharedModule,
        TableModule,
    ],
    declarations: [
        RMComponent,
        RMDashboardComponent,
        RMNewOnboardComponent,
        RMEditOnboardComponent,
        RMManageOnboardComponent
    ],
    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
        ChecklistService,
        ConfirmationService,
        OnboardService
    ]
})

export class RMModule { }
