import { TLShape, TLShapeId, useEditor } from 'tldraw';
import { AnimationKeyframe, AnimationSequence } from './animation-types';

export class AnimationEngine {
  private editor: ReturnType<typeof useEditor>;
  private animationFrame: number | null = null;
  private startTime: number = 0;
  private onTimeUpdate?: (time: number) => void;

  constructor(editor: ReturnType<typeof useEditor>) {
    this.editor = editor;
  }

  // Start playing an animation sequence
  playSequence(sequence: AnimationSequence, onTimeUpdate?: (time: number) => void) {
    this.onTimeUpdate = onTimeUpdate;
    this.startTime = Date.now();
    
    // Store initial shape states
    const initialStates = this.captureShapeStates(sequence.keyframes);
    
    // Start animation loop
    this.animationFrame = requestAnimationFrame(() => 
      this.animateFrame(sequence, initialStates)
    );
  }

  // Stop the current animation
  stop() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  // Seek to a specific time in the animation
  seekTo(sequence: AnimationSequence, time: number) {
    const initialStates = this.captureShapeStates(sequence.keyframes);
    this.applyAnimationAtTime(sequence, time, initialStates);
  }

  private animateFrame(sequence: AnimationSequence, initialStates: Map<string, TLShape>) {
    const elapsed = Date.now() - this.startTime;
    const currentTime = elapsed % sequence.duration;
    
    this.applyAnimationAtTime(sequence, currentTime, initialStates);
    
    if (this.onTimeUpdate) {
      this.onTimeUpdate(currentTime);
    }
    
    // Continue animation if not finished or if looping
    if (elapsed < sequence.duration || sequence.loop) {
      this.animationFrame = requestAnimationFrame(() => 
        this.animateFrame(sequence, initialStates)
      );
    } else {
      this.animationFrame = null;
    }
  }

  private applyAnimationAtTime(
    sequence: AnimationSequence, 
    time: number, 
    initialStates: Map<string, TLShape>
  ) {
    const shapesUpdated = new Set<string>();
    
    // Group keyframes by shape
    const keyframesByShape = new Map<string, AnimationKeyframe[]>();
    for (const keyframe of sequence.keyframes) {
      if (!keyframesByShape.has(keyframe.shapeId)) {
        keyframesByShape.set(keyframe.shapeId, []);
      }
      keyframesByShape.get(keyframe.shapeId)!.push(keyframe);
    }
    
    // Apply animations to each shape
    for (const [shapeId, keyframes] of keyframesByShape) {
      const shape = this.editor.getShape(shapeId as TLShapeId);
      const initialState = initialStates.get(shapeId);
      
      if (!shape || !initialState) continue;
      
      const interpolatedProps = this.interpolateProperties(keyframes, time, initialState);
      
      if (interpolatedProps) {
        this.editor.updateShape({
          id: shapeId as TLShapeId,
          type: shape.type,
          ...interpolatedProps,
        });
        shapesUpdated.add(shapeId);
      }
    }
  }

  private interpolateProperties(
    keyframes: AnimationKeyframe[], 
    time: number, 
    initialState: TLShape
  ): Partial<TLShape> | null {
    if (keyframes.length === 0) return null;
    
    // Sort keyframes by timestamp
    const sortedKeyframes = [...keyframes].sort((a, b) => a.timestamp - b.timestamp);
    
    // Find the keyframes to interpolate between
    let beforeKeyframe: AnimationKeyframe | null = null;
    let afterKeyframe: AnimationKeyframe | null = null;
    
    for (let i = 0; i < sortedKeyframes.length; i++) {
      const keyframe = sortedKeyframes[i];
      
      if (keyframe.timestamp <= time) {
        beforeKeyframe = keyframe;
      } else {
        afterKeyframe = keyframe;
        break;
      }
    }
    
    // If no keyframes apply at this time, return null
    if (!beforeKeyframe && !afterKeyframe) return null;
    
    // If only one keyframe applies, use it directly
    if (!afterKeyframe) {
      return this.applyKeyframeToShape(beforeKeyframe!, initialState);
    }
    
    if (!beforeKeyframe) {
      return this.applyKeyframeToShape(afterKeyframe, initialState);
    }
    
    // Interpolate between keyframes
    const timeDiff = afterKeyframe.timestamp - beforeKeyframe.timestamp;
    const progress = timeDiff > 0 ? (time - beforeKeyframe.timestamp) / timeDiff : 0;
    
    // Apply easing
    const easedProgress = this.applyEasing(progress, beforeKeyframe.easing || 'linear');
    
    return this.interpolateBetweenKeyframes(
      beforeKeyframe, 
      afterKeyframe, 
      easedProgress, 
      initialState
    );
  }

  private applyKeyframeToShape(keyframe: AnimationKeyframe, initialState: TLShape): Partial<TLShape> {
    const updates: Partial<TLShape> = {};
    
    if (keyframe.properties.x !== undefined) {
      updates.x = keyframe.properties.x;
    }
    if (keyframe.properties.y !== undefined) {
      updates.y = keyframe.properties.y;
    }
    
    // Handle props updates
    const props: any = { ...initialState.props };
    
    if (keyframe.properties.w !== undefined) {
      props.w = keyframe.properties.w;
    }
    if (keyframe.properties.h !== undefined) {
      props.h = keyframe.properties.h;
    }
    if (keyframe.properties.opacity !== undefined) {
      props.opacity = keyframe.properties.opacity;
    }
    if (keyframe.properties.rotation !== undefined) {
      props.rotation = keyframe.properties.rotation;
    }
    if (keyframe.properties.scale !== undefined) {
      props.scale = keyframe.properties.scale;
    }
    
    if (Object.keys(props).length > Object.keys(initialState.props).length) {
      updates.props = props;
    }
    
    return updates;
  }

  private interpolateBetweenKeyframes(
    from: AnimationKeyframe, 
    to: AnimationKeyframe, 
    progress: number, 
    initialState: TLShape
  ): Partial<TLShape> {
    const updates: Partial<TLShape> = {};
    
    // Interpolate position
    if (from.properties.x !== undefined && to.properties.x !== undefined) {
      updates.x = this.lerp(from.properties.x, to.properties.x, progress);
    }
    if (from.properties.y !== undefined && to.properties.y !== undefined) {
      updates.y = this.lerp(from.properties.y, to.properties.y, progress);
    }
    
    // Handle props interpolation
    const props: any = { ...initialState.props };
    
    if (from.properties.w !== undefined && to.properties.w !== undefined) {
      props.w = this.lerp(from.properties.w, to.properties.w, progress);
    }
    if (from.properties.h !== undefined && to.properties.h !== undefined) {
      props.h = this.lerp(from.properties.h, to.properties.h, progress);
    }
    if (from.properties.opacity !== undefined && to.properties.opacity !== undefined) {
      props.opacity = this.lerp(from.properties.opacity, to.properties.opacity, progress);
    }
    if (from.properties.rotation !== undefined && to.properties.rotation !== undefined) {
      props.rotation = this.lerp(from.properties.rotation, to.properties.rotation, progress);
    }
    if (from.properties.scale !== undefined && to.properties.scale !== undefined) {
      props.scale = this.lerp(from.properties.scale, to.properties.scale, progress);
    }
    
    updates.props = props;
    
    return updates;
  }

  private applyEasing(progress: number, easing: AnimationKeyframe['easing']): number {
    switch (easing) {
      case 'ease-in':
        return progress * progress;
      case 'ease-out':
        return 1 - (1 - progress) * (1 - progress);
      case 'ease-in-out':
        return progress < 0.5 
          ? 2 * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      case 'bounce':
        const n1 = 7.5625;
        const d1 = 2.75;
        if (progress < 1 / d1) {
          return n1 * progress * progress;
        } else if (progress < 2 / d1) {
          return n1 * (progress -= 1.5 / d1) * progress + 0.75;
        } else if (progress < 2.5 / d1) {
          return n1 * (progress -= 2.25 / d1) * progress + 0.9375;
        } else {
          return n1 * (progress -= 2.625 / d1) * progress + 0.984375;
        }
      case 'linear':
      default:
        return progress;
    }
  }

  private lerp(start: number, end: number, progress: number): number {
    return start + (end - start) * progress;
  }

  private captureShapeStates(keyframes: AnimationKeyframe[]): Map<string, TLShape> {
    const states = new Map<string, TLShape>();
    const uniqueShapeIds = new Set(keyframes.map(kf => kf.shapeId));
    
    for (const shapeId of uniqueShapeIds) {
      const shape = this.editor.getShape(shapeId as TLShapeId);
      if (shape) {
        states.set(shapeId, { ...shape });
      }
    }
    
    return states;
  }

  // Utility method to create a keyframe from current shape state
  createKeyframeFromShape(shapeId: string, timestamp: number): AnimationKeyframe | null {
    const shape = this.editor.getShape(shapeId as TLShapeId);
    if (!shape) return null;
    
    const props = shape.props as any;
    
    return {
      id: `keyframe-${shapeId}-${timestamp}`,
      timestamp,
      shapeId,
      properties: {
        x: shape.x,
        y: shape.y,
        w: props.w,
        h: props.h,
        opacity: props.opacity || 1,
        rotation: props.rotation || 0,
        scale: props.scale || 1,
        visible: true,
      },
      easing: 'ease-in-out',
    };
  }
}