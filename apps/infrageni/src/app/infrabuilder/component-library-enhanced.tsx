import { useState, useMemo } from 'react';
import { useEditor } from 'tldraw';
import { 
  EXTENDED_COMPONENTS, 
  ExtendedGenericComponent, 
  getComponentsByCategory, 
  searchComponents,
  useProvider 
} from './components-extended';
import { getEnhancedProviderIcon } from './icons-extended';
import { SHAPE_UTILS_MAP } from './shapes';

interface ComponentLibraryState {
  selectedCategory: string;
  searchTerm: string;
  selectedComplexity: string;
  favoriteComponents: string[];
  recentlyUsed: string[];
}

interface ComponentLibraryEnhancedProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ComponentLibraryEnhanced({ isOpen, onClose }: ComponentLibraryEnhancedProps) {
  const editor = useEditor();
  const provider = useProvider();
  
  const [state, setState] = useState<ComponentLibraryState>({
    selectedCategory: 'all',
    searchTerm: '',
    selectedComplexity: 'all',
    favoriteComponents: [],
    recentlyUsed: [],
  });

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(EXTENDED_COMPONENTS.map(comp => comp.category));
    return ['all', ...Array.from(cats)];
  }, []);

  // Get unique complexity levels
  const complexityLevels = useMemo(() => {
    const levels = new Set(EXTENDED_COMPONENTS.map(comp => comp.complexity));
    return ['all', ...Array.from(levels)];
  }, []);

  // Filter components based on current state
  const filteredComponents = useMemo(() => {
    let components = EXTENDED_COMPONENTS;

    // Filter by search term
    if (state.searchTerm) {
      components = searchComponents(state.searchTerm);
    }

    // Filter by category
    if (state.selectedCategory !== 'all') {
      components = components.filter(comp => comp.category === state.selectedCategory);
    }

    // Filter by complexity
    if (state.selectedComplexity !== 'all') {
      components = components.filter(comp => comp.complexity === state.selectedComplexity);
    }

    return components;
  }, [state.searchTerm, state.selectedCategory, state.selectedComplexity]);

  // Group components by category for display
  const groupedComponents = useMemo(() => {
    const groups: Record<string, ExtendedGenericComponent[]> = {};
    
    filteredComponents.forEach(component => {
      if (!groups[component.category]) {
        groups[component.category] = [];
      }
      groups[component.category].push(component);
    });

    return groups;
  }, [filteredComponents]);

  const handleDragStart = (component: ExtendedGenericComponent, event: React.DragEvent) => {
    const componentData = {
      type: 'component',
      componentId: component.id,
      label: component.providerNames[provider] || component.label,
    };
    
    event.dataTransfer.setData('application/json', JSON.stringify(componentData));
    event.dataTransfer.effectAllowed = 'copy';
  };

  const handleComponentClick = (component: ExtendedGenericComponent) => {
    // Add component to canvas at center
    const bounds = editor.getViewportPageBounds();
    const center = bounds.center;
    
    const shapeUtil = SHAPE_UTILS_MAP[component.id];
    if (shapeUtil) {
      const shapeId = editor.createShapeId();
      editor.createShape({
        id: shapeId,
        type: component.id as any,
        x: center.x - 75, // Half default width
        y: center.y - 50, // Half default height
        props: {
          w: 150,
          h: 100,
          color: '#3b82f6',
          label: component.providerNames[provider] || component.label,
          componentId: component.id,
          isBoundingBox: component.isBoundingBox || false,
        },
      });

      // Update recently used
      setState(prev => ({
        ...prev,
        recentlyUsed: [
          component.id,
          ...prev.recentlyUsed.filter(id => id !== component.id)
        ].slice(0, 10), // Keep last 10
      }));
    }
  };

  const toggleFavorite = (componentId: string) => {
    setState(prev => ({
      ...prev,
      favoriteComponents: prev.favoriteComponents.includes(componentId)
        ? prev.favoriteComponents.filter(id => id !== componentId)
        : [...prev.favoriteComponents, componentId],
    }));
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'basic': return 'text-green-600 bg-green-50';
      case 'intermediate': return 'text-yellow-600 bg-yellow-50';
      case 'advanced': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPricingColor = (pricing?: string) => {
    switch (pricing) {
      case 'free': return 'text-green-600 bg-green-50';
      case 'low': return 'text-blue-600 bg-blue-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'enterprise': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-5/6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Enhanced Component Library</h2>
            <p className="text-gray-600">
              {filteredComponents.length} components available for {provider.toUpperCase()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Components
              </label>
              <input
                type="text"
                placeholder="Search by name or description..."
                value={state.searchTerm}
                onChange={(e) => setState(prev => ({ ...prev, searchTerm: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={state.selectedCategory}
                onChange={(e) => setState(prev => ({ ...prev, selectedCategory: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : 
                     category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Complexity Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Complexity
              </label>
              <select
                value={state.selectedComplexity}
                onChange={(e) => setState(prev => ({ ...prev, selectedComplexity: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {complexityLevels.map(level => (
                  <option key={level} value={level}>
                    {level === 'all' ? 'All Levels' : 
                     level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Filters
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setState(prev => ({ 
                    ...prev, 
                    searchTerm: '',
                    selectedCategory: 'all',
                    selectedComplexity: 'all'
                  }))}
                  className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setState(prev => ({ 
                    ...prev, 
                    selectedComplexity: 'basic'
                  }))}
                  className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                >
                  Basic Only
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Components Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {Object.keys(groupedComponents).length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <p className="text-xl mb-2">No components found</p>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedComponents).map(([category, components]) => (
                <div key={category}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="capitalize">{category}</span>
                    <span className="ml-2 text-sm text-gray-500">({components.length})</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {components.map(component => {
                      const isFavorite = state.favoriteComponents.includes(component.id);
                      const isRecentlyUsed = state.recentlyUsed.includes(component.id);
                      const providerPricing = component.pricing?.[provider as keyof typeof component.pricing];

                      return (
                        <div
                          key={component.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer group"
                          draggable
                          onDragStart={(e) => handleDragStart(component, e)}
                          onClick={() => handleComponentClick(component)}
                        >
                          {/* Component Icon and Name */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0">
                                {getEnhancedProviderIcon(component.id, provider, { 
                                  size: 'md',
                                  className: 'text-blue-600'
                                })}
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900 text-sm">
                                  {component.providerNames[provider] || component.label}
                                </h4>
                                <p className="text-xs text-gray-500">{component.id}</p>
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(component.id);
                              }}
                              className={`text-lg ${
                                isFavorite ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-500'
                              }`}
                            >
                              ★
                            </button>
                          </div>

                          {/* Description */}
                          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                            {component.description}
                          </p>

                          {/* Badges */}
                          <div className="flex flex-wrap gap-1 mb-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getComplexityColor(component.complexity)}`}>
                              {component.complexity}
                            </span>
                            {providerPricing && (
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPricingColor(providerPricing)}`}>
                                {providerPricing}
                              </span>
                            )}
                            {component.isBoundingBox && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-purple-600 bg-purple-50">
                                Container
                              </span>
                            )}
                            {isRecentlyUsed && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-blue-600 bg-blue-50">
                                Recent
                              </span>
                            )}
                          </div>

                          {/* Subcategory */}
                          {component.subcategory && (
                            <p className="text-xs text-gray-500">
                              {component.subcategory}
                            </p>
                          )}

                          {/* Hover Actions */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-2">
                            <div className="flex justify-between items-center text-xs text-gray-500">
                              <span>Click to add to canvas</span>
                              <span>Drag to position</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div>
              Tip: Drag components directly onto the canvas or click to add at center
            </div>
            <div className="flex space-x-4">
              <span>Recently Used: {state.recentlyUsed.length}</span>
              <span>Favorites: {state.favoriteComponents.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}