import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceViewChecklistLogsComponent } from './compliance-view-checklist-logs.component';

describe('ComplianceViewChecklistLogsComponent', () => {
    let component: ComplianceViewChecklistLogsComponent;
    let fixture: ComponentFixture<ComplianceViewChecklistLogsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ComplianceViewChecklistLogsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ComplianceViewChecklistLogsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
