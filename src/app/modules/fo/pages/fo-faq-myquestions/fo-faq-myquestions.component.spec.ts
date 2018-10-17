import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FOFaqMyQuestionsComponent } from './fo-faq-myquestions.component';

describe('FOFaqMyQuestionsComponent', () => {
    let component: FOFaqMyQuestionsComponent;
    let fixture: ComponentFixture<FOFaqMyQuestionsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FOFaqMyQuestionsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FOFaqMyQuestionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
