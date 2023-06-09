import type { Config, Human } from "@vladmandic/human";
import React, { useEffect } from "react";
import { useEyesOfAIStore } from "../store";

const config: Partial<Config> = {
	debug: false,
	modelBasePath: `${process.env.NEXT_PUBLIC_HUMAN_MODELS_PATH}`,
	face: {
		enabled: true,
		attention: { enabled: true },
		antispoof: { enabled: false },
		mesh: { enabled: true },
		iris: { enabled: true },
		gear: { enabled: false },
		emotion: { enabled: true },
		detector: { enabled: false },
		description: { enabled: true },
		liveness: { enabled: false },
	},
	warmup: "face",
	body: { enabled: false },
	hand: { enabled: false },
	object: { enabled: false },
};

interface Props {
	videoRef: React.MutableRefObject<HTMLVideoElement>;
	humanLibraryReadyCallback: () => void;
}

const HumanDetection: React.FC<Props> = ({
	videoRef,
	humanLibraryReadyCallback,
}) => {
	const ready = useEyesOfAIStore((state) => state.ready);
	const setReady = useEyesOfAIStore((state) => state.setReady);

	const human = useEyesOfAIStore((state) => state.human);
	const setHuman = useEyesOfAIStore((state) => state.setHuman);

	const setResult = useEyesOfAIStore((state) => state.setResult);

	const checkIfShouldTrigger = useEyesOfAIStore(
		(state) => state.checkIfShouldTrigger
	);
	const appendAndShiftResultHistory = useEyesOfAIStore(
		(state) => state.appendAndShiftResultHistory
	);

	useEffect(() => {
		if (typeof document === "undefined") return;

		import("@vladmandic/human")
			.then((H) => {
				const newHuman = new H.default(config) as Human;
				setHuman(newHuman);
				console.log("config:", newHuman.config);
				console.log("loading models...");
				newHuman
					.load()
					.then(() => {
						console.log("initializing...");
						newHuman
							.warmup()
							.then(() => {
								setReady(true);
								humanLibraryReadyCallback();
								console.log("ready...");
							})
							.catch((err) => {
								console.error("warumup error", err);
								console.log("error...");
							});
					})
					.catch((err) => {
						console.error("load error", err);
						console.log("error...");
					});
			})
			.catch((err) => {
				console.error("import error", err);
				console.log("error...");
			});
	}, [humanLibraryReadyCallback, setHuman, setReady]);

	useEffect(() => {
		let timestamp = 0;
		let fps = 0;

		const detect = async () => {
			if (!human || !videoRef.current) return;

			await human.detect(videoRef.current);

			const now = human.now();
			fps = 1000 / (now - timestamp);
			timestamp = now;

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
	}, [
		appendAndShiftResultHistory,
		checkIfShouldTrigger,
		human,
		ready,
		setResult,
		videoRef,
	]);

	return <></>;
};

export default HumanDetection;
