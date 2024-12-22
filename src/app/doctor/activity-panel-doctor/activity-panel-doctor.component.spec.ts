import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityPanelDoctorComponent } from './activity-panel-doctor.component';

describe('ActivityPanelDoctorComponent', () => {
  let component: ActivityPanelDoctorComponent;
  let fixture: ComponentFixture<ActivityPanelDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityPanelDoctorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActivityPanelDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
