import { atom } from 'jotai';
import { AnimationState, AnimationSequence, AnimationKeyframe } from './animation-types';

// Animation state atom
export const animationStateAtom = atom<AnimationState>({
  sequences: [],
  currentSequence: undefined,
  isPlaying: false,
  currentTime: 0,
  playbackSpeed: 1,
});

// Animation config atom
export const animationConfigAtom = atom({
  defaultDuration: 3000,
  defaultEasing: 'ease-in-out' as const,
  enableAutoKeyframes: true,
  snapToGrid: false,
});

// Derived atoms for computed values
export const currentSequenceAtom = atom(
  (get) => {
    const state = get(animationStateAtom);
    return state.sequences.find(seq => seq.id === state.currentSequence);
  }
);

export const currentKeyframesAtom = atom(
  (get) => {
    const sequence = get(currentSequenceAtom);
    return sequence ? sequence.keyframes : [];
  }
);

// Actions
export const addSequenceAtom = atom(
  null,
  (get, set, sequence: AnimationSequence) => {
    const state = get(animationStateAtom);
    set(animationStateAtom, {
      ...state,
      sequences: [...state.sequences, sequence],
    });
  }
);

export const removeSequenceAtom = atom(
  null,
  (get, set, sequenceId: string) => {
    const state = get(animationStateAtom);
    set(animationStateAtom, {
      ...state,
      sequences: state.sequences.filter(seq => seq.id !== sequenceId),
      currentSequence: state.currentSequence === sequenceId ? undefined : state.currentSequence,
    });
  }
);

export const updateSequenceAtom = atom(
  null,
  (get, set, sequenceId: string, updates: Partial<AnimationSequence>) => {
    const state = get(animationStateAtom);
    set(animationStateAtom, {
      ...state,
      sequences: state.sequences.map(seq => 
        seq.id === sequenceId ? { ...seq, ...updates } : seq
      ),
    });
  }
);

export const addKeyframeAtom = atom(
  null,
  (get, set, sequenceId: string, keyframe: AnimationKeyframe) => {
    const state = get(animationStateAtom);
    set(animationStateAtom, {
      ...state,
      sequences: state.sequences.map(seq => 
        seq.id === sequenceId 
          ? { ...seq, keyframes: [...seq.keyframes, keyframe].sort((a, b) => a.timestamp - b.timestamp) }
          : seq
      ),
    });
  }
);

export const removeKeyframeAtom = atom(
  null,
  (get, set, sequenceId: string, keyframeId: string) => {
    const state = get(animationStateAtom);
    set(animationStateAtom, {
      ...state,
      sequences: state.sequences.map(seq => 
        seq.id === sequenceId 
          ? { ...seq, keyframes: seq.keyframes.filter(kf => kf.id !== keyframeId) }
          : seq
      ),
    });
  }
);

export const updateKeyframeAtom = atom(
  null,
  (get, set, sequenceId: string, keyframeId: string, updates: Partial<AnimationKeyframe>) => {
    const state = get(animationStateAtom);
    set(animationStateAtom, {
      ...state,
      sequences: state.sequences.map(seq => 
        seq.id === sequenceId 
          ? { 
              ...seq, 
              keyframes: seq.keyframes.map(kf => 
                kf.id === keyframeId ? { ...kf, ...updates } : kf
              ).sort((a, b) => a.timestamp - b.timestamp)
            }
          : seq
      ),
    });
  }
);

export const setCurrentSequenceAtom = atom(
  null,
  (get, set, sequenceId: string | undefined) => {
    const state = get(animationStateAtom);
    set(animationStateAtom, {
      ...state,
      currentSequence: sequenceId,
      currentTime: 0,
      isPlaying: false,
    });
  }
);

export const setPlaybackStateAtom = atom(
  null,
  (get, set, isPlaying: boolean) => {
    const state = get(animationStateAtom);
    set(animationStateAtom, {
      ...state,
      isPlaying,
    });
  }
);

export const setCurrentTimeAtom = atom(
  null,
  (get, set, time: number) => {
    const state = get(animationStateAtom);
    set(animationStateAtom, {
      ...state,
      currentTime: time,
    });
  }
);

export const setPlaybackSpeedAtom = atom(
  null,
  (get, set, speed: number) => {
    const state = get(animationStateAtom);
    set(animationStateAtom, {
      ...state,
      playbackSpeed: speed,
    });
  }
);