import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FONewOnboardComponent } from './fo-new-onboard.component';

describe('FONewOnboardComponent', () => {
    let component: FONewOnboardComponent;
    let fixture: ComponentFixture<FONewOnboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [ FONewOnboardComponent ]
    })
    .compileComponents();
  }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FONewOnboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
