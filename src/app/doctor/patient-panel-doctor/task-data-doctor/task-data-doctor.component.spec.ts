import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDataDoctorComponent } from './task-data-doctor.component';

describe('TaskDataDoctorComponent', () => {
  let component: TaskDataDoctorComponent;
  let fixture: ComponentFixture<TaskDataDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskDataDoctorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaskDataDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
