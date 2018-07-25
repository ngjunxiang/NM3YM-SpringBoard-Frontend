import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CMChecklistComponent } from './cm-checklist.component';

describe('CMChecklistComponent', () => {
    let component: CMChecklistComponent;
    let fixture: ComponentFixture<CMChecklistComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CMChecklistComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CMChecklistComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
