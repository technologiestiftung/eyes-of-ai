"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import HumanDetection from "../components/HumanDetection";
import HumanDetectionDisplay from "../components/HumanDetectionDisplay";
import InitWebCam from "../components/InitWebCam";
import { useEyesOfAIStore } from "../store";
import styles from "../styles/elements.module.css";
import ImageGrid from "../components/ImageGrid";
import useGeneratedImage from "../hooks/useGeneratedImage";
import usePrompt from "../hooks/usePrompt";
import GeneratedImageDisplay from "../components/GeneratedImageDisplay";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = context.res.req.headers["x-csrf-token"] as string;
  return { props: { csrf: token } };
};

export interface DetectionText {
  core: string;
  emotion: string;
  gesture: string;
}

const Page: React.FC<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ csrf }) => {
  const videoRef = useRef<HTMLVideoElement | undefined>(undefined);
  const triggered = useEyesOfAIStore((state) => state.trigger);
  const humanDetected = useEyesOfAIStore((state) => state.humanDetected);
  const resetDetection = useEyesOfAIStore((state) => state.resetDetection);
  const human = useEyesOfAIStore((state) => state.human);
  const result = useEyesOfAIStore((state) => state.result);
  const firstStandStillTime = useEyesOfAIStore(
    (state) => state.firstStandStillTime
  );
  const msInStandStill = useEyesOfAIStore((state) => state.msInStandStill);
  const standStillProgress = Math.min(100, msInStandStill / 2000);
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);
  const [prompt, setPrompt] = useState<string>();
  const [imageGenerationLoading, setImageGenerationLoading] = useState(false);
  const [generatedImageSrc, setGeneratedImageSrc] = useState<string>();
  const { generatePrompt } = usePrompt(csrf, result);
  const { generateImage } = useGeneratedImage(csrf);
  const [imageGenerationTime, setImageGenerationTime] = useState<Date>();
  const EXPIRATION_SECONDS = 20;
  const [expirationProgress, setExpirationProgress] = useState<number>(0.0);

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
          videoRef.current.play();
        }
      }
    }, 200);

    return () => {
      clearInterval(interval);
    };
  }, [imageGenerationTime, resetDetection]);

  const detectionText = useMemo(() => {
    if (!humanDetected || !result || !result.face[0]) {
      return undefined;
    }
    const face = result.face[0];
    const distinctGestures = result.gesture
      .map(({ gesture }) => gesture.toString())
      .filter((x, i, a) => a.indexOf(x) == i);

    const coreLabel = `${Math.round(face.age)} years old ${face.gender} person`;
    const emotionLabel = `${face.emotion
      .map(({ emotion, score }) => `${Math.round(score * 100)}% ${emotion}`)
      .join(", ")}`;
    const gesturesLabel = `${distinctGestures.join(", ")}`;

    return {
      core: coreLabel,
      emotion: emotionLabel,
      gesture: gesturesLabel,
    } as DetectionText;
  }, [humanDetected, result]);

  useEffect(() => {
    if (videoRef && videoRef.current) {
      if (triggered) {
        console.log("generating prompt");
        videoRef.current.pause();
        setImageGenerationLoading(true);
        generatePrompt((prompt) => {
          setPrompt(prompt);
          console.log("generate image");
          generateImage(prompt, (imageSrc) => {
            setGeneratedImageSrc(imageSrc);
            setImageGenerationLoading(false);
            setImageGenerationTime(new Date());
          });
        });
      }
    }
  }, [generateImage, generatePrompt, triggered]);

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
      <InitWebCam elementId="video" />
      {/* Actual components */}
      <div className={styles.mainContainer}>
        <HumanDetection videoRef={videoRef} />
        {!triggered && humanDetected && (
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
        {triggered && (
          <GeneratedImageDisplay
            prompt={prompt}
            imageGenerationInProgress={imageGenerationLoading}
            generatedImageSrc={generatedImageSrc}
            expirationProgress={expirationProgress}
          />
        )}
        {!triggered && !humanDetected && (
          <ImageGrid showCaption={false} showMoreButton={false}></ImageGrid>
        )}
      </div>
    </div>
  );
};

export default Page;
