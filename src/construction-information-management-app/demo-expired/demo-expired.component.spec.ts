import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoExpiredComponent } from './demo-expired.component';

describe('DemoExpiredComponent', () => {
  let component: DemoExpiredComponent;
  let fixture: ComponentFixture<DemoExpiredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoExpiredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoExpiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
