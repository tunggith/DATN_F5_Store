import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LichSuHoaDonComponent } from './lich-su-hoa-don.component';

describe('LichSuHoaDonComponent', () => {
  let component: LichSuHoaDonComponent;
  let fixture: ComponentFixture<LichSuHoaDonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LichSuHoaDonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LichSuHoaDonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
