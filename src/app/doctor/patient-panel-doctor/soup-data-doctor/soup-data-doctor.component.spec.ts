import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoupDataDoctorComponent } from './soup-data-doctor.component';

describe('SoupDataDoctorComponent', () => {
  let component: SoupDataDoctorComponent;
  let fixture: ComponentFixture<SoupDataDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoupDataDoctorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SoupDataDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
