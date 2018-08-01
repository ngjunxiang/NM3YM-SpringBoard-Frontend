import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RMDashboardComponent } from './rm-dashboard.component';

describe('RMDashboardComponent', () => {
    let component: RMDashboardComponent;
    let fixture: ComponentFixture<RMDashboardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RMDashboardComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RMDashboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
