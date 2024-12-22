import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilDataPatientComponent } from './perfil-data-patient.component';

describe('PerfilDataPatientComponent', () => {
  let component: PerfilDataPatientComponent;
  let fixture: ComponentFixture<PerfilDataPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilDataPatientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PerfilDataPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
