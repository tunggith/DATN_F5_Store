import { TestBed } from '@angular/core/testing';

import { DiaChiKhachHangService } from './dia-chi-khach-hang.service';

describe('DiaChiKhachHangService', () => {
  let service: DiaChiKhachHangService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiaChiKhachHangService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
