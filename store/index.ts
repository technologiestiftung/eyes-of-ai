import { create } from "zustand";
import { Human, Result } from "@vladmandic/human";
import MathUtils from "../lib/math-utils";

const HISTORY_SIZE_LIMIT_FRAMES = 5;
const ROTATION_THRESHOLD_DEGRESS = 0.05;
const DISTANCE_THRESHOLD_METERS = 1.5;
export const STANDSTILL_THRESHOLD_MS = 5000;

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

	playbackResult: Partial<Result> | undefined;
	setPlaybackResult: (playbackResult: Partial<Result>) => void;

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

	humanCloseEnough: boolean;
	setHumanCloseEnough: (humanCloseEnough: boolean) => void;

	meanDistance: number;
	setMeanDistance: (meanDistance: number) => void;

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

	playbackResult: undefined,
	setPlaybackResult: (playbackResult) => set(() => ({ playbackResult })),

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

	humanCloseEnough: false,
	setHumanCloseEnough: (humanCloseEnough) => set(() => ({ humanCloseEnough })),

	meanDistance: 0,
	setMeanDistance: (meanDistance) => set(() => ({ meanDistance })),

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

		if (!hasConsistentlyOneFace(resultHistory)) {
			set(() => ({
				humanDetected: false,
				trigger: false,
				msInStandStill: 0,
				firstStandStillTime: undefined,
			}));
			return;
		}
		set(() => ({ humanDetected: true }));

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
		const meanDistance = MathUtils.mean(distances);
		const humanCloseEnough = meanDistance < DISTANCE_THRESHOLD_METERS;
		set(() => ({
			humanCloseEnough: humanCloseEnough,
			meanDistance: meanDistance,
		}));
		if (!humanCloseEnough) {
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

function hasConsistentlyOneFace(resultHistory: Partial<Result>[]) {
	const facesInHistory = resultHistory.filter(
		(r) => r.face && r.face.length == 1
	).length;
	return facesInHistory === resultHistory.length;
}
