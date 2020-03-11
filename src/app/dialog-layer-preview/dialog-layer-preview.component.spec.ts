import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogLayerPreviewComponent } from './dialog-layer-preview.component';

describe('DialogLayerPreviewComponent', () => {
  let component: DialogLayerPreviewComponent;
  let fixture: ComponentFixture<DialogLayerPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogLayerPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogLayerPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
