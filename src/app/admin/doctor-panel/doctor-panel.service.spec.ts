import { TestBed } from '@angular/core/testing';

import { DoctorPanelService } from './doctor-panel.service';

describe('DoctorPanelService', () => {
  let service: DoctorPanelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DoctorPanelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
