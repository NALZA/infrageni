/**
 * Pattern Toolbar Component
 * Quick access toolbar for pattern operations in the canvas
 */

import React, { useState, useRef } from 'react';
import { 
  Layers, 
  Search, 
  Star, 
  Download, 
  Eye,
  Plus,
  Grid,
  Filter,
  Bookmark,
  Clock,
  TrendingUp,
  ChevronDown,
  X
} from 'lucide-react';
import { InfrastructurePattern, PatternCategory } from '../patterns/core/pattern-types';
import { PatternRegistry } from '../patterns/core/pattern-registry';
import { usePatternDeployment } from '../hooks/usePatternDeployment';

export interface PatternToolbarProps {
  onPatternSelect?: (pattern: InfrastructurePattern) => void;
  onPatternPreview?: (pattern: InfrastructurePattern) => void;
  position?: { x: number; y: number };
  className?: string;
}

interface QuickPattern {
  id: string;
  name: string;
  category: PatternCategory;
  icon: string;
  description: string;
  complexity: 'simple' | 'moderate' | 'complex' | 'expert';
  rating: number;
  downloadCount: number;
}

export const PatternToolbar: React.FC<PatternToolbarProps> = ({
  onPatternSelect,
  onPatternPreview,
  position,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PatternCategory | 'all'>('all');
  const [quickPatterns, setQuickPatterns] = useState<QuickPattern[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const { deployPattern, deploymentStatus } = usePatternDeployment({
    defaultPosition: position || { x: 100, y: 100 },
    onDeploymentSuccess: (pattern) => {
      console.log('Pattern deployed successfully:', pattern.name);
      onPatternSelect?.(pattern);
    },
    onDeploymentError: (pattern, error) => {
      console.error('Pattern deployment failed:', error);
    }
  });

  // Load quick patterns
  React.useEffect(() => {
    const loadQuickPatterns = async () => {
      try {
        const registry = PatternRegistry.getInstance();
        const allPatterns = registry.getAllPatterns();
        
        // Get popular and recent patterns
        const popular = allPatterns
          .filter(p => p.downloadCount > 100)
          .sort((a, b) => b.downloadCount - a.downloadCount)
          .slice(0, 3);
          
        const recent = allPatterns
          .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
          .slice(0, 3);
          
        const featured = allPatterns.filter(p => p.featured).slice(0, 2);
        
        const combined = [...featured, ...popular, ...recent]
          .filter((pattern, index, self) => 
            index === self.findIndex(p => p.id === pattern.id)
          )
          .slice(0, 8);

        setQuickPatterns(combined.map(pattern => ({
          id: pattern.id,
          name: pattern.name,
          category: pattern.category,
          icon: getCategoryIcon(pattern.category),
          description: pattern.description,
          complexity: pattern.complexity,
          rating: pattern.rating,
          downloadCount: pattern.downloadCount
        })));
      } catch (error) {
        console.error('Failed to load quick patterns:', error);
      }
    };

    loadQuickPatterns();
  }, []);

  // Focus search input when search is shown
  React.useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  const getCategoryIcon = (category: PatternCategory): string => {
    const icons: Record<PatternCategory, string> = {
      'Web Applications': '🌐',
      'Microservices': '🔧',
      'Data Analytics': '📊',
      'Machine Learning': '🧠',
      'Security': '🔒',
      'Compliance': '📋',
      'Serverless': '⚡',
      'Container Orchestration': '📦',
      'Networking': '🌐',
      'Storage': '💾',
      'Identity and Access Management': '👤',
      'Monitoring and Observability': '📈',
      'CI/CD': '🔄',
      'Edge Computing': '🏔️',
      'IoT': '📡',
      'Blockchain': '⛓️',
      'Gaming': '🎮',
      'Media and Entertainment': '🎬',
      'E-commerce': '🛒',
      'Financial Services': '💰',
      'Healthcare': '🏥',
      'Education': '🎓',
      'Government': '🏛️',
      'Hybrid and Multi-Cloud': '☁️'
    };
    return icons[category] || '📄';
  };

  const handlePatternClick = async (pattern: QuickPattern) => {
    try {
      const registry = PatternRegistry.getInstance();
      const fullPattern = registry.getPattern(pattern.id);
      
      if (fullPattern) {
        await deployPattern(fullPattern);
      }
    } catch (error) {
      console.error('Failed to deploy pattern:', error);
    }
  };

  const handlePreviewClick = (pattern: QuickPattern, e: React.MouseEvent) => {
    e.stopPropagation();
    const registry = PatternRegistry.getInstance();
    const fullPattern = registry.getPattern(pattern.id);
    
    if (fullPattern) {
      onPatternPreview?.(fullPattern);
    }
  };

  const filteredPatterns = React.useMemo(() => {
    let filtered = quickPatterns;

    if (searchQuery) {
      filtered = filtered.filter(pattern =>
        pattern.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pattern.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(pattern => pattern.category === selectedCategory);
    }

    return filtered;
  }, [quickPatterns, searchQuery, selectedCategory]);

  const toolbarStyle = position ? {
    position: 'absolute' as const,
    top: position.y,
    left: position.x,
    zIndex: 1000
  } : {};

  return (
    <div 
      className={`pattern-toolbar bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg ${className}`}
      style={toolbarStyle}
    >
      {/* Collapsed state */}
      {!isExpanded && (
        <div className="flex items-center p-2">
          <button
            onClick={() => setIsExpanded(true)}
            className="flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="Quick Pattern Access"
          >
            <Layers className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium">Patterns</span>
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Expanded state */}
      {isExpanded && (
        <div className="w-80 max-h-96 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Layers className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Quick Patterns</h3>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  showSearch ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                }`}
                title="Search patterns"
              >
                <Search className="h-4 w-4" />
              </button>
              
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Search */}
          {showSearch && (
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patterns..."
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Category filter */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as PatternCategory | 'all')}
              className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Categories</option>
              <option value="Web Applications">Web Applications</option>
              <option value="Microservices">Microservices</option>
              <option value="Data Analytics">Data Analytics</option>
              <option value="Machine Learning">Machine Learning</option>
              <option value="Security">Security</option>
              <option value="Serverless">Serverless</option>
            </select>
          </div>

          {/* Pattern list */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {deploymentStatus.isDeploying && (
              <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm text-blue-700 dark:text-blue-300">
                    {deploymentStatus.currentStep}
                  </span>
                </div>
                <div className="mt-2 w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${deploymentStatus.progress}%` }}
                  />
                </div>
              </div>
            )}

            {filteredPatterns.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Layers className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No patterns found</p>
                {searchQuery && (
                  <p className="text-xs mt-1">Try adjusting your search</p>
                )}
              </div>
            ) : (
              filteredPatterns.map(pattern => (
                <div
                  key={pattern.id}
                  className="group p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 cursor-pointer transition-all duration-200 hover:shadow-md"
                  onClick={() => handlePatternClick(pattern)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="text-lg">{pattern.icon}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {pattern.name}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                          {pattern.description}
                        </p>
                        <div className="flex items-center space-x-3 mt-2">
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {pattern.rating.toFixed(1)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Download className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {pattern.downloadCount.toLocaleString()}
                            </span>
                          </div>
                          <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                            pattern.complexity === 'simple' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                            pattern.complexity === 'moderate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                            pattern.complexity === 'complex' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                          }`}>
                            {pattern.complexity}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handlePreviewClick(pattern, e)}
                      className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Preview pattern"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Click to deploy • Right-click for options
            </div>
          </div>
        </div>
      )}
    </div>
  );
};