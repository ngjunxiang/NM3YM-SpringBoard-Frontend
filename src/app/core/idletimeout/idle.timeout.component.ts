import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { UserIdleService } from 'angular-user-idle';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
    selector: 'app-idletimeout',
    templateUrl: './idle.timeout.component.html',
    styleUrls: ['./idle.timeout.component.css']
})

export class IdleTimeoutComponent implements OnInit, OnDestroy {

    @Output() changeIdleValues = new EventEmitter();
    idle: number;
    timeout: number;
    ping: number;
    lastPing: string;
    isWatching: boolean;
    isTimer: boolean;
    timeIsUp: boolean;
    timerCount: number;

    private timerStartSubscription: Subscription;
    private timeoutSubscription: Subscription;
    private pingSubscription: Subscription;

    constructor(
        private router: Router,
        private userIdleService: UserIdleService
    ) { }

    ngOnInit() {
        this.idle = this.userIdleService.getConfigValue().idle;
        this.timeout = this.userIdleService.getConfigValue().timeout;
        this.ping = this.userIdleService.getConfigValue().ping;
        this.changeIdleValues.emit({
            idle: this.idle,
            timeout: this.timeout,
            ping: this.ping
        });
        this.onStartWatching();
    }

    ngOnDestroy() {
        this.onStopTimer();
        this.onStopWatching();
    }

    extendSession() {
        this.onResetTimer();
    }

    onStartWatching() {
        this.isWatching = true;
        this.timerCount = this.timeout;
        this.userIdleService.setConfigValues({
            idle: this.idle,
            timeout: this.timeout,
            ping: this.ping
        });
        
        // Start watching for user inactivity.
        this.userIdleService.startWatching();

        // Start watching when user idle is starting.
        this.timerStartSubscription = this.userIdleService.onTimerStart()
            .pipe(tap(() => {
                this.isTimer = true;
            }))
            .subscribe(count => {
                this.timerCount = count;
            });

        // Start watch when time is up.
        this.timeoutSubscription = this.userIdleService.onTimeout()
            .subscribe(() => {
                this.timeIsUp = true;
                this.router.navigate(['/login'], {
                    queryParams: {
                        err: 'idle001'
                    }
                });
            });

        this.pingSubscription = this.userIdleService.ping$
            .subscribe(value => this.lastPing = `#${value} at ${new Date().toString()}`);
    }

    onStopWatching() {
        this.userIdleService.stopWatching();
        this.timerStartSubscription.unsubscribe();
        this.timeoutSubscription.unsubscribe();
        this.pingSubscription.unsubscribe();
        this.isWatching = false;
        this.isTimer = false;
        this.timeIsUp = false;
        this.lastPing = null;
    }

    onStopTimer() {
        this.userIdleService.stopTimer();
        this.isTimer = false;
    }

    onResetTimer() {
        this.userIdleService.resetTimer();
        this.isTimer = false;
        this.timeIsUp = false;
    }
}
