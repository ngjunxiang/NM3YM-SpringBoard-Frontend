import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RMComponent } from './rm.component';

describe('RMComponent', () => {
  let component: RMComponent;
  let fixture: ComponentFixture<RMComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RMComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
