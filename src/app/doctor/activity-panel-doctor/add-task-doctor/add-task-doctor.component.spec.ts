import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTaskDoctorComponent } from './add-task-doctor.component';

describe('AddTaskDoctorComponent', () => {
  let component: AddTaskDoctorComponent;
  let fixture: ComponentFixture<AddTaskDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTaskDoctorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddTaskDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
