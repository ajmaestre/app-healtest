import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupListPanelComponent } from './group-list-panel.component';

describe('GroupListPanelComponent', () => {
  let component: GroupListPanelComponent;
  let fixture: ComponentFixture<GroupListPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupListPanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupListPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
