import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PerfectScrollbarModule, PerfectScrollbarConfigInterface, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { GrowlModule } from 'primeng/growl';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ProgressBarModule} from 'primeng/progressbar';
import { SharedModule } from '../../shared/shared.module';
import { TableModule } from 'primeng/table';

import { RMRoutingModule } from './rm-routing.module';
import { RMComponent } from './pages/rm.component';
import { RMDashboardComponent } from './pages/rm-dashboard/rm-dashboard.component';
import { RMNewOnboardComponent } from './pages/rm-new-onboard/rm-new-onboard.component';
import { ChecklistService } from '../../core/services/checklist.service';
import { OnboardService } from '../../core/services/onboard.service';
import { RMEditOnboardComponent } from './pages/rm-edit-onboard/rm-edit-onboard.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
}

@NgModule({
    imports: [
        RMRoutingModule,
        ButtonModule,
        CardModule,
        CheckboxModule,
        CommonModule,
        DialogModule,
        DropdownModule,
        FormsModule,
        GrowlModule,
        InputTextModule,
        MessageModule,
        MessagesModule,
        NgbModule.forRoot(),
        PerfectScrollbarModule,
        ProgressBarModule,
        ReactiveFormsModule,
        SharedModule,
        TableModule
    ],
    declarations: [
        RMComponent,
        RMDashboardComponent,
        RMNewOnboardComponent,
        RMEditOnboardComponent
    ],
    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
        ChecklistService,
        OnboardService
    ]
})

export class RMModule { }
