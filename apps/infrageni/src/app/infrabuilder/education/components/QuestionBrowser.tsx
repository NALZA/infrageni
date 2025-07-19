/**
 * Question Browser Component
 * Browse and filter available design questions
 */

import React, { useState, useMemo } from 'react';
import { Search, Filter, Clock, Users, Star, BookOpen, ChevronRight } from 'lucide-react';
import { DesignQuestion, DifficultyLevel, QuestionCategory, UserProgress, QuestionFilter } from '../types';
import { questionLibrary, getQuestionsByDifficulty, getQuestionsByCategory } from '../data/questionLibrary';

interface QuestionBrowserProps {
  onQuestionSelect: (question: DesignQuestion) => void;
  userProgress: UserProgress | null;
  className?: string;
}

export const QuestionBrowser: React.FC<QuestionBrowserProps> = ({
  onQuestionSelect,
  userProgress,
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<QuestionFilter>({
    categories: [],
    difficulties: [],
    objectives: [],
    tags: [],
    completed: undefined
  });

  // Filter questions based on search and filters
  const filteredQuestions = useMemo(() => {
    let results = questionLibrary;

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(q => 
        q.title.toLowerCase().includes(query) ||
        q.description.toLowerCase().includes(query) ||
        q.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (filters.categories.length > 0) {
      results = results.filter(q => filters.categories.includes(q.category));
    }

    // Apply difficulty filter
    if (filters.difficulties.length > 0) {
      results = results.filter(q => filters.difficulties.includes(q.difficulty));
    }

    // Apply completion filter
    if (filters.completed !== undefined) {
      const completedIds = userProgress?.completedQuestions.map(cq => cq.questionId) || [];
      results = results.filter(q => 
        filters.completed ? completedIds.includes(q.id) : !completedIds.includes(q.id)
      );
    }

    // Apply time range filter
    if (filters.timeRange) {
      results = results.filter(q => 
        q.estimatedTime >= filters.timeRange!.min && 
        q.estimatedTime <= filters.timeRange!.max
      );
    }

    return results;
  }, [searchQuery, filters, userProgress]);

  const isQuestionCompleted = (questionId: string): boolean => {
    return userProgress?.completedQuestions.some(cq => cq.questionId === questionId) || false;
  };

  const getCompletionInfo = (questionId: string) => {
    return userProgress?.completedQuestions.find(cq => cq.questionId === questionId);
  };

  const getDifficultyColor = (difficulty: DifficultyLevel): string => {
    switch (difficulty) {
      case DifficultyLevel.BEGINNER: return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case DifficultyLevel.INTERMEDIATE: return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case DifficultyLevel.ADVANCED: return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getCategoryColor = (category: QuestionCategory): string => {
    const colors = {
      [QuestionCategory.WEB_ARCHITECTURE]: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
      [QuestionCategory.MICROSERVICES]: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30',
      [QuestionCategory.DATA_STORAGE]: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30',
      [QuestionCategory.CACHING]: 'text-cyan-600 bg-cyan-100 dark:bg-cyan-900/30',
      [QuestionCategory.LOAD_BALANCING]: 'text-teal-600 bg-teal-100 dark:bg-teal-900/30',
      [QuestionCategory.SCALABILITY]: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30',
      [QuestionCategory.SECURITY]: 'text-red-600 bg-red-100 dark:bg-red-900/30',
      [QuestionCategory.MESSAGING]: 'text-pink-600 bg-pink-100 dark:bg-pink-900/30',
      [QuestionCategory.REAL_TIME]: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30',
      [QuestionCategory.CONTENT_DELIVERY]: 'text-violet-600 bg-violet-100 dark:bg-violet-900/30'
    };
    return colors[category] || 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
  };

  const formatCategory = (category: QuestionCategory): string => {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      difficulties: [],
      objectives: [],
      tags: [],
      completed: undefined
    });
    setSearchQuery('');
  };

  const hasActiveFilters = searchQuery.trim() || 
    filters.categories.length > 0 || 
    filters.difficulties.length > 0 || 
    filters.completed !== undefined ||
    filters.timeRange;

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black dark:text-white mb-2">
          Practice Questions
        </h2>
        <p className="text-black/70 dark:text-white/70">
          Choose a system design question to practice. Each question includes step-by-step guidance and pattern explanations.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/40 dark:text-white/40 w-4 h-4" />
          <input
            type="text"
            placeholder="Search questions by title, description, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 glass-card border-0 text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
              ${showFilters 
                ? 'bg-blue-600 text-white' 
                : 'glass-button glass-button-hover'
              }
            `}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Clear all filters
            </button>
          )}

          <div className="text-sm text-black/70 dark:text-white/70">
            {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''} found
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="glass-card p-4 space-y-4">
            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Difficulty Level
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.values(DifficultyLevel).map(difficulty => (
                  <button
                    key={difficulty}
                    onClick={() => {
                      const newDifficulties = filters.difficulties.includes(difficulty)
                        ? filters.difficulties.filter(d => d !== difficulty)
                        : [...filters.difficulties, difficulty];
                      setFilters({ ...filters, difficulties: newDifficulties });
                    }}
                    className={`
                      px-3 py-1 rounded-full text-sm transition-all duration-200 capitalize
                      ${filters.difficulties.includes(difficulty)
                        ? getDifficultyColor(difficulty) + ' ring-2 ring-offset-2 ring-current'
                        : 'glass-button glass-button-hover'
                      }
                    `}
                  >
                    {difficulty}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Categories
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(QuestionCategory).map(category => (
                  <button
                    key={category}
                    onClick={() => {
                      const newCategories = filters.categories.includes(category)
                        ? filters.categories.filter(c => c !== category)
                        : [...filters.categories, category];
                      setFilters({ ...filters, categories: newCategories });
                    }}
                    className={`
                      px-3 py-2 rounded-lg text-sm text-left transition-all duration-200
                      ${filters.categories.includes(category)
                        ? getCategoryColor(category) + ' ring-2 ring-offset-2 ring-current'
                        : 'glass-button glass-button-hover'
                      }
                    `}
                  >
                    {formatCategory(category)}
                  </button>
                ))}
              </div>
            </div>

            {/* Completion Status Filter */}
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Completion Status
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilters({ ...filters, completed: false })}
                  className={`
                    px-3 py-1 rounded-full text-sm transition-all duration-200
                    ${filters.completed === false
                      ? 'bg-blue-600 text-white ring-2 ring-offset-2 ring-blue-600'
                      : 'glass-button glass-button-hover'
                    }
                  `}
                >
                  Not Completed
                </button>
                <button
                  onClick={() => setFilters({ ...filters, completed: true })}
                  className={`
                    px-3 py-1 rounded-full text-sm transition-all duration-200
                    ${filters.completed === true
                      ? 'bg-green-600 text-white ring-2 ring-offset-2 ring-green-600'
                      : 'glass-button glass-button-hover'
                    }
                  `}
                >
                  Completed
                </button>
                <button
                  onClick={() => setFilters({ ...filters, completed: undefined })}
                  className={`
                    px-3 py-1 rounded-full text-sm transition-all duration-200
                    ${filters.completed === undefined
                      ? 'bg-gray-600 text-white ring-2 ring-offset-2 ring-gray-600'
                      : 'glass-button glass-button-hover'
                    }
                  `}
                >
                  All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Questions List */}
      <div className="flex-1 space-y-4 overflow-y-auto">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-black dark:text-white mb-2">
              No questions found
            </h3>
            <p className="text-black/70 dark:text-white/70 mb-4">
              Try adjusting your search terms or filters.
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="glass-button glass-button-hover px-4 py-2"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          filteredQuestions.map(question => {
            const completed = isQuestionCompleted(question.id);
            const completionInfo = getCompletionInfo(question.id);
            
            return (
              <div
                key={question.id}
                className="glass-card glass-card-hover p-6 cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                onClick={() => onQuestionSelect(question)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-black dark:text-white">
                        {question.title}
                      </h3>
                      {completed && (
                        <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-xs font-medium">Completed</span>
                        </div>
                      )}
                    </div>
                    <p className="text-black/70 dark:text-white/70 mb-4">
                      {question.description}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-black/40 dark:text-white/40 ml-4 flex-shrink-0" />
                </div>

                {/* Question Metadata */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                    {question.difficulty}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(question.category)}`}>
                    {formatCategory(question.category)}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-black/60 dark:text-white/60">
                    <Clock className="w-3 h-3" />
                    {question.estimatedTime} min
                  </div>
                  {question.completionCount && (
                    <div className="flex items-center gap-1 text-xs text-black/60 dark:text-white/60">
                      <Users className="w-3 h-3" />
                      {question.completionCount} completed
                    </div>
                  )}
                  {question.rating && (
                    <div className="flex items-center gap-1 text-xs text-black/60 dark:text-white/60">
                      <Star className="w-3 h-3" />
                      {question.rating.toFixed(1)}
                    </div>
                  )}
                </div>

                {/* Learning Objectives */}
                <div className="mb-4">
                  <div className="text-xs font-medium text-black/70 dark:text-white/70 mb-2">
                    Learning Objectives:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {question.learningObjectives.slice(0, 3).map(objective => (
                      <span
                        key={objective}
                        className="px-2 py-1 bg-black/5 dark:bg-white/5 rounded text-xs text-black/60 dark:text-white/60"
                      >
                        {objective.replace(/-/g, ' ')}
                      </span>
                    ))}
                    {question.learningObjectives.length > 3 && (
                      <span className="px-2 py-1 bg-black/5 dark:bg-white/5 rounded text-xs text-black/60 dark:text-white/60">
                        +{question.learningObjectives.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Completion Info */}
                {completed && completionInfo && (
                  <div className="border-t border-black/10 dark:border-white/10 pt-3 mt-3">
                    <div className="flex items-center justify-between text-xs text-black/60 dark:text-white/60">
                      <span>
                        Completed on {new Date(completionInfo.completedAt).toLocaleDateString()}
                      </span>
                      <div className="flex items-center gap-3">
                        <span>Time: {completionInfo.timeSpent}m</span>
                        {completionInfo.rating && (
                          <span>Rating: {completionInfo.rating}/5</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default QuestionBrowser;