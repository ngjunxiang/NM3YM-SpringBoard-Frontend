import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginForgotPwComponent } from './login-forgot-pw.component';

describe('LoginForgotPwComponent', () => {
    let component: LoginForgotPwComponent;
    let fixture: ComponentFixture<LoginForgotPwComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LoginForgotPwComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginForgotPwComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
