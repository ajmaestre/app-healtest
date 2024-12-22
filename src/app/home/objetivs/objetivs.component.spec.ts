import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjetivsComponent } from './objetivs.component';

describe('ObjetivsComponent', () => {
  let component: ObjetivsComponent;
  let fixture: ComponentFixture<ObjetivsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObjetivsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ObjetivsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
