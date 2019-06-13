import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkFunctionComponent } from './work-function.component';

describe('WorkFunctionComponent', () => {
  let component: WorkFunctionComponent;
  let fixture: ComponentFixture<WorkFunctionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkFunctionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkFunctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
