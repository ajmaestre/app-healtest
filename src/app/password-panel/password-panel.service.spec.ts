import { TestBed } from '@angular/core/testing';

import { PasswordPanelService } from './password-panel.service';

describe('PasswordPanelService', () => {
  let service: PasswordPanelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasswordPanelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
