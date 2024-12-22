import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionPanelDoctorComponent } from './question-panel-doctor.component';

describe('QuestionPanelDoctorComponent', () => {
  let component: QuestionPanelDoctorComponent;
  let fixture: ComponentFixture<QuestionPanelDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionPanelDoctorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuestionPanelDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
