import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddResourseDoctorComponent } from './add-resourse-doctor.component';

describe('AddResourseDoctorComponent', () => {
  let component: AddResourseDoctorComponent;
  let fixture: ComponentFixture<AddResourseDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddResourseDoctorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddResourseDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
