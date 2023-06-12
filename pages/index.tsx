"use client";
import React, { useEffect, useRef, useState } from "react";

import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import HumanDetection from "../components/HumanDetection";
import HumanDetectionDisplay from "../components/HumanDetectionDisplay";
import ImageGenerator from "../components/ImageGenerator";
import ImageGrid from "../components/ImageGrid";
import InitWebCam from "../components/InitWebCam";
import { useEyesOfAIStore } from "../store";
import styles from "../styles/elements.module.css";

export const getServerSideProps: GetServerSideProps = async (context) => {
	const token = context.res.req.headers["x-csrf-token"] as string;

	return { props: { csrf: token } };
};

const Page: React.FC<
	InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ csrf }) => {
	const videoRef = useRef<HTMLVideoElement | undefined>(undefined);
	const canvasRef = useRef<HTMLCanvasElement | undefined>(undefined);
	const triggered = useEyesOfAIStore((state) => state.trigger);
	const humanDetected = useEyesOfAIStore((state) => state.humanDetected);
	const generatedImageExpired = useEyesOfAIStore(
		(state) => state.generatedImageExpired
	);
	const resetDetection = useEyesOfAIStore((state) => state.resetDetection);
	const [webcamReady, setWebcamReady] = useState(false);

	useEffect(() => {
		if (generatedImageExpired) {
			resetDetection();
			if (videoRef && videoRef.current) {
				if (triggered) {
					videoRef.current.play();
				}
			}
		}
	}, [generatedImageExpired]);

	useEffect(() => {
		if (videoRef && videoRef.current) {
			if (triggered) {
				videoRef.current.pause();
			}
		}
	}, [triggered]);

	return (
		<div>
			<canvas
				hidden
				id="canvas"
				ref={canvasRef}
				className={styles.output}
				onClick={() =>
					videoRef.current?.paused
						? videoRef.current?.play()
						: videoRef.current?.pause()
				}
			/>
			<video
				hidden
				id="video"
				ref={videoRef}
				className={styles.webcam}
				autoPlay
				muted
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
			{webcamReady && (
				<HumanDetection
					videoRef={videoRef}
					canvasRef={canvasRef}
				></HumanDetection>
			)}
			{!triggered && humanDetected && (
				<HumanDetectionDisplay videoRef={videoRef} canvasRef={canvasRef} />
			)}
			{triggered && <ImageGenerator csrf={csrf} />}
			{!triggered && !humanDetected && (
				<ImageGrid showCaption={false} showMoreButton={false}></ImageGrid>
			)}
		</div>
	);
};

export default Page;
