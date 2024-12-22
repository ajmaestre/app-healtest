import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupDataPanelDoctorComponent } from './group-data-panel-doctor.component';

describe('GroupDataPanelDoctorComponent', () => {
  let component: GroupDataPanelDoctorComponent;
  let fixture: ComponentFixture<GroupDataPanelDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupDataPanelDoctorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupDataPanelDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
