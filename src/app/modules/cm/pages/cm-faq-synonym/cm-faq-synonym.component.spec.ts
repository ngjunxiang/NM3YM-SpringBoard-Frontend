import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmFaqSynonymComponent } from './cm-faq-synonym.component';

describe('CmFaqSynonymComponent', () => {
  let component: CmFaqSynonymComponent;
  let fixture: ComponentFixture<CmFaqSynonymComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmFaqSynonymComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmFaqSynonymComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
