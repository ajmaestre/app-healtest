import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourseDataPanelPatientComponent } from './resourse-data-panel-patient.component';

describe('ResourseDataPanelPatientComponent', () => {
  let component: ResourseDataPanelPatientComponent;
  let fixture: ComponentFixture<ResourseDataPanelPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourseDataPanelPatientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResourseDataPanelPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
