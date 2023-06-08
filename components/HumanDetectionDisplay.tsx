import React, { useMemo } from "react";
import { useEyesOfAIStore } from "../store";
import styles from "../styles/elements.module.css";
import ProgressBar from "./ProgressBar";

interface Props {
	videoRef: React.MutableRefObject<HTMLVideoElement>;
	canvasRef: React.MutableRefObject<HTMLCanvasElement>;
}

const HumanDetectionDisplay: React.FC<Props> = ({ videoRef, canvasRef }) => {
	const result = useEyesOfAIStore((state) => state.result);
	const triggered = useEyesOfAIStore((state) => state.trigger);
	const firstStillTime = useEyesOfAIStore((state) => state.firstStandStillTime);
	const msInStill = useEyesOfAIStore((state) => state.msInStandStill);

	const detectionText = useMemo(() => {
		const text = result?.face.map((face) => {
			const distinctGestures = result.gesture
				.map(({ gesture }) => gesture.toString())
				.filter((x, i, a) => a.indexOf(x) == i);

			const coreLabel = `${Math.round(face.age)} years old ${
				face.gender
			} person`;
			const emotionLabel = `${face.emotion
				.map(({ emotion, score }) => `${Math.round(score * 100)}% ${emotion}`)
				.join(", ")}`;
			const gesturesLabel = `${distinctGestures.join(", ")}`;

			return [coreLabel, emotionLabel, gesturesLabel];
		})[0];
		return text;
	}, [result]);

	return (
		<>
			<div className={styles.standStillHint}>
				{!triggered && firstStillTime ? (
					<div>
						<ProgressBar
							progress={Math.min(100, msInStill / 2000)}
							width={window.innerWidth}
							height={20}
						></ProgressBar>
						<div>Stay like this!</div>
					</div>
				) : (
					<div style={{ paddingTop: "20px" }}>Stay still!</div>
				)}
				{triggered && <div>&apos;Triggered&apos;</div>}
			</div>
			<div className={styles.detectionText}>
				<div>
					{detectionText?.map((label) => (
						<p key={label}>{label}</p>
					))}
				</div>
			</div>
		</>
	);
};

export default HumanDetectionDisplay;
