import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectRouterComponent } from './project-router.component';

describe('ProjectRouterComponent', () => {
  let component: ProjectRouterComponent;
  let fixture: ComponentFixture<ProjectRouterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectRouterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectRouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
