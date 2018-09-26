import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FOManageOnboardComponent } from './fo-manage-onboard.component';

describe('FOManageOnboardComponent', () => {
    let component: FOManageOnboardComponent;
    let fixture: ComponentFixture<FOManageOnboardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FOManageOnboardComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FOManageOnboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
