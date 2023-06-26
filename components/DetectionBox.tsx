import React from "react";
import { DetectionFacts } from "../hooks/useDetectionText";
import styles from "../styles/elements.module.css";

interface Props {
	detectionFacts: DetectionFacts;
	showMouth: boolean;
	showGesture: boolean;
}

interface LabelProps {
	label: string;
	value: string;
}

const DetectionLabel: React.FC<LabelProps> = ({ label, value }) => {
	return (
		<>
			<div
				className={`col-start-1 col-span-2 font-bold ${styles.defaultColor}`}
			>
				{label}
			</div>
			<div
				className={`col-start-3 col-end-6 text-right font-extrabold ${styles.highlightColor}`}
			>
				{value}
			</div>
		</>
	);
};

const DetectionBox: React.FC<Props> = ({
	detectionFacts,
	showMouth,
	showGesture,
}) => {
	return (
		<>
			<div
				className={`h-[20%] w-full grid grid-cols-5 text-xl grid ${
					showMouth || showGesture ? "" : "gap-3"
				}`}
			>
				<DetectionLabel
					label={"alter"}
					value={detectionFacts.age.toString()}
				></DetectionLabel>
				<DetectionLabel
					label={"emotion"}
					value={detectionFacts.coreEmotions[0]}
				></DetectionLabel>
				<DetectionLabel
					label={"erkannt als"}
					value={detectionFacts.gender}
				></DetectionLabel>
				{showGesture && (
					<DetectionLabel
						label={"blickrichtung"}
						value={detectionFacts.coreGestures.join(", ")}
					></DetectionLabel>
				)}
				{showMouth && (
					<DetectionLabel
						label={"mund"}
						value={detectionFacts.mouthOpen ? "geöffnet" : "geschlossen"}
					></DetectionLabel>
				)}
			</div>
		</>
	);
};

export default DetectionBox;
