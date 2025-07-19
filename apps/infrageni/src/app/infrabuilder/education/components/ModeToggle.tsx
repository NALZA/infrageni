/**
 * Mode Toggle Component
 * Switches between Design Mode and Education Mode
 */

import React from 'react';
import { BookOpen, Wrench, GraduationCap, Settings } from 'lucide-react';

interface ModeToggleProps {
  isEducationMode: boolean;
  onModeChange: (isEducationMode: boolean) => void;
  className?: string;
}

export const ModeToggle: React.FC<ModeToggleProps> = ({
  isEducationMode,
  onModeChange,
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Mode indicator */}
      <div className="flex items-center gap-2 text-sm text-black/70 dark:text-white/70">
        <div className="flex items-center gap-1">
          {isEducationMode ? (
            <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          ) : (
            <Settings className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          )}
          <span className="font-medium">
            {isEducationMode ? 'Education Mode' : 'Design Mode'}
          </span>
        </div>
      </div>

      {/* Toggle switch */}
      <div className="relative">
        <div className="glass-card p-1 flex gap-1">
          {/* Design Mode Button */}
          <button
            onClick={() => onModeChange(false)}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200
              ${!isEducationMode 
                ? 'bg-purple-600 text-white shadow-lg' 
                : 'text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5'
              }
            `}
            title="Switch to Design Mode - Create and edit infrastructure diagrams"
          >
            <Wrench className="w-4 h-4" />
            <span className="font-medium">Design</span>
          </button>

          {/* Education Mode Button */}
          <button
            onClick={() => onModeChange(true)}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200
              ${isEducationMode 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5'
              }
            `}
            title="Switch to Education Mode - Learn system design patterns"
          >
            <BookOpen className="w-4 h-4" />
            <span className="font-medium">Learn</span>
          </button>
        </div>
      </div>

      {/* Mode description */}
      <div className="text-xs text-black/50 dark:text-white/50 max-w-xs">
        {isEducationMode 
          ? 'Practice system design through guided questions and explanations'
          : 'Create and modify infrastructure diagrams with patterns'
        }
      </div>
    </div>
  );
};

export default ModeToggle;