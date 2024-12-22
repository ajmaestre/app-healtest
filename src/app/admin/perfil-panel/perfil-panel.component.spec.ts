import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilPanelComponent } from './perfil-panel.component';

describe('PerfilPanelComponent', () => {
  let component: PerfilPanelComponent;
  let fixture: ComponentFixture<PerfilPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilPanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PerfilPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
