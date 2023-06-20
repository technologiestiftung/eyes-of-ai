"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import GeneratedImageDisplay from "../components/GeneratedImageDisplay";
import HumanDetection from "../components/HumanDetection";
import HumanDetectionDisplay from "../components/HumanDetectionDisplay";
import ImageGrid from "../components/ImageGrid";
import InitWebCam from "../components/InitWebCam";
import useColorThief from "../hooks/useColorThief";
import useDetectionText from "../hooks/useDetectionText";
import useGeneratedImage from "../hooks/useGeneratedImage";
import usePrompt from "../hooks/usePrompt";
import { STANDSTILL_THRESHOLD_MS, useEyesOfAIStore } from "../store";
import styles from "../styles/elements.module.css";
import { LocalizedPrompt } from "./api/prompt";
import useVideoData from "../hooks/useVideoData";

export const getServerSideProps: GetServerSideProps = async (context) => {
	const token = context.res.req.headers["x-csrf-token"] as string;
	return { props: { csrf: token } };
};

const Page: React.FC<
	InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ csrf }) => {
	const EXPIRATION_SECONDS = 20;

	const videoRef = useRef<HTMLVideoElement | undefined>(undefined);
	const triggered = useEyesOfAIStore((state) => state.trigger);
	const humanDetected = useEyesOfAIStore((state) => state.humanDetected);
	const resetDetection = useEyesOfAIStore((state) => state.resetDetection);
	const human = useEyesOfAIStore((state) => state.human);
	const result = useEyesOfAIStore((state) => state.result);
	const firstStandStillTime = useEyesOfAIStore(
		(state) => state.firstStandStillTime
	);
	const humanCloseEnough = useEyesOfAIStore((state) => state.humanCloseEnough);
	const msInStandStill = useEyesOfAIStore((state) => state.msInStandStill);
	const standStillProgress = Math.min(
		100,
		msInStandStill / STANDSTILL_THRESHOLD_MS
	);
	const [canvasWidth, setCanvasWidth] = useState(0);
	const [canvasHeight, setCanvasHeight] = useState(0);
	const [prompt, setPrompt] = useState<LocalizedPrompt>();
	const [imageGenerationLoading, setImageGenerationLoading] = useState(false);
	const [generatedImageSrc, setGeneratedImageSrc] = useState<string>();
	const [imageGenerationTime, setImageGenerationTime] = useState<Date>();
	const [expirationProgress, setExpirationProgress] = useState<number>(0.0);
	const [webcamReady, setWebcamReady] = useState(false);

	const { generatePrompt } = usePrompt(csrf, result);
	const { generateImage } = useGeneratedImage(csrf);
	const { detectionText } = useDetectionText(result);
	const { getColors } = useColorThief();
	const { getVideoDataUrl } = useVideoData(videoRef);

	const showHumanDetection = !triggered && humanDetected && humanCloseEnough;
	const showGeneratedImage = triggered;
	const showGallery = !triggered && (!humanCloseEnough || !humanDetected);

	const resetUxFlow = useCallback(() => {
		resetDetection();
		setImageGenerationTime(undefined);
		setGeneratedImageSrc(undefined);
		setPrompt(undefined);
		setExpirationProgress(0.0);
		videoRef.current.play();
	}, [resetDetection]);

	useEffect(() => {
		const interval = setInterval(() => {
			if (imageGenerationTime) {
				const elapsed =
					(new Date().getTime() - imageGenerationTime.getTime()) / 1000.0;
				const progress = Math.min(1, elapsed / EXPIRATION_SECONDS);
				setExpirationProgress(progress);
				if (progress >= 1) {
					resetUxFlow();
				}
			}
		}, 200);

		return () => {
			clearInterval(interval);
		};
	}, [imageGenerationTime, resetDetection, resetUxFlow]);

	useEffect(() => {
		if (!videoRef || !videoRef.current) return;
		if (!triggered) return;
		(async () => {
			try {
				videoRef.current.pause();

				const dataUrl = getVideoDataUrl();
				const colors = await getColors(dataUrl);
				const localizedPrompt = await generatePrompt(colors);
				setPrompt((_) => localizedPrompt);
				setImageGenerationLoading((_) => true);

				const generatedImageSrc = await generateImage({
					localizedPrompt,
					colors,
					result,
				});
				setGeneratedImageSrc((_) => generatedImageSrc);
				setImageGenerationLoading((_) => false);
				setImageGenerationTime((_) => new Date());
			} catch (err) {
				console.log("Error occured in UX flow: " + err);
				resetUxFlow();
			}
		})();
	}, [
		generateImage,
		generatePrompt,
		getColors,
		getVideoDataUrl,
		resetUxFlow,
		result,
		triggered,
	]);

	return (
		<div>
			{/* Placeholders for capturing webcam video */}
			<video
				hidden
				id="video"
				ref={videoRef}
				className={styles.webcam}
				autoPlay
				muted
				onResize={() => {
					setCanvasWidth(videoRef.current.videoWidth);
					setCanvasHeight(videoRef.current.videoHeight);
				}}
			/>
			<div id="status" className={styles.status}></div>
			<div id="log" className={styles.log}></div>
			<div id="performance" className={styles.performance}></div>
			<InitWebCam
				elementId="video"
				webcamReadyCallback={() => {
					setWebcamReady(true);
				}}
			/>
			{/* Actual components */}
			<div className={styles.mainContainer}>
				{webcamReady && <HumanDetection videoRef={videoRef} />}
				{showHumanDetection && (
					<HumanDetectionDisplay
						canvasDrawWidth={canvasWidth}
						canvasDrawHeight={canvasHeight}
						detectedHuman={human}
						detectionText={detectionText}
						snapshotTriggered={triggered}
						standStillDetected={firstStandStillTime !== undefined}
						standStillProgress={standStillProgress}
					/>
				)}
				{showGeneratedImage && (
					<GeneratedImageDisplay
						prompt={prompt}
						imageGenerationInProgress={imageGenerationLoading}
						generatedImageSrc={generatedImageSrc}
						expirationProgress={expirationProgress}
					/>
				)}
				{showGallery && (
					<ImageGrid showCaption={false} showMoreButton={false}></ImageGrid>
				)}
			</div>
		</div>
	);
};

export default Page;
