import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetailPublicComponent } from './user-detail-public.component';

describe('UserDetailPublicComponent', () => {
  let component: UserDetailPublicComponent;
  let fixture: ComponentFixture<UserDetailPublicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDetailPublicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
