import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultPanelPatientComponent } from './result-panel-patient.component';

describe('ResultPanelPatientComponent', () => {
  let component: ResultPanelPatientComponent;
  let fixture: ComponentFixture<ResultPanelPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultPanelPatientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResultPanelPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
