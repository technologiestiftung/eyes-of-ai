import { Result } from "@vladmandic/human";
import { useMemo } from "react";
import {
	translateEmotion,
	translateGender,
	translateGesture,
} from "../lib/collection";

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

		const gender =
			result.face[0].gender === "unknown" || result.face[0].genderScore < 0.4
				? "non-binary"
				: result.face[0].gender;

		const translatedGestures = result.gesture
			.map(({ gesture }) => translateGesture(gesture.toString()))
			.filter((x, i, a) => a.indexOf(x) == i);

		const coreLabel = `${Math.round(face.age)} Jahre alte ${translateGender(
			gender
		)} Person`;

		const emotionLabel = `${face.emotion
			.map(
				({ emotion, score }) =>
					`${Math.round(score * 100)}% ${translateEmotion(emotion)}`
			)
			.join(", ")}`;

		const gesturesLabel = `${translatedGestures.join(", ")}`;

		return {
			core: coreLabel,
			emotion: emotionLabel,
			gesture: gesturesLabel,
		} as DetectionText;
	}, [result]);

	return { detectionText };
};

export default useDetectionText;
