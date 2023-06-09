import { create } from "zustand";
import { Human, Result } from "@vladmandic/human";
import MathUtils from "../lib/math-utils";

const HISTORY_SIZE_LIMIT_FRAMES = 5;

export type EyesOfAIStore = {
	ready: boolean;
	setReady: (ready: boolean) => void;

	frame: number;
	setFrame: (frame: number) => void;

	timestamp: number;
	setTimestamp: (timestamp: number) => void;

	fps: number;
	setFps: (fps: number) => void;

	rotationThresholdDegrees: number;
	setRotationThresholdDegrees: (rotationThresholdDegrees: number) => void;

	distanceThresholdMeters: number;
	setDistanceThresholdMeters: (distanceThresholdMeters: number) => void;

	standstillThresholdMs: number;
	setStandstillThresholdMs: (standstillThresholdMs: number) => void;

	meshZoom: number;
	setMeshZoom: (meshZoom: number) => void;

	playbackZoom: number;
	setPlaybackZoom: (playbackZoom: number) => void;

	expirationSeconds: number;
	setExpirationSeconds: (expirationSeconds: number) => void;

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

	rotationThresholdDegrees: 0.05,
	setRotationThresholdDegrees: (rotationThresholdDegrees) =>
		set(() => ({ rotationThresholdDegrees })),

	distanceThresholdMeters: 1.5,
	setDistanceThresholdMeters: (distanceThresholdMeters) =>
		set(() => ({ distanceThresholdMeters })),

	standstillThresholdMs: 10000,
	setStandstillThresholdMs: (standstillThresholdMs) =>
		set(() => ({ standstillThresholdMs })),

	meshZoom: 1.5,
	setMeshZoom: (meshZoom) => set(() => ({ meshZoom })),

	playbackZoom: 1.3,
	setPlaybackZoom: (playbackZoom) => set(() => ({ playbackZoom })),

	expirationSeconds: 20,
	setExpirationSeconds: (resetSeconds) =>
		set(() => ({ expirationSeconds: resetSeconds })),

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
		const humanCloseEnough = meanDistance < get().distanceThresholdMeters;
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
			sdDistances < get().distanceThresholdMeters &&
			sdRolls < get().rotationThresholdDegrees &&
			sdPitches < get().rotationThresholdDegrees &&
			sdYaws < get().rotationThresholdDegrees
		) {
			if (!get().firstStandStillTime) {
				set(() => ({ firstStandStillTime: new Date() }));
			} else {
				const standStillTimeMs =
					new Date().getTime() - get().firstStandStillTime.getTime();
				set(() => ({ msInStandStill: standStillTimeMs }));
				if (standStillTimeMs > get().standstillThresholdMs) {
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
