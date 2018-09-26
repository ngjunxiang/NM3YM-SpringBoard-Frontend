import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FODashboardComponent } from './fo-dashboard.component';

describe('FODashboardComponent', () => {
    let component: FODashboardComponent;
    let fixture: ComponentFixture<FODashboardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FODashboardComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FODashboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
