import React from "react";
import { DetectionFacts } from "../hooks/useDetectionText";
import styles from "../styles/elements.module.css";

interface Props {
	detectionFacts: DetectionFacts;
}

const DetectionBox: React.FC<Props> = ({ detectionFacts }) => {
	return (
		<>
			<div className="h-[20%] w-full p-[20px] grid grid-cols-5 text-2xl">
				<div className={`font-bold ${styles.defaultColor}`}>alter</div>
				<div
					className={`col-start-2 col-span-4 text-right font-extrabold ${styles.highlightColor}`}
				>
					{detectionFacts.age}
				</div>
				<div className={`font-bold ${styles.defaultColor}`}>emotion</div>
				<div
					className={`col-start-2 col-span-4 text-right font-extrabold ${styles.highlightColor}`}
				>
					{detectionFacts.emotion}
				</div>
				<div
					className={`col-start-1 col-span-2 font-bold ${styles.defaultColor}`}
				>
					erkannt als
				</div>
				<div
					className={`col-start-3 col-end-6 text-right font-extrabold ${styles.highlightColor}`}
				>
					{detectionFacts.gender}
				</div>
			</div>
		</>
	);
};

export default DetectionBox;
