/**
 * Pattern Manager Component
 * Central hub for organizing, managing, and curating infrastructure patterns
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Download, 
  Upload, 
  Eye, 
  Star,
  Folder,
  FolderPlus,
  Tag,
  Calendar,
  User,
  MoreVertical,
  Archive,
  Copy,
  ExternalLink,
  Settings,
  RefreshCw,
  Grid,
  List,
  SortAsc,
  SortDesc,
  CheckCircle,
  AlertTriangle,
  Clock,
  Bookmark,
  Share2
} from 'lucide-react';
import { 
  InfrastructurePattern, 
  PatternCategory, 
  PatternComplexity, 
  PatternStatus,
  PatternSearchFilters
} from '../core/pattern-types';
import { PatternRegistry } from '../core/pattern-registry';
import { patternImportExport } from '../core/pattern-import-export';
import { workspaceIntegration } from '../integration/workspace-integration';
import { PatternBrowser } from './PatternBrowser';
import { PatternPreview } from './PatternPreview';
import { PatternCard } from './PatternCard';

export interface PatternManagerProps {
  onPatternSelect?: (pattern: InfrastructurePattern) => void;
  onPatternEdit?: (pattern: InfrastructurePattern) => void;
  onPatternDeploy?: (pattern: InfrastructurePattern) => void;
  initialView?: 'grid' | 'list' | 'folders';
  allowEdit?: boolean;
  allowDelete?: boolean;
  allowImport?: boolean;
  allowExport?: boolean;
}

interface PatternFolder {
  id: string;
  name: string;
  description?: string;
  patterns: string[];
  color?: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface PatternCollection {
  id: string;
  name: string;
  description: string;
  patterns: string[];
  tags: string[];
  isPublic: boolean;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

type ViewMode = 'grid' | 'list' | 'folders' | 'collections';
type SortField = 'name' | 'category' | 'rating' | 'updated' | 'downloads' | 'complexity';
type FilterPanel = 'categories' | 'status' | 'complexity' | 'authors' | 'tags' | 'folders';

export const PatternManager: React.FC<PatternManagerProps> = ({
  onPatternSelect,
  onPatternEdit,
  onPatternDeploy,
  initialView = 'grid',
  allowEdit = true,
  allowDelete = true,
  allowImport = true,
  allowExport = true
}) => {
  // State management
  const [patterns, setPatterns] = useState<InfrastructurePattern[]>([]);
  const [folders, setFolders] = useState<PatternFolder[]>([]);
  const [collections, setCollections] = useState<PatternCollection[]>([]);
  const [selectedPatterns, setSelectedPatterns] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>(initialView);
  const [sortField, setSortField] = useState<SortField>('updated');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [activeFilters, setActiveFilters] = useState<PatternSearchFilters>({});
  const [showFilters, setShowFilters] = useState(true);
  const [expandedPanels, setExpandedPanels] = useState<Set<FilterPanel>>(new Set(['categories', 'status']));
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewPattern, setPreviewPattern] = useState<InfrastructurePattern | null>(null);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pattern registry instance
  const patternRegistry = useMemo(() => PatternRegistry.getInstance(), []);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Filtered and sorted patterns
  const filteredPatterns = useMemo(() => {
    let filtered = [...patterns];

    // Apply folder filter
    if (selectedFolder) {
      const folder = folders.find(f => f.id === selectedFolder);
      if (folder) {
        filtered = filtered.filter(p => folder.patterns.includes(p.id));
      }
    }

    // Apply collection filter
    if (selectedCollection) {
      const collection = collections.find(c => c.id === selectedCollection);
      if (collection) {
        filtered = filtered.filter(p => collection.patterns.includes(p.id));
      }
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.tags.some(tag => tag.toLowerCase().includes(query)) ||
        p.author.toLowerCase().includes(query)
      );
    }

    // Apply active filters
    if (activeFilters.categories?.length) {
      filtered = filtered.filter(p => activeFilters.categories!.includes(p.category));
    }
    if (activeFilters.complexities?.length) {
      filtered = filtered.filter(p => activeFilters.complexities!.includes(p.complexity));
    }
    if (activeFilters.status?.length) {
      filtered = filtered.filter(p => activeFilters.status!.includes(p.status));
    }
    if (activeFilters.tags?.length) {
      filtered = filtered.filter(p => 
        p.tags.some(tag => activeFilters.tags!.includes(tag))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'updated':
          comparison = new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
          break;
        case 'downloads':
          comparison = a.downloadCount - b.downloadCount;
          break;
        case 'complexity':
          const complexityOrder = { 'simple': 1, 'moderate': 2, 'complex': 3, 'expert': 4 };
          comparison = complexityOrder[a.complexity] - complexityOrder[b.complexity];
          break;
        default:
          comparison = new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [patterns, folders, collections, selectedFolder, selectedCollection, searchQuery, activeFilters, sortField, sortOrder]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load patterns
      const allPatterns = patternRegistry.getAllPatterns();
      setPatterns(allPatterns);

      // Load folders and collections from storage
      await loadFolders();
      await loadCollections();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load patterns');
    } finally {
      setLoading(false);
    }
  };

  const loadFolders = async () => {
    // Implementation would load from persistent storage
    const defaultFolders: PatternFolder[] = [
      {
        id: 'favorites',
        name: 'Favorites',
        description: 'Your favorite patterns',
        patterns: [],
        color: '#F59E0B',
        icon: '⭐',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'recent',
        name: 'Recently Used',
        description: 'Recently deployed patterns',
        patterns: [],
        color: '#3B82F6',
        icon: '🕒',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    setFolders(defaultFolders);
  };

  const loadCollections = async () => {
    // Implementation would load from persistent storage
    setCollections([]);
  };

  const handlePatternSelect = (pattern: InfrastructurePattern) => {
    onPatternSelect?.(pattern);
  };

  const handlePatternPreview = (pattern: InfrastructurePattern) => {
    setPreviewPattern(pattern);
    setShowPreview(true);
  };

  const handlePatternEdit = (pattern: InfrastructurePattern) => {
    onPatternEdit?.(pattern);
  };

  const handlePatternDelete = async (patternId: string) => {
    if (window.confirm('Are you sure you want to delete this pattern?')) {
      try {
        patternRegistry.unregisterPattern(patternId);
        setPatterns(prev => prev.filter(p => p.id !== patternId));
        
        // Remove from folders
        setFolders(prev => prev.map(folder => ({
          ...folder,
          patterns: folder.patterns.filter(id => id !== patternId)
        })));
      } catch (error) {
        console.error('Failed to delete pattern:', error);
      }
    }
  };

  const handlePatternDeploy = (pattern: InfrastructurePattern) => {
    onPatternDeploy?.(pattern);
  };

  const handleBulkAction = async (action: string) => {
    const selectedPatternList = patterns.filter(p => selectedPatterns.has(p.id));
    
    switch (action) {
      case 'export':
        await handleBulkExport(selectedPatternList);
        break;
      case 'delete':
        await handleBulkDelete(selectedPatternList);
        break;
      case 'addToFolder':
        await handleAddToFolder(selectedPatternList);
        break;
      case 'createCollection':
        await handleCreateCollection(selectedPatternList);
        break;
    }
    
    setSelectedPatterns(new Set());
  };

  const handleBulkExport = async (patterns: InfrastructurePattern[]) => {
    // Implementation for bulk export
    console.log('Bulk export:', patterns);
  };

  const handleBulkDelete = async (patterns: InfrastructurePattern[]) => {
    if (window.confirm(`Delete ${patterns.length} patterns?`)) {
      patterns.forEach(pattern => {
        patternRegistry.unregisterPattern(pattern.id);
      });
      loadData();
    }
  };

  const handleAddToFolder = async (patterns: InfrastructurePattern[]) => {
    // Implementation for adding patterns to folder
    console.log('Add to folder:', patterns);
  };

  const handleCreateCollection = async (patterns: InfrastructurePattern[]) => {
    // Implementation for creating collection from patterns
    console.log('Create collection:', patterns);
  };

  const createFolder = async (name: string, description?: string) => {
    const newFolder: PatternFolder = {
      id: `folder-${Date.now()}`,
      name,
      description,
      patterns: [],
      color: '#6B7280',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setFolders(prev => [...prev, newFolder]);
    setShowCreateFolder(false);
  };

  const toggleFilter = (filterType: FilterPanel) => {
    setExpandedPanels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(filterType)) {
        newSet.delete(filterType);
      } else {
        newSet.add(filterType);
      }
      return newSet;
    });
  };

  const togglePatternSelection = (patternId: string) => {
    setSelectedPatterns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(patternId)) {
        newSet.delete(patternId);
      } else {
        newSet.add(patternId);
      }
      return newSet;
    });
  };

  const selectAllPatterns = () => {
    setSelectedPatterns(new Set(filteredPatterns.map(p => p.id)));
  };

  const clearSelection = () => {
    setSelectedPatterns(new Set());
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
          <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
          <div className="text-red-600 font-medium">Error loading patterns</div>
        </div>
        <div className="text-red-600 text-sm mt-1">{error}</div>
        <button 
          onClick={loadData}
          className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-gray-50">
      {/* Sidebar */}
      {showFilters && (
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Pattern Manager</h3>
              <button
                onClick={loadData}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex space-x-2 mb-4">
              {allowImport && (
                <button
                  onClick={() => setShowImportDialog(true)}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center justify-center"
                >
                  <Upload className="h-4 w-4 mr-1" />
                  Import
                </button>
              )}
              <button
                onClick={() => setShowCreateFolder(true)}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                title="Create Folder"
              >
                <FolderPlus className="h-4 w-4" />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patterns..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Folders */}
          <div className="p-4 border-b border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Folders</h4>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedFolder(null)}
                className={`w-full flex items-center px-3 py-2 text-sm rounded-lg text-left ${
                  selectedFolder === null ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Folder className="h-4 w-4 mr-2" />
                All Patterns ({patterns.length})
              </button>
              {folders.map(folder => (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolder(folder.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm rounded-lg text-left ${
                    selectedFolder === folder.id ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-2">{folder.icon}</span>
                  {folder.name} ({folder.patterns.length})
                </button>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="p-4 space-y-4">
            {/* Categories Filter */}
            <div>
              <button
                onClick={() => toggleFilter('categories')}
                className="flex items-center justify-between w-full text-sm font-medium text-gray-700 mb-2"
              >
                Categories
                {expandedPanels.has('categories') ? '−' : '+'}
              </button>
              {expandedPanels.has('categories') && (
                <div className="space-y-2">
                  {Array.from(new Set(patterns.map(p => p.category))).map(category => (
                    <label key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={activeFilters.categories?.includes(category) || false}
                        onChange={(e) => {
                          const categories = activeFilters.categories || [];
                          if (e.target.checked) {
                            setActiveFilters(prev => ({
                              ...prev,
                              categories: [...categories, category]
                            }));
                          } else {
                            setActiveFilters(prev => ({
                              ...prev,
                              categories: categories.filter(c => c !== category)
                            }));
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

            {/* Status Filter */}
            <div>
              <button
                onClick={() => toggleFilter('status')}
                className="flex items-center justify-between w-full text-sm font-medium text-gray-700 mb-2"
              >
                Status
                {expandedPanels.has('status') ? '−' : '+'}
              </button>
              {expandedPanels.has('status') && (
                <div className="space-y-2">
                  {(['stable', 'beta', 'experimental', 'deprecated'] as PatternStatus[]).map(status => (
                    <label key={status} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={activeFilters.status?.includes(status) || false}
                        onChange={(e) => {
                          const statuses = activeFilters.status || [];
                          if (e.target.checked) {
                            setActiveFilters(prev => ({
                              ...prev,
                              status: [...statuses, status]
                            }));
                          } else {
                            setActiveFilters(prev => ({
                              ...prev,
                              status: statuses.filter(s => s !== status)
                            }));
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-600 capitalize">{status}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Complexity Filter */}
            <div>
              <button
                onClick={() => toggleFilter('complexity')}
                className="flex items-center justify-between w-full text-sm font-medium text-gray-700 mb-2"
              >
                Complexity
                {expandedPanels.has('complexity') ? '−' : '+'}
              </button>
              {expandedPanels.has('complexity') && (
                <div className="space-y-2">
                  {(['simple', 'moderate', 'complex', 'expert'] as PatternComplexity[]).map(complexity => (
                    <label key={complexity} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={activeFilters.complexities?.includes(complexity) || false}
                        onChange={(e) => {
                          const complexities = activeFilters.complexities || [];
                          if (e.target.checked) {
                            setActiveFilters(prev => ({
                              ...prev,
                              complexities: [...complexities, complexity]
                            }));
                          } else {
                            setActiveFilters(prev => ({
                              ...prev,
                              complexities: complexities.filter(c => c !== complexity)
                            }));
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
                {selectedFolder ? folders.find(f => f.id === selectedFolder)?.name : 'All Patterns'}
              </h2>
              <span className="text-sm text-gray-500">
                {selectedPatterns.size > 0 ? (
                  <>
                    {selectedPatterns.size} of {filteredPatterns.length} selected
                  </>
                ) : (
                  <>
                    {filteredPatterns.length} of {patterns.length} patterns
                  </>
                )}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              {/* Bulk Actions */}
              {selectedPatterns.size > 0 && (
                <div className="flex items-center space-x-2">
                  {allowExport && (
                    <button
                      onClick={() => handleBulkAction('export')}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Export ({selectedPatterns.size})
                    </button>
                  )}
                  {allowDelete && (
                    <button
                      onClick={() => handleBulkAction('delete')}
                      className="px-3 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
                    >
                      Delete ({selectedPatterns.size})
                    </button>
                  )}
                  <button
                    onClick={clearSelection}
                    className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Clear
                  </button>
                </div>
              )}

              {/* Sort Controls */}
              <div className="flex items-center space-x-2">
                <select
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value as SortField)}
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option value="updated">Last Updated</option>
                  <option value="name">Name</option>
                  <option value="category">Category</option>
                  <option value="rating">Rating</option>
                  <option value="downloads">Downloads</option>
                  <option value="complexity">Complexity</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
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

              {/* Select All */}
              <button
                onClick={selectedPatterns.size === filteredPatterns.length ? clearSelection : selectAllPatterns}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {selectedPatterns.size === filteredPatterns.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
          </div>
        </div>

        {/* Pattern Grid/List */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredPatterns.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <Search className="h-12 w-12 mb-4" />
              <h3 className="text-lg font-medium mb-2">No patterns found</h3>
              <p className="text-sm text-center">
                {searchQuery || Object.keys(activeFilters).length > 0
                  ? 'Try adjusting your search or filters.'
                  : 'Import patterns to get started.'
                }
              </p>
              {allowImport && (
                <button
                  onClick={() => setShowImportDialog(true)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Import Patterns
                </button>
              )}
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }>
              {filteredPatterns.map(pattern => (
                <div key={pattern.id} className="relative">
                  {/* Selection Checkbox */}
                  <div className="absolute top-3 left-3 z-10">
                    <input
                      type="checkbox"
                      checked={selectedPatterns.has(pattern.id)}
                      onChange={() => togglePatternSelection(pattern.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>

                  <PatternCard
                    pattern={pattern}
                    relevanceScore={1}
                    viewMode={viewMode}
                    onSelect={handlePatternSelect}
                    onPreview={handlePatternPreview}
                    onImport={handlePatternDeploy}
                    isSelected={selectedPatterns.has(pattern.id)}
                  />

                  {/* Action Menu */}
                  <div className="absolute top-3 right-3 z-10">
                    <div className="relative group">
                      <button className="p-1 bg-white rounded-lg shadow-sm border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="h-4 w-4 text-gray-600" />
                      </button>
                      
                      <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[120px] opacity-0 group-hover:opacity-100 transition-opacity">
                        {allowEdit && (
                          <button
                            onClick={() => handlePatternEdit(pattern)}
                            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </button>
                        )}
                        <button
                          onClick={() => handlePatternPreview(pattern)}
                          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </button>
                        {allowExport && (
                          <button
                            onClick={() => {/* Handle single export */}}
                            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Export
                          </button>
                        )}
                        <button
                          onClick={() => {/* Handle duplicate */}}
                          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </button>
                        {allowDelete && (
                          <button
                            onClick={() => handlePatternDelete(pattern.id)}
                            className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pattern Preview Modal */}
      {showPreview && previewPattern && (
        <PatternPreview
          pattern={previewPattern}
          onClose={() => setShowPreview(false)}
          onImport={handlePatternDeploy}
        />
      )}
    </div>
  );
};