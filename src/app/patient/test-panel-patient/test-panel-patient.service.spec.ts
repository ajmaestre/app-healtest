import { TestBed } from '@angular/core/testing';

import { TestPanelPatientService } from './test-panel-patient.service';

describe('TestPanelPatientService', () => {
  let service: TestPanelPatientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestPanelPatientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
