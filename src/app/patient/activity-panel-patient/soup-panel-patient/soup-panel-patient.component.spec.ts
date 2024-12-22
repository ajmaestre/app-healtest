import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoupPanelPatientComponent } from './soup-panel-patient.component';

describe('SoupPanelPatientComponent', () => {
  let component: SoupPanelPatientComponent;
  let fixture: ComponentFixture<SoupPanelPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoupPanelPatientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SoupPanelPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
