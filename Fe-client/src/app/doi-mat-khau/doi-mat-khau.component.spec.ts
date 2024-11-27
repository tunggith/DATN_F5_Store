import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoiMatKhauComponent } from './doi-mat-khau.component';

describe('DoiMatKhauComponent', () => {
  let component: DoiMatKhauComponent;
  let fixture: ComponentFixture<DoiMatKhauComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DoiMatKhauComponent]
    });
    fixture = TestBed.createComponent(DoiMatKhauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
