import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionListPanelDoctorComponent } from './question-list-panel-doctor.component';

describe('QuestionListPanelDoctorComponent', () => {
  let component: QuestionListPanelDoctorComponent;
  let fixture: ComponentFixture<QuestionListPanelDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionListPanelDoctorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuestionListPanelDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
