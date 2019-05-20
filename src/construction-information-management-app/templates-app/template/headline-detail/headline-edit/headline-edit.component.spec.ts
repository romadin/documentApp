import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadlineEditComponent } from './headline-edit.component';

describe('HeadlineEditComponent', () => {
  let component: HeadlineEditComponent;
  let fixture: ComponentFixture<HeadlineEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeadlineEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadlineEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
