import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupActivityAddDoctorComponent } from './group-activity-add-doctor.component';

describe('GroupActivityAddDoctorComponent', () => {
  let component: GroupActivityAddDoctorComponent;
  let fixture: ComponentFixture<GroupActivityAddDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupActivityAddDoctorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupActivityAddDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
