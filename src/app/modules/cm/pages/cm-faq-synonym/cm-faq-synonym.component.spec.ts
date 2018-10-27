import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CMFaqSynonymComponent } from './cm-faq-synonym.component';

<<<<<<< .mine
describe('CMFaqSynonymComponent', () => {
  let component: CMFaqSynonymComponent;
=======
describe('CMFaqSynonymComponent', () => {
    let component: CMFaqSynonymComponent;
>>>>>>> .theirs
  let fixture: ComponentFixture<CMFaqSynonymComponent>;

<<<<<<< .mine
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CMFaqSynonymComponent ]
    })
    .compileComponents();
  }));
=======
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CMFaqSynonymComponent]
        })
            .compileComponents();
    }));
>>>>>>> .theirs

<<<<<<< .mine
  beforeEach(() => {
    fixture = TestBed.createComponent(CMFaqSynonymComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
=======
    beforeEach(() => {
        fixture = TestBed.createComponent(CMFaqSynonymComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
>>>>>>> .theirs

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
