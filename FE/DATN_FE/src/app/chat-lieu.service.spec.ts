import { TestBed } from '@angular/core/testing';

import { ChatLieuService } from './chat-lieu.service';

describe('ChatLieuService', () => {
  let service: ChatLieuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatLieuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
