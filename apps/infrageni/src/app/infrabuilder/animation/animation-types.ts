export interface AnimationKeyframe {
  id: string;
  timestamp: number; // milliseconds
  shapeId: string;
  properties: {
    x?: number;
    y?: number;
    w?: number;
    h?: number;
    opacity?: number;
    rotation?: number;
    scale?: number;
    visible?: boolean;
  };
  easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'bounce';
}

export interface AnimationSequence {
  id: string;
  name: string;
  duration: number; // milliseconds
  keyframes: AnimationKeyframe[];
  loop?: boolean;
  delay?: number;
}

export interface AnimationState {
  sequences: AnimationSequence[];
  currentSequence?: string;
  isPlaying: boolean;
  currentTime: number;
  playbackSpeed: number;
}

export interface AnimationConfig {
  defaultDuration: number;
  defaultEasing: AnimationKeyframe['easing'];
  enableAutoKeyframes: boolean;
  snapToGrid: boolean;
}