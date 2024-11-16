import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThongTinDonHangComponent } from './thong-tin-don-hang.component';

describe('ThongTinDonHangComponent', () => {
  let component: ThongTinDonHangComponent;
  let fixture: ComponentFixture<ThongTinDonHangComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThongTinDonHangComponent]
    });
    fixture = TestBed.createComponent(ThongTinDonHangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
