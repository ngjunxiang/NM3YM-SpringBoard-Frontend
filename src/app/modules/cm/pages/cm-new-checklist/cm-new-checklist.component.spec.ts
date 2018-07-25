import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CMNewChecklistComponent } from './cm-new-checklist.component';

describe('CMNewChecklistComponent', () => {
    let component: CMNewChecklistComponent;
    let fixture: ComponentFixture<CMNewChecklistComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CMNewChecklistComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CMNewChecklistComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
