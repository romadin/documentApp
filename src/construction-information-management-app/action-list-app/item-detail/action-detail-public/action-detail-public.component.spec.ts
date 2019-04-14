import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionDetailPublicComponent } from './action-detail-public.component';

describe('ActionDetailPublicComponent', () => {
  let component: ActionDetailPublicComponent;
  let fixture: ComponentFixture<ActionDetailPublicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionDetailPublicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionDetailPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
