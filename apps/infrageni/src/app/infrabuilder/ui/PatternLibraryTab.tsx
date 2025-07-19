/**
 * Pattern Library Tab Component
 * Provides access to pattern library features in the main InfraBuilder interface
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Library, 
  Bookmark, 
  Download, 
  Upload, 
  Grid, 
  List,
  Filter,
  Star,
  Layers,
  Settings,
  Plus,
  Eye,
  X,
  ChevronDown
} from 'lucide-react';
import { PatternBrowser } from '../patterns/ui/PatternBrowser';
import { PatternManager } from '../patterns/ui/PatternManager';
import { PatternPreview } from '../patterns/ui/PatternPreview';
import { InfrastructurePattern } from '../patterns/core/pattern-types';
import { workspaceIntegration } from '../patterns/integration/workspace-integration';
import { patternImportExport } from '../patterns/core/pattern-import-export';

export interface PatternLibraryTabProps {
  onPatternDeploy?: (pattern: InfrastructurePattern) => void;
  onClose?: () => void;
  initialView?: 'browse' | 'manage' | 'favorites';
  workspaceState?: any; // Current workspace state for deployment
}

type ViewMode = 'browse' | 'manage' | 'favorites' | 'recent';

export const PatternLibraryTab: React.FC<PatternLibraryTabProps> = ({
  onPatternDeploy,
  onClose,
  initialView = 'browse',
  workspaceState
}) => {
  const [currentView, setCurrentView] = useState<ViewMode>(initialView);
  const [selectedPattern, setSelectedPattern] = useState<InfrastructurePattern | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<string>('');
  const [quickFilters, setQuickFilters] = useState({
    category: '',
    complexity: '',
    provider: ''
  });

  // Handle pattern selection
  const handlePatternSelect = (pattern: InfrastructurePattern) => {
    setSelectedPattern(pattern);
  };

  // Handle pattern preview
  const handlePatternPreview = (pattern: InfrastructurePattern) => {
    setSelectedPattern(pattern);
    setShowPreview(true);
  };

  // Handle pattern deployment to workspace
  const handlePatternDeploy = async (pattern: InfrastructurePattern) => {
    if (!workspaceState) {
      console.warn('No workspace state available for deployment');
      return;
    }

    try {
      setIsDeploying(true);
      setDeploymentStatus('Preparing pattern deployment...');

      // Deploy pattern to workspace
      const result = await workspaceIntegration.deployPattern(
        pattern,
        workspaceState,
        {
          autoLayout: true,
          preserveExisting: true,
          validation: {
            checkConflicts: true,
            validateConnections: true,
            enforceConstraints: true
          }
        }
      );

      if (result.success) {
        setDeploymentStatus('Pattern deployed successfully!');
        onPatternDeploy?.(pattern);
        
        // Close after successful deployment
        setTimeout(() => {
          setIsDeploying(false);
          setDeploymentStatus('');
        }, 2000);
      } else {
        setDeploymentStatus(`Deployment failed: ${result.errors.join(', ')}`);
        setTimeout(() => {
          setIsDeploying(false);
          setDeploymentStatus('');
        }, 3000);
      }
    } catch (error) {
      setDeploymentStatus(`Deployment error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setTimeout(() => {
        setIsDeploying(false);
        setDeploymentStatus('');
      }, 3000);
    }
  };

  // Handle pattern import
  const handlePatternImport = async (pattern: InfrastructurePattern) => {
    await handlePatternDeploy(pattern);
  };

  // Render view selector
  const renderViewSelector = () => (
    <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      <button
        onClick={() => setCurrentView('browse')}
        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          currentView === 'browse'
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        <Library className="h-4 w-4 mr-2 inline" />
        Browse
      </button>
      <button
        onClick={() => setCurrentView('manage')}
        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          currentView === 'manage'
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        <Settings className="h-4 w-4 mr-2 inline" />
        Manage
      </button>
      <button
        onClick={() => setCurrentView('favorites')}
        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          currentView === 'favorites'
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        <Bookmark className="h-4 w-4 mr-2 inline" />
        Favorites
      </button>
    </div>
  );

  // Render quick search and filters
  const renderQuickControls = () => (
    <div className="flex items-center space-x-3">
      {/* Quick search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search patterns..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Quick filters */}
      <div className="flex items-center space-x-2">
        <select
          value={quickFilters.category}
          onChange={(e) => setQuickFilters(prev => ({ ...prev, category: e.target.value }))}
          className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="">All Categories</option>
          <option value="Web Applications">Web Applications</option>
          <option value="Microservices">Microservices</option>
          <option value="Data Analytics">Data Analytics</option>
          <option value="Machine Learning">Machine Learning</option>
          <option value="Security">Security</option>
        </select>

        <select
          value={quickFilters.complexity}
          onChange={(e) => setQuickFilters(prev => ({ ...prev, complexity: e.target.value }))}
          className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="">All Complexity</option>
          <option value="simple">Simple</option>
          <option value="moderate">Moderate</option>
          <option value="complex">Complex</option>
          <option value="expert">Expert</option>
        </select>

        <select
          value={quickFilters.provider}
          onChange={(e) => setQuickFilters(prev => ({ ...prev, provider: e.target.value }))}
          className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="">All Providers</option>
          <option value="AWS">AWS</option>
          <option value="Azure">Azure</option>
          <option value="GCP">GCP</option>
          <option value="Multi-Cloud">Multi-Cloud</option>
        </select>
      </div>
    </div>
  );

  // Render deployment status
  const renderDeploymentStatus = () => {
    if (!isDeploying && !deploymentStatus) return null;

    return (
      <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
        deploymentStatus.includes('failed') || deploymentStatus.includes('error')
          ? 'bg-red-50 border border-red-200 text-red-700'
          : deploymentStatus.includes('successfully')
          ? 'bg-green-50 border border-green-200 text-green-700'
          : 'bg-blue-50 border border-blue-200 text-blue-700'
      }`}>
        <div className="flex items-center">
          {isDeploying && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-3"></div>
          )}
          <span className="text-sm font-medium">{deploymentStatus}</span>
        </div>
      </div>
    );
  };

  // Render main content based on current view
  const renderMainContent = () => {
    const commonProps = {
      onPatternSelect: handlePatternSelect,
      onPatternPreview: handlePatternPreview,
      onPatternImport: handlePatternImport
    };

    switch (currentView) {
      case 'browse':
        return (
          <PatternBrowser
            {...commonProps}
            selectedCategories={quickFilters.category ? [quickFilters.category as any] : []}
            viewMode="grid"
            showFilters={true}
          />
        );

      case 'manage':
        return (
          <PatternManager
            {...commonProps}
            onPatternEdit={(pattern) => console.log('Edit pattern:', pattern)}
            onPatternDeploy={handlePatternDeploy}
            initialView="grid"
            allowEdit={true}
            allowDelete={true}
            allowImport={true}
            allowExport={true}
          />
        );

      case 'favorites':
        return (
          <PatternBrowser
            {...commonProps}
            // Filter to favorites only - would need to implement favorites system
            viewMode="grid"
            showFilters={false}
          />
        );

      default:
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500 dark:text-gray-400">Select a view to get started</p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Layers className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Pattern Library
            </h1>
          </div>
          {renderViewSelector()}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {/* Handle import */}}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center space-x-2"
          >
            <Upload className="h-4 w-4" />
            <span>Import</span>
          </button>
          
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Quick controls */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        {renderQuickControls()}
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        {renderMainContent()}
      </div>

      {/* Pattern preview modal */}
      {showPreview && selectedPattern && (
        <PatternPreview
          pattern={selectedPattern}
          onClose={() => setShowPreview(false)}
          onImport={handlePatternImport}
        />
      )}

      {/* Deployment status */}
      {renderDeploymentStatus()}
    </div>
  );
};