import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestPanelDoctorComponent } from './test-panel-doctor.component';

describe('TestPanelDoctorComponent', () => {
  let component: TestPanelDoctorComponent;
  let fixture: ComponentFixture<TestPanelDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestPanelDoctorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestPanelDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
