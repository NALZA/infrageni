// Animation system exports
export * from './animation-types';
export * from './animation-state';
export * from './animation-engine';
export * from './animation-controls';

// Export animation utilities
export { AnimationEngine } from './animation-engine';
export { AnimationControls } from './animation-controls';

// Export animation hooks
export {
  animationStateAtom,
  animationConfigAtom,
  currentSequenceAtom,
  currentKeyframesAtom,
  addSequenceAtom,
  removeSequenceAtom,
  updateSequenceAtom,
  addKeyframeAtom,
  removeKeyframeAtom,
  updateKeyframeAtom,
  setCurrentSequenceAtom,
  setPlaybackStateAtom,
  setCurrentTimeAtom,
  setPlaybackSpeedAtom,
} from './animation-state';

// Export animation types
export type {
  AnimationKeyframe,
  AnimationSequence,
  AnimationState,
  AnimationConfig,
} from './animation-types';