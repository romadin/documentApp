import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentDetailPublicComponent } from './document-detail-public.component';

describe('DocumentDetailPublicComponent', () => {
  let component: DocumentDetailPublicComponent;
  let fixture: ComponentFixture<DocumentDetailPublicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentDetailPublicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentDetailPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
