import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SanPhamComponent } from './san-pham.component';

describe('SanPhamComponent', () => {
  let component: SanPhamComponent;
  let fixture: ComponentFixture<SanPhamComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SanPhamComponent]
    });
    fixture = TestBed.createComponent(SanPhamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
