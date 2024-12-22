import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityPanelPatientComponent } from './activity-panel-patient.component';

describe('ActivityPanelPatientComponent', () => {
  let component: ActivityPanelPatientComponent;
  let fixture: ComponentFixture<ActivityPanelPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityPanelPatientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActivityPanelPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
