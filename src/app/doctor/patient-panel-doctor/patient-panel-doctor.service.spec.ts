import { TestBed } from '@angular/core/testing';

import { PatientPanelDoctorService } from './patient-panel-doctor.service';

describe('PatientPanelDoctorService', () => {
  let service: PatientPanelDoctorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientPanelDoctorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
