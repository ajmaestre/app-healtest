import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientListPanelComponent } from './patient-list-panel.component';

describe('PatientListPanelComponent', () => {
  let component: PatientListPanelComponent;
  let fixture: ComponentFixture<PatientListPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientListPanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PatientListPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
