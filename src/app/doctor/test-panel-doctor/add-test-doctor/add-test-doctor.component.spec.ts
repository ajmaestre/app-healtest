import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTestDoctorComponent } from './add-test-doctor.component';

describe('AddTestDoctorComponent', () => {
  let component: AddTestDoctorComponent;
  let fixture: ComponentFixture<AddTestDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTestDoctorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddTestDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
