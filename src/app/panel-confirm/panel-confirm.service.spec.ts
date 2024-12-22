import { TestBed } from '@angular/core/testing';

import { PanelConfirmService } from './panel-confirm.service';

describe('PanelConfirmService', () => {
  let service: PanelConfirmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PanelConfirmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
