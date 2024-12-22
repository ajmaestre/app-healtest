import { TestBed } from '@angular/core/testing';

import { ResultPanelPatientService } from './result-panel-patient.service';

describe('ResultPanelPatientService', () => {
  let service: ResultPanelPatientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResultPanelPatientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
