import { Injectable } from "@angular/core";
import { Subject, BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class VideoAudioCallService {
    private peerConnectionConfig: any = {
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
        iceServers: [
            { urls: "stun:stun.stunprotocol.org:3478" },
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun.services.mozilla.com" }
        ]
    };
    public remoteVideo: any;
    public streamObject: any;
    public localVideo: any;
    private serverConnection: any;
    private peerConnection: any = null;
    private videoCallAccepted: boolean = false;
    private webSocketUrl: string =
        "wss://connect.websocket.in/hack4mer?room_id=123";
    public isVideoAllowed: boolean = true;
    public isAudioAllowed: boolean = true;
    private isNegotiating: boolean = false;
    private peerFrom: any;
    public stream: any;
    public isMuted$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
        false
    );
    public isCamDisabled$: BehaviorSubject<boolean> = new BehaviorSubject<
        boolean
    >(false);
    public socketConnectionEstablished$: Subject<boolean> = new BehaviorSubject<
        boolean
    >(false);
    public inComingCall$: BehaviorSubject<boolean> = new BehaviorSubject<
        boolean
    >(false);
    public callStarted$: Subject<any> = new Subject<any>();
    public fullScreenMode$: BehaviorSubject<boolean> = new BehaviorSubject<
        boolean
    >(false);
    public callRejected$: Subject<boolean> = new BehaviorSubject<boolean>(
        false
    );

    constructor() {
        this.callStarted$.subscribe(flag => {
            debugger
            this.videoCallAccepted = flag;
        });
    }

    setWebSocketUrlConnection(id, room_id) {
        this.webSocketUrl = `wss://connect.websocket.in/hack4mer?room_id=${room_id}`;
        this.serverConnection = new WebSocket(this.webSocketUrl);
        this.serverConnection.onmessage = this.inCommingMessageHandler.bind(
            this
        );
        this.serverConnection.onopen = this.onOpenHandler.bind(this);
        this.serverConnection.onerror = this.onErrorHandler.bind(this);
    }

    inCommingMessageHandler(message) {
        var signal = JSON.parse(message.data);
        console.log(
            "Log : VideoAudioCallService -> inCommingMessageHandler -> signal",
            signal.type
        );
        if (signal.type === "callRejected") {
            this.callRejected$.next(true);
            this.stopStream();
        }
        if (signal.type === "calling") {
            this.inComingCall$.next(true);
        }
        if (signal.type == "callRequest") {
            this.startVideoCall(true, signal);
            console.log("Starting a call with: " + signal.from);
        } else if (signal.sdp) {
            if (!this.peerConnection) {
                this.startVideoCall(false, signal);
            }
            console.log(
                "signaling state on sdp recieving ",
                this.peerConnection.signalingState,
                JSON.stringify(this.peerConnection.signalingState)
            );
            this.peerConnection
                .setRemoteDescription(new RTCSessionDescription(signal.sdp))
                .then(() => {
                    // Only create answers in response to offers
                    if (signal.sdp.type == "offer") {
                        console.log("Got an offer from " + signal.from, signal);
                        console.log(
                            "signaling state after setting remote description ",
                            this.peerConnection.signalingState
                        );
                        this.peerConnection
                            .createAnswer()
                            .then(description => {
                                console.log(
                                    "Log : VideoAudioCallService -> inCommingMessageHandler -> description",
                                    description
                                );
                                console.log(
                                    "signaling state after creating answer ",
                                    this.peerConnection.signalingState
                                );
                                //The remove description
                                this.peerConnection
                                    .setLocalDescription(description)
                                    .then(() => {
                                        console.log(
                                            "signaling state after setting answer as local descriptoin ",
                                            this.peerConnection.signalingState
                                        );
                                        let message = this.constructSocketMessage(
                                            {
                                                peerInfo: "aptask",
                                                from: "aptask",
                                                to: signal.from,
                                                sdp: this.peerConnection
                                                    .localDescription
                                            }
                                        );
                                        this.sendSocketMessage(message);
                                    })
                                    .catch(error =>
                                        this.errorHandler(
                                            error,
                                            "from setLocalDescription"
                                        )
                                    );
                            })
                            .catch(error =>
                                this.errorHandler(error, "from createAnswer")
                            );
                    } else {
                        console.log(
                            "Got an asnwer from " + signal.from,
                            JSON.stringify(signal)
                        );
                    }
                })
                .catch(error =>
                    this.errorHandler(error, "from setRemoteDescription")
                );
        } else if (signal.ice) {
            console.log(
                "Log : VideoAudioCallService -> inCommingMessageHandler -> ice",
                signal.ice
            );
            if (!this.peerConnection) {
                console.log(
                    "received ice candidate while peer connection is",
                    this.peerConnection
                );
            }
            //Utilities.log("Adding ice.candidate : ",signal);
            this.peerConnection && this.peerConnection
                .addIceCandidate(new RTCIceCandidate(signal.ice))
                .catch(error =>
                    this.errorHandler(error, "error from signal ice")
                );
        }
    }

    errorHandler(error, from) {
        console.error("*****************" + from + "\n" + error);
    }

    onOpenHandler(message) {
        this.socketConnectionEstablished$.next(true);
        // this.callService.makeCall();
        // this.makeCall();
        console.log(
            "TCL: VideoAudioCallService -> onOpenHandler -> message",
            message
        );
    }

    onErrorHandler(error) {
        console.log(
            "TCL: VideoAudioCallService -> onErrorHandler -> error",
            error
        );
    }

    callClient() {
        console.trace()
        let message = JSON.stringify({
            peerInfo: "aptask",
            from: "aptask",
            type: "calling"
        });
        this.sendSocketMessage(message);
    }

    makeCall() {
        let message = JSON.stringify({
            peerInfo: "aptask",
            from: "aptask",
            type: "callRequest"
        });
        this.sendSocketMessage(message);
    }

    startVideoCall(isCaller, requestSignal) {
        console.trace();
        console.log("making pc:", requestSignal.from);

        this.peerConnection = new RTCPeerConnection(this.peerConnectionConfig);
        console.log(
            "signal state while initiating peer connection ",
            isCaller,
            this.peerConnection.signalingState
        );
        var peerFrom = this.peerConnection;

        peerFrom.oniceconnectionstatechange = async ev => {
            console.log(
                "connection state changed ",
                ev,
                JSON.stringify(ev),
                peerFrom.iceConnectionState
            );
            if (
                peerFrom.iceConnectionState === "disconnected" ||
                peerFrom.iceConnectionState === "failed"
            ) {
                console.log("connection failed ");
                console.log("restarting ice  iscaller", isCaller);
                await this.negotiationProcedure(
                    isCaller,
                    requestSignal,
                    peerFrom,
                    true
                );
            }
        };

        peerFrom.onicecandidate = event => {
            if (event.candidate != null) {
                console.log(
                    "Log : VideoAudioCallService -> startVideoCall -> event.candidate",
                    event.candidate
                );
                let message = this.constructSocketMessage({
                    peerInfo: "aptask",
                    from: "aptask",
                    to: requestSignal.from,
                    ice: event.candidate
                });
                this.sendSocketMessage(message);
            }
        };

        peerFrom.ontrack = event => {
            if (event.track.kind != "video") {
                return;
            }

            console.log("Remote video found!!");

            this.remoteVideo.srcObject = event.streams[0];
            console.log(
                "Log : VideoAudioCallService -> startVideoCall -> event.streams[0];",
                event.streams[0]
            );
            // this.remoteVideo.style.height = "auto";
            this.remoteVideo.play();
            this.callStarted$.next(true);
        };

        peerFrom.onsignalingstatechange = e => {
            // Workaround for Chrome: skip nested negotiations
            console.log(
                "Log : VideoAudioCallService -> startVideoCall -> this.peerConnection.signalingState",
                this.peerConnection.signalingState
            );
            this.isNegotiating = this.peerConnection.signalingState != "stable";
        };

        //Add the track to be sent
        this.stream = this.localVideo.srcObject;
        console.log(
            "TCL: VideoAudioCallService -> startVideoCall -> stream",
            this.stream
        );
        this.stream &&
            this.stream.getTracks().forEach(track => {
                this.peerConnection.addTrack(track, this.stream);
            });

        //Create offer when needed
        this.isNegotiating = false;
        peerFrom.onnegotiationneeded = async () => {
            await this.negotiationProcedure(
                isCaller,
                requestSignal,
                peerFrom,
                false
            );
        };
    }

    setSelfVideoObject(localVideo) {
        this.localVideo = localVideo;
    }

    setRemoteVideoObject(remoteVideo) {
        this.remoteVideo = remoteVideo;
    }

    async negotiationProcedure(
        isCaller,
        requestSignal,
        peerFrom,
        failedStatus
    ) {
        if (!isCaller || !this.peerConnection) {
            return;
        }

        // console.log("I need it", window.theRemoteDesc);

        if (this.isNegotiating) {
            console.log(requestSignal);
            console.log(
                "is negotatiating " + this.peerConnection.signalingState
            );
            console.log("SKIP nested negotiations");
            return;
        }

        this.isNegotiating = true;

        var description;

        if (failedStatus) {
            console.log("creating offer with iceRestart set in options");
            description = await peerFrom.createOffer({ iceRestart: true });
        } else {
            description = await peerFrom.createOffer();
        }

        console.log(
            "Log : VideoAudioCallService -> peerFrom.onnegotiationneeded -> description",
            description
        );

        console.log("got local description");
        console.log(
            "signlaning state after offer creation ",
            this.peerConnection.signalingState
        );
        console.log("a", isCaller, requestSignal);

        await peerFrom.setLocalDescription(description);
        console.log("b");

        console.log(
            "signaling state after setting local description " +
                this.peerConnection.signalingState
        );

        //if(isCaller){
        console.log("Making offer");
        //Send a call offer
        let message = this.constructSocketMessage({
            peerInfo: "aptask",
            from: "aptask",
            to: requestSignal.from,
            sdp: this.peerConnection.localDescription
        });
        this.sendSocketMessage(message);
        //}
    }

    closeTracks() {
        let tracks = this.stream.getTracks();
        tracks.forEach(function(track) {
            track.stop();
        });
    }

    sendSocketMessage(message) {
        this.serverConnection.send(message);
    }

    constructSocketMessage(message) {
        return JSON.stringify(message);
    }

    reinitializeStates() {
        // this.remoteVideo = null;
        // this.localVideo = null;
        // this.serverConnection = null;
        this.isNegotiating = false;
        this.peerConnection = null;
        this.peerFrom = null;
        this.stream = null;
        // this.serverConnection.close()
        this.inComingCall$.next(false);
        this.socketConnectionEstablished$.next(false)
    }

    public get inComingCallStatusResponseStatus() {
        return this.inComingCall$.value;
    }

    sendRejectCall() {
        let message = JSON.stringify({
            peerInfo: "aptask",
            from: "aptask",
            type: "callRejected"
        });
        this.sendSocketMessage(message);
    }

    controlStreams(streamType) {
        if (streamType === "video") {
            this.isCamDisabled$.next(!this.isCamDisabled$.value);
            this.stream.getVideoTracks()[0].enabled = !this.isCamDisabled$
                .value;
        }
        if (streamType === "audio") {
            this.isMuted$.next(!this.isMuted$.value);
            this.stream.getAudioTracks()[0].enabled = !this.isMuted$.value;
        }
    }

    initCamera(config: any) {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia(config).then(stream => {
                this.localVideo.srcObject = stream;
                this.streamObject = this.localVideo.srcObject;
                this.localVideo.play();
                this.localVideo.volume = 0;
                this.localVideo.muted = 0;
                this.localVideo.muted = true;
            });
        } else {
            alert("no media devices");
        }
    }

    stopStream() {
        // this.callService.closeTracks();
        let tracks = this.streamObject.getTracks();

        this.reinitializeStates();
        tracks.forEach(function(track) {
            track.stop();
        });
    }

    fullscreen() {
        let self = this.localVideo;
        let guest = this.remoteVideo;
        this.fullScreenMode$.next(!this.fullScreenMode$.value);
        /* if (this.videoCallAccepted) {
            if (guest.requestFullscreen) {
                guest.requestFullscreen();
            } else if (guest.mozRequestFullScreen) {
                guest.mozRequestFullScreen();
            } else if (guest.webkitRequestFullscreen) {
                guest.webkitRequestFullscreen();
            }
            this.remoteVideo.controls = false;
            this.localVideo.controls = false;
        } */
    }
}
