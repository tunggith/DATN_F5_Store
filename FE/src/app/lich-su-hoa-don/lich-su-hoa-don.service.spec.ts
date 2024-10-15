import { TestBed } from '@angular/core/testing';

import { LichSuHoaDonService } from './lich-su-hoa-don.service';

describe('LichSuHoaDonService', () => {
  let service: LichSuHoaDonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LichSuHoaDonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
