import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderRowComponent } from './folder-row.component';

describe('FolderRowComponent', () => {
  let component: FolderRowComponent;
  let fixture: ComponentFixture<FolderRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FolderRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FolderRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
