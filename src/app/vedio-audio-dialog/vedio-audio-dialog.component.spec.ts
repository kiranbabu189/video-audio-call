import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VedioAudioDialogComponent } from './vedio-audio-dialog.component';

describe('VedioAudioDialogComponent', () => {
  let component: VedioAudioDialogComponent;
  let fixture: ComponentFixture<VedioAudioDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VedioAudioDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VedioAudioDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
