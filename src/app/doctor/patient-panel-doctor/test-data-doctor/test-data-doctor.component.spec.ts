import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestDataDoctorComponent } from './test-data-doctor.component';

describe('TestDataDoctorComponent', () => {
  let component: TestDataDoctorComponent;
  let fixture: ComponentFixture<TestDataDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestDataDoctorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestDataDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
