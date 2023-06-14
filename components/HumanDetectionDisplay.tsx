import Human from "@vladmandic/human";
import React, { useEffect, useRef } from "react";
import styles from "../styles/elements.module.css";
import ProgressBar from "./ProgressBar";
import { DetectionText } from "../hooks/useDetectionText";

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
			ctx.fillStyle = "#000000";
			ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
			detectedHuman.draw.all(
				canvasRef.current,
				detectedHuman.next(detectedHuman.result),
				{
					color: "#F64C72",
					roundRect: 0,
					lineWidth: 2,
					drawPolygons: true,
					drawLabels: false,
					drawBoxes: standStillDetected,
					drawGaze: false,
					drawPoints: false,
					drawAttention: false,
					drawGestures: false,
				}
			);
		}
	}, [detectedHuman, canvasRef, detectionText, standStillDetected]);

	return (
		<>
			<div className={styles.standStillHint}>
				{!snapshotTriggered && standStillDetected ? (
					<div>
						<ProgressBar
							progress={standStillProgress}
							width={window.innerWidth}
							height={20}
						></ProgressBar>
						<div>Stay like this!</div>
					</div>
				) : (
					<div style={{ paddingTop: "20px" }}>Stay still!</div>
				)}
			</div>
			<canvas id="canvas" ref={canvasRef} className={styles.output} />
			{detectionText && (
				<div className={styles.detectionText}>
					<div>
						<p>{detectionText.core}</p>
						<p>{detectionText.emotion}</p>
						<p>{detectionText.gesture}</p>
					</div>
				</div>
			)}
		</>
	);
};

export default HumanDetectionDisplay;
