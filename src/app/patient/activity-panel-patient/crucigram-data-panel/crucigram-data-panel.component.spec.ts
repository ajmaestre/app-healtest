import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrucigramDataPanelComponent } from './crucigram-data-panel.component';

describe('CrucigramDataPanelComponent', () => {
  let component: CrucigramDataPanelComponent;
  let fixture: ComponentFixture<CrucigramDataPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrucigramDataPanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrucigramDataPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
