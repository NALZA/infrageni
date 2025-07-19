/**
 * Education Mode Container
 * Main container for education mode functionality
 */

import React, { useState, useEffect } from 'react';
import { DesignQuestion, LearningSession, UserProgress, EducationModeState, TeachingModeConfig } from '../types';
import { QuestionBrowser } from './QuestionBrowser';
import { QuestionViewer } from './QuestionViewer';
import { ProgressTracker } from './ProgressTracker';
import { LearningPathViewer } from './LearningPathViewer';
import { BookOpen, Target, TrendingUp, Map, Settings, Home } from 'lucide-react';

interface EducationModeContainerProps {
  onExitEducation: () => void;
  className?: string;
}

export const EducationModeContainer: React.FC<EducationModeContainerProps> = ({
  onExitEducation,
  className = ''
}) => {
  // Education mode state
  const [currentView, setCurrentView] = useState<'home' | 'questions' | 'question' | 'progress' | 'paths' | 'settings'>('home');
  const [currentQuestion, setCurrentQuestion] = useState<DesignQuestion | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [currentSession, setCurrentSession] = useState<LearningSession | null>(null);
  
  // Teaching configuration
  const [teachingConfig, setTeachingConfig] = useState<TeachingModeConfig>({
    showAnnotations: true,
    showStepByStep: true,
    autoAdvanceSteps: false,
    stepDelay: 2000,
    allowSkipSteps: true,
    requireConfirmation: false,
    showHints: true,
    hintDelay: 30,
    highlightIntensity: 'moderate',
    animationSpeed: 'normal',
    colorScheme: 'default',
    explanationLevel: 'detailed',
    showCodeExamples: true,
    showRealWorldExamples: true,
    includeTroubleshooting: true
  });

  // Initialize user progress on mount
  useEffect(() => {
    // Load user progress from localStorage or API
    const savedProgress = localStorage.getItem('infrageni-education-progress');
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    } else {
      // Initialize new user progress
      const newProgress: UserProgress = {
        userId: 'current-user', // TODO: Get from auth
        completedQuestions: [],
        skillLevels: {},
        objectiveProgress: {},
        currentStreak: 0,
        longestStreak: 0,
        achievements: [],
        preferences: {
          difficultyPreference: 'beginner' as any,
          categoryPreferences: [],
          studyReminders: true,
          showHints: true,
          autoAdvanceDifficulty: false
        }
      };
      setUserProgress(newProgress);
    }
  }, []);

  // Save progress to localStorage when it changes
  useEffect(() => {
    if (userProgress) {
      localStorage.setItem('infrageni-education-progress', JSON.stringify(userProgress));
    }
  }, [userProgress]);

  const handleQuestionSelect = (question: DesignQuestion) => {
    setCurrentQuestion(question);
    setCurrentView('question');
    
    // Start new session if none exists
    if (!currentSession) {
      const newSession: LearningSession = {
        id: `session-${Date.now()}`,
        userId: userProgress?.userId || 'current-user',
        startedAt: new Date().toISOString(),
        mode: 'practice',
        targetDifficulty: question.difficulty,
        targetCategories: [question.category],
        questions: [{
          questionId: question.id,
          startedAt: new Date().toISOString(),
          hintsUsed: []
        }]
      };
      setCurrentSession(newSession);
    }
  };

  const handleQuestionComplete = (questionId: string, timeSpent: number, hintsUsed: number, rating?: number) => {
    if (!userProgress) return;

    // Update user progress
    const completedQuestion = {
      questionId,
      completedAt: new Date().toISOString(),
      timeSpent,
      hintsUsed,
      rating
    };

    const updatedProgress: UserProgress = {
      ...userProgress,
      completedQuestions: [...userProgress.completedQuestions, completedQuestion]
    };

    setUserProgress(updatedProgress);

    // Update current session
    if (currentSession) {
      const updatedSession: LearningSession = {
        ...currentSession,
        questions: currentSession.questions.map(q => 
          q.questionId === questionId 
            ? { ...q, completedAt: new Date().toISOString() }
            : q
        )
      };
      setCurrentSession(updatedSession);
    }
  };

  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home, description: 'Education dashboard and quick start' },
    { id: 'questions', label: 'Questions', icon: BookOpen, description: 'Browse and practice design questions' },
    { id: 'progress', label: 'Progress', icon: TrendingUp, description: 'Track your learning progress' },
    { id: 'paths', label: 'Learning Paths', icon: Map, description: 'Structured learning journeys' },
    { id: 'settings', label: 'Settings', icon: Settings, description: 'Customize your learning experience' }
  ];

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return (
          <EducationDashboard 
            userProgress={userProgress}
            onStartLearning={() => setCurrentView('questions')}
            onViewProgress={() => setCurrentView('progress')}
            onViewPaths={() => setCurrentView('paths')}
          />
        );
      
      case 'questions':
        return (
          <QuestionBrowser 
            onQuestionSelect={handleQuestionSelect}
            userProgress={userProgress}
          />
        );
      
      case 'question':
        return currentQuestion ? (
          <QuestionViewer 
            question={currentQuestion}
            teachingConfig={teachingConfig}
            userProgress={userProgress}
            onComplete={(timeSpent, hintsUsed, rating) => 
              handleQuestionComplete(currentQuestion.id, timeSpent, hintsUsed, rating)
            }
            onBack={() => setCurrentView('questions')}
          />
        ) : null;
      
      case 'progress':
        return (
          <ProgressTracker 
            userProgress={userProgress}
            currentSession={currentSession}
          />
        );
      
      case 'paths':
        return (
          <LearningPathViewer 
            userProgress={userProgress}
            onQuestionSelect={handleQuestionSelect}
          />
        );
      
      case 'settings':
        return (
          <EducationSettings 
            config={teachingConfig}
            onConfigChange={setTeachingConfig}
            userProgress={userProgress}
            onProgressUpdate={setUserProgress}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="glass-card glass-card-hover mb-4 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-black dark:text-white">
                Education Mode
              </h1>
              <p className="text-sm text-black/70 dark:text-white/70">
                Learn system design through interactive questions and patterns
              </p>
            </div>
          </div>
          
          <button
            onClick={onExitEducation}
            className="glass-button glass-button-hover px-4 py-2 text-sm"
          >
            Exit Education
          </button>
        </div>
      </div>

      <div className="flex flex-1 gap-4">
        {/* Navigation Sidebar */}
        <div className="w-64 glass-card p-4 flex flex-col gap-2">
          <h3 className="font-medium text-black dark:text-white mb-2">Navigation</h3>
          {navigationItems.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as any)}
              className={`
                flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200
                ${currentView === item.id 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5'
                }
              `}
              title={item.description}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium">{item.label}</div>
                <div className={`text-xs ${currentView === item.id ? 'text-white/80' : 'text-black/50 dark:text-white/50'}`}>
                  {item.description}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 glass-card p-6">
          {renderCurrentView()}
        </div>
      </div>
    </div>
  );
};

// Placeholder components - these will be implemented in subsequent steps
const EducationDashboard: React.FC<{
  userProgress: UserProgress | null;
  onStartLearning: () => void;
  onViewProgress: () => void;
  onViewPaths: () => void;
}> = ({ userProgress, onStartLearning, onViewProgress, onViewPaths }) => (
  <div className="text-center py-12">
    <BookOpen className="w-16 h-16 mx-auto mb-4 text-blue-600 dark:text-blue-400" />
    <h2 className="text-2xl font-bold mb-4">Welcome to Education Mode</h2>
    <p className="text-black/70 dark:text-white/70 mb-8 max-w-2xl mx-auto">
      Learn system design through interactive questions, guided explanations, and hands-on practice with real infrastructure patterns.
    </p>
    <div className="flex gap-4 justify-center">
      <button onClick={onStartLearning} className="glass-button glass-button-hover px-6 py-3">
        Start Learning
      </button>
      <button onClick={onViewProgress} className="glass-button glass-button-hover px-6 py-3">
        View Progress
      </button>
      <button onClick={onViewPaths} className="glass-button glass-button-hover px-6 py-3">
        Learning Paths
      </button>
    </div>
  </div>
);

const EducationSettings: React.FC<{
  config: TeachingModeConfig;
  onConfigChange: (config: TeachingModeConfig) => void;
  userProgress: UserProgress | null;
  onProgressUpdate: (progress: UserProgress) => void;
}> = ({ config, onConfigChange }) => (
  <div className="text-center py-12">
    <Settings className="w-16 h-16 mx-auto mb-4 text-gray-600 dark:text-gray-400" />
    <h2 className="text-2xl font-bold mb-4">Education Settings</h2>
    <p className="text-black/70 dark:text-white/70">
      Customize your learning experience (settings panel will be implemented)
    </p>
  </div>
);

export default EducationModeContainer;