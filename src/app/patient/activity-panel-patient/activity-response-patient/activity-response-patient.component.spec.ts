import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityResponsePatientComponent } from './activity-response-patient.component';

describe('ActivityResponsePatientComponent', () => {
  let component: ActivityResponsePatientComponent;
  let fixture: ComponentFixture<ActivityResponsePatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityResponsePatientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActivityResponsePatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
