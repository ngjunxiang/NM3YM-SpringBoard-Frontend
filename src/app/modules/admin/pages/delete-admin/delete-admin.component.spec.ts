import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAdminComponent } from './delete-admin.component';

describe('DeleteAdminComponent', () => {
  let component: DeleteAdminComponent;
  let fixture: ComponentFixture<DeleteAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
