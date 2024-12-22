import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChardCardComponent } from './chard-card.component';

describe('ChardCardComponent', () => {
  let component: ChardCardComponent;
  let fixture: ComponentFixture<ChardCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChardCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChardCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
