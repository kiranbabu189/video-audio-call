import { TestBed } from '@angular/core/testing';

import { VideoAudioCallService } from './video-audio-call.service';

describe('VideoAudioCallService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VideoAudioCallService = TestBed.get(VideoAudioCallService);
    expect(service).toBeTruthy();
  });
});
