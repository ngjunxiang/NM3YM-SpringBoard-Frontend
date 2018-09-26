import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FOComponent } from './fo.component';

describe('FOComponent', () => {
    let component: FOComponent;
    let fixture: ComponentFixture<FOComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FOComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FOComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
