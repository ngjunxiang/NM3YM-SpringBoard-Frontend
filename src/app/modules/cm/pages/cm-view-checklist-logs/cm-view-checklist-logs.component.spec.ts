import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CMViewChecklistLogsComponent } from './cm-view-checklist-logs.component';

describe('CMViewChecklistLogsComponent', () => {
    let component: CMViewChecklistLogsComponent;
    let fixture: ComponentFixture<CMViewChecklistLogsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CMViewChecklistLogsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CMViewChecklistLogsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
