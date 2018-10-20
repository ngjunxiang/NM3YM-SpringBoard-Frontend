import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CMFaqCreateComponent } from './cm-faq-create.component';

describe('CMFaqCreateComponent', () => {
  let component: CMFaqCreateComponent;
  let fixture: ComponentFixture<CMFaqCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CMFaqCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CMFaqCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
