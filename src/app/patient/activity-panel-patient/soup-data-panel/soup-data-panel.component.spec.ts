import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoupDataPanelComponent } from './soup-data-panel.component';

describe('SoupDataPanelComponent', () => {
  let component: SoupDataPanelComponent;
  let fixture: ComponentFixture<SoupDataPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoupDataPanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SoupDataPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
