import { Component, OnInit } from "@angular/core";
import { VideoAudioCallService } from "../video-audio-call.service";
import { IncomingCallComponent } from "./incoming-call/incoming-call.component";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatSnackBar,
  MatDialogConfig
} from "@angular/material";
import { VedioAudioDialogComponent } from "../vedio-audio-dialog/vedio-audio-dialog.component";
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: "app-receiver",
  templateUrl: "./receiver.component.html",
  styleUrls: ["./receiver.component.scss"]
})
export class ReceiverComponent implements OnInit {
  dialogRef: any;
  audio: HTMLAudioElement;
  adminDetails: any;
  id: string;
  constructor(
    private callService: VideoAudioCallService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("code");
    debugger
    this.callService.setWebSocketUrlConnection("",this.id)
    this.callService.inComingCall$.subscribe(flag => {
      if (flag) {
        this.openIncomingCallDialog();
        this.audio = new Audio("assets/sounds/call.mp3");
        this.audio.loop = true;
        this.audio.play();
      }
    });
  }
  openIncomingCallDialog(): void {
    this.dialogRef = this.dialog.open(IncomingCallComponent, {
      panelClass: "video-audio-dialog",
      width: "350px",
      disableClose: true
    });
    this.dialogRef.componentInstance.respondHandler$.subscribe(response => {
      if (response) {
        this.dialogRef.close();
        this.dialogRef = null;
        this.openVedioAudiodialog();
        this.stopCallerTune();
        // this.openCallDialog();
      } else {
        this.callService.sendRejectCall();
        this.dialogRef.close();
        this.stopCallerTune();
      }
    });
  }
  openVedioAudiodialog(): void {
    this.dialogRef = this.dialog.open(VedioAudioDialogComponent, {
      panelClass: "video-audio-dialog",
      disableClose: true,
      data: {
        startCall: true
      }
    });
    this.dialogRef.componentInstance.closeVideoAudioDialog$.subscribe(() => {
      this.dialogRef.close();
    });
    this.dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
    });
  }
  stopCallerTune() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.audio = null;
  }
}
