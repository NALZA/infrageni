/**
 * Question Viewer Component
 * Interactive question display with step-by-step teaching
 */

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  Lightbulb, 
  Eye, 
  EyeOff, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause,
  CheckCircle,
  Star,
  RotateCcw
} from 'lucide-react';
import { DesignQuestion, TeachingModeConfig, UserProgress, TeachingStep } from '../types';
import { EducationalCanvas } from './EducationalCanvas';

interface QuestionViewerProps {
  question: DesignQuestion;
  teachingConfig: TeachingModeConfig;
  userProgress: UserProgress | null;
  onComplete: (timeSpent: number, hintsUsed: number, rating?: number) => void;
  onBack: () => void;
  className?: string;
}

export const QuestionViewer: React.FC<QuestionViewerProps> = ({
  question,
  teachingConfig,
  userProgress,
  onComplete,
  onBack,
  className = ''
}) => {
  // State management
  const [currentStep, setCurrentStep] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [startTime] = useState(Date.now());
  const [isPlaying, setIsPlaying] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [showCompletion, setShowCompletion] = useState(false);

  // Auto-advance steps if configured
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && teachingConfig.autoAdvanceSteps && showSolution) {
      interval = setInterval(() => {
        if (currentStep < question.solution.teachingSteps.length - 1) {
          setCurrentStep(prev => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, teachingConfig.stepDelay);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, question.solution.teachingSteps.length, teachingConfig, showSolution]);

  // Auto-show hints after delay
  useEffect(() => {
    if (!showSolution && teachingConfig.showHints) {
      const timer = setTimeout(() => {
        setShowHints(true);
      }, teachingConfig.hintDelay * 1000);
      
      return () => clearTimeout(timer);
    }
  }, [showSolution, teachingConfig]);

  const formatCategory = (category: string): string => {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'advanced': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const handleRevealSolution = () => {
    setShowSolution(true);
    setCurrentStep(0);
  };

  const handleStepNavigation = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else if (direction === 'next' && currentStep < question.solution.teachingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleUseHint = () => {
    setHintsUsed(prev => prev + 1);
  };

  const handleComplete = () => {
    const timeSpent = Math.round((Date.now() - startTime) / (1000 * 60)); // minutes
    onComplete(timeSpent, hintsUsed, userRating || undefined);
    setShowCompletion(true);
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setShowSolution(false);
    setShowHints(false);
    setIsPlaying(false);
  };

  const currentTeachingStep = question.solution.teachingSteps[currentStep];

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="glass-card p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 glass-button glass-button-hover px-3 py-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Questions
          </button>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-black/70 dark:text-white/70">
              <Clock className="w-4 h-4" />
              Est. {question.estimatedTime}m
            </div>
            
            {!showCompletion && (
              <button
                onClick={handleComplete}
                className="glass-button glass-button-hover px-4 py-2 text-sm"
              >
                Mark Complete
              </button>
            )}
          </div>
        </div>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-black dark:text-white mb-2">
              {question.title}
            </h1>
            <p className="text-black/70 dark:text-white/70 mb-4">
              {question.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getDifficultyColor(question.difficulty)}`}>
                {question.difficulty}
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-medium text-blue-600 bg-blue-100 dark:bg-blue-900/30">
                {formatCategory(question.category)}
              </span>
              <div className="flex items-center gap-1 text-sm text-black/60 dark:text-white/60">
                <Clock className="w-4 h-4" />
                {question.estimatedTime} minutes
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 gap-4">
        {/* Left Panel - Question Details & Teaching */}
        <div className="w-1/2 flex flex-col gap-4">
          {/* Requirements Section */}
          <div className="glass-card p-4">
            <h3 className="font-semibold text-black dark:text-white mb-3">Requirements</h3>
            <ul className="space-y-2">
              {question.requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm text-black/70 dark:text-white/70">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Scale Requirements */}
          {question.scaleRequirements && (
            <div className="glass-card p-4">
              <h3 className="font-semibold text-black dark:text-white mb-3">Scale Requirements</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {Object.entries(question.scaleRequirements).map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <span className="text-black/50 dark:text-white/50 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-black dark:text-white font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Constraints */}
          <div className="glass-card p-4">
            <h3 className="font-semibold text-black dark:text-white mb-3">Constraints</h3>
            <ul className="space-y-2">
              {question.constraints.map((constraint, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm text-black/70 dark:text-white/70">{constraint}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Hints Section */}
          {showHints && !showSolution && (
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-black dark:text-white flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-600" />
                  Hints
                </h3>
                <span className="text-xs text-black/50 dark:text-white/50">
                  {hintsUsed} used
                </span>
              </div>
              
              <div className="space-y-3">
                {question.hints.map((hint, index) => (
                  <div key={index} className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-yellow-800 dark:text-yellow-200 capitalize">
                        {hint.level} hint
                      </span>
                      <button
                        onClick={handleUseHint}
                        className="text-xs text-yellow-600 dark:text-yellow-400 hover:underline"
                      >
                        Use hint
                      </button>
                    </div>
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      {hint.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Solution Controls */}
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-black dark:text-white">Solution</h3>
              <div className="flex items-center gap-2">
                {showSolution && teachingConfig.showStepByStep && (
                  <>
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="glass-button glass-button-hover p-2"
                      title={isPlaying ? 'Pause auto-advance' : 'Auto-advance steps'}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={handleRestart}
                      className="glass-button glass-button-hover p-2"
                      title="Restart explanation"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {!showSolution ? (
              <div className="text-center py-6">
                <button
                  onClick={handleRevealSolution}
                  className="flex items-center gap-2 glass-button glass-button-hover px-6 py-3 mx-auto"
                >
                  <Eye className="w-4 h-4" />
                  Reveal Solution & Explanation
                </button>
                <p className="text-xs text-black/50 dark:text-white/50 mt-2">
                  Try to think through the solution first
                </p>
              </div>
            ) : (
              <div>
                {/* Step Navigation */}
                {teachingConfig.showStepByStep && (
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => handleStepNavigation('prev')}
                      disabled={currentStep === 0}
                      className="glass-button glass-button-hover p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-black/70 dark:text-white/70">
                        Step {currentStep + 1} of {question.solution.teachingSteps.length}
                      </span>
                      <div className="flex gap-1">
                        {question.solution.teachingSteps.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentStep(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-200 ${
                              index === currentStep
                                ? 'bg-blue-600'
                                : index < currentStep
                                ? 'bg-green-600'
                                : 'bg-black/20 dark:bg-white/20'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleStepNavigation('next')}
                      disabled={currentStep >= question.solution.teachingSteps.length - 1}
                      className="glass-button glass-button-hover p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Current Teaching Step */}
                {currentTeachingStep && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-black dark:text-white mb-2">
                        {currentTeachingStep.title}
                      </h4>
                      <p className="text-sm text-black/70 dark:text-white/70 mb-3">
                        {currentTeachingStep.description}
                      </p>
                      <p className="text-sm text-black/80 dark:text-white/80">
                        {currentTeachingStep.explanation}
                      </p>
                    </div>

                    {/* Code Example */}
                    {currentTeachingStep.codeExample && teachingConfig.showCodeExamples && (
                      <div className="bg-black/5 dark:bg-white/5 rounded-lg p-3">
                        <pre className="text-sm font-mono text-black dark:text-white overflow-x-auto">
                          {currentTeachingStep.codeExample}
                        </pre>
                      </div>
                    )}

                    {/* Key Points */}
                    <div>
                      <h5 className="text-sm font-medium text-black dark:text-white mb-2">Key Points:</h5>
                      <ul className="space-y-1">
                        {currentTeachingStep.keyPoints.map((point, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-xs text-black/70 dark:text-white/70">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Common Mistakes */}
                    {currentTeachingStep.commonMistakes && currentTeachingStep.commonMistakes.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-black dark:text-white mb-2">Common Mistakes:</h5>
                        <ul className="space-y-1">
                          {currentTeachingStep.commonMistakes.map((mistake, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-3 h-3 bg-red-600 rounded-full mt-0.5 flex-shrink-0" />
                              <span className="text-xs text-black/70 dark:text-white/70">{mistake}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Completion Rating */}
          {showCompletion && (
            <div className="glass-card p-4">
              <h3 className="font-semibold text-black dark:text-white mb-3">Rate this Question</h3>
              <div className="flex items-center gap-2 mb-3">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    onClick={() => setUserRating(rating)}
                    className={`p-1 transition-all duration-200 ${
                      userRating && rating <= userRating
                        ? 'text-yellow-500'
                        : 'text-black/20 dark:text-white/20 hover:text-yellow-400'
                    }`}
                  >
                    <Star className="w-5 h-5 fill-current" />
                  </button>
                ))}
              </div>
              <p className="text-sm text-black/70 dark:text-white/70">
                Question completed! {hintsUsed > 0 && `Used ${hintsUsed} hints.`}
              </p>
            </div>
          )}
        </div>

        {/* Right Panel - Interactive Canvas */}
        <div className="w-1/2">
          <div className="glass-card h-full">
            <EducationalCanvas
              pattern={question.solution.pattern}
              annotations={showSolution ? question.solution.annotations : []}
              highlightedComponents={
                showSolution && currentTeachingStep?.visualHighlights
                  ? currentTeachingStep.visualHighlights
                  : []
              }
              teachingConfig={teachingConfig}
              className="h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionViewer;