/**
 * Pattern Card Component
 * Card component for displaying infrastructure patterns in grid/list view
 */

import React from 'react';
import { 
  Star, 
  Download, 
  Eye, 
  Tag,
  Calendar,
  User,
  Layers,
  Shield,
  Zap,
  Database,
  Globe,
  ChevronRight,
  Clock,
  DollarSign
} from 'lucide-react';
import { InfrastructurePattern, PatternComplexity, PatternCategory } from '../core/pattern-types';

export interface PatternCardProps {
  pattern: InfrastructurePattern;
  relevanceScore: number;
  viewMode: 'grid' | 'list';
  onSelect: (pattern: InfrastructurePattern) => void;
  onPreview: (pattern: InfrastructurePattern) => void;
  onImport: (pattern: InfrastructurePattern) => void;
  isSelected?: boolean;
}

const COMPLEXITY_COLORS = {
  simple: 'bg-green-100 text-green-800',
  moderate: 'bg-yellow-100 text-yellow-800', 
  complex: 'bg-orange-100 text-orange-800',
  expert: 'bg-red-100 text-red-800'
};

const CATEGORY_ICONS = {
  'Web Applications': Globe,
  'Microservices': Layers,
  'Data Analytics': Database,
  'Machine Learning': Zap,
  'Security': Shield,
  'Compliance': Shield,
  'Serverless': Zap,
  'Container Orchestration': Layers,
  'Networking': Globe,
  'Storage': Database,
  'Identity and Access Management': Shield,
  'Monitoring and Observability': Eye,
  'CI/CD': Layers,
  'Edge Computing': Globe,
  'IoT': Globe,
  'Blockchain': Shield,
  'Gaming': Zap,
  'Media and Entertainment': Globe,
  'E-commerce': Globe,
  'Financial Services': Shield,
  'Healthcare': Shield,
  'Education': Globe,
  'Government': Shield,
  'Hybrid and Multi-Cloud': Globe
};

const formatLastUpdated = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
};

const formatEstimatedCost = (cost: { min: number; max: number; currency: string }): string => {
  if (cost.min === cost.max) {
    return `${cost.currency}${cost.min}/month`;
  }
  return `${cost.currency}${cost.min}-${cost.max}/month`;
};

export const PatternCard: React.FC<PatternCardProps> = ({
  pattern,
  relevanceScore,
  viewMode,
  onSelect,
  onPreview,
  onImport,
  isSelected = false
}) => {
  const CategoryIcon = CATEGORY_ICONS[pattern.category as keyof typeof CATEGORY_ICONS] || Layers;

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onSelect(pattern);
  };

  const handlePreviewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPreview(pattern);
  };

  const handleImportClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImport(pattern);
  };

  if (viewMode === 'list') {
    return (
      <div 
        className={`bg-white rounded-lg border-2 p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
          isSelected ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-gray-300'
        }`}
        onClick={handleCardClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            {/* Icon and Category */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CategoryIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>

            {/* Pattern Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {pattern.name}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${COMPLEXITY_COLORS[pattern.complexity]}`}>
                  {pattern.complexity}
                </span>
                {pattern.featured && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                    Featured
                  </span>
                )}
              </div>
              
              <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                {pattern.description}
              </p>

              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {pattern.author}
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                  {pattern.rating.toFixed(1)} ({pattern.reviewCount})
                </div>
                <div className="flex items-center">
                  <Download className="h-4 w-4 mr-1" />
                  {pattern.downloadCount.toLocaleString()}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatLastUpdated(pattern.lastUpdated)}
                </div>
                {pattern.estimatedCost && (
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {formatEstimatedCost(pattern.estimatedCost)}
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="flex-shrink-0 max-w-xs">
              <div className="flex flex-wrap gap-1">
                {pattern.tags.slice(0, 3).map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
                {pattern.tags.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">
                    +{pattern.tags.length - 3}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={handlePreviewClick}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Preview Pattern"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={handleImportClick}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Import
            </button>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div 
      className={`bg-white rounded-lg border-2 p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isSelected ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <CategoryIcon className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${COMPLEXITY_COLORS[pattern.complexity]}`}>
                {pattern.complexity}
              </span>
              {pattern.featured && (
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                  Featured
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500">{pattern.category}</div>
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
          {pattern.rating.toFixed(1)}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
        {pattern.name}
      </h3>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {pattern.description}
      </p>

      {/* Components Count */}
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <Layers className="h-4 w-4 mr-1" />
        <span>{pattern.components.length} components</span>
        {pattern.estimatedCost && (
          <>
            <span className="mx-2">•</span>
            <DollarSign className="h-4 w-4 mr-1" />
            <span>{formatEstimatedCost(pattern.estimatedCost)}</span>
          </>
        )}
      </div>

      {/* Tags */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-1">
          {pattern.tags.slice(0, 4).map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
            >
              {tag}
            </span>
          ))}
          {pattern.tags.length > 4 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">
              +{pattern.tags.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-3 text-xs text-gray-500">
          <div className="flex items-center">
            <User className="h-3 w-3 mr-1" />
            {pattern.author}
          </div>
          <div className="flex items-center">
            <Download className="h-3 w-3 mr-1" />
            {pattern.downloadCount.toLocaleString()}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePreviewClick}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Preview Pattern"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={handleImportClick}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Import
          </button>
        </div>
      </div>

      {/* Relevance Score (only show in search results) */}
      {relevanceScore < 1 && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Relevance</span>
            <div className="flex items-center space-x-1">
              <div className="w-16 bg-gray-200 rounded-full h-1">
                <div 
                  className="bg-blue-600 h-1 rounded-full" 
                  style={{ width: `${relevanceScore * 100}%` }}
                />
              </div>
              <span>{Math.round(relevanceScore * 100)}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};