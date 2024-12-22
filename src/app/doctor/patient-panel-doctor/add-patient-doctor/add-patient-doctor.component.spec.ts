import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPatientDoctorComponent } from './add-patient-doctor.component';

describe('AddPatientDoctorComponent', () => {
  let component: AddPatientDoctorComponent;
  let fixture: ComponentFixture<AddPatientDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPatientDoctorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddPatientDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
