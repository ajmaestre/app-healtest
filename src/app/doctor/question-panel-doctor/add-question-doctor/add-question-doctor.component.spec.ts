import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddQuestionDoctorComponent } from './add-question-doctor.component';

describe('AddQuestionDoctorComponent', () => {
  let component: AddQuestionDoctorComponent;
  let fixture: ComponentFixture<AddQuestionDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddQuestionDoctorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddQuestionDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
