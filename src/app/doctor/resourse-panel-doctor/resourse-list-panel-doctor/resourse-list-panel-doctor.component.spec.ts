import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourseListPanelDoctorComponent } from './resourse-list-panel-doctor.component';

describe('ResourseListPanelDoctorComponent', () => {
  let component: ResourseListPanelDoctorComponent;
  let fixture: ComponentFixture<ResourseListPanelDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourseListPanelDoctorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResourseListPanelDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
