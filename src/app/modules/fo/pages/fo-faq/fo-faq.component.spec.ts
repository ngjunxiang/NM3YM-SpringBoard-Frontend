import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FOFaqComponent } from './fo-faq.component';

describe('FOFaqComponent', () => {
    let component: FOFaqComponent;
    let fixture: ComponentFixture<FOFaqComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FOFaqComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FOFaqComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
