import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RMEditOnboardComponent } from './rm-edit-onboard.component';

describe('RMEditOnboardComponent', () => {
    let component: RMEditOnboardComponent;
    let fixture: ComponentFixture<RMEditOnboardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RMEditOnboardComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RMEditOnboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
