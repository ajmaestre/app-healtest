import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlPanelDoctorComponent } from './control-panel-doctor.component';

describe('ControlPanelDoctorComponent', () => {
  let component: ControlPanelDoctorComponent;
  let fixture: ComponentFixture<ControlPanelDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlPanelDoctorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ControlPanelDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
