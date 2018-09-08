import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceNewChecklistComponent } from './compliance-new-checklist.component';

describe('ComplianceNewChecklistComponent', () => {
    let component: ComplianceNewChecklistComponent;
    let fixture: ComponentFixture<ComplianceNewChecklistComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ComplianceNewChecklistComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ComplianceNewChecklistComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
