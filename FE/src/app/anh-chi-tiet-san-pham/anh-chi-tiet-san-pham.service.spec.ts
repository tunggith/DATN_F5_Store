import { TestBed } from '@angular/core/testing';

import { AnhChiTietSanPhamService } from './anh-chi-tiet-san-pham.service';

describe('AnhChiTietSanPhamService', () => {
  let service: AnhChiTietSanPhamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnhChiTietSanPhamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
