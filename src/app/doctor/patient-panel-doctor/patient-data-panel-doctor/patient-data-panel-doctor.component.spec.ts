import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDataPanelDoctorComponent } from './patient-data-panel-doctor.component';

describe('PatientDataPanelDoctorComponent', () => {
  let component: PatientDataPanelDoctorComponent;
  let fixture: ComponentFixture<PatientDataPanelDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientDataPanelDoctorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PatientDataPanelDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
