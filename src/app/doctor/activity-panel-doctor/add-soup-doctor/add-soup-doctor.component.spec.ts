import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSoupDoctorComponent } from './add-soup-doctor.component';

describe('AddSoupDoctorComponent', () => {
  let component: AddSoupDoctorComponent;
  let fixture: ComponentFixture<AddSoupDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSoupDoctorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddSoupDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
