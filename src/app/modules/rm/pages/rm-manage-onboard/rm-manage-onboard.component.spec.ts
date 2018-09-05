import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RMManageOnboardComponent } from './rm-manage-onboard.component';

describe('RMManageOnboardComponent', () => {
    let component: RMManageOnboardComponent;
    let fixture: ComponentFixture<RMManageOnboardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RMManageOnboardComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RMManageOnboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
