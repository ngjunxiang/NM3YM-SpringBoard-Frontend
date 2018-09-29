import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FOFaqViewAllComponent } from './fo-faq-viewall.component';

describe('FOFaqViewAllComponent', () => {
    let component: FOFaqViewAllComponent;
    let fixture: ComponentFixture<FOFaqViewAllComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FOFaqViewAllComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FOFaqViewAllComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
