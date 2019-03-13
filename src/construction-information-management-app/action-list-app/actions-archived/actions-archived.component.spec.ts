import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsArchivedComponent } from './actions-archived.component';

describe('ActionsArchivedComponent', () => {
  let component: ActionsArchivedComponent;
  let fixture: ComponentFixture<ActionsArchivedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionsArchivedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionsArchivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
