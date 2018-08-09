import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RMNewOnboardComponent } from './rm-new-onboard.component';

describe('RMNewOnboardComponent', () => {
    let component: RMNewOnboardComponent;
    let fixture: ComponentFixture<RMNewOnboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [ RMNewOnboardComponent ]
    })
    .compileComponents();
  }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RMNewOnboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
