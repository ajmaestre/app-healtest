import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionDataPanelDoctorComponent } from './question-data-panel-doctor.component';

describe('QuestionDataPanelDoctorComponent', () => {
  let component: QuestionDataPanelDoctorComponent;
  let fixture: ComponentFixture<QuestionDataPanelDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionDataPanelDoctorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuestionDataPanelDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
