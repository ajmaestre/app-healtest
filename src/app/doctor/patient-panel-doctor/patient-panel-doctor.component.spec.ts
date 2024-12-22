import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientPanelDoctorComponent } from './patient-panel-doctor.component';

describe('PatientPanelDoctorComponent', () => {
  let component: PatientPanelDoctorComponent;
  let fixture: ComponentFixture<PatientPanelDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientPanelDoctorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PatientPanelDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
