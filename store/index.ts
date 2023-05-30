import {create} from "zustand";
import {Human} from "@vladmandic/human";


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

  age: number,
  setAge: (age: number) => void,

  gender: string,
  setGender: (gender: string) => void,
}


export const useEyesOfAIStore = create<EyesOfAIStore>()((set) => ({
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

  age: 0,
  setAge: (age) => set(() => ({age})),

  gender: '',
  setGender: (gender) => set(() => ({gender})),
}))