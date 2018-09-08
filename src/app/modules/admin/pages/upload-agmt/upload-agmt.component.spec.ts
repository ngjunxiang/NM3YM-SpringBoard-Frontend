import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadAgmtComponent } from './upload-agmt.component';

describe('UploadAgmtComponent', () => {
  let component: UploadAgmtComponent;
  let fixture: ComponentFixture<UploadAgmtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadAgmtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadAgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
