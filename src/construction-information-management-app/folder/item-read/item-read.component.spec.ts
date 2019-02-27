import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemReadComponent } from './item-read.component';

describe('ItemReadComponent', () => {
  let component: ItemReadComponent;
  let fixture: ComponentFixture<ItemReadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemReadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemReadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
