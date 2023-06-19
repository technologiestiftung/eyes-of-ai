import { Component } from "react";

interface Props {
	elementId: string;
	webcamReadyCallback: () => void;
}
interface State {
	ready: boolean;
	videoDeviceIds: Array<MediaDeviceInfo>;
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

		navigator.mediaDevices.enumerateDevices().then((devices) => {
			const webcams = devices.filter((d) => d.kind === "videoinput");
			console.log(webcams);
			this.setState({ videoDeviceIds: webcams });
		});
	}

	selectVideoSource(deviceId: string) {
		this.constraints = {
			audio: false,
			video: {
				facingMode: "user",
				deviceId: deviceId,
				width: { ideal: document.body.clientWidth },
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
		if (this && this.state) {
			return (
				<ul>
					{(this.state.videoDeviceIds ?? []).map((webcam) => {
						return (
							<li
								key={webcam.deviceId}
								onClick={() => {
									this.selectVideoSource(webcam.deviceId);
								}}
							>
								{webcam.label}
							</li>
						);
					})}
				</ul>
			);
		}
	}
}

export default InitWebCam;
