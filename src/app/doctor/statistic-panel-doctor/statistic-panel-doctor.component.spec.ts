import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticPanelDoctorComponent } from './statistic-panel-doctor.component';

describe('StatisticPanelDoctorComponent', () => {
  let component: StatisticPanelDoctorComponent;
  let fixture: ComponentFixture<StatisticPanelDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticPanelDoctorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StatisticPanelDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
