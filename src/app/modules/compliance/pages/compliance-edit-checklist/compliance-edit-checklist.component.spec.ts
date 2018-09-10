import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceEditChecklistComponent } from './compliance-edit-checklist.component';

describe('ComplianceEditChecklistComponent', () => {
    let component: ComplianceEditChecklistComponent;
    let fixture: ComponentFixture<ComplianceEditChecklistComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ComplianceEditChecklistComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ComplianceEditChecklistComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
