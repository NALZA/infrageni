import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Layers, 
  Library, 
  Star,
  Bookmark,
  Grid,
  List,
  Settings,
  ChevronDown,
  Plus
} from 'lucide-react';
import { ComponentRegistry } from './components/core/component-registry';
import { ComponentMetadata, ComponentCategory, ComponentSubcategory } from './components/core/component-types';
import { useProvider } from './components';
import { PatternBrowser } from './patterns/ui/PatternBrowser';
import { InfrastructurePattern } from './patterns/core/pattern-types';
import { PatternLibraryTab } from './ui/PatternLibraryTab';

// Enhanced component library with new registry system
export function EnhancedComponentLibrary({
  favorites,
  setFavorites,
  search,
  setSearch,
  workspaceState,
  onPatternDeploy,
}: {
  favorites: string[];
  setFavorites: (favs: string[]) => void;
  search: string;
  setSearch: (s: string) => void;
  workspaceState?: any;
  onPatternDeploy?: (pattern: InfrastructurePattern) => void;
}) {
  const provider = useProvider();
  const [components, setComponents] = useState<ComponentMetadata[]>([]);
  const [categories, setCategories] = useState<ComponentCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory | 'all'>('all');
  const [viewMode, setViewMode] = useState<'category' | 'provider' | 'all'>('category');
  const [showPatterns, setShowPatterns] = useState(false);
  const [activeTab, setActiveTab] = useState<'components' | 'patterns'>('components');

  // Initialize component registry
  useEffect(() => {
    async function initializeRegistry() {
      try {
        const registry = ComponentRegistry.getInstance();
        await registry.initialize();
        
        const allComponents = registry.getAllComponents();
        const allCategories = registry.getCategories();
        
        setComponents(allComponents);
        setCategories(allCategories);
        setLoading(false);
      } catch (error) {
        console.error('Failed to initialize component registry:', error);
        setLoading(false);
      }
    }
    
    initializeRegistry();
  }, []);

  // Filter and organize components
  const filteredComponents = useMemo(() => {
    let filtered = components;

    // Filter by search
    if (search) {
      filtered = filtered.filter(comp => {
        const providerMapping = comp.providerMappings[provider];
        const name = providerMapping?.name || comp.name;
        const description = providerMapping?.description || comp.description;
        const tags = [...comp.tags, ...(providerMapping?.tags || [])];
        
        return name.toLowerCase().includes(search.toLowerCase()) ||
               description.toLowerCase().includes(search.toLowerCase()) ||
               tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
      });
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(comp => comp.category === selectedCategory);
    }

    // Filter by provider availability
    filtered = filtered.filter(comp => comp.providerMappings[provider] || comp.providerMappings.generic);

    return filtered;
  }, [components, search, selectedCategory, provider]);

  // Group components by category
  const groupedComponents = useMemo(() => {
    const groups: Record<string, ComponentMetadata[]> = {};
    
    filteredComponents.forEach(comp => {
      const category = comp.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(comp);
    });

    // Sort components within each group (favorites first)
    Object.keys(groups).forEach(category => {
      groups[category] = [
        ...groups[category].filter(comp => favorites.includes(comp.id)),
        ...groups[category].filter(comp => !favorites.includes(comp.id))
      ];
    });

    return groups;
  }, [filteredComponents, favorites]);

  // Category display names and icons
  const getCategoryDisplayInfo = (category: ComponentCategory) => {
    const categoryInfo: Record<ComponentCategory, { name: string; icon: string; color: string }> = {
      [ComponentCategory.NETWORK]: { name: 'Network', icon: '🌐', color: 'blue' },
      [ComponentCategory.COMPUTE]: { name: 'Compute', icon: '💻', color: 'green' },
      [ComponentCategory.STORAGE]: { name: 'Storage', icon: '💾', color: 'orange' },
      [ComponentCategory.DATABASE]: { name: 'Database', icon: '🗄️', color: 'purple' },
      [ComponentCategory.SERVERLESS]: { name: 'Serverless', icon: '⚡', color: 'yellow' },
      [ComponentCategory.CONTAINERS]: { name: 'Containers', icon: '📦', color: 'indigo' },
      [ComponentCategory.MESSAGING]: { name: 'Messaging', icon: '📨', color: 'pink' },
      [ComponentCategory.INTEGRATION]: { name: 'Integration', icon: '🔗', color: 'cyan' },
      [ComponentCategory.API_GATEWAY]: { name: 'API Gateway', icon: '🚪', color: 'teal' },
      [ComponentCategory.ANALYTICS]: { name: 'Analytics', icon: '📊', color: 'red' },
      [ComponentCategory.DATA_PROCESSING]: { name: 'Data Processing', icon: '⚙️', color: 'gray' },
      [ComponentCategory.STREAMING]: { name: 'Streaming', icon: '🌊', color: 'blue' },
      [ComponentCategory.AI_ML]: { name: 'AI/ML', icon: '🧠', color: 'purple' },
      [ComponentCategory.SECURITY]: { name: 'Security', icon: '🔒', color: 'red' },
      [ComponentCategory.IDENTITY]: { name: 'Identity', icon: '👤', color: 'green' },
      [ComponentCategory.COMPLIANCE]: { name: 'Compliance', icon: '📋', color: 'gray' },
      [ComponentCategory.DEVOPS]: { name: 'DevOps', icon: '🔧', color: 'orange' },
      [ComponentCategory.MONITORING]: { name: 'Monitoring', icon: '📈', color: 'blue' },
      [ComponentCategory.LOGGING]: { name: 'Logging', icon: '📝', color: 'yellow' },
      [ComponentCategory.IOT]: { name: 'IoT', icon: '🌐', color: 'green' },
      [ComponentCategory.EDGE]: { name: 'Edge', icon: '🏔️', color: 'gray' },
      [ComponentCategory.MANAGEMENT]: { name: 'Management', icon: '⚖️', color: 'indigo' },
      [ComponentCategory.GOVERNANCE]: { name: 'Governance', icon: '🏛️', color: 'purple' },
      [ComponentCategory.GENERIC]: { name: 'Generic', icon: '📄', color: 'gray' },
      [ComponentCategory.EXTERNAL]: { name: 'External', icon: '🌍', color: 'cyan' }
    };
    
    return categoryInfo[category] || { name: category, icon: '📄', color: 'gray' };
  };

  // Render individual component
  const renderComponent = (comp: ComponentMetadata) => {
    const providerMapping = comp.providerMappings[provider] || comp.providerMappings.generic;
    const displayName = providerMapping?.name || comp.name;
    const isContainer = comp.config.isContainer;
    const isFavorite = favorites.includes(comp.id);

    return (
      <div
        key={comp.id}
        draggable
        onDragStart={e => {
          e.dataTransfer.setData('application/x-infrageni-component', comp.id);
        }}
        className={`
          group cursor-move p-3 rounded-lg transition-all duration-200
          border glass-button glass-button-hover
          ${isFavorite
            ? 'border-yellow-400/60 bg-yellow-50/40 dark:bg-yellow-900/20'
            : 'border-white/20 dark:border-white/10'
          }
          ${isContainer
            ? 'border-dashed border-blue-400/60 bg-blue-50/40 dark:bg-blue-900/20'
            : ''
          }
          hover:scale-[1.02] hover:shadow-lg
        `}
        title={providerMapping?.description || comp.description}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {/* Component icon if available */}
            {providerMapping?.iconPath && (
              <img
                src={providerMapping.iconPath}
                alt={displayName}
                className="w-4 h-4 flex-shrink-0 opacity-80"
                onError={(e) => {
                  // Hide broken images
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            
            <span className={`
              text-sm font-medium truncate
              ${isContainer
                ? 'text-blue-700 dark:text-blue-300'
                : 'text-gray-700 dark:text-gray-300'
              }
            `}>
              {displayName}
            </span>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Provider indicator */}
            <span className={`
              text-xs px-1.5 py-0.5 rounded uppercase font-semibold
              ${provider === 'aws' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300' : ''}
              ${provider === 'azure' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : ''}
              ${provider === 'gcp' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' : ''}
              ${provider === 'generic' ? 'bg-gray-100 text-gray-700 dark:bg-gray-900/50 dark:text-gray-300' : ''}
            `}>
              {provider}
            </span>

            {/* Favorite button */}
            <button
              type="button"
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              className="text-yellow-500 hover:text-yellow-600 dark:text-yellow-400 dark:hover:text-yellow-300 transition-colors duration-200 focus:outline-none opacity-0 group-hover:opacity-100"
              onClick={e => {
                e.stopPropagation();
                setFavorites(
                  isFavorite
                    ? favorites.filter(id => id !== comp.id)
                    : [...favorites, comp.id]
                );
              }}
            >
              {isFavorite ? '★' : '☆'}
            </button>
          </div>
        </div>

        {/* Component tags */}
        {comp.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {comp.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
              >
                {tag}
              </span>
            ))}
            {comp.tags.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{comp.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render category section
  const renderCategory = (category: ComponentCategory, components: ComponentMetadata[]) => {
    const categoryInfo = getCategoryDisplayInfo(category);
    const containerComponents = components.filter(comp => comp.config.isContainer);
    const regularComponents = components.filter(comp => !comp.config.isContainer);

    return (
      <div key={category} className="space-y-3">
        <h3 className={`
          text-sm font-semibold mb-2 flex items-center gap-2
          text-${categoryInfo.color}-700 dark:text-${categoryInfo.color}-300
        `}>
          <div className={`w-2 h-2 rounded-full bg-${categoryInfo.color}-500`}></div>
          <span>{categoryInfo.icon}</span>
          <span>{categoryInfo.name}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
            {components.length}
          </span>
        </h3>

        <div className="space-y-2">
          {/* Container components first */}
          {containerComponents.length > 0 && (
            <div className="space-y-2">
              {containerComponents.map(renderComponent)}
            </div>
          )}
          
          {/* Regular components */}
          {regularComponents.length > 0 && (
            <div className="space-y-2">
              {regularComponents.map(renderComponent)}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <aside className="w-64 glass-panel border border-white/20 dark:border-white/10 rounded-lg p-4 shrink-0 flex flex-col shadow-lg">
        <h2 className="text-lg font-semibold mb-3 text-black/90 dark:text-white/90">Component Library</h2>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-80 glass-panel border border-white/20 dark:border-white/10 rounded-lg p-4 shrink-0 flex flex-col shadow-lg">
      {/* Header with Tab Switcher */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-black/90 dark:text-white/90">
            Library
          </h2>
          <button
            onClick={() => setShowPatterns(!showPatterns)}
            className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 rounded"
            title="Toggle Pattern Library"
          >
            <Library className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mb-3">
          <button
            onClick={() => setActiveTab('components')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'components'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Settings className="h-4 w-4 mr-1 inline" />
            Components
          </button>
          <button
            onClick={() => setActiveTab('patterns')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'patterns'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Layers className="h-4 w-4 mr-1 inline" />
            Patterns
          </button>
        </div>
        
        {/* Search input with pattern search integration */}
        <div className="relative mb-3">
          <input
            type="text"
            placeholder={activeTab === 'components' ? "Search components..." : "Search patterns..."}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full glass-input px-3 py-2 rounded-lg text-sm"
          />
          {activeTab === 'patterns' && search.length >= 2 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
              <div className="p-2 text-xs text-gray-500 dark:text-gray-400">
                Pattern search results appear here...
              </div>
            </div>
          )}
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`
              text-xs px-2 py-1 rounded-full transition-colors
              ${selectedCategory === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }
            `}
          >
            All ({filteredComponents.length})
          </button>
          
          {categories.map(category => {
            const categoryInfo = getCategoryDisplayInfo(category);
            const count = components.filter(comp => comp.category === category).length;
            
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  text-xs px-2 py-1 rounded-full transition-colors
                  ${selectedCategory === category
                    ? `bg-${categoryInfo.color}-500 text-white`
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }
                `}
                title={`${categoryInfo.name} (${count})`}
              >
                {categoryInfo.icon}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'components' ? (
          <div className="space-y-4">
            {Object.keys(groupedComponents).length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <p className="text-sm">No components found</p>
                {search && (
                  <p className="text-xs mt-1">Try adjusting your search terms</p>
                )}
              </div>
            ) : (
              Object.entries(groupedComponents).map(([category, categoryComponents]) =>
                renderCategory(category as ComponentCategory, categoryComponents)
              )
            )}
          </div>
        ) : (
          <div className="h-full">
            <PatternBrowser
              onPatternSelect={(pattern) => console.log('Pattern selected:', pattern)}
              onPatternPreview={(pattern) => console.log('Pattern preview:', pattern)}
              onPatternImport={onPatternDeploy}
              viewMode="list"
              showFilters={false}
            />
          </div>
        )}
      </div>

      {/* Stats footer */}
      <div className="mt-4 pt-3 border-t border-white/20 dark:border-white/10">
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          {activeTab === 'components' ? (
            <>{filteredComponents.length} components • {provider.toUpperCase()}</>
          ) : (
            <>Pattern Library • Browse & Deploy</>
          )}
        </div>
      </div>
    </aside>
  );
}