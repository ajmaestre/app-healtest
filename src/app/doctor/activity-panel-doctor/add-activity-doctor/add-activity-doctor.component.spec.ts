import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddActivityDoctorComponent } from './add-activity-doctor.component';

describe('AddActivityDoctorComponent', () => {
  let component: AddActivityDoctorComponent;
  let fixture: ComponentFixture<AddActivityDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddActivityDoctorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddActivityDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
