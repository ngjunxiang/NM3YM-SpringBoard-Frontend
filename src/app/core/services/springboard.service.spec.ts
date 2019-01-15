import { TestBed } from '@angular/core/testing';

import { SpringboardService } from './springboard.service';

describe('SpringboardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SpringboardService = TestBed.get(SpringboardService);
    expect(service).toBeTruthy();
  });
});
