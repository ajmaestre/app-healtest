import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskPanelPatientComponent } from './task-panel-patient.component';

describe('TaskPanelPatientComponent', () => {
  let component: TaskPanelPatientComponent;
  let fixture: ComponentFixture<TaskPanelPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskPanelPatientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaskPanelPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
