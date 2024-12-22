import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestDataPanelDoctorComponent } from './test-data-panel-doctor.component';

describe('TestDataPanelDoctorComponent', () => {
  let component: TestDataPanelDoctorComponent;
  let fixture: ComponentFixture<TestDataPanelDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestDataPanelDoctorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestDataPanelDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
