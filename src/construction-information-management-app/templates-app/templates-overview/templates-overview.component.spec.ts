import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatesOverviewComponent } from './templates-overview.component';

describe('TemplatesOverviewComponent', () => {
  let component: TemplatesOverviewComponent;
  let fixture: ComponentFixture<TemplatesOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplatesOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatesOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
