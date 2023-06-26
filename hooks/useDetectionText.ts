import { Result } from "@vladmandic/human";
import { useMemo } from "react";
import {
	translateEmotion,
	translateGender,
	translateGesture,
} from "../lib/collection";

export interface DetectionFacts {
	age: number;
	gender: string;
	coreGestures: Array<string>;
	coreEmotions: Array<string>;
	mouthOpen: boolean;
}

const useDetectionText = (
	result: Partial<Result>,
	playbackResult: Partial<Result>
) => {
	const detectionText = useMemo(() => {
		const resultToUse = playbackResult ?? result;

		if (!resultToUse || !resultToUse.face[0]) {
			return undefined;
		}
		const face = resultToUse.face[0];

		const gender =
			resultToUse.face[0].gender === "unknown" ||
			resultToUse.face[0].genderScore < 0.4
				? "non-binary"
				: resultToUse.face[0].gender;

		const translatedGestures = resultToUse.gesture
			.map(({ gesture }) => translateGesture(gesture.toString()))
			.filter((x, i, a) => a.indexOf(x) == i)
			.slice(0, 1);

		const mouthRegex = /^mouth \d{1,3}% open$/;
		const mouthOpen =
			resultToUse.gesture.filter((g) => g.gesture.match(mouthRegex)).length > 0;

		const emotions = face.emotion
			.sort((l, r) => (l.score < r.score ? 1 : -1))
			.slice(0, 2)
			.map(
				({ emotion, score }) =>
					`${Math.round(score * 100)}% ${translateEmotion(emotion)}`
			)
			.map((x) => x.toString());

		const test = {
			age: face.age,
			gender: `${translateGender(gender)} Person`,
			coreEmotions: emotions,
			coreGestures: translatedGestures,
			mouthOpen: mouthOpen,
		} as DetectionFacts;
		return test;
	}, [playbackResult, result]);

	return { detectionText };
};

export default useDetectionText;
