import React, { useState, useEffect, useRef } from "react";
import type { Human, Config } from "@vladmandic/human";
import { log, status } from "../lib/logging";

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
	const [ready, setReady] = useState(false);
	const [frame, setFrame] = useState(0);
	const timestampRef = useRef(0);
	const fpsRef = useRef(0);

	const HumanImport = useRef<any>(null);
	const humanRef = useRef<Human | undefined>(undefined);
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
			humanRef.current = new H.default(config) as Human;
			log(
				"human version:",
				humanRef.current.version,
				"| tfjs version:",
				humanRef.current.tf.version["tfjs-core"],
			);
			log(
				"platform:",
				humanRef.current.env.platform,
				"| agent:",
				humanRef.current.env.agent,
			);
			status("loading models...");
			humanRef.current.load().then(() => {
				log(
					"backend:",
					humanRef.current!.tf.getBackend(),
					"| available:",
					humanRef.current!.env.backends,
				);
				log(
					"loaded models:" +
						Object.values(humanRef.current!.models).filter(
							(model) => model !== null,
						).length,
				);
				status("initializing...");
				humanRef.current!.warmup().then(() => {
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
			if (!humanRef.current || !videoRef.current || !canvasRef.current) return;
			await humanRef.current.detect(videoRef.current);
			const now = humanRef.current.now();
			fpsRef.current = 1000 / (now - timestampRef.current);
			timestampRef.current = now;
			setFrame((prevFrame) => prevFrame + 1);
		};

		if (ready) {
			detect();
		}
	}, [ready, frame]);

	if (
		!videoRef.current ||
		!canvasRef.current ||
		!humanRef.current ||
		!humanRef.current.result
	)
		return null;

	if (!videoRef.current.paused) {
		const interpolated = humanRef.current.next(humanRef.current.result);
		humanRef.current.draw.canvas(videoRef.current, canvasRef.current);
		humanRef.current.draw.all(canvasRef.current, interpolated);
	}

	status(
		videoRef.current.paused
			? "paused"
			: `fps: ${fpsRef.current.toFixed(1).padStart(5, " ")}`,
	);

	return null;
};

export default RunHuman;
