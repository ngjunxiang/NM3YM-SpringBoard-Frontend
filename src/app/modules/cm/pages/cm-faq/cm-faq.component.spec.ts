import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CMFaqComponent } from './cm-faq.component';

describe('CMFaqComponent', () => {
    let component: CMFaqComponent;
    let fixture: ComponentFixture<CMFaqComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CMFaqComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CMFaqComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
