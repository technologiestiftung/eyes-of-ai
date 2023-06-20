import Human from "@vladmandic/human";
import React, { useEffect, useRef } from "react";
import styles from "../styles/elements.module.css";
import ProgressBar from "./ProgressBar";
import { DetectionText } from "../hooks/useDetectionText";
import { STANDSTILL_THRESHOLD_MS } from "../store";

interface Props {
	canvasDrawWidth: number;
	canvasDrawHeight: number;
	detectedHuman: Human | undefined;
	detectionText: DetectionText;
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

	return (
		<>
			<div
				style={{
					height: "100%",
					width: "100%",
					boxSizing: "border-box",
				}}
			>
				<div
					className="grid h-screen place-items-center text-3xl font-bold"
					style={{ height: "20%", width: "100%" }}
				>
					{standStillDetected
						? `stillhalten (${Math.round(
								STANDSTILL_THRESHOLD_MS / 1000.0 -
									(standStillProgress / 1000.0) * STANDSTILL_THRESHOLD_MS
						  )} s)`
						: "nicht bewegen"}
				</div>
				<div
					ref={divRef}
					style={{
						height: "60%",
						width: "100%",
					}}
				>
					<canvas
						id="canvas"
						ref={canvasRef}
						style={{ width: "574px", height: "472px" }}
					/>
				</div>
				<div
					style={{
						height: "20%",
						width: "100%",
						boxSizing: "border-box",
						padding: "20px",
					}}
					className="grid grid-cols-5 text-2xl"
				>
					<div className="font-bold">alter</div>
					<div
						className="col-start-2 col-span-4 text-right font-extrabold"
						style={{ color: "#2F2FA2" }}
					>
						{detectionText.age}
					</div>
					<div className="font-bold">emotion</div>
					<div
						className="col-start-2 col-span-4 text-right font-extrabold"
						style={{ color: "#2F2FA2" }}
					>
						{detectionText.emotion}
					</div>
					<div className="col-start-1 col-span-2 font-bold">erkannt als</div>
					<div
						className="col-start-3 col-end-6 text-right font-extrabold"
						style={{ color: "#2F2FA2" }}
					>
						{detectionText.gender}
					</div>
				</div>
			</div>
		</>
	);
};

export default HumanDetectionDisplay;
