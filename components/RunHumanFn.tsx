import React, { useEffect, useRef } from "react";
import type { Human, Config } from "@vladmandic/human";
import { log, status } from "../lib/logging";
import {useEyesOfAIStore} from "../store";

const config: Partial<Config> = {
	debug: false,
	modelBasePath: "https://cdn.jsdelivr.net/npm/@vladmandic/human/models",
	face: { enabled: true },
	body: { enabled: false },
	hand: { enabled: false },
	object: { enabled: false },
};

interface Props {
	inputId: string;
	outputId: string;
}

const RunHuman: React.FC<Props> = ({ inputId, outputId }) => {
	const ready = useEyesOfAIStore((state) => state.ready);
	const setReady = useEyesOfAIStore((state) => state.setReady);

	const frame = useEyesOfAIStore((state) => state.frame);
	const setFrame = useEyesOfAIStore((state) => state.setFrame);

	const timestamp = useEyesOfAIStore((state) => state.timestamp);
	const setTimestamp = useEyesOfAIStore((state) => state.setTimestamp);

	const fps = useEyesOfAIStore((state) => state.fps);
	const setFps = useEyesOfAIStore((state) => state.setFps);

	const human = useEyesOfAIStore((state) => state.human);
	const setHuman = useEyesOfAIStore((state) => state.setHuman);

	const age = useEyesOfAIStore((state) => state.age);
	const setAge = useEyesOfAIStore((state) => state.setAge);

	const gender = useEyesOfAIStore((state) => state.gender);
	const setGender = useEyesOfAIStore((state) => state.setGender);

	const videoRef = useRef<HTMLVideoElement | undefined>(undefined);
	const canvasRef = useRef<HTMLCanvasElement | undefined>(undefined);

	useEffect(() => {
		if (typeof document === "undefined") return;
		videoRef.current =
			(document.getElementById(inputId) as HTMLVideoElement | undefined) ||
			document.createElement("video");
		canvasRef.current =
			(document.getElementById(outputId) as HTMLCanvasElement | undefined) ||
			document.createElement("canvas");

		import("@vladmandic/human").then((H) => {
			const newHuman = new H.default(config) as Human;
			setHuman(newHuman);
			log(
				"human version:",
				newHuman.version,
				"| tfjs version:",
				newHuman.tf.version["tfjs-core"],
			);
			log(
				"platform:",
				newHuman.env.platform,
				"| agent:",
				newHuman.env.agent,
			);
			status("loading models...");
			newHuman.load().then(() => {
				log(
					"backend:",
					newHuman!.tf.getBackend(),
					"| available:",
					newHuman!.env.backends,
				);
				log(
					"loaded models:" +
						Object.values(newHuman!.models).filter(
							(model) => model !== null,
						).length,
				);
				status("initializing...");
				newHuman!.warmup().then(() => {
					setReady(true);
					status("ready...");
				});
			});
		});
	}, []);

	useEffect(() => {
		if (videoRef.current) {
			videoRef.current.onresize = () => {
				canvasRef.current!.width = videoRef.current!.videoWidth;
				canvasRef.current!.height = videoRef.current!.videoHeight;
			};
		}
		if (canvasRef.current) {
			canvasRef.current.onclick = () => {
				videoRef.current?.paused
					? videoRef.current?.play()
					: videoRef.current?.pause();
			};
		}
	}, []);

	useEffect(() => {
		const detect = async () => {
			if (!human || !videoRef.current || !canvasRef.current) return;

			await human.detect(videoRef.current);

			const now = human.now();
			setFps(1000 / (now - timestamp));
			setTimestamp(now);

			setFrame(frame + 1);
		};

		if (ready) {
			detect();
		}
	}, [ready, frame]);

	if (
		!videoRef.current ||
		!canvasRef.current ||
		!human ||
		!human.result
	)
		return null;

	if (!videoRef.current.paused) {
		const interpolated = human.next(human.result);

		setAge(interpolated.face[0]?.age);
		setGender(interpolated.face[0]?.gender);

		human.draw.canvas(videoRef.current, canvasRef.current);
		human.draw.all(canvasRef.current, interpolated);
	}

	status(
		videoRef.current.paused
			? "paused"
			: `fps: ${fps.toFixed(1).padStart(5, " ")}`,
	);

	return <>
		Age: {age}, Gender: {gender}
	</>;
};

export default RunHuman;
