import { TestBed } from '@angular/core/testing';

import { ActivityPanelPatientService } from './activity-panel-patient.service';

describe('ActivityPanelPatientService', () => {
  let service: ActivityPanelPatientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivityPanelPatientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
