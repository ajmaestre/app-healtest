import { TestBed } from '@angular/core/testing';

import { ResoursePanelDoctorService } from './resourse-panel-doctor.service';

describe('ResoursePanelDoctorService', () => {
  let service: ResoursePanelDoctorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResoursePanelDoctorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
