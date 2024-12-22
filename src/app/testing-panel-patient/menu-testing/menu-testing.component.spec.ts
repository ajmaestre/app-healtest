import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuTestingComponent } from './menu-testing.component';

describe('MenuTestingComponent', () => {
  let component: MenuTestingComponent;
  let fixture: ComponentFixture<MenuTestingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuTestingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenuTestingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
