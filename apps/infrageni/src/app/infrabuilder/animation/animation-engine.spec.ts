import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AnimationEngine } from './animation-engine';
import { AnimationSequence, AnimationKeyframe } from './animation-types';

// Mock tldraw
const mockEditor = {
  getShape: vi.fn(),
  updateShape: vi.fn(),
  store: {
    getSnapshot: vi.fn(),
  },
};

// Mock useEditor
vi.mock('tldraw', () => ({
  useEditor: () => mockEditor,
}));

describe('AnimationEngine', () => {
  let engine: AnimationEngine;

  beforeEach(() => {
    vi.clearAllMocks();
    engine = new AnimationEngine(mockEditor as any);
  });

  describe('createKeyframeFromShape', () => {
    it('should create keyframe from shape', () => {
      const mockShape = {
        id: 'shape-1',
        x: 100,
        y: 200,
        props: {
          w: 150,
          h: 100,
          opacity: 0.8,
          rotation: 45,
          scale: 1.2,
        },
      };

      mockEditor.getShape.mockReturnValue(mockShape);

      const keyframe = engine.createKeyframeFromShape('shape-1', 1000);

      expect(keyframe).toEqual({
        id: 'keyframe-shape-1-1000',
        timestamp: 1000,
        shapeId: 'shape-1',
        properties: {
          x: 100,
          y: 200,
          w: 150,
          h: 100,
          opacity: 0.8,
          rotation: 45,
          scale: 1.2,
          visible: true,
        },
        easing: 'ease-in-out',
      });
    });

    it('should return null for non-existent shape', () => {
      mockEditor.getShape.mockReturnValue(null);

      const keyframe = engine.createKeyframeFromShape('invalid-shape', 1000);

      expect(keyframe).toBeNull();
    });
  });

  describe('seekTo', () => {
    it('should seek to specific time in animation', () => {
      const keyframe: AnimationKeyframe = {
        id: 'keyframe-1',
        timestamp: 1000,
        shapeId: 'shape-1',
        properties: {
          x: 200,
          y: 300,
          opacity: 0.5,
        },
        easing: 'linear',
      };

      const sequence: AnimationSequence = {
        id: 'seq-1',
        name: 'Test Sequence',
        duration: 2000,
        keyframes: [keyframe],
        loop: false,
      };

      const mockShape = {
        id: 'shape-1',
        type: 'geo',
        x: 100,
        y: 200,
        props: {
          w: 150,
          h: 100,
          opacity: 1,
        },
      };

      mockEditor.getShape.mockReturnValue(mockShape);

      engine.seekTo(sequence, 1000);

      expect(mockEditor.updateShape).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'shape-1',
          type: 'geo',
          x: 200,
          y: 300,
          props: expect.objectContaining({
            opacity: 0.5,
          }),
        })
      );
    });
  });

  describe('easing functions', () => {
    it('should apply linear easing', () => {
      const result = (engine as any).applyEasing(0.5, 'linear');
      expect(result).toBe(0.5);
    });

    it('should apply ease-in easing', () => {
      const result = (engine as any).applyEasing(0.5, 'ease-in');
      expect(result).toBe(0.25); // 0.5 * 0.5
    });

    it('should apply ease-out easing', () => {
      const result = (engine as any).applyEasing(0.5, 'ease-out');
      expect(result).toBe(0.75); // 1 - (1 - 0.5) * (1 - 0.5)
    });

    it('should apply ease-in-out easing', () => {
      const result = (engine as any).applyEasing(0.25, 'ease-in-out');
      expect(result).toBe(0.125); // 2 * 0.25 * 0.25
    });

    it('should apply bounce easing', () => {
      const result = (engine as any).applyEasing(0.1, 'bounce');
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(1);
    });
  });

  describe('interpolation', () => {
    it('should interpolate between values', () => {
      const result = (engine as any).lerp(0, 100, 0.5);
      expect(result).toBe(50);
    });

    it('should interpolate between keyframes', () => {
      const fromKeyframe: AnimationKeyframe = {
        id: 'from',
        timestamp: 0,
        shapeId: 'shape-1',
        properties: {
          x: 0,
          y: 0,
          opacity: 0,
        },
        easing: 'linear',
      };

      const toKeyframe: AnimationKeyframe = {
        id: 'to',
        timestamp: 1000,
        shapeId: 'shape-1',
        properties: {
          x: 100,
          y: 200,
          opacity: 1,
        },
        easing: 'linear',
      };

      const initialState = {
        id: 'shape-1',
        type: 'geo',
        x: 0,
        y: 0,
        props: {
          w: 100,
          h: 100,
          opacity: 0,
        },
      };

      const result = (engine as any).interpolateBetweenKeyframes(
        fromKeyframe,
        toKeyframe,
        0.5,
        initialState
      );

      expect(result.x).toBe(50);
      expect(result.y).toBe(100);
      expect(result.props.opacity).toBe(0.5);
    });
  });

  describe('playSequence', () => {
    it('should start animation playback', () => {
      const sequence: AnimationSequence = {
        id: 'seq-1',
        name: 'Test Sequence',
        duration: 1000,
        keyframes: [],
        loop: false,
      };

      const mockTimeUpdate = vi.fn();

      // Mock requestAnimationFrame
      const mockRaf = vi.fn((callback) => {
        callback();
        return 1;
      });
      global.requestAnimationFrame = mockRaf;

      // Mock Date.now
      const mockNow = vi.fn(() => 0);
      global.Date.now = mockNow;

      engine.playSequence(sequence, mockTimeUpdate);

      expect(mockRaf).toHaveBeenCalled();
    });

    it('should stop animation', () => {
      const mockCancelAnimationFrame = vi.fn();
      global.cancelAnimationFrame = mockCancelAnimationFrame;

      // Set up animation frame ID
      (engine as any).animationFrame = 123;

      engine.stop();

      expect(mockCancelAnimationFrame).toHaveBeenCalledWith(123);
      expect((engine as any).animationFrame).toBeNull();
    });
  });

  describe('shape state capture', () => {
    it('should capture initial shape states', () => {
      const keyframes: AnimationKeyframe[] = [
        {
          id: 'keyframe-1',
          timestamp: 0,
          shapeId: 'shape-1',
          properties: { x: 100 },
          easing: 'linear',
        },
        {
          id: 'keyframe-2',
          timestamp: 500,
          shapeId: 'shape-2',
          properties: { y: 200 },
          easing: 'linear',
        },
      ];

      const shape1 = { id: 'shape-1', x: 50, y: 60, props: {} };
      const shape2 = { id: 'shape-2', x: 70, y: 80, props: {} };

      mockEditor.getShape.mockImplementation((id) => {
        if (id === 'shape-1') return shape1;
        if (id === 'shape-2') return shape2;
        return null;
      });

      const states = (engine as any).captureShapeStates(keyframes);

      expect(states.get('shape-1')).toEqual(shape1);
      expect(states.get('shape-2')).toEqual(shape2);
      expect(states.size).toBe(2);
    });
  });
});