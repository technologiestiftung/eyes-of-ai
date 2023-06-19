import { useCallback } from "react";

const useVideoData = (videoRef: React.MutableRefObject<HTMLVideoElement>) => {
	const MAX_WIDTH = 480;
	const MAX_HEIGHT = 270;
	const getVideoDataUrl = useCallback(() => {
		const video = videoRef.current;
		let width = video.videoWidth;
		let height = video.videoHeight;
		const aspectRatio = width / height;
		if (width > MAX_WIDTH) {
			width = MAX_WIDTH;
			height = width / aspectRatio;
		}
		if (height > MAX_HEIGHT) {
			height = MAX_HEIGHT;
			width = height * aspectRatio;
		}

		const canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		const ctx = canvas.getContext("2d");
		ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
		const dataUrl = canvas.toDataURL();
		canvas.remove();
		return dataUrl;
	}, [videoRef]);
	return { getVideoDataUrl };
};

export default useVideoData;
