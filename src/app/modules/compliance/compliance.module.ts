import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PerfectScrollbarModule, PerfectScrollbarConfigInterface, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { BlockUIModule } from 'primeng/blockui';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipsModule } from 'primeng/chips';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { GrowlModule } from 'primeng/growl';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PanelModule } from 'primeng/panel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SharedModule } from '../../shared/shared.module';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { NgxWigModule } from 'ngx-wig';

import { ComplianceRoutingModule } from './compliance-routing.module';
import { ComplianceComponent } from './pages/compliance.component';
import { ComplianceChecklistComponent } from './pages/compliance-checklist/compliance-checklist.component';
import { ComplianceNewChecklistComponent } from './pages/compliance-new-checklist/compliance-new-checklist.component';
import { ComplianceEditChecklistComponent } from './pages/compliance-edit-checklist/compliance-edit-checklist.component';
import { ComplianceViewChecklistLogsComponent } from './pages/compliance-view-checklist-logs/compliance-view-checklist-logs.component';
import { ComplianceService } from '../../core/services/compliance.service';


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
}

@NgModule({
    imports: [
        AutoCompleteModule,
        BlockUIModule,
        ButtonModule,
        CardModule,
        CheckboxModule,
        ChipsModule,
        ComplianceRoutingModule,
        CommonModule,
        ConfirmDialogModule,
        DialogModule,
        DropdownModule,
        FormsModule,
        GrowlModule,
        InputTextareaModule,
        InputTextModule,
        MessageModule,
        MessagesModule,
        NgbModule.forRoot(),
        NgxWigModule,
        OverlayPanelModule,
        PanelModule,
        PerfectScrollbarModule,
        ProgressSpinnerModule,
        ReactiveFormsModule,
        ScrollPanelModule,
        SharedModule,
        TableModule,
        TabViewModule
    ],
    declarations: [
        ComplianceComponent,
        ComplianceChecklistComponent,
        ComplianceEditChecklistComponent,
        ComplianceNewChecklistComponent,
        ComplianceEditChecklistComponent,
        ComplianceViewChecklistLogsComponent
    ],
    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
        ComplianceService,
        ConfirmationService
    ]
})

export class ComplianceModule { }
