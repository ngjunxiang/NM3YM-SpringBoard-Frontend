import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CMUploadAgmtComponent } from './cm-upload-agmt.component';

describe('CMUploadAgmtComponent', () => {
    let component: CMUploadAgmtComponent;
    let fixture: ComponentFixture<CMUploadAgmtComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CMUploadAgmtComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CMUploadAgmtComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
