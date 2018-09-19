import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RMFaqComponent } from './rm-faq.component';

describe('RMFaqComponent', () => {
    let component: RMFaqComponent;
    let fixture: ComponentFixture<RMFaqComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RMFaqComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RMFaqComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
