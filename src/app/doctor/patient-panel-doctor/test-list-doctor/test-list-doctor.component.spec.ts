import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestListDoctorComponent } from './test-list-doctor.component';

describe('TestListDoctorComponent', () => {
  let component: TestListDoctorComponent;
  let fixture: ComponentFixture<TestListDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestListDoctorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestListDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
