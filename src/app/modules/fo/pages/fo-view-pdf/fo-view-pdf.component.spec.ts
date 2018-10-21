import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FOViewPDFComponent } from './fo-view-pdf.component';

describe('FOViewPDFComponent', () => {
    let component: FOViewPDFComponent;
    let fixture: ComponentFixture<FOViewPDFComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FOViewPDFComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FOViewPDFComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
