import { scenes } from "./scenes";

export type StoryState = {
  index: number;
  step: number;
  playing: boolean;
  predictionReady: boolean;
  delayChoice: string | null;
  reviewed: string[];
  testsAccepted: boolean;
  finalAccepted: boolean;
  selectedFailure: string;
  jumpOpen: boolean;
  guardOpen: boolean;
};

export const initialState: StoryState = {
  index: 0, step: 1, playing: true, predictionReady: false,
  delayChoice: null, reviewed: [], testsAccepted: false,
  finalAccepted: false, selectedFailure: "AC1", jumpOpen: false, guardOpen: false,
};

export type Action =
  | { type: "NEXT" } | { type: "BACK" } | { type: "RESTART" }
  | { type: "JUMP"; index: number } | { type: "TICK"; max: number }
  | { type: "REVEAL_ALL"; max: number } | { type: "TOGGLE_PLAY"; max: number }
  | { type: "REVEAL_OUTCOME" } | { type: "DELAY_CHOICE"; choice: string }
  | { type: "TOGGLE_REVIEW"; id: string } | { type: "ACCEPT_TESTS" }
  | { type: "ACCEPT_FINAL" } | { type: "SELECT_FAILURE"; id: string }
  | { type: "TOGGLE_JUMP" } | { type: "SHOW_GUARD" } | { type: "HIDE_GUARD" };

export function canAdvance(state: StoryState): boolean {
  if (state.guardOpen) return true;
  const gate = scenes[state.index]?.gate;
  if (gate === "predict") return state.predictionReady;
  if (gate === "delay") return state.delayChoice !== null;
  if (gate === "review") return state.testsAccepted;
  if (gate === "final") return state.finalAccepted;
  return true;
}

export function storyReducer(state: StoryState, action: Action): StoryState {
  switch (action.type) {
    case "NEXT":
      if (state.guardOpen) return { ...state, guardOpen: false, step: 1, playing: false };
      if (!canAdvance(state)) return state;
      return { ...state, index: Math.min(scenes.length - 1, state.index + 1), step: 1, playing: true, jumpOpen: false };
    case "BACK":
      if (state.guardOpen) return { ...state, guardOpen: false, step: 1, playing: false };
      return { ...state, index: Math.max(0, state.index - 1), step: 1, playing: true, jumpOpen: false };
    case "RESTART":
      return { ...initialState };
    case "JUMP":
      return { ...state, index: Math.max(0, Math.min(scenes.length - 1, action.index)), step: 1, playing: true, jumpOpen: false, guardOpen: false };
    case "TICK":
      if (!state.playing || state.step >= action.max) return state;
      return { ...state, step: state.step + 1, playing: state.step + 1 < action.max };
    case "REVEAL_ALL":
      return { ...state, step: action.max, playing: false };
    case "TOGGLE_PLAY":
      return state.step >= action.max
        ? { ...state, step: 1, playing: true }
        : { ...state, playing: !state.playing };
    case "REVEAL_OUTCOME":
      return { ...state, predictionReady: true, index: Math.min(scenes.length - 1, state.index + 1), step: 1, playing: false };
    case "DELAY_CHOICE":
      return { ...state, delayChoice: action.choice };
    case "TOGGLE_REVIEW":
      return { ...state, reviewed: state.reviewed.includes(action.id) ? state.reviewed.filter(id => id !== action.id) : [...state.reviewed, action.id] };
    case "ACCEPT_TESTS":
      return state.reviewed.length === 4 ? { ...state, testsAccepted: true } : state;
    case "ACCEPT_FINAL":
      return { ...state, finalAccepted: true };
    case "SELECT_FAILURE":
      return { ...state, selectedFailure: action.id };
    case "TOGGLE_JUMP":
      return { ...state, jumpOpen: !state.jumpOpen };
    case "SHOW_GUARD":
      return { ...state, guardOpen: true, step: 1, playing: true, jumpOpen: false };
    case "HIDE_GUARD":
      return { ...state, guardOpen: false, step: 1, playing: false };
    default:
      return state;
  }
}
