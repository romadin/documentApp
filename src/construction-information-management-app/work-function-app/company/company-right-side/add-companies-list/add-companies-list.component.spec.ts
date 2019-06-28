import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCompaniesListComponent } from './add-companies-list.component';

describe('AddCompaniesListComponent', () => {
  let component: AddCompaniesListComponent;
  let fixture: ComponentFixture<AddCompaniesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCompaniesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCompaniesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
