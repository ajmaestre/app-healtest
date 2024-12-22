import { TestBed } from '@angular/core/testing';

import { ResoursePanelPatientService } from './resourse-panel-patient.service';

describe('ResoursePanelPatientService', () => {
  let service: ResoursePanelPatientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResoursePanelPatientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
