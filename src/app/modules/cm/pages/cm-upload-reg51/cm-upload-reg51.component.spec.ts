import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CMUploadReg51Component } from './cm-upload-reg51.component';

describe('CMUploadReg51Component', () => {
    let component: CMUploadReg51Component;
    let fixture: ComponentFixture<CMUploadReg51Component>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CMUploadReg51Component]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CMUploadReg51Component);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
