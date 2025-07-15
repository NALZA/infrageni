import React, { useState, useEffect } from 'react';
import { useEditor } from 'tldraw';
import { DiagramTemplate, SavedDiagram } from './diagram-types';
import { DiagramStorage } from './diagram-storage';
import { convertShapesToCanvasItems, extractConnectionsFromArrows } from '../export/export-utils';

interface DiagramLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadDiagram: (diagram: SavedDiagram | DiagramTemplate) => void;
}

export function DiagramLibrary({ isOpen, onClose, onLoadDiagram }: DiagramLibraryProps) {
  const editor = useEditor();
  const [activeTab, setActiveTab] = useState<'saved' | 'templates'>('saved');
  const [savedDiagrams, setSavedDiagrams] = useState<SavedDiagram[]>([]);
  const [templates, setTemplates] = useState<DiagramTemplate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveDescription, setSaveDescription] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadDiagrams();
      loadTemplates();
    }
  }, [isOpen]);

  const loadDiagrams = () => {
    const diagrams = DiagramStorage.getSavedDiagrams();
    setSavedDiagrams(diagrams);
  };

  const loadTemplates = () => {
    const templates = DiagramStorage.getTemplates();
    setTemplates(templates);
  };

  const handleSaveCurrentDiagram = () => {
    if (!editor) return;
    
    const shapes = editor.getCurrentPageShapes();
    const items = convertShapesToCanvasItems(shapes);
    const connections = extractConnectionsFromArrows(editor, shapes);
    const canvasState = editor.store.getSnapshot();
    
    const diagram: SavedDiagram = {
      id: `diagram-${Date.now()}`,
      name: saveName || 'Untitled Diagram',
      description: saveDescription,
      data: {
        items,
        connections,
        canvasState,
      },
      provider: 'generic',
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isAutoSave: false,
      version: 1,
    };
    
    DiagramStorage.saveDiagram(diagram);
    loadDiagrams();
    setShowSaveDialog(false);
    setSaveName('');
    setSaveDescription('');
  };

  const handleDeleteDiagram = (id: string) => {
    if (confirm('Are you sure you want to delete this diagram?')) {
      DiagramStorage.deleteDiagram(id);
      loadDiagrams();
    }
  };

  const handleImportDiagram = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const result = await DiagramStorage.importDiagram(file);
    if (result.success && result.diagram) {
      loadDiagrams();
      alert('Diagram imported successfully!');
    } else {
      alert(`Import failed: ${result.error}`);
    }
    
    // Reset file input
    event.target.value = '';
  };

  const handleExportDiagram = (diagram: SavedDiagram) => {
    DiagramStorage.exportDiagram(diagram);
  };

  const filteredSavedDiagrams = savedDiagrams.filter(diagram => {
    const matchesSearch = diagram.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         diagram.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'web-architecture', name: 'Web Architecture' },
    { id: 'microservices', name: 'Microservices' },
    { id: 'data-pipeline', name: 'Data Pipeline' },
    { id: 'networking', name: 'Networking' },
    { id: 'custom', name: 'Custom' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Diagram Library
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'saved'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Saved Diagrams ({savedDiagrams.length})
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'templates'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Templates ({templates.length})
          </button>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="Search diagrams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            {activeTab === 'templates' && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            )}
            
            {activeTab === 'saved' && (
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSaveDialog(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Current
                </button>
                <label className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
                  Import
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportDiagram}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {activeTab === 'saved' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSavedDiagrams.map(diagram => (
                <div
                  key={diagram.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {diagram.name}
                    </h3>
                    <div className="flex gap-1 ml-2">
                      <button
                        onClick={() => handleExportDiagram(diagram)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Export"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteDiagram(diagram.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {diagram.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {diagram.description}
                    </p>
                  )}
                  
                  <div className="text-xs text-gray-500 dark:text-gray-500 mb-3">
                    Updated: {new Date(diagram.updatedAt).toLocaleDateString()}
                  </div>
                  
                  <button
                    onClick={() => onLoadDiagram(diagram)}
                    className="w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Load Diagram
                  </button>
                </div>
              ))}
              
              {filteredSavedDiagrams.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
                  No saved diagrams found
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map(template => (
                <div
                  key={template.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {template.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        template.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                        template.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {template.difficulty}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {template.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {template.provider.toUpperCase()}
                    </span>
                    <span>{template.estimatedTime} min</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {template.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => onLoadDiagram(template)}
                    className="w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Use Template
                  </button>
                </div>
              ))}
              
              {filteredTemplates.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
                  No templates found
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Save Current Diagram
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={saveName}
                    onChange={(e) => setSaveName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter diagram name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={saveDescription}
                    onChange={(e) => setSaveDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter description"
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveCurrentDiagram}
                  disabled={!saveName.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowSaveDialog(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}