import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  EventEmitter,
  Output,
  Input
} from "@angular/core";
import { VideoAudioCallService } from "../video-audio-call.service";
@Component({
  selector: "app-vedio-audio-dialog",
  templateUrl: "./vedio-audio-dialog.component.html",
  styleUrls: ["./vedio-audio-dialog.component.scss"]
})
export class VedioAudioDialogComponent implements OnInit, AfterViewInit {
  displayControls: any;
  constructor(private callService: VideoAudioCallService) {}
  @ViewChild("videoElementSelf") videoElementSelf: any;
  selfVideo: any;
  @ViewChild("videoElementGuest") videoElementGuest: any;
  guestVideo: any;
  streamObject: any;
  videoCallAccepted: boolean = false;
  isAudioMuted: boolean = false;
  isCamDisabled: boolean = false;
  isFullScreen: boolean = false;
  @Input() startCall;
  @Output() closeVideoAudioDialog$: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    this.selfVideo = this.videoElementSelf.nativeElement;
    this.guestVideo = this.videoElementGuest.nativeElement;
    this.callService.setRemoteVideoObject(this.guestVideo);
    this.callService.setSelfVideoObject(this.selfVideo);
    this.callService.initCamera({ video: true, audio: true });
    this.callService.fullScreenMode$.subscribe(flag => {
      this.isFullScreen = flag;
    });
    this.callService.isMuted$.subscribe(isMuted => {
      this.isAudioMuted = isMuted;
    });
    this.callService.isCamDisabled$.subscribe(isCamDisabled => {
      this.isCamDisabled = isCamDisabled;
    });
    this.callService.callStarted$.subscribe(flag => {
        debugger
      this.videoCallAccepted = flag;
    });
    if (this.startCall) {
      this.callService.callClient();
    }
    /* this.callService.socketConnectionEstablished$.subscribe(flag => {
            debugger
            if (flag && !this.callService.inComingCallStatusResponseStatus) {
                
            }
        }); */
  }
  ngAfterViewInit() {
    if (this.callService.inComingCallStatusResponseStatus) {
      this.callService.makeCall();
    }
  }
  start() {
    this.initCamera({ video: true, audio: true });
  }
  sound() {
    this.initCamera({ video: true, audio: true });
  }

  initCamera(config: any) {}
  pause() {
    this.selfVideo.pause();
  }

  toggleControls() {}
  fullscreen() {
    this.callService.fullscreen();
  }
  resume() {
    this.selfVideo.play();
  }
  closeVideoAudioDialog() {
    // this.callService.closeTracks();
    this.callService.stopStream();
    this.closeVideoAudioDialog$.emit();
  }
  controlStreams(streamType) {
    this.callService.controlStreams(streamType);
  }
}
