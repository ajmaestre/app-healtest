import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupDataPanelComponent } from './group-data-panel.component';

describe('GroupDataPanelComponent', () => {
  let component: GroupDataPanelComponent;
  let fixture: ComponentFixture<GroupDataPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupDataPanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupDataPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
