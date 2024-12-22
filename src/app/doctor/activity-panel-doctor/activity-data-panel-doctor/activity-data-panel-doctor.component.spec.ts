import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityDataPanelDoctorComponent } from './activity-data-panel-doctor.component';

describe('ActivityDataPanelDoctorComponent', () => {
  let component: ActivityDataPanelDoctorComponent;
  let fixture: ComponentFixture<ActivityDataPanelDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityDataPanelDoctorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActivityDataPanelDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
