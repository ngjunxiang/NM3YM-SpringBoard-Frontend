import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './spinner.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { NavigationComponent } from './header-navigation/navigation.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterModule } from '../../../node_modules/@angular/router';
import { IdleTimeoutComponent } from '../core/idletimeout/idle.timeout.component';
import { DialogModule } from '../../../node_modules/primeng/dialog';

@NgModule({
    imports: [
        CommonModule,
        DialogModule,
        RouterModule
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
