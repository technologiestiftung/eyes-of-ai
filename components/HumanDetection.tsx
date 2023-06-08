import type { Config, Human } from "@vladmandic/human";
import React, { useEffect } from "react";
import { status } from "../lib/logging";
import { useEyesOfAIStore } from "../store";

const config: Partial<Config> = {
	debug: false,
	modelBasePath: "https://cdn.jsdelivr.net/gh/vladmandic/human-models/models/",
	face: { enabled: true, attention: { enabled: true } },
	body: { enabled: false },
	hand: { enabled: false },
	object: { enabled: false },
};

interface Props {
	videoRef: React.MutableRefObject<HTMLVideoElement>;
	canvasRef: React.MutableRefObject<HTMLCanvasElement>;
}

const HumanDetection: React.FC<Props> = ({ videoRef, canvasRef }) => {
	const ready = useEyesOfAIStore((state) => state.ready);
	const setReady = useEyesOfAIStore((state) => state.setReady);

	const human = useEyesOfAIStore((state) => state.human);
	const setHuman = useEyesOfAIStore((state) => state.setHuman);

	const setResult = useEyesOfAIStore((state) => state.setResult);

	const checkIfShouldTrigger = useEyesOfAIStore(
		(state) => state.checkIfShouldTrigger,
	);
	const appendAndShiftResultHistory = useEyesOfAIStore(
		(state) => state.appendAndShiftResultHistory,
	);

	useEffect(() => {
		if (typeof document === "undefined") return;

		import("@vladmandic/human").then((H) => {
			const newHuman = new H.default(config) as Human;
			setHuman(newHuman);
			console.log("config:", newHuman.config);
			status("loading models...");
			newHuman.load().then(() => {
				status("initializing...");
				newHuman.warmup().then(() => {
					setReady(true);
					status("ready...");
				});
			});
		});
	}, []);

	useEffect(() => {
		let timestamp = 0;
		let fps = 0;

		const detect = async () => {
			if (!human || !videoRef.current || !canvasRef.current) return;

			await human.detect(videoRef.current);

			const now = human.now();
			fps = 1000 / (now - timestamp);
			timestamp = now;

			status(
				videoRef.current.paused
					? "paused"
					: `fps: ${fps.toFixed(1).padStart(5, " ")}`,
			);

			if (!videoRef.current.paused) {
				const interpolated = human.next(human.result);
				setResult({ face: interpolated.face, gesture: interpolated.gesture });
				appendAndShiftResultHistory({
					face: interpolated.face,
					gesture: interpolated.gesture,
				});
				checkIfShouldTrigger();
			}

			detect();
		};

		if (ready) {
			detect();
		}
	}, [ready]);

	return <></>;
};

export default HumanDetection;
