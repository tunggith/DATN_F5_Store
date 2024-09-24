import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThuongHieuComponent } from './thuong-hieu.component';

describe('ThuongHieuComponent', () => {
  let component: ThuongHieuComponent;
  let fixture: ComponentFixture<ThuongHieuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThuongHieuComponent]
    });
    fixture = TestBed.createComponent(ThuongHieuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
