import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourseDataPanelDoctorComponent } from './resourse-data-panel-doctor.component';

describe('ResourseDataPanelDoctorComponent', () => {
  let component: ResourseDataPanelDoctorComponent;
  let fixture: ComponentFixture<ResourseDataPanelDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourseDataPanelDoctorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResourseDataPanelDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
