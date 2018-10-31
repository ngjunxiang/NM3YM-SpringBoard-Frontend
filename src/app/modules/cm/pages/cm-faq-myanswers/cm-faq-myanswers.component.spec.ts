import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CMFaqMyAnswersComponent } from './cm-faq-myanswers.component';

describe('CMFaqMyAnswersComponent', () => {
    let component: CMFaqMyAnswersComponent;
    let fixture: ComponentFixture<CMFaqMyAnswersComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CMFaqMyAnswersComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CMFaqMyAnswersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
