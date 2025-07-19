/**
 * Educational Canvas Component
 * Enhanced tldraw canvas with educational annotations and highlights
 */

import React from 'react';
import { InfrastructurePattern } from '../../patterns/core/pattern-types';
import { DiagramAnnotation, TeachingModeConfig } from '../types';

interface EducationalCanvasProps {
  pattern: InfrastructurePattern;
  annotations: DiagramAnnotation[];
  highlightedComponents: string[];
  teachingConfig: TeachingModeConfig;
  className?: string;
}

export const EducationalCanvas: React.FC<EducationalCanvasProps> = ({
  pattern,
  annotations,
  highlightedComponents,
  teachingConfig,
  className = ''
}) => {
  return (
    <div className={`relative w-full h-full bg-white dark:bg-gray-900 rounded-lg ${className}`}>
      {/* Placeholder for tldraw integration */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-black dark:text-white mb-2">
            Interactive Diagram
          </h3>
          <p className="text-sm text-black/70 dark:text-white/70 mb-4">
            {pattern.name} - {pattern.description}
          </p>
          
          {/* Component Preview */}
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {pattern.components.slice(0, 4).map(component => (
              <div
                key={component.instanceId}
                className={`
                  p-3 rounded-lg border-2 transition-all duration-200
                  ${highlightedComponents.includes(component.instanceId)
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                  }
                `}
              >
                <div className="text-sm font-medium text-black dark:text-white">
                  {component.displayName}
                </div>
                <div className="text-xs text-black/60 dark:text-white/60">
                  {component.componentId}
                </div>
              </div>
            ))}
          </div>

          {/* Annotations Preview */}
          {annotations.length > 0 && (
            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                Active Annotations ({annotations.length})
              </h4>
              <div className="space-y-2">
                {annotations.slice(0, 2).map(annotation => (
                  <div key={annotation.id} className="text-xs text-yellow-700 dark:text-yellow-300">
                    <span className="font-medium">{annotation.title}:</span> {annotation.content}
                  </div>
                ))}
                {annotations.length > 2 && (
                  <div className="text-xs text-yellow-600 dark:text-yellow-400">
                    +{annotations.length - 2} more annotations
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="mt-4 text-xs text-black/50 dark:text-white/50">
            Full tldraw integration will be implemented with canvas annotations
          </div>
        </div>
      </div>
    </div>
  );
};