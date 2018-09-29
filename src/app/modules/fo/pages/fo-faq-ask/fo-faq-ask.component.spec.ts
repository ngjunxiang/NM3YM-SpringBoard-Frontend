import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FOFaqAskComponent } from './fo-faq-ask.component';

describe('FOFaqAskComponent', () => {
    let component: FOFaqAskComponent;
    let fixture: ComponentFixture<FOFaqAskComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FOFaqAskComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FOFaqAskComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
