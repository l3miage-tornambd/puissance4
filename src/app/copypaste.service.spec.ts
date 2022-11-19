import { TestBed } from '@angular/core/testing';

import { CopypasteService } from './copypaste.service';

describe('CopypasteService', () => {
  let service: CopypasteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CopypasteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
