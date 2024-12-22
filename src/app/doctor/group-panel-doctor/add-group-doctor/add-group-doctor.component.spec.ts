import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGroupDoctorComponent } from './add-group-doctor.component';

describe('AddGroupDoctorComponent', () => {
  let component: AddGroupDoctorComponent;
  let fixture: ComponentFixture<AddGroupDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddGroupDoctorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddGroupDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
