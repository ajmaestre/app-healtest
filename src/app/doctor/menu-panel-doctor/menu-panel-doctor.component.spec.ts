import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuPanelDoctorComponent } from './menu-panel-doctor.component';

describe('MenuPanelDoctorComponent', () => {
  let component: MenuPanelDoctorComponent;
  let fixture: ComponentFixture<MenuPanelDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuPanelDoctorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenuPanelDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
