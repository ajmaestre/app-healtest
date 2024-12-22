import { TestBed } from '@angular/core/testing';

import { QuestionPanelDoctorService } from './question-panel-doctor.service';

describe('QuestionPanelDoctorService', () => {
  let service: QuestionPanelDoctorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuestionPanelDoctorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
