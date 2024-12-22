import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilPanelDoctorComponent } from './perfil-panel-doctor.component';

describe('PerfilPanelDoctorComponent', () => {
  let component: PerfilPanelDoctorComponent;
  let fixture: ComponentFixture<PerfilPanelDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilPanelDoctorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PerfilPanelDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
