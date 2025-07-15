import React, { useState, useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { useEditor } from 'tldraw';
import { 
  animationStateAtom, 
  currentSequenceAtom, 
  setPlaybackStateAtom, 
  setCurrentTimeAtom,
  setPlaybackSpeedAtom,
  addSequenceAtom,
  setCurrentSequenceAtom,
} from './animation-state';
import { AnimationEngine } from './animation-engine';
import { AnimationSequence } from './animation-types';

export function AnimationControls() {
  const editor = useEditor();
  const [animationState, setAnimationState] = useAtom(animationStateAtom);
  const [currentSequence] = useAtom(currentSequenceAtom);
  const [, setIsPlaying] = useAtom(setPlaybackStateAtom);
  const [, setCurrentTime] = useAtom(setCurrentTimeAtom);
  const [, setPlaybackSpeed] = useAtom(setPlaybackSpeedAtom);
  const [, addSequence] = useAtom(addSequenceAtom);
  const [, setCurrentSequenceId] = useAtom(setCurrentSequenceAtom);

  const engineRef = useRef<AnimationEngine | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStartTime, setRecordingStartTime] = useState(0);

  useEffect(() => {
    if (editor && !engineRef.current) {
      engineRef.current = new AnimationEngine(editor);
    }
  }, [editor]);

  const handlePlay = () => {
    if (!currentSequence || !engineRef.current) return;
    
    setIsPlaying(true);
    engineRef.current.playSequence(currentSequence, (time) => {
      setCurrentTime(time);
    });
  };

  const handlePause = () => {
    setIsPlaying(false);
    engineRef.current?.stop();
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    engineRef.current?.stop();
    
    if (currentSequence) {
      engineRef.current?.seekTo(currentSequence, 0);
    }
  };

  const handleSeek = (time: number) => {
    if (!currentSequence || !engineRef.current) return;
    
    setCurrentTime(time);
    engineRef.current.seekTo(currentSequence, time);
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
  };

  const handleSequenceChange = (sequenceId: string) => {
    handleStop();
    setCurrentSequenceId(sequenceId);
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingStartTime(Date.now());
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    
    // Create a new sequence from recorded data
    const newSequence: AnimationSequence = {
      id: `seq-${Date.now()}`,
      name: `Animation ${animationState.sequences.length + 1}`,
      duration: Date.now() - recordingStartTime,
      keyframes: [],
      loop: false,
    };
    
    addSequence(newSequence);
    setCurrentSequenceId(newSequence.id);
  };

  const handleExportAnimation = () => {
    if (!currentSequence) return;
    
    const animationData = {
      sequence: currentSequence,
      metadata: {
        exportedAt: new Date().toISOString(),
        version: '1.0.0',
      },
    };
    
    const blob = new Blob([JSON.stringify(animationData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentSequence.name.replace(/\s+/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass-panel border border-white/20 dark:border-white/10 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-black/90 dark:text-white/90">
          Animation Controls
        </h3>
        <div className="flex items-center gap-2">
          {isRecording ? (
            <button
              onClick={handleStopRecording}
              className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Stop Recording
            </button>
          ) : (
            <button
              onClick={handleStartRecording}
              className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              Start Recording
            </button>
          )}
          <button
            onClick={handleExportAnimation}
            disabled={!currentSequence}
            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Export
          </button>
        </div>
      </div>

      {/* Sequence Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-black/80 dark:text-white/80 mb-2">
          Animation Sequence
        </label>
        <select
          value={animationState.currentSequence || ''}
          onChange={(e) => handleSequenceChange(e.target.value)}
          className="w-full glass-input px-3 py-2 rounded-md text-sm"
        >
          <option value="">Select a sequence...</option>
          {animationState.sequences.map((seq) => (
            <option key={seq.id} value={seq.id}>
              {seq.name}
            </option>
          ))}
        </select>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={animationState.isPlaying ? handlePause : handlePlay}
          disabled={!currentSequence}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {animationState.isPlaying ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5.5 3.5A1.5 1.5 0 0 1 7 2h6a1.5 1.5 0 0 1 1.5 1.5v13a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 16.5v-13Z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 0 0 4 4.11v11.78a1.5 1.5 0 0 0 2.3 1.269l9.344-5.89a1.5 1.5 0 0 0 0-2.538L6.3 2.84Z" />
            </svg>
          )}
          {animationState.isPlaying ? 'Pause' : 'Play'}
        </button>
        
        <button
          onClick={handleStop}
          disabled={!currentSequence}
          className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5.75 3a.75.75 0 0 0-.75.75v12.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75V3.75a.75.75 0 0 0-.75-.75H5.75Z" />
          </svg>
          Stop
        </button>
      </div>

      {/* Timeline */}
      {currentSequence && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-black/80 dark:text-white/80 mb-2">
            Timeline ({animationState.currentTime}ms / {currentSequence.duration}ms)
          </label>
          <input
            type="range"
            min="0"
            max={currentSequence.duration}
            value={animationState.currentTime}
            onChange={(e) => handleSeek(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      )}

      {/* Playback Speed */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-black/80 dark:text-white/80">
          Speed:
        </label>
        <select
          value={animationState.playbackSpeed}
          onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
          className="glass-input px-2 py-1 rounded text-sm"
        >
          <option value="0.25">0.25x</option>
          <option value="0.5">0.5x</option>
          <option value="1">1x</option>
          <option value="1.5">1.5x</option>
          <option value="2">2x</option>
        </select>
      </div>

      {/* Recording Indicator */}
      {isRecording && (
        <div className="mt-4 flex items-center gap-2 text-red-500">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">Recording animation...</span>
        </div>
      )}
    </div>
  );
}