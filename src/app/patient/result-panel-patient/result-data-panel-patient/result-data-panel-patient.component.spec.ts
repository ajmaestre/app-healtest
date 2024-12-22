import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultDataPanelPatientComponent } from './result-data-panel-patient.component';

describe('ResultDataPanelPatientComponent', () => {
  let component: ResultDataPanelPatientComponent;
  let fixture: ComponentFixture<ResultDataPanelPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultDataPanelPatientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResultDataPanelPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
