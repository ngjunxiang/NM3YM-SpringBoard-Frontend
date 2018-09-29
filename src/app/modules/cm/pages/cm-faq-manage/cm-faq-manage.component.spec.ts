import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CMFaqManageComponent } from './cm-faq-manage.component';

describe('CMFaqManageComponent', () => {
  let component: CMFaqManageComponent;
  let fixture: ComponentFixture<CMFaqManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CMFaqManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CMFaqManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
