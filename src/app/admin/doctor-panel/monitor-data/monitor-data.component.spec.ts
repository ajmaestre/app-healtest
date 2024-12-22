import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorDataComponent } from './monitor-data.component';

describe('MonitorDataComponent', () => {
  let component: MonitorDataComponent;
  let fixture: ComponentFixture<MonitorDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonitorDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MonitorDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
