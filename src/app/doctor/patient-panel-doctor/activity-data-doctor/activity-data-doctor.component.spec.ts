import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityDataDoctorComponent } from './activity-data-doctor.component';

describe('ActivityDataDoctorComponent', () => {
  let component: ActivityDataDoctorComponent;
  let fixture: ComponentFixture<ActivityDataDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityDataDoctorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActivityDataDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
