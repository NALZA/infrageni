/**
 * Education Mode Types and Interfaces
 * System design learning and teaching functionality
 */

import { InfrastructurePattern } from '../patterns/core/pattern-types';

// Learning difficulty levels
export enum DifficultyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate', 
  ADVANCED = 'advanced'
}

// Question categories for organization
export enum QuestionCategory {
  WEB_ARCHITECTURE = 'web-architecture',
  MICROSERVICES = 'microservices',
  DATA_STORAGE = 'data-storage',
  CACHING = 'caching',
  LOAD_BALANCING = 'load-balancing',
  SCALABILITY = 'scalability',
  SECURITY = 'security',
  MESSAGING = 'messaging',
  REAL_TIME = 'real-time',
  CONTENT_DELIVERY = 'content-delivery'
}

// Learning objectives for structured education
export enum LearningObjective {
  UNDERSTAND_CONCEPTS = 'understand-concepts',
  APPLY_PATTERNS = 'apply-patterns',
  ANALYZE_TRADEOFFS = 'analyze-tradeoffs',
  DESIGN_SYSTEMS = 'design-systems',
  OPTIMIZE_PERFORMANCE = 'optimize-performance',
  ENSURE_SECURITY = 'ensure-security'
}

// Step-by-step explanation for teaching
export interface TeachingStep {
  id: string;
  title: string;
  description: string;
  explanation: string;
  visualHighlights?: string[]; // Component IDs to highlight
  codeExample?: string;
  keyPoints: string[];
  commonMistakes?: string[];
  nextSteps?: string[];
}

// Pattern explanation for educational context
export interface PatternExplanation {
  patternName: string;
  when: string; // When to use this pattern
  why: string; // Why this pattern is beneficial
  how: string; // How to implement this pattern
  tradeoffs: {
    pros: string[];
    cons: string[];
  };
  alternatives: string[];
  realWorldExamples: string[];
  scalingConsiderations: string[];
}

// Interactive annotation for diagram elements
export interface DiagramAnnotation {
  id: string;
  componentId: string;
  position: { x: number; y: number };
  type: 'tooltip' | 'callout' | 'highlight' | 'explanation';
  title: string;
  content: string;
  importance: 'high' | 'medium' | 'low';
  relatedConcepts: string[];
}

// Design question with learning context
export interface DesignQuestion {
  id: string;
  title: string;
  description: string;
  
  // Classification
  category: QuestionCategory;
  difficulty: DifficultyLevel;
  estimatedTime: number; // minutes
  learningObjectives: LearningObjective[];
  
  // Problem context
  requirements: string[];
  constraints: string[];
  assumptions: string[];
  scaleRequirements?: {
    users?: string;
    requests?: string;
    data?: string;
    availability?: string;
  };
  
  // Solution and teaching
  solution: {
    pattern: InfrastructurePattern;
    teachingSteps: TeachingStep[];
    annotations: DiagramAnnotation[];
    patternExplanations: PatternExplanation[];
  };
  
  // Educational content
  hints: {
    level: 'subtle' | 'moderate' | 'explicit';
    content: string;
    triggeredAfter?: number; // seconds
  }[];
  
  commonPitfalls: string[];
  extensionChallenges?: string[];
  relatedQuestions: string[];
  
  // Metadata
  tags: string[];
  author: string;
  createdAt: string;
  updatedAt: string;
  rating?: number;
  completionCount?: number;
}

// User progress tracking
export interface UserProgress {
  userId: string;
  
  // Question completion
  completedQuestions: {
    questionId: string;
    completedAt: string;
    timeSpent: number; // minutes
    hintsUsed: number;
    rating?: number;
    notes?: string;
  }[];
  
  // Skill development
  skillLevels: {
    [category in QuestionCategory]?: {
      level: DifficultyLevel;
      experience: number; // 0-100
      lastPracticed: string;
    };
  };
  
  // Learning objectives progress
  objectiveProgress: {
    [objective in LearningObjective]?: {
      completed: number;
      total: number;
      mastery: number; // 0-100
    };
  };
  
  // Streaks and achievements
  currentStreak: number; // consecutive days
  longestStreak: number;
  achievements: string[];
  
  // Preferences
  preferences: {
    difficultyPreference: DifficultyLevel;
    categoryPreferences: QuestionCategory[];
    studyReminders: boolean;
    showHints: boolean;
    autoAdvanceDifficulty: boolean;
  };
}

// Learning session for structured study
export interface LearningSession {
  id: string;
  userId: string;
  startedAt: string;
  endedAt?: string;
  
  // Session configuration
  mode: 'guided' | 'practice' | 'challenge' | 'review';
  targetDifficulty: DifficultyLevel;
  targetCategories: QuestionCategory[];
  timeLimit?: number; // minutes
  
  // Session progress
  questions: {
    questionId: string;
    startedAt: string;
    completedAt?: string;
    hintsUsed: string[];
    userSolution?: any; // User's attempt
    feedback?: string;
  }[];
  
  // Session results
  summary?: {
    questionsCompleted: number;
    totalQuestions: number;
    timeSpent: number;
    averageRating: number;
    skillsImproved: QuestionCategory[];
    nextRecommendations: string[];
  };
}

// Learning path for guided education
export interface LearningPath {
  id: string;
  name: string;
  description: string;
  
  // Path structure
  difficulty: DifficultyLevel;
  estimatedDuration: number; // hours
  prerequisites: string[];
  
  // Learning modules
  modules: LearningModule[];
  
  // Progress tracking
  enrolledUsers: number;
  completionRate: number;
  averageRating: number;
  
  // Metadata
  tags: string[];
  author: string;
  organization?: string;
  createdAt: string;
  updatedAt: string;
}

// Learning module within a path
export interface LearningModule {
  id: string;
  name: string;
  description: string;
  
  // Module content
  learningObjectives: LearningObjective[];
  questions: string[]; // Question IDs
  readings?: ReadingResource[];
  exercises?: Exercise[];
  
  // Module structure
  order: number;
  isRequired: boolean;
  estimatedTime: number; // minutes
  
  // Prerequisites and dependencies
  prerequisites: string[]; // Module IDs
  unlocks: string[]; // Module IDs
}

// Additional learning resources
export interface ReadingResource {
  id: string;
  title: string;
  type: 'article' | 'documentation' | 'video' | 'tutorial';
  url: string;
  description: string;
  estimatedTime: number; // minutes
  difficulty: DifficultyLevel;
  tags: string[];
}

// Practice exercise
export interface Exercise {
  id: string;
  title: string;
  description: string;
  type: 'diagram' | 'calculation' | 'analysis' | 'comparison';
  instructions: string[];
  solution: string;
  hints: string[];
  difficulty: DifficultyLevel;
}

// Teaching mode configuration
export interface TeachingModeConfig {
  // Display settings
  showAnnotations: boolean;
  showStepByStep: boolean;
  autoAdvanceSteps: boolean;
  stepDelay: number; // milliseconds
  
  // Interaction settings
  allowSkipSteps: boolean;
  requireConfirmation: boolean;
  showHints: boolean;
  hintDelay: number; // seconds
  
  // Visual settings
  highlightIntensity: 'subtle' | 'moderate' | 'strong';
  animationSpeed: 'slow' | 'normal' | 'fast';
  colorScheme: 'default' | 'colorblind' | 'high-contrast';
  
  // Content settings
  explanationLevel: 'basic' | 'detailed' | 'expert';
  showCodeExamples: boolean;
  showRealWorldExamples: boolean;
  includeTroubleshooting: boolean;
}

// Education mode state management
export interface EducationModeState {
  // Current mode
  isEducationMode: boolean;
  currentQuestion?: DesignQuestion;
  currentSession?: LearningSession;
  currentStep?: number;
  
  // UI state
  showSolution: boolean;
  showHints: boolean;
  showAnnotations: boolean;
  teachingConfig: TeachingModeConfig;
  
  // Progress state
  userProgress: UserProgress;
  sessionProgress: {
    questionsCompleted: number;
    currentQuestionIndex: number;
    timeSpent: number;
    hintsUsed: number;
  };
  
  // Content state
  availableQuestions: DesignQuestion[];
  learningPaths: LearningPath[];
  filteredQuestions: DesignQuestion[];
  
  // Navigation state
  questionHistory: string[];
  canGoBack: boolean;
  canGoForward: boolean;
}

// Question filtering and search
export interface QuestionFilter {
  categories: QuestionCategory[];
  difficulties: DifficultyLevel[];
  objectives: LearningObjective[];
  tags: string[];
  timeRange?: {
    min: number; // minutes
    max: number; // minutes
  };
  completed?: boolean;
  rating?: {
    min: number;
    max: number;
  };
}

// Analytics and insights
export interface LearningAnalytics {
  userId: string;
  
  // Performance metrics
  overallProgress: number; // 0-100
  strengthAreas: QuestionCategory[];
  improvementAreas: QuestionCategory[];
  
  // Time analytics
  totalTimeSpent: number; // minutes
  averageSessionTime: number; // minutes
  studyFrequency: number; // sessions per week
  
  // Accuracy metrics
  averageRating: number;
  hintsUsageRate: number;
  completionRate: number;
  
  // Learning insights
  learningVelocity: number; // questions per hour
  retentionRate: number; // 0-100
  masteryTrend: 'improving' | 'stable' | 'declining';
  
  // Recommendations
  nextRecommendedQuestions: string[];
  suggestedLearningPaths: string[];
  skillGapAnalysis: {
    category: QuestionCategory;
    currentLevel: DifficultyLevel;
    targetLevel: DifficultyLevel;
    recommendedActions: string[];
  }[];
}