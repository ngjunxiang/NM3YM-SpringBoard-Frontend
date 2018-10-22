import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CMFaqCleaningComponent } from './cm-faq-cleaning.component';

describe('CMFaqCleaningComponent', () => {
  let component: CMFaqCleaningComponent;
  let fixture: ComponentFixture<CMFaqCleaningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CMFaqCleaningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CMFaqCleaningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
