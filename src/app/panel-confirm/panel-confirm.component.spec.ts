import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelConfirmComponent } from './panel-confirm.component';

describe('PanelConfirmComponent', () => {
  let component: PanelConfirmComponent;
  let fixture: ComponentFixture<PanelConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelConfirmComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PanelConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
