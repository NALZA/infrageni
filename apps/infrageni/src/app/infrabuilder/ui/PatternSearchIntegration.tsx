/**
 * Pattern Search Integration Component
 * Advanced search functionality integrated into the component library
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  Star, 
  Download, 
  Eye,
  Clock,
  Tag,
  ChevronDown,
  ChevronRight,
  Layers,
  Zap,
  TrendingUp
} from 'lucide-react';
import { 
  InfrastructurePattern, 
  PatternCategory, 
  PatternComplexity,
  PatternSearchFilters,
  PatternSearchResult
} from '../patterns/core/pattern-types';
import { PatternRegistry } from '../patterns/core/pattern-registry';

export interface PatternSearchIntegrationProps {
  isVisible: boolean;
  onPatternSelect: (pattern: InfrastructurePattern) => void;
  onPatternPreview: (pattern: InfrastructurePattern) => void;
  onPatternDeploy: (pattern: InfrastructurePattern) => void;
  onClose: () => void;
  searchQuery?: string;
  maxResults?: number;
}

interface SearchState {
  query: string;
  filters: PatternSearchFilters;
  results: PatternSearchResult[];
  loading: boolean;
  selectedIndex: number;
  showAdvanced: boolean;
}

export const PatternSearchIntegration: React.FC<PatternSearchIntegrationProps> = ({
  isVisible,
  onPatternSelect,
  onPatternPreview,
  onPatternDeploy,
  onClose,
  searchQuery = '',
  maxResults = 10
}) => {
  const [searchState, setSearchState] = useState<SearchState>({
    query: searchQuery,
    filters: {},
    results: [],
    loading: false,
    selectedIndex: -1,
    showAdvanced: false
  });

  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const patternRegistry = useMemo(() => PatternRegistry.getInstance(), []);

  // Focus search input when visible
  useEffect(() => {
    if (isVisible && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isVisible]);

  // Perform search when query or filters change
  useEffect(() => {
    if (searchState.query.length >= 2 || Object.keys(searchState.filters).length > 0) {
      performSearch();
    } else {
      setSearchState(prev => ({ ...prev, results: [], selectedIndex: -1 }));
    }
  }, [searchState.query, searchState.filters]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isVisible) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSearchState(prev => ({
            ...prev,
            selectedIndex: Math.min(prev.selectedIndex + 1, prev.results.length - 1)
          }));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSearchState(prev => ({
            ...prev,
            selectedIndex: Math.max(prev.selectedIndex - 1, -1)
          }));
          break;
        case 'Enter':
          e.preventDefault();
          if (searchState.selectedIndex >= 0 && searchState.results[searchState.selectedIndex]) {
            handlePatternSelect(searchState.results[searchState.selectedIndex].pattern);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, searchState.selectedIndex, searchState.results, onClose]);

  // Scroll selected item into view
  useEffect(() => {
    if (searchState.selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.children[searchState.selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [searchState.selectedIndex]);

  const performSearch = async () => {
    try {
      setSearchState(prev => ({ ...prev, loading: true }));

      const searchFilters: PatternSearchFilters = {
        ...searchState.filters,
        freeText: searchState.query || undefined
      };

      const results = patternRegistry.searchPatterns(searchFilters);
      
      // Limit results
      const limitedResults = results.slice(0, maxResults);

      setSearchState(prev => ({
        ...prev,
        results: limitedResults,
        loading: false,
        selectedIndex: limitedResults.length > 0 ? 0 : -1
      }));
    } catch (error) {
      console.error('Search failed:', error);
      setSearchState(prev => ({ ...prev, loading: false, results: [] }));
    }
  };

  const handleQueryChange = (query: string) => {
    setSearchState(prev => ({ ...prev, query, selectedIndex: -1 }));
  };

  const handleFilterChange = (filters: Partial<PatternSearchFilters>) => {
    setSearchState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...filters },
      selectedIndex: -1
    }));
  };

  const clearFilters = () => {
    setSearchState(prev => ({
      ...prev,
      filters: {},
      selectedIndex: -1
    }));
  };

  const handlePatternSelect = (pattern: InfrastructurePattern) => {
    onPatternSelect(pattern);
    onClose();
  };

  const handlePatternPreview = (pattern: InfrastructurePattern, e: React.MouseEvent) => {
    e.stopPropagation();
    onPatternPreview(pattern);
  };

  const handlePatternDeploy = (pattern: InfrastructurePattern, e: React.MouseEvent) => {
    e.stopPropagation();
    onPatternDeploy(pattern);
    onClose();
  };

  const renderSearchResults = () => {
    if (searchState.loading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Searching...</span>
        </div>
      );
    }

    if (searchState.results.length === 0 && searchState.query.length >= 2) {
      return (
        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
          <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No patterns found</p>
          <p className="text-xs mt-1">Try adjusting your search terms or filters</p>
        </div>
      );
    }

    if (searchState.query.length < 2 && Object.keys(searchState.filters).length === 0) {
      return (
        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
          <Layers className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Start typing to search patterns</p>
          <p className="text-xs mt-1">Or use filters to browse categories</p>
        </div>
      );
    }

    return (
      <div ref={resultsRef} className="space-y-2">
        {searchState.results.map((result, index) => (
          <div
            key={result.pattern.id}
            className={`group p-3 rounded-lg cursor-pointer transition-all duration-200 ${
              index === searchState.selectedIndex
                ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
            onClick={() => handlePatternSelect(result.pattern)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {result.pattern.name}
                  </h4>
                  
                  {result.pattern.featured && (
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  )}
                  
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    result.pattern.complexity === 'simple' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                    result.pattern.complexity === 'moderate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                    result.pattern.complexity === 'complex' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                  }`}>
                    {result.pattern.complexity}
                  </span>
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                  {result.pattern.description}
                </p>

                <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Tag className="h-3 w-3" />
                    <span>{result.pattern.category}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span>{result.pattern.rating.toFixed(1)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Download className="h-3 w-3" />
                    <span>{result.pattern.downloadCount.toLocaleString()}</span>
                  </div>

                  {result.relevanceScore < 1 && (
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>{Math.round(result.relevanceScore * 100)}% match</span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {result.pattern.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {result.pattern.tags.slice(0, 4).map(tag => (
                      <span
                        key={tag}
                        className="text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {result.pattern.tags.length > 4 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        +{result.pattern.tags.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center space-x-1 ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => handlePatternPreview(result.pattern, e)}
                  className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded"
                  title="Preview pattern"
                >
                  <Eye className="h-4 w-4" />
                </button>
                
                <button
                  onClick={(e) => handlePatternDeploy(result.pattern, e)}
                  className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400 rounded"
                  title="Deploy pattern"
                >
                  <Zap className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderAdvancedFilters = () => {
    if (!searchState.showAdvanced) return null;

    return (
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-4">
        {/* Category filter */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <select
            value={searchState.filters.categories?.[0] || ''}
            onChange={(e) => handleFilterChange({
              categories: e.target.value ? [e.target.value as PatternCategory] : undefined
            })}
            className="w-full text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">All Categories</option>
            <option value="Web Applications">Web Applications</option>
            <option value="Microservices">Microservices</option>
            <option value="Data Analytics">Data Analytics</option>
            <option value="Machine Learning">Machine Learning</option>
            <option value="Security">Security</option>
            <option value="Serverless">Serverless</option>
          </select>
        </div>

        {/* Complexity filter */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
            Complexity
          </label>
          <div className="flex flex-wrap gap-1">
            {(['simple', 'moderate', 'complex', 'expert'] as PatternComplexity[]).map(complexity => (
              <label key={complexity} className="flex items-center text-xs">
                <input
                  type="checkbox"
                  checked={searchState.filters.complexities?.includes(complexity) || false}
                  onChange={(e) => {
                    const complexities = searchState.filters.complexities || [];
                    if (e.target.checked) {
                      handleFilterChange({ complexities: [...complexities, complexity] });
                    } else {
                      handleFilterChange({ 
                        complexities: complexities.filter(c => c !== complexity) 
                      });
                    }
                  }}
                  className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-1"
                />
                <span className="capitalize">{complexity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Clear filters */}
        {Object.keys(searchState.filters).length > 0 && (
          <button
            onClick={clearFilters}
            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            Clear all filters
          </button>
        )}
      </div>
    );
  };

  if (!isVisible) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden flex flex-col">
      {/* Search header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchState.query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Search infrastructure patterns..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={() => setSearchState(prev => ({ ...prev, showAdvanced: !prev.showAdvanced }))}
            className={`p-2 rounded-lg transition-colors ${
              searchState.showAdvanced
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            title="Advanced filters"
          >
            <Filter className="h-4 w-4" />
          </button>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Advanced filters */}
      {renderAdvancedFilters()}

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-4">
        {renderSearchResults()}
      </div>

      {/* Footer */}
      {searchState.results.length > 0 && (
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>
              {searchState.results.length} result{searchState.results.length !== 1 ? 's' : ''}
              {maxResults < 100 && ` (showing first ${maxResults})`}
            </span>
            <span>↑↓ Navigate • Enter to deploy • Esc to close</span>
          </div>
        </div>
      )}
    </div>
  );
};