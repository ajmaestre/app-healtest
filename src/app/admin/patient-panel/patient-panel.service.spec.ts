import { TestBed } from '@angular/core/testing';

import { PatientPanelService } from './patient-panel.service';

describe('PatientPanelService', () => {
  let service: PatientPanelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientPanelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
