import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResoursePanelPatientComponent } from './resourse-panel-patient.component';

describe('ResoursePanelPatientComponent', () => {
  let component: ResoursePanelPatientComponent;
  let fixture: ComponentFixture<ResoursePanelPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResoursePanelPatientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResoursePanelPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
