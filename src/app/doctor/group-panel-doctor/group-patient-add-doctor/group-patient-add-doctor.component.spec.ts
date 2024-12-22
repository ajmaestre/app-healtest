import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupPatientAddDoctorComponent } from './group-patient-add-doctor.component';

describe('GroupPatientAddDoctorComponent', () => {
  let component: GroupPatientAddDoctorComponent;
  let fixture: ComponentFixture<GroupPatientAddDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupPatientAddDoctorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupPatientAddDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
