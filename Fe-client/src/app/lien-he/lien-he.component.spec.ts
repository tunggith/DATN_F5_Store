import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LienHeComponent } from './lien-he.component';

describe('LienHeComponent', () => {
  let component: LienHeComponent;
  let fixture: ComponentFixture<LienHeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LienHeComponent]
    });
    fixture = TestBed.createComponent(LienHeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
