import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FOEditOnboardComponent } from './fo-edit-onboard.component';

describe('FOEditOnboardComponent', () => {
    let component: FOEditOnboardComponent;
    let fixture: ComponentFixture<FOEditOnboardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FOEditOnboardComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FOEditOnboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
