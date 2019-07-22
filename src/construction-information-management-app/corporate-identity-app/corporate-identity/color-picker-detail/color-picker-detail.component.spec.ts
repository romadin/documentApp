import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorPickerDetailComponent } from './color-picker-detail.component';

describe('ColorPickerDetailComponent', () => {
  let component: ColorPickerDetailComponent;
  let fixture: ComponentFixture<ColorPickerDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorPickerDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorPickerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
