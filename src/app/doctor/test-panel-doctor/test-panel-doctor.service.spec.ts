import { TestBed } from '@angular/core/testing';

import { TestPanelDoctorService } from './test-panel-doctor.service';

describe('TestPanelDoctorService', () => {
  let service: TestPanelDoctorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestPanelDoctorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
