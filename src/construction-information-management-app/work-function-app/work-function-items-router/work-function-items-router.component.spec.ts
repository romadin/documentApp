import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkFunctionItemsRouterComponent } from './work-function-items-router.component';

describe('WorkFunctionItemsRouterComponent', () => {
  let component: WorkFunctionItemsRouterComponent;
  let fixture: ComponentFixture<WorkFunctionItemsRouterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkFunctionItemsRouterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkFunctionItemsRouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
