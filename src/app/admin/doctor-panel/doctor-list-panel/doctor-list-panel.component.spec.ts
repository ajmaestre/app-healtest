import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorListPanelComponent } from './doctor-list-panel.component';

describe('DoctorListPanelComponent', () => {
  let component: DoctorListPanelComponent;
  let fixture: ComponentFixture<DoctorListPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorListPanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DoctorListPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
