import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationNotFoundComponent } from './organisation-not-found.component';

describe('OrganisationNotFoundComponent', () => {
  let component: OrganisationNotFoundComponent;
  let fixture: ComponentFixture<OrganisationNotFoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganisationNotFoundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
