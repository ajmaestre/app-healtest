import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientListPanelDoctorComponent } from './patient-list-panel-doctor.component';

describe('PatientListPanelDoctorComponent', () => {
  let component: PatientListPanelDoctorComponent;
  let fixture: ComponentFixture<PatientListPanelDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientListPanelDoctorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PatientListPanelDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
