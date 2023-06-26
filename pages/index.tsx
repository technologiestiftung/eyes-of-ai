/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import FaceDetectionPlayback from "../components/FaceDetectionPlayback";
import GeneratedImageDisplay from "../components/GeneratedImageDisplay";
import HumanDetection from "../components/HumanDetection";
import HumanDetectionDisplay from "../components/HumanDetectionDisplay";
import InitWebCam from "../components/InitWebCam";
import Loading from "../components/Loading";
import ParameterSetting from "../components/ParameterSetting";
import useColorThief from "../hooks/useColorThief";
import useDetectionText from "../hooks/useDetectionText";
import useGeneratedImage from "../hooks/useGeneratedImage";
import usePaginatedImages from "../hooks/usePaginatedImages";
import usePrompt from "../hooks/usePrompt";
import useVideoData from "../hooks/useVideoData";
import { Database } from "../lib/database";
import { useEyesOfAIStore } from "../store";
import styles from "../styles/elements.module.css";
import { LocalizedPrompt } from "./api/prompt";
type Image = Database["public"]["Tables"]["eotai_images"]["Row"];

interface ControlKeyMapping {
	setParameter: (paramter: number) => void;
	parameter: number;
	step: number;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	const token = context.res.req.headers["x-csrf-token"] as string;
	return { props: { csrf: token } };
};

const Page: React.FC<
	InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ csrf }) => {
	const [standstillThresholdMs, setStandstillThresholdMs] = useEyesOfAIStore(
		(state) => [state.standstillThresholdMs, state.setStandstillThresholdMs]
	);
	const [rotationThresholdDegrees, setRotationThresholdDegrees] =
		useEyesOfAIStore((state) => [
			state.rotationThresholdDegrees,
			state.setRotationThresholdDegrees,
		]);
	const [distanceThresholdMeters, setDistanceThresholdMeters] =
		useEyesOfAIStore((state) => [
			state.distanceThresholdMeters,
			state.setDistanceThresholdMeters,
		]);
	const [meshZoom, setMeshZoom] = useEyesOfAIStore((state) => [
		state.meshZoom,
		state.setMeshZoom,
	]);
	const [expirationSeconds, setExpirationSeconds] = useEyesOfAIStore(
		(state) => [state.expirationSeconds, state.setExpirationSeconds]
	);
	const videoRef = useRef<HTMLVideoElement | undefined>(undefined);
	const triggered = useEyesOfAIStore((state) => state.trigger);
	const humanDetected = useEyesOfAIStore((state) => state.humanDetected);
	const resetDetection = useEyesOfAIStore((state) => state.resetDetection);
	const human = useEyesOfAIStore((state) => state.human);
	const result = useEyesOfAIStore((state) => state.result);
	const playbackResult = useEyesOfAIStore((state) => state.playbackResult);
	const firstStandStillTime = useEyesOfAIStore(
		(state) => state.firstStandStillTime
	);
	const humanCloseEnough = useEyesOfAIStore((state) => state.humanCloseEnough);
	const msInStandStill = useEyesOfAIStore((state) => state.msInStandStill);
	const standStillProgress = Math.min(
		100,
		msInStandStill / standstillThresholdMs
	);
	const [canvasWidth, setCanvasWidth] = useState(0);
	const [canvasHeight, setCanvasHeight] = useState(0);
	const [prompt, setPrompt] = useState<LocalizedPrompt>();
	const [imageGenerationLoading, setImageGenerationLoading] = useState(false);
	const [generatedImageSrc, setGeneratedImageSrc] = useState<string>();
	const [imageGenerationTime, setImageGenerationTime] = useState<Date>();
	const [expirationProgress, setExpirationProgress] = useState<number>(0.0);
	const [webcamReady, setWebcamReady] = useState(false);
	const [humanLibraryReady, setHumanLibraryReady] = useState(false);

	const { generatePrompt } = usePrompt(csrf, result);
	const { generateImage } = useGeneratedImage(csrf);
	const { detectionText } = useDetectionText(result, playbackResult);
	const { getColors } = useColorThief();
	const { getVideoDataUrl } = useVideoData(videoRef);

	const showHumanDetection = !triggered && humanDetected && humanCloseEnough;
	const showGeneratedImage = triggered;
	const showPlayback =
		!triggered && (!humanCloseEnough || !humanDetected) && playbackResult;

	const PAGE_SIZE = 19;
	const [page, setPage] = useState(0);
	const [allImageData, setAllImageData] = useState<Image[]>([]);
	const { fetchPaginatedImages } = usePaginatedImages();

	const initializing = !webcamReady || !humanLibraryReady;

	const keyMapping = {
		d: {
			parameter: distanceThresholdMeters,
			setParameter: setDistanceThresholdMeters,
			step: 0.1,
		} as ControlKeyMapping,
		r: {
			parameter: rotationThresholdDegrees,
			setParameter: setRotationThresholdDegrees,
			step: 0.01,
		} as ControlKeyMapping,
		m: {
			parameter: meshZoom,
			setParameter: setMeshZoom,
			step: 0.1,
		} as ControlKeyMapping,
		s: {
			parameter: standstillThresholdMs,
			setParameter: setStandstillThresholdMs,
			step: 1000.0,
		} as ControlKeyMapping,
		e: {
			parameter: expirationSeconds,
			setParameter: setExpirationSeconds,
			step: 1.0,
		} as ControlKeyMapping,
	};

	const [lockedKey, setLockedKey] = useState<string>();

	useEffect(() => {
		fetchPaginatedImages(page, PAGE_SIZE, (data) => {
			setAllImageData((prevImageData) => prevImageData.concat(data));
		});
	}, [fetchPaginatedImages, page]);

	const resetUxFlow = useCallback(() => {
		fetchPaginatedImages(0, PAGE_SIZE, (data) => {
			setAllImageData(data);
			resetDetection();
			setImageGenerationTime(undefined);
			setGeneratedImageSrc(undefined);
			setPrompt(undefined);
			setExpirationProgress(0.0);
			videoRef.current.play();
			setPage(0);
		});
	}, [fetchPaginatedImages, resetDetection]);

	useEffect(() => {
		const interval = setInterval(() => {
			if (imageGenerationTime) {
				const elapsed =
					(new Date().getTime() - imageGenerationTime.getTime()) / 1000.0;
				const progress = Math.min(1, elapsed / expirationSeconds);
				setExpirationProgress(expirationSeconds - elapsed);
				if (progress >= 1) {
					resetUxFlow();
				}
			}
		}, 200);

		return () => {
			clearInterval(interval);
		};
	}, [expirationSeconds, imageGenerationTime, resetDetection, resetUxFlow]);

	const humanLibraryReadyCallback = useCallback(() => {
		setHumanLibraryReady(true);
	}, []);

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
		<div
			tabIndex={0}
			onKeyDown={(e) => {
				if (e.key === "Enter") {
					setLockedKey(undefined);
					return;
				}
				if (Object.keys(keyMapping).indexOf(e.key) !== -1) {
					setLockedKey(e.key);
				} else if (lockedKey && (e.key === "+" || e.key === "-")) {
					const map = keyMapping[lockedKey];
					if (e.key === "+") {
						map.setParameter(map.parameter + map.step);
					} else if (e.key === "-") {
						map.setParameter(map.parameter - map.step);
					}
				}
			}}
		>
			{lockedKey && (
				<ParameterSetting
					label={lockedKey}
					value={keyMapping[lockedKey].parameter}
				/>
			)}
			{/* Placeholders for capturing webcam video */}
			<video
				hidden
				id="video"
				ref={videoRef}
				className={styles.webcam}
				autoPlay
				muted
				onResize={() => {
					console.log(
						videoRef.current.videoWidth,
						videoRef.current.videoHeight
					);
					setCanvasWidth(videoRef.current.videoWidth);
					setCanvasHeight(videoRef.current.videoHeight);
				}}
			/>
			<div id="log" className={styles.log}></div>
			<div id="performance" className={styles.performance}></div>
			<InitWebCam
				elementId="video"
				webcamReadyCallback={() => {
					setWebcamReady(true);
				}}
			/>
			{webcamReady && (
				<HumanDetection
					videoRef={videoRef}
					humanLibraryReadyCallback={humanLibraryReadyCallback}
				/>
			)}
			{initializing && (
				<div className="flex items-center justify-center h-screen">
					<Loading></Loading>
				</div>
			)}
			{/* Actual components */}
			{!initializing && (
				<div>
					{allImageData && allImageData.length > 0 && (
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 bg-white flex h-screen gap-3">
							{allImageData.slice(0, 6).map((image) => (
								<div
									key={image.id}
									className={`${styles.fadeOut} 	${
										playbackResult ? styles.fadeIn : styles.fadeOut
									} `}
								>
									<img
										src={image.url}
										alt={image.prompt_de ?? image.prompt}
										className="w-full h-auto"
										style={{
											flexShrink: 0,
											minWidth: "100%",
											minHeight: "100%",
										}}
									/>
								</div>
							))}

							<div
								key={allImageData[0].id}
								className={`col-start-2 col-span-3 row-span-4 bg-white ${styles.centerBox}`}
							>
								<FaceDetectionPlayback csrf={csrf} />

								{(showHumanDetection || showPlayback) && (
									<HumanDetectionDisplay
										canvasDrawWidth={canvasWidth}
										canvasDrawHeight={canvasHeight}
										detectedHuman={human}
										detectionText={detectionText}
										standStillDetected={firstStandStillTime !== undefined}
										standStillProgress={standStillProgress}
									/>
								)}

								{showGeneratedImage && (
									<GeneratedImageDisplay
										detectionFacts={detectionText}
										prompt={prompt}
										imageGenerationInProgress={imageGenerationLoading}
										generatedImageSrc={generatedImageSrc}
										expiresInSeconds={Math.round(expirationProgress)}
									/>
								)}
							</div>

							{allImageData.slice(6, 18).map((image) => (
								<div
									key={image.id}
									className={`${styles.fadeOut} 	${
										playbackResult ? styles.fadeIn : styles.fadeOut
									}`}
								>
									<img
										src={image.url}
										alt={image.prompt_de ?? image.prompt}
										className="w-full h-auto"
										style={{
											flexShrink: 0,
											minWidth: "100%",
											minHeight: "100%",
										}}
									/>
								</div>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default Page;
