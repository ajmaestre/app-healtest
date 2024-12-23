import { TestBed } from '@angular/core/testing';

import { GroupPanelService } from './group-panel.service';

describe('GroupPanelService', () => {
  let service: GroupPanelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupPanelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
