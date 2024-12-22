import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupListAddDoctorComponent } from './group-list-add-doctor.component';

describe('GroupListAddDoctorComponent', () => {
  let component: GroupListAddDoctorComponent;
  let fixture: ComponentFixture<GroupListAddDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupListAddDoctorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupListAddDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
