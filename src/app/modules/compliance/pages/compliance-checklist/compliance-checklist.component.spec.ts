import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceChecklistComponent } from './compliance-checklist.component';

describe('ComplianceChecklistComponent', () => {
    let component: ComplianceChecklistComponent;
    let fixture: ComponentFixture<ComplianceChecklistComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ComplianceChecklistComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ComplianceChecklistComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
