import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PerfectScrollbarModule, PerfectScrollbarConfigInterface, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { UserIdleModule } from 'angular-user-idle';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminAuthGuard } from './core/guard/admin-auth.guard';
import { RMAuthGuard } from './core/guard/rm-auth.guard';
import { CMAuthGuard } from './core/guard/cm-auth.guard';
import { SpinnerComponent } from './shared/spinner.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
}

@NgModule({
    declarations: [
        AppComponent,
        SpinnerComponent
    ],
    imports: [
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        NgbModule.forRoot(),
        PerfectScrollbarModule,
        ReactiveFormsModule,
        UserIdleModule.forRoot({idle: 1, timeout: 5, ping: 1})
    ],
    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
        AdminAuthGuard,
        CMAuthGuard,
        RMAuthGuard
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
    constructor(router: Router) {
        console.log('Routes: ', JSON.stringify(router.config, undefined, 2));
    }
}
