import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnhChiTietSanPhamComponent } from './anh-chi-tiet-san-pham.component';

describe('AnhChiTietSanPhamComponent', () => {
  let component: AnhChiTietSanPhamComponent;
  let fixture: ComponentFixture<AnhChiTietSanPhamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnhChiTietSanPhamComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnhChiTietSanPhamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
