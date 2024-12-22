import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestListPanelDoctorComponent } from './test-list-panel-doctor.component';

describe('TestListPanelDoctorComponent', () => {
  let component: TestListPanelDoctorComponent;
  let fixture: ComponentFixture<TestListPanelDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestListPanelDoctorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestListPanelDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
