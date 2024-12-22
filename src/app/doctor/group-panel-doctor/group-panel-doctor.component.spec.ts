import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupPanelDoctorComponent } from './group-panel-doctor.component';

describe('GroupPanelDoctorComponent', () => {
  let component: GroupPanelDoctorComponent;
  let fixture: ComponentFixture<GroupPanelDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupPanelDoctorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupPanelDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
