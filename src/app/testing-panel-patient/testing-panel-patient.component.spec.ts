import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestingPanelPatientComponent } from './testing-panel-patient.component';

describe('TestingPanelPatientComponent', () => {
  let component: TestingPanelPatientComponent;
  let fixture: ComponentFixture<TestingPanelPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingPanelPatientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestingPanelPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
