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
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { GrowlModule } from 'primeng/growl';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { PanelModule } from 'primeng/panel';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SharedModule } from '../../shared/shared.module';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';

import { CMRoutingModule } from './cm-routing.module';
import { CMComponent } from './pages/cm.component';
import { CMDashboardComponent } from './pages/cm-dashboard/cm-dashboard.component';
import { CMChecklistComponent } from './pages/cm-checklist/cm-checklist.component';
import { ChecklistService } from '../../core/services/checklist.service';
import { CMNewChecklistComponent } from './pages/cm-new-checklist/cm-new-checklist.component';
import { CMEditChecklistComponent } from './pages/cm-edit-checklist/cm-edit-checklist.component';

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
        CMRoutingModule,
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
        PanelModule,
        PerfectScrollbarModule,
        ReactiveFormsModule,
        ScrollPanelModule,
        SharedModule,
        TableModule,
        TabViewModule
    ],
    declarations: [
        CMComponent,
        CMDashboardComponent,
        CMChecklistComponent,
        CMEditChecklistComponent,
        CMNewChecklistComponent,
        CMEditChecklistComponent
    ],
    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
        ChecklistService,
        ConfirmationService
    ]
})

export class CMModule { }
