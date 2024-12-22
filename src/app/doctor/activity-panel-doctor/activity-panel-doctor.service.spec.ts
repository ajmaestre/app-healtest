import { TestBed } from '@angular/core/testing';

import { ActivityPanelDoctorService } from './activity-panel-doctor.service';

describe('ActivityPanelDoctorService', () => {
  let service: ActivityPanelDoctorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivityPanelDoctorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
