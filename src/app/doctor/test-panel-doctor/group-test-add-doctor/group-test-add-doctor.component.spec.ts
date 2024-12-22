import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupTestAddDoctorComponent } from './group-test-add-doctor.component';

describe('GroupTestAddDoctorComponent', () => {
  let component: GroupTestAddDoctorComponent;
  let fixture: ComponentFixture<GroupTestAddDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupTestAddDoctorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupTestAddDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
