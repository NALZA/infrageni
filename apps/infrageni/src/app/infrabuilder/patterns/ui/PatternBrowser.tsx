/**
 * Pattern Browser Component
 * Advanced UI for browsing, searching, and filtering infrastructure patterns
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Star, 
  Download, 
  Eye, 
  Tag,
  Calendar,
  User,
  Layers,
  ChevronDown,
  ChevronRight,
  Settings
} from 'lucide-react';
import { 
  InfrastructurePattern, 
  PatternCategory, 
  PatternComplexity, 
  PatternSearchFilters,
  PatternSearchResult
} from '../core/pattern-types';
import { PatternRegistry } from '../core/pattern-registry';
import { PatternPreview } from './PatternPreview';
import { PatternCard } from './PatternCard';

export interface PatternBrowserProps {
  onPatternSelect?: (pattern: InfrastructurePattern) => void;
  onPatternImport?: (pattern: InfrastructurePattern) => void;
  onPatternPreview?: (pattern: InfrastructurePattern) => void;
  selectedCategories?: PatternCategory[];
  viewMode?: 'grid' | 'list';
  showFilters?: boolean;
}

export interface FilterState {
  categories: PatternCategory[];
  complexities: PatternComplexity[];
  providers: string[];
  tags: string[];
  ratings: { min: number; max: number };
  dateRange: { start?: Date; end?: Date };
  freeText: string;
}

const DEFAULT_FILTERS: FilterState = {
  categories: [],
  complexities: [],
  providers: [],
  tags: [],
  ratings: { min: 0, max: 5 },
  dateRange: {},
  freeText: ''
};

export const PatternBrowser: React.FC<PatternBrowserProps> = ({
  onPatternSelect,
  onPatternImport,
  onPatternPreview,
  selectedCategories = [],
  viewMode: initialViewMode = 'grid',
  showFilters = true
}) => {
  // State management
  const [patterns, setPatterns] = useState<PatternSearchResult[]>([]);
  const [filteredPatterns, setFilteredPatterns] = useState<PatternSearchResult[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTERS,
    categories: selectedCategories
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(initialViewMode);
  const [sortBy, setSortBy] = useState<'relevance' | 'name' | 'rating' | 'updated' | 'complexity'>('relevance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedPattern, setSelectedPattern] = useState<InfrastructurePattern | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(new Set(['categories', 'complexity']));

  // Available filter options
  const [availableCategories, setAvailableCategories] = useState<PatternCategory[]>([]);
  const [availableProviders, setAvailableProviders] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  // Pattern registry instance
  const patternRegistry = useMemo(() => PatternRegistry.getInstance(), []);

  // Load patterns and filter options
  useEffect(() => {
    loadPatterns();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    applyFilters();
  }, [patterns, filters, sortBy, sortOrder]);

  const loadPatterns = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get all patterns
      const searchFilters: PatternSearchFilters = {
        categories: selectedCategories.length > 0 ? selectedCategories : undefined
      };
      
      const results = patternRegistry.searchPatterns(searchFilters);
      setPatterns(results);

      // Extract available filter options
      const categories = new Set<PatternCategory>();
      const providers = new Set<string>();
      const tags = new Set<string>();

      results.forEach(result => {
        categories.add(result.pattern.category);
        result.pattern.providers?.forEach(p => providers.add(p));
        result.pattern.tags.forEach(t => tags.add(t));
      });

      setAvailableCategories(Array.from(categories));
      setAvailableProviders(Array.from(providers));
      setAvailableTags(Array.from(tags));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load patterns');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...patterns];

    // Apply filters
    if (filters.categories.length > 0) {
      filtered = filtered.filter(p => filters.categories.includes(p.pattern.category));
    }

    if (filters.complexities.length > 0) {
      filtered = filtered.filter(p => filters.complexities.includes(p.pattern.complexity));
    }

    if (filters.providers.length > 0) {
      filtered = filtered.filter(p => 
        p.pattern.providers?.some(provider => filters.providers.includes(provider))
      );
    }

    if (filters.tags.length > 0) {
      filtered = filtered.filter(p => 
        p.pattern.tags.some(tag => filters.tags.includes(tag))
      );
    }

    if (filters.ratings.min > 0 || filters.ratings.max < 5) {
      filtered = filtered.filter(p => 
        p.pattern.rating >= filters.ratings.min && p.pattern.rating <= filters.ratings.max
      );
    }

    if (filters.freeText) {
      const searchText = filters.freeText.toLowerCase();
      filtered = filtered.filter(p => 
        p.pattern.name.toLowerCase().includes(searchText) ||
        p.pattern.description.toLowerCase().includes(searchText) ||
        p.pattern.tags.some(tag => tag.toLowerCase().includes(searchText))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.pattern.name.localeCompare(b.pattern.name);
          break;
        case 'rating':
          comparison = a.pattern.rating - b.pattern.rating;
          break;
        case 'updated':
          comparison = new Date(a.pattern.lastUpdated).getTime() - new Date(b.pattern.lastUpdated).getTime();
          break;
        case 'complexity':
          const complexityOrder = { 'simple': 1, 'moderate': 2, 'complex': 3, 'expert': 4 };
          comparison = complexityOrder[a.pattern.complexity] - complexityOrder[b.pattern.complexity];
          break;
        case 'relevance':
        default:
          comparison = b.relevanceScore - a.relevanceScore;
          break;
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });

    setFilteredPatterns(filtered);
  };

  const handleFilterChange = (filterType: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handlePatternClick = (pattern: InfrastructurePattern) => {
    setSelectedPattern(pattern);
    onPatternSelect?.(pattern);
  };

  const handlePatternPreview = (pattern: InfrastructurePattern) => {
    setSelectedPattern(pattern);
    setShowPreview(true);
    onPatternPreview?.(pattern);
  };

  const handlePatternImport = (pattern: InfrastructurePattern) => {
    onPatternImport?.(pattern);
  };

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const toggleFilterExpansion = (filterType: string) => {
    setExpandedFilters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(filterType)) {
        newSet.delete(filterType);
      } else {
        newSet.add(filterType);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading patterns...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="text-red-600 font-medium">Error loading patterns</div>
        </div>
        <div className="text-red-600 text-sm mt-1">{error}</div>
        <button 
          onClick={loadPatterns}
          className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-gray-50">
      {/* Filters Sidebar */}
      {showFilters && (
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              <button 
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="p-4 space-y-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={filters.freeText}
                  onChange={(e) => handleFilterChange('freeText', e.target.value)}
                  placeholder="Search patterns..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Categories */}
            <div>
              <button 
                onClick={() => toggleFilterExpansion('categories')}
                className="flex items-center justify-between w-full text-sm font-medium text-gray-700 mb-2"
              >
                Categories
                {expandedFilters.has('categories') ? 
                  <ChevronDown className="h-4 w-4" /> : 
                  <ChevronRight className="h-4 w-4" />
                }
              </button>
              {expandedFilters.has('categories') && (
                <div className="space-y-2">
                  {availableCategories.map(category => (
                    <label key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(category)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleFilterChange('categories', [...filters.categories, category]);
                          } else {
                            handleFilterChange('categories', filters.categories.filter(c => c !== category));
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-600">{category}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Complexity */}
            <div>
              <button 
                onClick={() => toggleFilterExpansion('complexity')}
                className="flex items-center justify-between w-full text-sm font-medium text-gray-700 mb-2"
              >
                Complexity
                {expandedFilters.has('complexity') ? 
                  <ChevronDown className="h-4 w-4" /> : 
                  <ChevronRight className="h-4 w-4" />
                }
              </button>
              {expandedFilters.has('complexity') && (
                <div className="space-y-2">
                  {(['simple', 'moderate', 'complex', 'expert'] as PatternComplexity[]).map(complexity => (
                    <label key={complexity} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.complexities.includes(complexity)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleFilterChange('complexities', [...filters.complexities, complexity]);
                          } else {
                            handleFilterChange('complexities', filters.complexities.filter(c => c !== complexity));
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-600 capitalize">{complexity}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Providers */}
            {availableProviders.length > 0 && (
              <div>
                <button 
                  onClick={() => toggleFilterExpansion('providers')}
                  className="flex items-center justify-between w-full text-sm font-medium text-gray-700 mb-2"
                >
                  Providers
                  {expandedFilters.has('providers') ? 
                    <ChevronDown className="h-4 w-4" /> : 
                    <ChevronRight className="h-4 w-4" />
                  }
                </button>
                {expandedFilters.has('providers') && (
                  <div className="space-y-2">
                    {availableProviders.map(provider => (
                      <label key={provider} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.providers.includes(provider)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleFilterChange('providers', [...filters.providers, provider]);
                            } else {
                              handleFilterChange('providers', filters.providers.filter(p => p !== provider));
                            }
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-600">{provider}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Rating Range */}
            <div>
              <button 
                onClick={() => toggleFilterExpansion('rating')}
                className="flex items-center justify-between w-full text-sm font-medium text-gray-700 mb-2"
              >
                Minimum Rating
                {expandedFilters.has('rating') ? 
                  <ChevronDown className="h-4 w-4" /> : 
                  <ChevronRight className="h-4 w-4" />
                }
              </button>
              {expandedFilters.has('rating') && (
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <label key={rating} className="flex items-center">
                      <input
                        type="radio"
                        name="minRating"
                        checked={filters.ratings.min === rating}
                        onChange={() => handleFilterChange('ratings', { ...filters.ratings, min: rating })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-600 flex items-center">
                        {rating}+ <Star className="h-3 w-3 ml-1 text-yellow-400 fill-current" />
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Infrastructure Patterns
              </h2>
              <span className="text-sm text-gray-500">
                {filteredPatterns.length} of {patterns.length} patterns
              </span>
            </div>

            <div className="flex items-center space-x-4">
              {/* Sort Controls */}
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option value="relevance">Relevance</option>
                  <option value="name">Name</option>
                  <option value="rating">Rating</option>
                  <option value="updated">Last Updated</option>
                  <option value="complexity">Complexity</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>

              {/* View Mode Toggle */}
              <div className="flex rounded-lg border border-gray-300">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Pattern Grid/List */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredPatterns.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <Layers className="h-12 w-12 mb-4" />
              <h3 className="text-lg font-medium mb-2">No patterns found</h3>
              <p className="text-sm text-center">
                Try adjusting your filters or search terms to find patterns.
              </p>
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }>
              {filteredPatterns.map(result => (
                <PatternCard
                  key={result.pattern.id}
                  pattern={result.pattern}
                  relevanceScore={result.relevanceScore}
                  viewMode={viewMode}
                  onSelect={handlePatternClick}
                  onPreview={handlePatternPreview}
                  onImport={handlePatternImport}
                  isSelected={selectedPattern?.id === result.pattern.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pattern Preview Modal */}
      {showPreview && selectedPattern && (
        <PatternPreview
          pattern={selectedPattern}
          onClose={() => setShowPreview(false)}
          onImport={handlePatternImport}
        />
      )}
    </div>
  );
};