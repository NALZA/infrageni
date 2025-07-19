/**
 * Pattern Preview Component
 * Detailed preview modal for infrastructure patterns with visualization
 */

import React, { useState, useMemo } from 'react';
import { 
  X, 
  Download, 
  Star, 
  Eye, 
  Calendar,
  User,
  Tag,
  Layers,
  Code,
  FileText,
  Settings,
  Shield,
  Zap,
  DollarSign,
  Clock,
  GitBranch,
  CheckCircle,
  AlertTriangle,
  Info,
  ExternalLink,
  Copy,
  Play
} from 'lucide-react';
import { 
  InfrastructurePattern, 
  ComponentReference, 
  ComponentRelationship,
  PatternValidationResult 
} from '../core/pattern-types';
import { patternValidator } from '../core/pattern-validator';
import { templateEngine } from '../core/template-engine';

export interface PatternPreviewProps {
  pattern: InfrastructurePattern;
  onClose: () => void;
  onImport: (pattern: InfrastructurePattern) => void;
}

interface TabType {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TABS: TabType[] = [
  { id: 'overview', label: 'Overview', icon: Eye },
  { id: 'architecture', label: 'Architecture', icon: Layers },
  { id: 'components', label: 'Components', icon: Settings },
  { id: 'configuration', label: 'Configuration', icon: Code },
  { id: 'validation', label: 'Validation', icon: Shield },
  { id: 'documentation', label: 'Documentation', icon: FileText }
];

const COMPLEXITY_COLORS = {
  simple: 'bg-green-100 text-green-800',
  moderate: 'bg-yellow-100 text-yellow-800', 
  complex: 'bg-orange-100 text-orange-800',
  expert: 'bg-red-100 text-red-800'
};

const formatLastUpdated = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

const formatEstimatedCost = (cost: { min: number; max: number; currency: string }): string => {
  if (cost.min === cost.max) {
    return `${cost.currency}${cost.min}/month`;
  }
  return `${cost.currency}${cost.min}-${cost.max}/month`;
};

export const PatternPreview: React.FC<PatternPreviewProps> = ({
  pattern,
  onClose,
  onImport
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [validationResult, setValidationResult] = useState<PatternValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [showConfigPreview, setShowConfigPreview] = useState(false);

  // Run validation when component mounts
  React.useEffect(() => {
    validatePattern();
  }, [pattern]);

  const validatePattern = async () => {
    setIsValidating(true);
    try {
      const result = await patternValidator.validatePattern(pattern);
      setValidationResult(result);
    } catch (error) {
      console.error('Pattern validation failed:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const handleImport = () => {
    onImport(pattern);
    onClose();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const previewConfiguration = async () => {
    try {
      // Check if there's a template for this pattern
      const templatePreview = templateEngine.previewTemplate(pattern.id);
      if (templatePreview.template) {
        setShowConfigPreview(true);
      }
    } catch (error) {
      console.error('Failed to preview configuration:', error);
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pattern Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <p className="text-gray-900">{pattern.category}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Complexity</label>
            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${COMPLEXITY_COLORS[pattern.complexity]}`}>
              {pattern.complexity}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
            <p className="text-gray-900">{pattern.version}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
              pattern.status === 'stable' ? 'bg-green-100 text-green-800' : 
              pattern.status === 'beta' ? 'bg-yellow-100 text-yellow-800' : 
              'bg-gray-100 text-gray-800'
            }`}>
              {pattern.status}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
            <p className="text-gray-900">{pattern.author}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
            <p className="text-gray-900">{formatLastUpdated(pattern.lastUpdated)}</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
        <p className="text-gray-700 leading-relaxed">{pattern.description}</p>
      </div>

      {/* Use Cases */}
      {pattern.useCases && pattern.useCases.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Use Cases</h3>
          <ul className="space-y-2">
            {pattern.useCases.map((useCase, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{useCase}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Star className="h-5 w-5 text-yellow-400 fill-current" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{pattern.rating.toFixed(1)}</div>
          <div className="text-sm text-gray-600">{pattern.reviewCount} reviews</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Download className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{pattern.downloadCount.toLocaleString()}</div>
          <div className="text-sm text-gray-600">downloads</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Layers className="h-5 w-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{pattern.components.length}</div>
          <div className="text-sm text-gray-600">components</div>
        </div>
      </div>

      {/* Cost Estimate */}
      {pattern.estimatedCost && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 text-yellow-600 mr-2" />
            <h3 className="text-lg font-medium text-yellow-800">Estimated Cost</h3>
          </div>
          <p className="text-yellow-700 mt-2">
            {formatEstimatedCost(pattern.estimatedCost)} based on typical usage patterns
          </p>
          {pattern.costFactors && (
            <div className="mt-3">
              <p className="text-sm text-yellow-600 mb-2">Cost factors:</p>
              <ul className="text-sm text-yellow-700 space-y-1">
                {pattern.costFactors.map((factor, index) => (
                  <li key={index}>• {factor}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Tags */}
      {pattern.tags.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {pattern.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderArchitectureTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Architecture Overview</h3>
      
      {/* Architecture Diagram Placeholder */}
      <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <Layers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h4 className="text-lg font-medium text-gray-900 mb-2">Architecture Diagram</h4>
        <p className="text-gray-600">
          Interactive architecture diagram will be displayed here showing component relationships and data flow.
        </p>
      </div>

      {/* Component Relationships */}
      {pattern.relationships && pattern.relationships.length > 0 && (
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-3">Component Relationships</h4>
          <div className="space-y-3">
            {pattern.relationships.map((relationship, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-medium text-gray-900">{relationship.from}</span>
                    <GitBranch className="h-4 w-4 text-gray-400" />
                    <span className="font-medium text-gray-900">{relationship.to}</span>
                  </div>
                  <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {relationship.type}
                  </span>
                </div>
                {relationship.description && (
                  <p className="text-sm text-gray-600 mt-2 ml-6">{relationship.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Design Principles */}
      {pattern.designPrinciples && pattern.designPrinciples.length > 0 && (
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-3">Design Principles</h4>
          <ul className="space-y-2">
            {pattern.designPrinciples.map((principle, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{principle}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const renderComponentsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Components</h3>
        <span className="text-sm text-gray-600">{pattern.components.length} components</span>
      </div>

      <div className="grid gap-4">
        {pattern.components.map((component, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="text-md font-semibold text-gray-900">{component.name}</h4>
                  <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {component.type}
                  </span>
                  {component.required && (
                    <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                      Required
                    </span>
                  )}
                </div>
                
                {component.description && (
                  <p className="text-gray-700 mb-3">{component.description}</p>
                )}

                {/* Component Configuration */}
                {component.configuration && Object.keys(component.configuration).length > 0 && (
                  <div className="mt-3">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Configuration</h5>
                    <div className="bg-gray-50 rounded p-3">
                      <pre className="text-xs text-gray-600 overflow-x-auto">
                        {JSON.stringify(component.configuration, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Dependencies */}
                {component.dependencies && component.dependencies.length > 0 && (
                  <div className="mt-3">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Dependencies</h5>
                    <div className="flex flex-wrap gap-1">
                      {component.dependencies.map(dep => (
                        <span key={dep} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {dep}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => copyToClipboard(JSON.stringify(component, null, 2))}
                className="p-2 text-gray-400 hover:text-gray-600"
                title="Copy component configuration"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderConfigurationTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Configuration</h3>
        <button
          onClick={previewConfiguration}
          className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Play className="h-4 w-4" />
          <span>Preview Configuration</span>
        </button>
      </div>

      {/* Parameters */}
      {pattern.parameters && pattern.parameters.length > 0 && (
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-3">Parameters</h4>
          <div className="space-y-3">
            {pattern.parameters.map((param, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h5 className="text-sm font-semibold text-gray-900">{param.name}</h5>
                      <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {param.type}
                      </span>
                      {param.required && (
                        <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                          Required
                        </span>
                      )}
                    </div>
                    
                    {param.description && (
                      <p className="text-gray-700 text-sm mb-2">{param.description}</p>
                    )}

                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      {param.defaultValue !== undefined && (
                        <span>Default: <code className="bg-gray-100 px-1 rounded">{String(param.defaultValue)}</code></span>
                      )}
                      {param.allowedValues && param.allowedValues.length > 0 && (
                        <span>
                          Values: {param.allowedValues.map(v => 
                            <code key={v} className="bg-gray-100 px-1 rounded mr-1">{String(v)}</code>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Example Configuration */}
      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-3">Example Configuration</h4>
        <div className="bg-gray-900 rounded-lg p-4">
          <pre className="text-green-400 text-sm overflow-x-auto">
            <code>{JSON.stringify({
              pattern_id: pattern.id,
              name: pattern.name,
              parameters: pattern.parameters?.reduce((acc, param) => {
                acc[param.name] = param.defaultValue || `<${param.type}>`;
                return acc;
              }, {} as any) || {}
            }, null, 2)}</code>
          </pre>
        </div>
      </div>
    </div>
  );

  const renderValidationTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Validation Results</h3>
        <button
          onClick={validatePattern}
          disabled={isValidating}
          className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isValidating ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Shield className="h-4 w-4" />
          )}
          <span>Re-validate</span>
        </button>
      </div>

      {validationResult && (
        <div className="space-y-4">
          {/* Overall Status */}
          <div className={`p-4 rounded-lg ${
            validationResult.valid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center">
              {validationResult.valid ? (
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              )}
              <h4 className={`font-medium ${validationResult.valid ? 'text-green-800' : 'text-red-800'}`}>
                {validationResult.valid ? 'Pattern is valid' : 'Pattern has validation issues'}
              </h4>
            </div>
          </div>

          {/* Errors */}
          {validationResult.errors.length > 0 && (
            <div>
              <h4 className="text-md font-semibold text-red-800 mb-3">Errors</h4>
              <div className="space-y-2">
                {validationResult.errors.map((error, index) => (
                  <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-start">
                      <AlertTriangle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-red-800 font-medium">{error.code}</p>
                        <p className="text-red-700 text-sm">{error.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warnings */}
          {validationResult.warnings.length > 0 && (
            <div>
              <h4 className="text-md font-semibold text-yellow-800 mb-3">Warnings</h4>
              <div className="space-y-2">
                {validationResult.warnings.map((warning, index) => (
                  <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-start">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-yellow-800 font-medium">{warning.code}</p>
                        <p className="text-yellow-700 text-sm">{warning.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {validationResult.suggestions.length > 0 && (
            <div>
              <h4 className="text-md font-semibold text-blue-800 mb-3">Suggestions</h4>
              <div className="space-y-2">
                {validationResult.suggestions.map((suggestion, index) => (
                  <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-start">
                      <Info className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-blue-800 font-medium">{suggestion.code}</p>
                        <p className="text-blue-700 text-sm">{suggestion.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderDocumentationTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Documentation</h3>

      {/* Links */}
      {pattern.documentation && pattern.documentation.length > 0 && (
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-3">Documentation Links</h4>
          <div className="space-y-2">
            {pattern.documentation.map((doc, index) => (
              <a
                key={index}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
              >
                <ExternalLink className="h-4 w-4" />
                <span>{doc.title}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* License */}
      {pattern.license && (
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-3">License</h4>
          <p className="text-gray-700">{pattern.license}</p>
        </div>
      )}

      {/* Changelog */}
      {pattern.changelog && pattern.changelog.length > 0 && (
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-3">Changelog</h4>
          <div className="space-y-3">
            {pattern.changelog.slice(0, 5).map((change, index) => (
              <div key={index} className="border-l-4 border-blue-200 pl-4">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-gray-900">{change.version}</span>
                  <span className="text-sm text-gray-500">{change.date}</span>
                </div>
                <p className="text-gray-700 text-sm">{change.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverviewTab();
      case 'architecture': return renderArchitectureTab();
      case 'components': return renderComponentsTab();
      case 'configuration': return renderConfigurationTab();
      case 'validation': return renderValidationTab();
      case 'documentation': return renderDocumentationTab();
      default: return renderOverviewTab();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{pattern.name}</h2>
              <p className="text-gray-600">{pattern.category} • {pattern.complexity}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${COMPLEXITY_COLORS[pattern.complexity]}`}>
                {pattern.complexity}
              </span>
              {pattern.featured && (
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                  Featured
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleImport}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Import Pattern</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};