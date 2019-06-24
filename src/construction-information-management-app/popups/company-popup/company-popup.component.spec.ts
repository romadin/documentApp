import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyPopupComponent } from './company-popup.component';

describe('CompanyPopupComponent', () => {
  let component: CompanyPopupComponent;
  let fixture: ComponentFixture<CompanyPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
