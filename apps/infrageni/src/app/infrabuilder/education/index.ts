/**
 * Education Mode Exports
 * Main exports for the education system
 */

// Types
export * from './types';

// Components
export { ModeToggle } from './components/ModeToggle';
export { EducationModeContainer } from './components/EducationModeContainer';
export { QuestionBrowser } from './components/QuestionBrowser';
export { QuestionViewer } from './components/QuestionViewer';
export { ProgressTracker } from './components/ProgressTracker';
export { LearningPathViewer } from './components/LearningPathViewer';
export { EducationalCanvas } from './components/EducationalCanvas';

// Data
export { 
  questionLibrary,
  urlShortenerQuestion,
  chatApplicationQuestion,
  getQuestionsByDifficulty,
  getQuestionsByCategory,
  getQuestionById,
  getRelatedQuestions,
  searchQuestions
} from './data/questionLibrary';