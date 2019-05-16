import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadlineDetailComponent } from './headline-detail.component';

describe('HeadlineDetailComponent', () => {
  let component: HeadlineDetailComponent;
  let fixture: ComponentFixture<HeadlineDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeadlineDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadlineDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
