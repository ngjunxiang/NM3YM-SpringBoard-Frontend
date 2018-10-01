import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminViewAllComponent } from './admin-view-all.component';

describe('AdminViewAllComponent', () => {
    let component: AdminViewAllComponent;
    let fixture: ComponentFixture<AdminViewAllComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AdminViewAllComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminViewAllComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
