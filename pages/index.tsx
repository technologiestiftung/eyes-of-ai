"use client";
import React, {useRef} from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ImageGrid from "../components/ImageGrid";
import styles from "../styles/elements.module.css";
import RunHuman from "../components/RunHumanFn";
import InitWebCam from "../components/InitWebCam";
export default function Page() {

	const videoRef = useRef<HTMLVideoElement | undefined>(undefined);
	const canvasRef = useRef<HTMLCanvasElement | undefined>(undefined);

	return (
		<div>
			<Header />
			<canvas id="canvas"
							ref={canvasRef}
							className={styles.output}
							onClick={() => videoRef.current?.paused ? videoRef.current?.play() : videoRef.current?.pause()}
			/>{" "}
			{/* placeholder element that will be used by human for output */}
			<video id="video"
						 ref={videoRef}
						 className={styles.webcam}
						 autoPlay
						 muted
						 onResize={() => {
							 canvasRef.current!.width = videoRef.current!.videoWidth;
							 canvasRef.current!.height = videoRef.current!.videoHeight;
						 }}
			/>{" "}
			{/* placeholder element that will be used by webcam */}
			<div id="status" className={styles.status}></div>
			<div id="log" className={styles.log}></div>
			<div id="performance" className={styles.performance}></div>
			<InitWebCam elementId="video" />{" "}
			{/* initialized webcam using htmlvideo element with specified id */}
			<RunHuman videoRef={videoRef} canvasRef={canvasRef} />{" "}
			{/* loads and start human using specified input video element and output canvas element */}
			<ImageGrid />
			<Footer />
		</div>
	);
}
