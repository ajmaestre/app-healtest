import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupListPanelDoctorComponent } from './group-list-panel-doctor.component';

describe('GroupListPanelDoctorComponent', () => {
  let component: GroupListPanelDoctorComponent;
  let fixture: ComponentFixture<GroupListPanelDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupListPanelDoctorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupListPanelDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
