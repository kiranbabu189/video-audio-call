import { Component, OnInit, Output, EventEmitter } from "@angular/core";

@Component({
    selector: "app-incoming-call",
    templateUrl: "./incoming-call.component.html",
    styleUrls: ["./incoming-call.component.scss"]
})
export class IncomingCallComponent implements OnInit {
    @Output() respondHandler$: EventEmitter<any> = new EventEmitter();
    constructor() {}

    ngOnInit() {}
    acceptRejectCall(isAccept) {
        this.respondHandler$.emit(isAccept);
    }
}
