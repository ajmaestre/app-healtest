import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCrucigramaDoctorComponent } from './add-crucigrama-doctor.component';

describe('AddCrucigramaDoctorComponent', () => {
  let component: AddCrucigramaDoctorComponent;
  let fixture: ComponentFixture<AddCrucigramaDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCrucigramaDoctorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddCrucigramaDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
