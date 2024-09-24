import { TestBed } from '@angular/core/testing';

import { XuatXuService } from './xuat-xu.service';

describe('XuatXuService', () => {
  let service: XuatXuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(XuatXuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
