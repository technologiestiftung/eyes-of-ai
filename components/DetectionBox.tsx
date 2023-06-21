import React from "react";
import { DetectionFacts } from "../hooks/useDetectionText";

interface Props {
	detectionFacts: DetectionFacts;
}

const DetectionBox: React.FC<Props> = ({ detectionFacts }) => {
	const color = "text-[#2F2FA2]";
	return (
		<>
			<div className="h-[20%] w-full p-[20px] grid grid-cols-5 text-2xl">
				<div className="font-bold">alter</div>
				<div
					className={`col-start-2 col-span-4 text-right font-extrabold ${color}`}
				>
					{detectionFacts.age}
				</div>
				<div className="font-bold">emotion</div>
				<div
					className={`col-start-2 col-span-4 text-right font-extrabold ${color}`}
				>
					{detectionFacts.emotion}
				</div>
				<div className="col-start-1 col-span-2 font-bold">erkannt als</div>
				<div
					className={`col-start-3 col-end-6 text-right font-extrabold ${color}`}
				>
					{detectionFacts.gender}
				</div>
			</div>
		</>
	);
};

export default DetectionBox;
