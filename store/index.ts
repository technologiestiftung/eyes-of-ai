import { create } from "zustand";
import { Human, Result } from "@vladmandic/human";
import MathUtils from "../lib/math-utils";

const HISTORY_SIZE_LIMIT_FRAMES = 20;
const ROTATION_THRESHOLD_DEGRESS = 0.05;
const DISTANCE_THRESHOLD_METERS = 0.15;
const STANDSTILL_THRESHOLD_MS = 2000;

export type EyesOfAIStore = {
	ready: boolean;
	setReady: (ready: boolean) => void;

	frame: number;
	setFrame: (frame: number) => void;

	timestamp: number;
	setTimestamp: (timestamp: number) => void;

	fps: number;
	setFps: (fps: number) => void;

	human: Human | undefined;
	setHuman: (human: Human | undefined) => void;

	result: Partial<Result> | undefined;
	setResult: (result: Partial<Result>) => void;

	resultHistory: Partial<Result>[];
	appendAndShiftResultHistory: (result: Partial<Result>) => void;

	trigger: boolean;
	checkIfShouldTrigger: () => void;

	firstStandStillTime: Date | undefined;
	setFirstStandStillTime: (date: Date) => void;

	msInStandStill: number;
	setMsInStandStill: (timeInStill: number) => void;

	humanDetected: boolean;
	setHumanDetected: (humanDetected: boolean) => void;

	generatedImageExpired: boolean;
	setGeneratedImageExpired: (generatedImageExpired: boolean) => void;

	resetDetection: () => void;
};

export const useEyesOfAIStore = create<EyesOfAIStore>()((set, get) => ({
	ready: false,
	setReady: (ready) => set(() => ({ ready })),

	frame: 0,
	setFrame: (frame) => set(() => ({ frame })),

	timestamp: 0,
	setTimestamp: (timestamp) => set(() => ({ timestamp })),

	fps: 0,
	setFps: (fps) => set(() => ({ fps })),

	human: undefined,
	setHuman: (human) => set(() => ({ human })),

	result: undefined,
	setResult: (result) => set(() => ({ result })),

	resultHistory: [],
	appendAndShiftResultHistory: (result) => {
		const resultHistory = get().resultHistory.slice(0);

		if (resultHistory.length > HISTORY_SIZE_LIMIT_FRAMES) {
			resultHistory.shift();
		}

		resultHistory.push(JSON.parse(JSON.stringify(result)));

		set(() => ({ resultHistory }));
	},

	msInStandStill: 0,
	setMsInStandStill: (msInStill) => set(() => ({ msInStandStill: msInStill })),

	firstStandStillTime: undefined,
	setFirstStandStillTime: (firstStillTime) =>
		set(() => ({ firstStandStillTime: firstStillTime })),

	humanDetected: false,
	setHumanDetected: (humanDetected) => set(() => ({ humanDetected })),

	generatedImageExpired: false,
	setGeneratedImageExpired: (generatedImageExpired) =>
		set(() => ({ generatedImageExpired })),

	resetDetection: () =>
		set(() => ({
			trigger: false,
			msInStandStill: 0,
			firstStandStillTime: undefined,
			humanDetected: false,
			generatedImageExpired: false,
			result: undefined,
			resultHistory: [],
		})),

	trigger: false,
	checkIfShouldTrigger: () => {
		const resultHistory = get().resultHistory;
		const currentResult = get().result;

		if (currentResult.face.length === 0) {
			set(() => ({
				humanDetected: false,
				trigger: false,
				msInStandStill: 0,
				firstStandStillTime: undefined,
			}));
			return;
		}
		set(() => ({ humanDetected: true }));

		if (!hasConsistentlyOneFace(currentResult, resultHistory)) {
			return;
		}

		const faces = resultHistory
			.filter((result) => result.face && result.face!.length > 0)
			.map((result) => result.face![0]);
		if (faces.length === 0) {
			return;
		}

		const distances = faces.map((face) => (face.distance ? face.distance : 0));
		const rolls = faces.map((face) => face.rotation?.angle.roll);
		const pitches = faces.map((face) => face.rotation?.angle.pitch);
		const yaws = faces.map((face) => face.rotation?.angle.yaw);

		if (
			distances.length === 0 ||
			rolls.length === 0 ||
			pitches.length === 0 ||
			yaws.length === 0
		) {
			return;
		}

		const sdDistances = MathUtils.standardDeviation(distances);
		const sdRolls = MathUtils.standardDeviation(rolls);
		const sdPitches = MathUtils.standardDeviation(pitches);
		const sdYaws = MathUtils.standardDeviation(yaws);

		if (
			sdDistances < DISTANCE_THRESHOLD_METERS &&
			sdRolls < ROTATION_THRESHOLD_DEGRESS &&
			sdPitches < ROTATION_THRESHOLD_DEGRESS &&
			sdYaws < ROTATION_THRESHOLD_DEGRESS
		) {
			if (!get().firstStandStillTime) {
				set(() => ({ firstStandStillTime: new Date() }));
			} else {
				const standStillTimeMs =
					new Date().getTime() - get().firstStandStillTime.getTime();
				set(() => ({ msInStandStill: standStillTimeMs }));
				if (standStillTimeMs > STANDSTILL_THRESHOLD_MS) {
					set(() => ({ trigger: true }));
				}
			}
		} else {
			set(() => ({
				trigger: false,
				msInStandStill: 0,
				firstStandStillTime: undefined,
			}));
		}
	},
}));

function hasConsistentlyOneFace(
	currentResult: Partial<Result>,
	resultHistory: Partial<Result>[]
) {
	if (currentResult.face.length === 0) {
		return false;
	}

	if (!currentResult.face[0]?.age) {
		return false;
	}

	if (resultHistory.length === 0) {
		return false;
	}

	return (
		resultHistory.length < HISTORY_SIZE_LIMIT_FRAMES ||
		resultHistory.every(
			(result) => result.face.length === currentResult.face.length
		)
	);
}
