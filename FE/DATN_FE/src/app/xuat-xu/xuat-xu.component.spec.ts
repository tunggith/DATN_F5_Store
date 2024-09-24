import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XuatXuComponent } from './xuat-xu.component';

describe('XuatXuComponent', () => {
  let component: XuatXuComponent;
  let fixture: ComponentFixture<XuatXuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [XuatXuComponent]
    });
    fixture = TestBed.createComponent(XuatXuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
