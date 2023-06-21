/* eslint-disable @next/next/no-img-element */
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
import usePaginatedImages from "../hooks/usePaginatedImages";
import { Database } from "../lib/database";

type Image = Database["public"]["Tables"]["eotai_images"]["Row"];

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

	const PAGE_SIZE = 30;
	const [page, setPage] = useState(0);
	const [allImageData, setAllImageData] = useState<Image[]>([]);
	const { fetchPaginatedImages } = usePaginatedImages();

	useEffect(() => {
		fetchPaginatedImages(page, PAGE_SIZE, (data) => {
			setAllImageData((prevImageData) => prevImageData.concat(data));
		});
	}, [fetchPaginatedImages, page]);

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
				setExpirationProgress(EXPIRATION_SECONDS - elapsed);
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
			{/* Actual components */}
			<div>
				{webcamReady && <HumanDetection videoRef={videoRef} />}
				{(showHumanDetection || showGeneratedImage) && (
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 bg-white flex h-screen gap-1">
						{allImageData.slice(0, 6).map((image) => (
							<div key={image.id} className=" m-auto text-white opacity-20">
								<figure>
									<img
										src={image.url}
										alt={image.prompt_de ?? image.prompt}
										className="w-full h-auto"
									/>
								</figure>
							</div>
						))}

						<div
							key={allImageData[0].id}
							className="col-start-2 col-span-3 row-span-4 bg-white m-[20px]"
							style={{
								boxShadow: "0px 0px 6px 5px #d3d3d3",
							}}
						>
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
									expiresInSeconds={Math.round(expirationProgress)}
								/>
							)}
						</div>

						{allImageData.slice(6, 18).map((image) => (
							<div key={image.id} className=" m-auto text-white opacity-20">
								<figure>
									<img
										src={image.url}
										alt={image.prompt_de ?? image.prompt}
										className="w-full h-auto"
									/>
								</figure>
							</div>
						))}
					</div>
				)}

				{showGallery && (
					<ImageGrid showCaption={false} showMoreButton={false}></ImageGrid>
				)}
			</div>
		</div>
	);
};

export default Page;
