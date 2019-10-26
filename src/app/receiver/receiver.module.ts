import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReceiverComponent } from "./receiver.component";
import {
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatDialogModule,
  MatIconModule
} from "@angular/material";
import { VedioAudioDialogComponent } from "../vedio-audio-dialog/vedio-audio-dialog.component";
import { IncomingCallComponent } from "./incoming-call/incoming-call.component";
@NgModule({
  declarations: [ReceiverComponent,IncomingCallComponent],
  imports: [CommonModule, MatDialogModule,MatIconModule],
  entryComponents: [VedioAudioDialogComponent, IncomingCallComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReceiverModule {}
