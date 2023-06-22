import Human, { FaceResult, Result } from "@vladmandic/human";
import React, { useEffect, useRef, useState } from "react";
import { DetectionFacts } from "../hooks/useDetectionText";
import { STANDSTILL_THRESHOLD_MS, useEyesOfAIStore } from "../store";
import DetectionBox from "./DetectionBox";
import UserHintBox from "./UserHintBox";

interface Props {
	canvasDrawWidth: number;
	canvasDrawHeight: number;
	detectedHuman: Human | undefined;
	detectionText: DetectionFacts;
	standStillDetected: boolean;
	standStillProgress: number | undefined;
}

const HumanDetectionDisplay: React.FC<Props> = ({
	canvasDrawWidth,
	canvasDrawHeight,
	detectedHuman,
	detectionText,
	standStillDetected,
	standStillProgress,
}) => {
	const showRecordingDevFeature = false;
	const canvasRef = useRef<HTMLCanvasElement | undefined>(undefined);
	const divRef = useRef<HTMLDivElement | undefined>(undefined);
	const [recordedResults, setRecordedResults] = useState<
		Array<Partial<Result>>
	>([]);
	const result = useEyesOfAIStore((state) => state.result);
	const playbackResult = useEyesOfAIStore((state) => state.playbackResult);
	const [recording, setRecording] = useState(false);

	useEffect(() => {
		if (canvasRef.current) {
			canvasRef.current!.width = canvasDrawWidth;
			canvasRef.current!.height = canvasDrawHeight;
		}
	}, [canvasDrawWidth, canvasDrawHeight]);

	useEffect(() => {
		if (
			canvasRef.current &&
			detectedHuman &&
			((result && result.face && result.face[0]) ||
				(playbackResult && playbackResult.face && playbackResult.face[0]))
		) {
			const resultToRender = playbackResult ?? result;

			var ctx = canvasRef.current.getContext("2d");
			ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
			ctx.fillStyle = "#ffffff";
			ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

			ctx.save();

			const faceBox = resultToRender.face[0].box;
			const scaleFactor = 2.0;
			const translateX = faceBox[0] + faceBox[2] / 2.0;
			const translateY = faceBox[1] + faceBox[3] / 2.0;
			ctx.scale(scaleFactor, scaleFactor);
			ctx.translate(-translateX, -translateY);
			ctx.translate(
				canvasDrawWidth / scaleFactor / 2.0,
				canvasDrawHeight / scaleFactor / 2.0
			);

			detectedHuman.draw.face(
				canvasRef.current,
				resultToRender.face as FaceResult[],
				{
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
		playbackResult,
		result,
		detectedHuman,
		canvasRef,
		detectionText,
		standStillDetected,
		canvasDrawWidth,
		canvasDrawHeight,
	]);

	useEffect(() => {
		if (recording) {
			setRecordedResults((xs) =>
				JSON.parse(JSON.stringify(xs.concat([result])))
			);
		}
	}, [recording, result]);

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
				{playbackResult ? (
					<div className="grid place-items-center text-3xl font-bold w-full h-[20%]"></div>
				) : (
					<UserHintBox label={userHint}></UserHintBox>
				)}
				<div className="w-full h-[60%]" ref={divRef}>
					{showRecordingDevFeature && (
						<>
							<button
								onClick={() => {
									if (recording) {
										setRecording(false);
										console.log(recordedResults);
									} else {
										setRecordedResults([]);
										setRecording(true);
									}
								}}
							>
								record
							</button>
							<div>recording: {recording ? "yes" : "no"}</div>
						</>
					)}
					<canvas
						id="canvas"
						ref={canvasRef}
						className="w-[572px] h-[472px] bg-white"
					/>
				</div>
				{!playbackResult && (
					<DetectionBox
						detectionFacts={detectionText}
						showMouth={false}
						showGesture={false}
					></DetectionBox>
				)}
			</div>
		</>
	);
};

export default HumanDetectionDisplay;
