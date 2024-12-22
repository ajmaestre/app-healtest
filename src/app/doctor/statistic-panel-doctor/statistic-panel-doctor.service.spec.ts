import { TestBed } from '@angular/core/testing';

import { StatisticPanelDoctorService } from './statistic-panel-doctor.service';

describe('StatisticPanelDoctorService', () => {
  let service: StatisticPanelDoctorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatisticPanelDoctorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
