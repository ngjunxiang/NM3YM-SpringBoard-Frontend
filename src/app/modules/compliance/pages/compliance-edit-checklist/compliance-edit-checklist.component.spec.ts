import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CMEditChecklistComponent } from './cm-edit-checklist.component';

describe('CMEditChecklistComponent', () => {
    let component: CMEditChecklistComponent;
    let fixture: ComponentFixture<CMEditChecklistComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CMEditChecklistComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CMEditChecklistComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
