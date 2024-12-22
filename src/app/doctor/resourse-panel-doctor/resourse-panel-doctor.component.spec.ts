import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResoursePanelDoctorComponent } from './resourse-panel-doctor.component';

describe('ResoursePanelDoctorComponent', () => {
  let component: ResoursePanelDoctorComponent;
  let fixture: ComponentFixture<ResoursePanelDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResoursePanelDoctorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResoursePanelDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
