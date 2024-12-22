import { TestBed } from '@angular/core/testing';

import { TestingPanelPatientService } from './testing-panel-patient.service';

describe('TestingPanelPatientService', () => {
  let service: TestingPanelPatientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestingPanelPatientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
