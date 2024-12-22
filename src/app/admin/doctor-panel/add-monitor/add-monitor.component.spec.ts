import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMonitorComponent } from './add-monitor.component';

describe('AddMonitorComponent', () => {
  let component: AddMonitorComponent;
  let fixture: ComponentFixture<AddMonitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMonitorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
