"use client";
import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ImageGrid from "../components/ImageGrid";
import styles from "../styles/elements.module.css";
import RunHuman from "../components/RunHuman";
import InitWebCam from "../components/InitWebCam";
export default function Page() {
	return (
		<div>
			<Header />
			<canvas id="canvas" className={styles.output} />{" "}
			{/* placeholder element that will be used by human for output */}
			<video id="video" className={styles.webcam} autoPlay muted />{" "}
			{/* placeholder element that will be used by webcam */}
			<div id="status" className={styles.status}></div>
			<div id="log" className={styles.log}></div>
			<div id="performance" className={styles.performance}></div>
			<InitWebCam elementId="video" />{" "}
			{/* initialized webcam using htmlvideo element with specified id */}
			<RunHuman inputId="video" outputId="canvas" />{" "}
			{/* loads and start human using specified input video element and output canvas element */}
			<ImageGrid />
			<Footer />
		</div>
	);
}
