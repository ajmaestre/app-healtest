import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupResourseAddDoctorComponent } from './group-resourse-add-doctor.component';

describe('GroupResourseAddDoctorComponent', () => {
  let component: GroupResourseAddDoctorComponent;
  let fixture: ComponentFixture<GroupResourseAddDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupResourseAddDoctorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupResourseAddDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
