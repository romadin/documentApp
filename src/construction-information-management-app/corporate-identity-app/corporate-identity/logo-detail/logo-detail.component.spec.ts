import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoDetailComponent } from './logo-detail.component';

describe('LogoDetailComponent', () => {
  let component: LogoDetailComponent;
  let fixture: ComponentFixture<LogoDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogoDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
