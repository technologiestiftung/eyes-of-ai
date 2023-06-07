import { create } from "zustand";
import { Human, Result } from "@vladmandic/human";
import MathUtils from "../utils/MathUtils";

const HISTORY_SIZE_LIMIT = 9
const ROTATION_THRESHOLD = 0.05
const DISTANCE_THRESHOLD = 0.15
const STILLSTAND_THRESHOLD_MS = 2000

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

  firstStillTime: Date | undefined,
  setFirstStillTime: (date: Date) => void;

  msInStill: number;
  setMsInStill: (timeInStill: number) => void;
}

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

    if (resultHistory.length > HISTORY_SIZE_LIMIT) {
      resultHistory.shift();
    }

    resultHistory.push(JSON.parse(JSON.stringify(result)))

    set(() => ({ resultHistory }));
  },

  msInStill: 0,
  setMsInStill: (msInStill) => set(() => ({ msInStill })),

  firstStillTime: undefined,
  setFirstStillTime: (firstStillTime) => set(() => ({ firstStillTime })),

  trigger: false,
  checkIfShouldTrigger: () => {

    const resultHistory = get().resultHistory;
    const currentResult = get().result

    if(!hasConsistentlyOneFace(currentResult, resultHistory)) {
      return
    }

    const distances = resultHistory.map(result => result.face[0].distance)
    const rolls = resultHistory.map(result => result.face[0].rotation.angle.roll)
    const pitches = resultHistory.map(result => result.face[0].rotation.angle.pitch)
    const yaws = resultHistory.map(result => result.face[0].rotation.angle.yaw)

    if (distances.length === 0 || rolls.length === 0 || pitches.length === 0 || yaws.length === 0) {
      return
    }

    const sdDistances = MathUtils.standardDeviation(distances);
    const sdRolls = MathUtils.standardDeviation(rolls);
    const sdPitches = MathUtils.standardDeviation(pitches);
    const sdYaws = MathUtils.standardDeviation(yaws);

    if (sdDistances < DISTANCE_THRESHOLD && sdRolls < ROTATION_THRESHOLD && sdPitches < ROTATION_THRESHOLD && sdYaws < ROTATION_THRESHOLD) {
      if (!get().firstStillTime) {
        set(() => ({ firstStillTime: new Date() }))
      } else {
        const timeInStillStandMs = new Date().getTime() - get().firstStillTime.getTime()
        set(() => ({ msInStill: timeInStillStandMs }))
        if (timeInStillStandMs > STILLSTAND_THRESHOLD_MS) {
          set(() => ({ trigger: true }));
        }
      }
    } else {
       set(() => ({ trigger: false, msInStill: 0, firstStillTime: undefined }))
    }
  }
}))

function hasConsistentlyOneFace(currentResult: Partial<Result>, resultHistory: Partial<Result>[]) {
  if (currentResult.face.length === 0) {
    return false;
  }

  if (!currentResult.face[0]?.age) {
    return false;
  }

  if (resultHistory.length === 0) {
    return false;
  }

  return resultHistory.length < HISTORY_SIZE_LIMIT || resultHistory.every((result) => result.face.length === currentResult.face.length);
}