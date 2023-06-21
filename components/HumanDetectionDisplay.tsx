import Human from "@vladmandic/human";
import React, { useEffect, useRef } from "react";
import styles from "../styles/elements.module.css";
import ProgressBar from "./ProgressBar";
import { DetectionFacts } from "../hooks/useDetectionText";
import { STANDSTILL_THRESHOLD_MS } from "../store";
import DetectionBox from "./DetectionBox";
import UserHintBox from "./UserHintBox";

interface Props {
	canvasDrawWidth: number;
	canvasDrawHeight: number;
	detectedHuman: Human | undefined;
	detectionText: DetectionFacts;
	snapshotTriggered: boolean;
	standStillDetected: boolean;
	standStillProgress: number | undefined;
}

const HumanDetectionDisplay: React.FC<Props> = ({
	canvasDrawWidth,
	canvasDrawHeight,
	detectedHuman,
	detectionText,
	snapshotTriggered,
	standStillDetected,
	standStillProgress,
}) => {
	const canvasRef = useRef<HTMLCanvasElement | undefined>(undefined);
	const divRef = useRef<HTMLDivElement | undefined>(undefined);

	useEffect(() => {
		if (canvasRef.current) {
			canvasRef.current!.width = canvasDrawWidth;
			canvasRef.current!.height = canvasDrawHeight;
		}
	}, [canvasDrawWidth, canvasDrawHeight]);

	useEffect(() => {
		if (canvasRef.current && detectedHuman) {
			var ctx = canvasRef.current.getContext("2d");
			ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
			ctx.fillStyle = "#ffffff";
			ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

			ctx.save();

			const faceBox = detectedHuman.result.face[0].box;
			const scaleFactor = 2.0;
			const translateX = faceBox[0] + faceBox[2] / 2.0;
			const translateY = faceBox[1] + faceBox[3] / 2.0;
			ctx.scale(scaleFactor, scaleFactor);
			ctx.translate(-translateX, -translateY);
			ctx.translate(
				canvasDrawWidth / scaleFactor / 2.0,
				canvasDrawHeight / scaleFactor / 2.0
			);

			detectedHuman.draw.all(
				canvasRef.current,
				detectedHuman.next(detectedHuman.result),
				{
					color: "#F64C72",
					roundRect: 0,
					lineWidth: 2,
					drawPolygons: true,
					drawLabels: false,
					drawBoxes: false,
					drawGaze: false,
					drawPoints: false,
					drawAttention: false,
					drawGestures: false,
				}
			);

			ctx.restore();
		}
	}, [
		detectedHuman,
		canvasRef,
		detectionText,
		standStillDetected,
		canvasDrawWidth,
		canvasDrawHeight,
	]);

	const secondsLeftUntilTrigger = Math.round(
		STANDSTILL_THRESHOLD_MS / 1000.0 -
			(standStillProgress / 1000.0) * STANDSTILL_THRESHOLD_MS
	);

	const userHint = standStillDetected
		? `stillhalten (${secondsLeftUntilTrigger} s)`
		: "nicht bewegen";

	return (
		<>
			<div className="w-full h-full">
				<UserHintBox label={userHint}></UserHintBox>
				<div className="w-full h-[60%]" ref={divRef}>
					<canvas
						id="canvas"
						ref={canvasRef}
						className="w-[572px] h-[472px] bg-white"
					/>
				</div>
				<DetectionBox detectionFacts={detectionText}></DetectionBox>
			</div>
		</>
	);
};

export default HumanDetectionDisplay;
