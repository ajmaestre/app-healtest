import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrucigramPanelPatientComponent } from './crucigram-panel-patient.component';

describe('CrucigramPanelPatientComponent', () => {
  let component: CrucigramPanelPatientComponent;
  let fixture: ComponentFixture<CrucigramPanelPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrucigramPanelPatientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrucigramPanelPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
