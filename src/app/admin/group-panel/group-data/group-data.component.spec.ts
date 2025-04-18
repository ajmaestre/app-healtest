import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupDataComponent } from './group-data.component';

describe('GroupDataComponent', () => {
  let component: GroupDataComponent;
  let fixture: ComponentFixture<GroupDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
