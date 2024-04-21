import { TestBed } from '@angular/core/testing';

import { SampleBackendService } from './sample-backend.service';

describe('SampleBackendServiceService', () => {
  let service: SampleBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SampleBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
