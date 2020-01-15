import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkFunctionListComponent } from './work-function-list.component';

describe('WorkFunctionListComponent', () => {
  let component: WorkFunctionListComponent;
  let fixture: ComponentFixture<WorkFunctionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkFunctionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkFunctionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
