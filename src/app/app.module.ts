import { BrowserModule } from "@angular/platform-browser";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { VedioAudioDialogComponent } from "./vedio-audio-dialog/vedio-audio-dialog.component";
import { VedioAudioDialogModule } from "./vedio-audio-dialog/vedio-audio-dialog.module";
import { ReceiverModule } from "./receiver/receiver.module";
import { IncomingCallComponent } from "./receiver/incoming-call/incoming-call.component";
import { CallerComponent } from "./caller/caller.component";
import {
  MatIconModule,
  MatSelectModule,
  MatButtonModule
} from "@angular/material";

@NgModule({
  declarations: [AppComponent, CallerComponent],
  imports: [
    BrowserAnimationsModule,
    MatIconModule,
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    VedioAudioDialogModule,
    ReceiverModule,
    MatButtonModule,
    MatSelectModule
  ],
  bootstrap: [AppComponent],
  entryComponents: [VedioAudioDialogComponent, IncomingCallComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
