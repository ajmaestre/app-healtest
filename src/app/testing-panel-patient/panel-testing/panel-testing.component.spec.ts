import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelTestingComponent } from './panel-testing.component';

describe('PanelTestingComponent', () => {
  let component: PanelTestingComponent;
  let fixture: ComponentFixture<PanelTestingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelTestingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PanelTestingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
