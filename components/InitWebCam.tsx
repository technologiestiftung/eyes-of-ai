import { Component } from "react";

interface Props {
	elementId: string;
	webcamReadyCallback: () => void;
}
interface State {
	ready: boolean;
}

class InitWebCam extends Component<Props, State> {
	video: HTMLVideoElement | undefined;
	stream: MediaStream | undefined;
	track: MediaStreamTrack | undefined;
	settings: MediaTrackSettings | undefined;
	constraints: MediaStreamConstraints | undefined;
	capabilities: MediaTrackCapabilities | undefined;

	constructor(props: Props) {
		super(props);
		if (typeof document === "undefined") return;
		this.video =
			(document.getElementById(this.props.elementId) as
				| HTMLVideoElement
				| undefined) || document.createElement("video");
		this.video.style.display = "none";
		this.video.id = this.props.elementId;
		this.constraints = {
			audio: false,
			video: {
				facingMode: "user",
				// Magic width, height calculation assuming we have a grid of 5x6
				// TODO: doublecheck how to do this responsively without magic
				width: {
					ideal: ((document.documentElement.clientWidth / 5.0) * 3.0 - 40) * 2,
				},
				height: {
					ideal:
						((document.documentElement.clientHeight / 6.0) * 4.0 * 0.6 - 40) *
						2,
				},
			},
		};
		navigator.mediaDevices
			.getUserMedia(this.constraints)
			.then((stream: MediaStream) => {
				this.stream = stream;
				this.track = this.stream.getVideoTracks()[0];
				this.capabilities = this.track.getCapabilities
					? this.track.getCapabilities()
					: undefined;
				this.settings = this.track.getSettings
					? this.track.getSettings()
					: undefined;
				this.video!.onloadeddata = () => this.setState({ ready: true });
				this.video!.srcObject = this.stream;
				this.video!.play();
				this.props.webcamReadyCallback();
			});
	}

	override render(this: InitWebCam) {
		if (this && this.state && this.state.ready) return null;
	}
}

export default InitWebCam;
