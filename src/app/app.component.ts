import { Component } from "@angular/core";
import { VideoAudioCallService } from "./video-audio-call.service"

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  constructor(
    private callService: VideoAudioCallService

  ) {
    // this.callService.setWebSocketUrlConnection("","")
  }
}
