import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatLieuComponent } from './chat-lieu.component';

describe('ChatLieuComponent', () => {
  let component: ChatLieuComponent;
  let fixture: ComponentFixture<ChatLieuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatLieuComponent]
    });
    fixture = TestBed.createComponent(ChatLieuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
