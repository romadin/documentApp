import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkFunctionEditComponent } from './work-function-edit.component';

describe('WorkFunctionEditComponent', () => {
  let component: WorkFunctionEditComponent;
  let fixture: ComponentFixture<WorkFunctionEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkFunctionEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkFunctionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
