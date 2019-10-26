import { Component, OnInit } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatSnackBar,
  MatDialogConfig
} from "@angular/material";
import { VedioAudioDialogComponent } from "../vedio-audio-dialog/vedio-audio-dialog.component";
import { VideoAudioCallService } from "../video-audio-call.service";
@Component({
  selector: "app-caller",
  templateUrl: "./caller.component.html",
  styleUrls: ["./caller.component.scss"]
})
export class CallerComponent {
  title = "video-call";
  dialogRef: any;
  selectedPerson: string = '';
  persons: any = [
    { value: "sudo", viewValue: "sudo" },
    { value: "ssh", viewValue: "ssh" },
    { value: "vscode", viewValue: "vscode" },
    { value: "postman", viewValue: "postman" }
  ];
  constructor(
    private dialog: MatDialog,
    private callService: VideoAudioCallService
  ) {
    // this.callService.setWebSocketUrlConnection("","")
  }
  openD() {
    this.dialogRef = this.dialog.open(VedioAudioDialogComponent, {
      panelClass: "video-audio-dialog",
      disableClose: true,
      data: {
        startCall: true
      }
    });
    this.dialogRef.componentInstance.startCall = true;
    this.dialogRef.componentInstance.closeVideoAudioDialog$.subscribe(() => {
      this.dialogRef.close();
    });
    this.dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
    });
  }
  setSocket($event) {
    this.selectedPerson = $event.value;
    this.callService.setWebSocketUrlConnection("",$event.value)
  }
}
