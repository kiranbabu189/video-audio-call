import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CommonModule } from "@angular/common";

import {
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatIconModule
} from "@angular/material";

import { VedioAudioDialogComponent } from "./vedio-audio-dialog.component";

@NgModule({
    declarations: [VedioAudioDialogComponent],
    imports: [
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        CommonModule,
        MatDialogModule,
        MatIconModule
    ],
    exports: [VedioAudioDialogComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class VedioAudioDialogModule {}
