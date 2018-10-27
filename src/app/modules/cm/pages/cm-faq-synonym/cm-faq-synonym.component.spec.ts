import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CMFaqSynonymComponent } from './cm-faq-synonym.component';

describe('CMFaqSynonymComponent', () => {
  let component: CMFaqSynonymComponent;
  let fixture: ComponentFixture<CMFaqSynonymComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CMFaqSynonymComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CMFaqSynonymComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
