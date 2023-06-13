import { Result } from "@vladmandic/human";
import { useMemo } from "react";

export interface DetectionText {
	core: string;
	emotion: string;
	gesture: string;
}

const useDetectionText = (result: Partial<Result>) => {
	const detectionText = useMemo(() => {
		if (!result || !result.face[0]) {
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
	}, [result]);

	return { detectionText };
};

export default useDetectionText;
