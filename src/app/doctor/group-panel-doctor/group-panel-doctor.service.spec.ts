import { TestBed } from '@angular/core/testing';

import { GroupPanelDoctorService } from './group-panel-doctor.service';

describe('GroupPanelDoctorService', () => {
  let service: GroupPanelDoctorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupPanelDoctorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
