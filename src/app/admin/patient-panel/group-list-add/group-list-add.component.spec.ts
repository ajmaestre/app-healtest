import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupListAddComponent } from './group-list-add.component';

describe('GroupListAddComponent', () => {
  let component: GroupListAddComponent;
  let fixture: ComponentFixture<GroupListAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupListAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupListAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
