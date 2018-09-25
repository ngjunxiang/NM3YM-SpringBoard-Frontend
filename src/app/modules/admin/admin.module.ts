import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PerfectScrollbarModule, PerfectScrollbarConfigInterface, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { GrowlModule } from 'primeng/growl';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { SharedModule } from '../../shared/shared.module';
import { TableModule } from 'primeng/table';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './pages/admin.component';
import { AdminService } from '../../core/services/admin.service';
import { CreateAdminComponent } from './pages/create-admin/create-admin.component';
import { UpdateAdminComponent } from './pages/update-admin/update-admin.component';
import { DeleteAdminComponent } from './pages/delete-admin/delete-admin.component';
import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
}

@NgModule({
    imports: [
        AdminRoutingModule,
        AutoCompleteModule,
        ButtonModule,
        CardModule,
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
        ReactiveFormsModule,
        SharedModule,
        TableModule
    ],
    declarations: [
        AdminComponent,
        AdminPanelComponent,
        CreateAdminComponent,
        UpdateAdminComponent,
        DeleteAdminComponent
    ],
    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
        AdminService
    ]
})

export class AdminModule { }
