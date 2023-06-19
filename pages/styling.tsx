import React, { useEffect, useRef, useState } from "react";
import GeneratedImageDisplay from "../components/GeneratedImageDisplay";
import ImageGrid from "../components/ImageGrid";
import HumanDetectionDisplay from "../components/HumanDetectionDisplay";
import { useEyesOfAIStore } from "../store";
import styles from "../styles/elements.module.css";
import InitWebCam from "../components/InitWebCam";
import { LocalizedPrompt } from "./api/prompt";
import HumanDetection from "../components/HumanDetection";
import { calcRatio } from "../lib/ratio";
const Styling: React.FC = () => {
	const human = useEyesOfAIStore((state) => state.human);
	const videoRef = useRef<HTMLVideoElement | undefined>(undefined);
	const [canvasWidth, setCanvasWidth] = useState(0);
	const [canvasHeight, setCanvasHeight] = useState(0);
	const [webcamReady, setWebcamReady] = useState(false);
	const [imageGenerationTime, setImageGenerationTime] = useState<Date>();
	const [expirationProgress, setExpirationProgress] = useState<number>(0.0);
	const EXPIRATION_SECONDS = 20;
	const resetDetection = useEyesOfAIStore((state) => state.resetDetection);
	const [generatedImageSrc, setGeneratedImageSrc] = useState<string>();
	const [prompt, setPrompt] = useState<LocalizedPrompt>();

	useEffect(() => {
		const interval = setInterval(() => {
			if (imageGenerationTime) {
				const elapsed =
					(new Date().getTime() - imageGenerationTime.getTime()) / 1000.0;
				const progress = Math.min(1, elapsed / EXPIRATION_SECONDS);
				setExpirationProgress(progress);
				if (progress >= 1) {
					resetDetection();
					setImageGenerationTime(undefined);
					setGeneratedImageSrc(undefined);
					setPrompt(undefined);
					setExpirationProgress(0.0);
					videoRef.current.play();
				}
			}
		}, 200);

		return () => {
			clearInterval(interval);
		};
	}, [imageGenerationTime, resetDetection]);
	return (
		<>
			<video
				hidden
				id="video"
				ref={videoRef}
				className={styles.webcam}
				autoPlay
				muted
				onResize={() => {
					const { width, height } = calcRatio(
						videoRef.current.videoWidth,
						videoRef.current.videoHeight,
						512,
						512
					);
					setCanvasWidth(width);
					setCanvasHeight(height);
				}}
			/>
			<InitWebCam
				elementId="video"
				webcamReadyCallback={() => {
					setWebcamReady(true);
				}}
			/>
			{webcamReady && <HumanDetection videoRef={videoRef} />}

			<HumanDetectionDisplay
				canvasDrawWidth={canvasWidth}
				canvasDrawHeight={canvasHeight}
				detectedHuman={human}
				detectionText={{
					core: "sdkjfhsdlkjfhsdlfkjh",
					emotion: "",
					gesture: "",
				}}
				snapshotTriggered={false}
				standStillDetected={false}
				standStillProgress={0.9}
			/>
		</>
		// <>
		// 	<GeneratedImageDisplay
		// 		imageGenerationInProgress={true}
		// 		generatedImageSrc={
		// 			"https://olsxhqqoqlnmcpohpwcw.supabase.co/storage/v1/object/public/eotai_images/test/15af3423-1656-4d03-b157e8ae24406c2e.png"
		// 		}
		// 		expirationProgress={1}
		// 		prompt={{
		// 			promptEn:
		// 				"A lithography of a 33 year old happy and neutral looking male, facing left, distorted pixel art, rosybrown, darkslategray, lightgray, darkolivegreen, and darkolivegreen",
		// 			promptDe:
		// 				"Eine Lithographie eines 33-jährigen glücklichen und neutral aussehenden Mannes, der nach links schaut, verzerrte Pixelkunst, rosbraun, dunkelschiefergrau, hellgrau, dunkelolivgrün und dunkelolivgrün.",
		// 		}}
		// 	/>
		// </>
		// <>
		// 	<ImageGrid showCaption={true} showMoreButton={false}></ImageGrid>
		// </>
	);
};

export default Styling;
