import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PerfectScrollbarModule, PerfectScrollbarConfigInterface, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AccordionModule } from 'primeng/accordion';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { BlockUIModule } from 'primeng/blockui';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipsModule } from 'primeng/chips';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { DataScrollerModule } from 'primeng/datascroller';
import { FileUploadModule } from 'primeng/fileupload';
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
import { TooltipModule } from 'primeng/tooltip';
import { NgxWigModule } from 'ngx-wig';

import { CMRoutingModule } from './cm-routing.module';
import { CMComponent } from './pages/cm.component';
import { CMDashboardComponent } from './pages/cm-dashboard/cm-dashboard.component';
import { CMChecklistComponent } from './pages/cm-checklist/cm-checklist.component';
import { CMEditChecklistComponent } from './pages/cm-edit-checklist/cm-edit-checklist.component';
import { CMNewChecklistComponent } from './pages/cm-new-checklist/cm-new-checklist.component';
import { CMViewChecklistLogsComponent } from './pages/cm-view-checklist-logs/cm-view-checklist-logs.component';
import { CMService } from '../../core/services/cm.service';
import { CMUploadAgmtComponent } from './pages/upload-agmt/cm-upload-agmt.component';
import { CMFaqManageComponent } from './pages/cm-faq-manage/cm-faq-manage.component';
import { CMFaqCreateComponent } from './pages/cm-faq-create/cm-faq-create.component';
import { CMFaqCleaningComponent } from './pages/cm-faq-cleaning/cm-faq-cleaning.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
}

@NgModule({
    imports: [
        AccordionModule,
        AutoCompleteModule,
        BlockUIModule,
        ButtonModule,
        CardModule,
        ChartModule,
        CheckboxModule,
        ChipsModule,
        CMRoutingModule,
        CommonModule,
        ConfirmDialogModule,
        DataScrollerModule,
        DialogModule,
        DropdownModule,
        FileUploadModule,
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
        TabViewModule,
        TooltipModule
    ],
    declarations: [
        CMComponent,
        CMDashboardComponent,
        CMChecklistComponent,
        CMEditChecklistComponent,
        CMEditChecklistComponent,
        CMNewChecklistComponent,
        CMViewChecklistLogsComponent,
        CMUploadAgmtComponent,
        CMFaqManageComponent,
        CMFaqCreateComponent,
        CMFaqCleaningComponent
    ],
    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
        ConfirmationService,
        CMService
    ]
})

export class CMModule { }
