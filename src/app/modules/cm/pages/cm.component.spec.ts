import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CMComponent } from './cm.component';

describe('CMComponent', () => {
  let component: CMComponent;
  let fixture: ComponentFixture<CMComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CMComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
