/**
 * Learning Path Viewer Component
 * Display structured learning paths and modules
 */

import React from 'react';
import { Map, BookOpen, Clock, Users } from 'lucide-react';
import { UserProgress, DesignQuestion } from '../types';

interface LearningPathViewerProps {
  userProgress: UserProgress | null;
  onQuestionSelect: (question: DesignQuestion) => void;
  className?: string;
}

export const LearningPathViewer: React.FC<LearningPathViewerProps> = ({
  userProgress,
  onQuestionSelect,
  className = ''
}) => {
  // Placeholder learning paths data
  const learningPaths = [
    {
      id: 'beginner-web-apps',
      name: 'Web Application Fundamentals',
      description: 'Learn the basics of designing web applications with simple, practical examples.',
      difficulty: 'beginner',
      estimatedDuration: 4, // hours
      modules: 3,
      enrolled: 245,
      rating: 4.7,
      progress: 0
    },
    {
      id: 'scalability-patterns',
      name: 'Scalability and Performance',
      description: 'Master the art of building systems that can handle growth and high load.',
      difficulty: 'intermediate',
      estimatedDuration: 8,
      modules: 6,
      enrolled: 89,
      rating: 4.5,
      progress: 0
    },
    {
      id: 'distributed-systems',
      name: 'Distributed Systems Design',
      description: 'Advanced patterns for building robust, distributed systems at scale.',
      difficulty: 'advanced',
      estimatedDuration: 12,
      modules: 8,
      enrolled: 34,
      rating: 4.8,
      progress: 0
    }
  ];

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'advanced': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <h2 className="text-2xl font-bold text-black dark:text-white mb-2">
          Learning Paths
        </h2>
        <p className="text-black/70 dark:text-white/70">
          Structured learning journeys to master system design concepts step by step.
        </p>
      </div>

      {/* Featured Paths */}
      <div className="space-y-4">
        {learningPaths.map(path => (
          <div
            key={path.id}
            className="glass-card glass-card-hover p-6 cursor-pointer transition-all duration-200 hover:scale-[1.02]"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-black dark:text-white">
                    {path.name}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getDifficultyColor(path.difficulty)}`}>
                    {path.difficulty}
                  </span>
                </div>
                <p className="text-black/70 dark:text-white/70 mb-4">
                  {path.description}
                </p>
              </div>
              <Map className="w-6 h-6 text-blue-600 ml-4 flex-shrink-0" />
            </div>

            {/* Path Metadata */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-black/60 dark:text-white/60" />
                <span className="text-sm text-black/70 dark:text-white/70">
                  {path.estimatedDuration}h
                </span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-black/60 dark:text-white/60" />
                <span className="text-sm text-black/70 dark:text-white/70">
                  {path.modules} modules
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-black/60 dark:text-white/60" />
                <span className="text-sm text-black/70 dark:text-white/70">
                  {path.enrolled} enrolled
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-500">⭐</span>
                <span className="text-sm text-black/70 dark:text-white/70">
                  {path.rating}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-black dark:text-white">
                  Progress
                </span>
                <span className="text-sm text-black/70 dark:text-white/70">
                  {path.progress}%
                </span>
              </div>
              <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${path.progress}%` }}
                />
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-between items-center">
              <div className="text-sm text-black/60 dark:text-white/60">
                {path.progress === 0 ? 'Not started' : 'In progress'}
              </div>
              <button className="glass-button glass-button-hover px-4 py-2 text-sm">
                {path.progress === 0 ? 'Start Path' : 'Continue'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Coming Soon */}
      <div className="glass-card p-6 text-center">
        <Map className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-black dark:text-white mb-2">
          More Paths Coming Soon
        </h3>
        <p className="text-black/70 dark:text-white/70 mb-4">
          We're working on additional learning paths covering microservices, security patterns, 
          and cloud-native architectures.
        </p>
        <button className="glass-button glass-button-hover px-4 py-2 text-sm">
          Request a Topic
        </button>
      </div>
    </div>
  );
};