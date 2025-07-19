/**
 * Progress Tracker Component
 * Track learning progress and analytics
 */

import React from 'react';
import { TrendingUp, Award, Calendar, Target } from 'lucide-react';
import { UserProgress, LearningSession } from '../types';

interface ProgressTrackerProps {
  userProgress: UserProgress | null;
  currentSession: LearningSession | null;
  className?: string;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  userProgress,
  currentSession,
  className = ''
}) => {
  if (!userProgress) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h2 className="text-2xl font-bold mb-4">Progress Tracking</h2>
        <p className="text-black/70 dark:text-white/70">
          Complete some questions to see your learning progress!
        </p>
      </div>
    );
  }

  const completedCount = userProgress.completedQuestions.length;
  const currentStreak = userProgress.currentStreak;
  const totalTimeSpent = userProgress.completedQuestions.reduce(
    (sum, q) => sum + q.timeSpent, 0
  );

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <h2 className="text-2xl font-bold text-black dark:text-white mb-2">
          Learning Progress
        </h2>
        <p className="text-black/70 dark:text-white/70">
          Track your system design learning journey and achievements.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 text-center">
          <Target className="w-8 h-8 mx-auto mb-2 text-blue-600" />
          <div className="text-2xl font-bold text-black dark:text-white">
            {completedCount}
          </div>
          <div className="text-sm text-black/70 dark:text-white/70">
            Questions Completed
          </div>
        </div>

        <div className="glass-card p-4 text-center">
          <Calendar className="w-8 h-8 mx-auto mb-2 text-green-600" />
          <div className="text-2xl font-bold text-black dark:text-white">
            {currentStreak}
          </div>
          <div className="text-sm text-black/70 dark:text-white/70">
            Day Streak
          </div>
        </div>

        <div className="glass-card p-4 text-center">
          <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-600" />
          <div className="text-2xl font-bold text-black dark:text-white">
            {totalTimeSpent}m
          </div>
          <div className="text-sm text-black/70 dark:text-white/70">
            Total Study Time
          </div>
        </div>

        <div className="glass-card p-4 text-center">
          <Award className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
          <div className="text-2xl font-bold text-black dark:text-white">
            {userProgress.achievements.length}
          </div>
          <div className="text-sm text-black/70 dark:text-white/70">
            Achievements
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
          Recent Activity
        </h3>
        
        {completedCount === 0 ? (
          <div className="text-center py-8">
            <p className="text-black/70 dark:text-white/70">
              No completed questions yet. Start learning to see your progress!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {userProgress.completedQuestions.slice(-5).reverse().map((completion) => (
              <div
                key={completion.questionId}
                className="flex items-center justify-between p-3 bg-black/5 dark:bg-white/5 rounded-lg"
              >
                <div>
                  <div className="font-medium text-black dark:text-white">
                    Question: {completion.questionId}
                  </div>
                  <div className="text-sm text-black/70 dark:text-white/70">
                    Completed on {new Date(completion.completedAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-black dark:text-white">
                    {completion.timeSpent}m
                  </div>
                  {completion.rating && (
                    <div className="text-sm text-black/70 dark:text-white/70">
                      ⭐ {completion.rating}/5
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Skill Levels */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
          Skill Development
        </h3>
        
        {Object.keys(userProgress.skillLevels).length === 0 ? (
          <div className="text-center py-8">
            <p className="text-black/70 dark:text-white/70">
              Complete questions in different categories to track your skill development.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(userProgress.skillLevels).map(([category, skill]) => (
              <div key={category}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-black dark:text-white capitalize">
                    {category.replace(/-/g, ' ')}
                  </span>
                  <span className="text-sm text-black/70 dark:text-white/70 capitalize">
                    {skill.level}
                  </span>
                </div>
                <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${skill.experience}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Current Session */}
      {currentSession && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Current Session
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-black/70 dark:text-white/70">Mode</div>
              <div className="font-medium text-black dark:text-white capitalize">
                {currentSession.mode}
              </div>
            </div>
            <div>
              <div className="text-sm text-black/70 dark:text-white/70">Started</div>
              <div className="font-medium text-black dark:text-white">
                {new Date(currentSession.startedAt).toLocaleTimeString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-black/70 dark:text-white/70">Questions</div>
              <div className="font-medium text-black dark:text-white">
                {currentSession.questions.length}
              </div>
            </div>
            <div>
              <div className="text-sm text-black/70 dark:text-white/70">Target Difficulty</div>
              <div className="font-medium text-black dark:text-white capitalize">
                {currentSession.targetDifficulty}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};