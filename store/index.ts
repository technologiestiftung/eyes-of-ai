import {create} from "zustand";
import {Human, Result} from "@vladmandic/human";

const HISTORY_SIZE_LIMIT = 9

export type EyesOfAIStore = {
  ready: boolean;
  setReady: (ready:boolean) => void;

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
}

export const useEyesOfAIStore = create<EyesOfAIStore>()((set, get) => ({
  ready: false,
  setReady: (ready) => set(() => ({ ready })),

  frame: 0,
  setFrame: (frame) => set(() => ({ frame })),

  timestamp: 0,
  setTimestamp: (timestamp) => set(() => ({timestamp})),

  fps: 0,
  setFps: (fps) => set(() => ({ fps })),

  human: undefined,
  setHuman: (human) => set(() => ({ human })),

  result: undefined,
  setResult: (result) => set(() => ({result })),

  resultHistory: [],
  appendAndShiftResultHistory: (result) => {
    const resultHistory = get().resultHistory.slice(0);

    if (resultHistory.length > HISTORY_SIZE_LIMIT) {
      resultHistory.shift();
    }

    resultHistory.push(result)

    set(() => ({ resultHistory }));
  },

  trigger: false,
  checkIfShouldTrigger: () => {
    const resultHistory = get().resultHistory;
    const currentResult = get().result;

    if (!hasConsistentlyOneFace(currentResult, resultHistory)) {
      set(() => ({ trigger: false }));
      return;
    }

    const ageSum = resultHistory.reduce(
      (ageAccumulator, result) => ageAccumulator + (result.face[0]?.age ?? 0),
      0
    );
    const ageAverage = Number((ageSum / resultHistory.length).toFixed(2));

    const currentAge = currentResult.face[0].age;

    const diff = Number(Math.abs(currentAge - ageAverage).toFixed(2));
    const maxDiff = Number((currentAge * 0.1).toFixed(2));

    if (diff > maxDiff) {
      set(() => ({ trigger: false }));
      return;
    }

    set(() => ({ trigger: true }))
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

  return resultHistory.length < HISTORY_SIZE_LIMIT ||resultHistory.every((result) => result.face.length === currentResult.face.length);
}