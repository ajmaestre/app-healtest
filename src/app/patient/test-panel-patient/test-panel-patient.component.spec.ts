import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestPanelPatientComponent } from './test-panel-patient.component';

describe('TestPanelPatientComponent', () => {
  let component: TestPanelPatientComponent;
  let fixture: ComponentFixture<TestPanelPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestPanelPatientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestPanelPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
