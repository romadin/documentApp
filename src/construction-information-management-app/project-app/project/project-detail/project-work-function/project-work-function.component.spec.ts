import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectWorkFunctionComponent } from './project-work-function.component';

describe('ProjectWorkFunctionComponent', () => {
  let component: ProjectWorkFunctionComponent;
  let fixture: ComponentFixture<ProjectWorkFunctionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectWorkFunctionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectWorkFunctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
