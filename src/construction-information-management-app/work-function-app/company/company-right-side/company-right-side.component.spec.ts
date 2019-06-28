import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyRightSideComponent } from './company-right-side.component';

describe('CompanyRightSideComponent', () => {
  let component: CompanyRightSideComponent;
  let fixture: ComponentFixture<CompanyRightSideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyRightSideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyRightSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
