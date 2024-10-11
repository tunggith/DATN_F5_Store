import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiaChiKhachHangComponent } from './dia-chi-khach-hang.component';

describe('DiaChiKhachHangComponent', () => {
  let component: DiaChiKhachHangComponent;
  let fixture: ComponentFixture<DiaChiKhachHangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiaChiKhachHangComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiaChiKhachHangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
