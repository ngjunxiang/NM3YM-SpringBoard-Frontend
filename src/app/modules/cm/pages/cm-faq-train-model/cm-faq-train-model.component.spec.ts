import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CMFAQTrainModelComponent } from './cm-faq-train-model.component';

describe('CMFAQTrainModelComponent', () => {
    let component: CMFAQTrainModelComponent;
    let fixture: ComponentFixture<CMFAQTrainModelComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CMFAQTrainModelComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CMFAQTrainModelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
