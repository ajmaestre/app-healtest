import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityListDoctorComponent } from './activity-list-doctor.component';

describe('ActivityListDoctorComponent', () => {
  let component: ActivityListDoctorComponent;
  let fixture: ComponentFixture<ActivityListDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityListDoctorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActivityListDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
