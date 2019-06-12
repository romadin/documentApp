import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectWorkFunctionEditComponent } from './project-work-function-edit.component';

describe('ProjectWorkFunctionEditComponent', () => {
  let component: ProjectWorkFunctionEditComponent;
  let fixture: ComponentFixture<ProjectWorkFunctionEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectWorkFunctionEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectWorkFunctionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
