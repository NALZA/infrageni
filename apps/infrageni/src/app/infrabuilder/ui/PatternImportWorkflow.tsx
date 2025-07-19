/**
 * Pattern Import Workflow Component
 * Comprehensive workflow for importing patterns from various sources
 */

import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Download, 
  FileText, 
  Link, 
  Github, 
  Cloud,
  X,
  Check,
  AlertTriangle,
  Info,
  ChevronRight,
  ChevronDown,
  Play,
  Eye,
  Settings,
  Zap
} from 'lucide-react';
import { 
  InfrastructurePattern,
  ImportSource,
  ImportResult,
  ImportProgress,
  BatchImportResult 
} from '../patterns/core/pattern-types';
import { patternImportExport } from '../patterns/core/pattern-import-export';
import { PatternPreview } from '../patterns/ui/PatternPreview';

export interface PatternImportWorkflowProps {
  isVisible: boolean;
  onClose: () => void;
  onImportComplete: (patterns: InfrastructurePattern[]) => void;
  onPatternPreview?: (pattern: InfrastructurePattern) => void;
}

type ImportSourceType = 'file' | 'url' | 'git' | 'registry' | 'terraform' | 'cloudformation' | 'kubernetes';

interface ImportStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
  error?: string;
}

interface ImportJob {
  id: string;
  source: ImportSource;
  progress: ImportProgress;
  result?: ImportResult;
  error?: string;
}

export const PatternImportWorkflow: React.FC<PatternImportWorkflowProps> = ({
  isVisible,
  onClose,
  onImportComplete,
  onPatternPreview
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [sourceType, setSourceType] = useState<ImportSourceType>('file');
  const [importSources, setImportSources] = useState<ImportSource[]>([]);
  const [importJobs, setImportJobs] = useState<ImportJob[]>([]);
  const [importedPatterns, setImportedPatterns] = useState<InfrastructurePattern[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewPattern, setPreviewPattern] = useState<InfrastructurePattern | null>(null);
  const [validationResults, setValidationResults] = useState<Record<string, any>>({});
  
  // Form states
  const [fileInputs, setFileInputs] = useState<File[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [gitInput, setGitInput] = useState({ repo: '', branch: 'main', path: '' });
  const [registryInput, setRegistryInput] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps: ImportStep[] = [
    {
      id: 'source',
      title: 'Select Source',
      description: 'Choose where to import patterns from',
      completed: importSources.length > 0,
      current: currentStep === 0
    },
    {
      id: 'configure',
      title: 'Configure Import',
      description: 'Set import options and parameters',
      completed: currentStep > 1,
      current: currentStep === 1
    },
    {
      id: 'validate',
      title: 'Validate Patterns',
      description: 'Check pattern validity and compatibility',
      completed: currentStep > 2,
      current: currentStep === 2
    },
    {
      id: 'import',
      title: 'Import Patterns',
      description: 'Import validated patterns into the library',
      completed: importedPatterns.length > 0,
      current: currentStep === 3
    }
  ];

  const sourceTypeOptions = [
    { 
      type: 'file' as ImportSourceType, 
      icon: FileText, 
      title: 'Local Files', 
      description: 'Import from JSON/YAML files on your computer' 
    },
    { 
      type: 'url' as ImportSourceType, 
      icon: Link, 
      title: 'Remote URL', 
      description: 'Import from a web URL or API endpoint' 
    },
    { 
      type: 'git' as ImportSourceType, 
      icon: Github, 
      title: 'Git Repository', 
      description: 'Import from a Git repository' 
    },
    { 
      type: 'registry' as ImportSourceType, 
      icon: Cloud, 
      title: 'Pattern Registry', 
      description: 'Import from a pattern registry' 
    },
    { 
      type: 'terraform' as ImportSourceType, 
      icon: Settings, 
      title: 'Terraform', 
      description: 'Convert Terraform configurations to patterns' 
    },
    { 
      type: 'cloudformation' as ImportSourceType, 
      icon: Cloud, 
      title: 'CloudFormation', 
      description: 'Convert CloudFormation templates to patterns' 
    },
    { 
      type: 'kubernetes' as ImportSourceType, 
      icon: Settings, 
      title: 'Kubernetes', 
      description: 'Convert Kubernetes manifests to patterns' 
    }
  ];

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    setFileInputs(fileArray);
    
    const sources: ImportSource[] = fileArray.map(file => ({
      type: 'file',
      source: file.name,
      options: { file }
    }));
    
    setImportSources(sources);
  };

  const addUrlSource = () => {
    if (!urlInput.trim()) return;
    
    const source: ImportSource = {
      type: 'url',
      source: urlInput.trim()
    };
    
    setImportSources([...importSources, source]);
    setUrlInput('');
  };

  const addGitSource = () => {
    if (!gitInput.repo.trim()) return;
    
    const source: ImportSource = {
      type: 'git',
      source: gitInput.repo.trim(),
      options: {
        branch: gitInput.branch || 'main',
        path: gitInput.path || ''
      }
    };
    
    setImportSources([...importSources, source]);
    setGitInput({ repo: '', branch: 'main', path: '' });
  };

  const addRegistrySource = () => {
    if (!registryInput.trim()) return;
    
    const source: ImportSource = {
      type: 'registry',
      source: registryInput.trim()
    };
    
    setImportSources([...importSources, source]);
    setRegistryInput('');
  };

  const removeSource = (index: number) => {
    setImportSources(importSources.filter((_, i) => i !== index));
  };

  const validatePatterns = async () => {
    try {
      setCurrentStep(2);
      const results: Record<string, any> = {};
      
      for (const source of importSources) {
        try {
          const result = await patternImportExport.importPattern(source);
          results[source.source] = result;
        } catch (error) {
          results[source.source] = {
            success: false,
            errors: [error instanceof Error ? error.message : 'Validation failed'],
            warnings: []
          };
        }
      }
      
      setValidationResults(results);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const performImport = async () => {
    try {
      setIsImporting(true);
      setCurrentStep(3);
      
      const jobs: ImportJob[] = importSources.map(source => ({
        id: `${source.type}-${Date.now()}-${Math.random()}`,
        source,
        progress: {
          stage: 'downloading',
          progress: 0,
          message: 'Starting import...'
        }
      }));
      
      setImportJobs(jobs);
      
      const importPromises = jobs.map(async (job) => {
        try {
          const result = await patternImportExport.importPattern(
            job.source,
            (progress) => {
              setImportJobs(prev => prev.map(j => 
                j.id === job.id ? { ...j, progress } : j
              ));
            }
          );
          
          setImportJobs(prev => prev.map(j => 
            j.id === job.id ? { ...j, result } : j
          ));
          
          return result;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Import failed';
          setImportJobs(prev => prev.map(j => 
            j.id === job.id ? { ...j, error: errorMessage } : j
          ));
          return null;
        }
      });
      
      const results = await Promise.all(importPromises);
      const successfulPatterns = results
        .filter((result): result is ImportResult => result !== null && result.success)
        .map(result => result.pattern!)
        .filter((pattern): pattern is InfrastructurePattern => pattern !== undefined);
      
      setImportedPatterns(successfulPatterns);
      
      if (successfulPatterns.length > 0) {
        onImportComplete(successfulPatterns);
      }
      
    } catch (error) {
      console.error('Import process failed:', error);
    } finally {
      setIsImporting(false);
    }
  };

  const handlePatternPreview = (pattern: InfrastructurePattern) => {
    setPreviewPattern(pattern);
    setShowPreview(true);
    onPatternPreview?.(pattern);
  };

  const renderStepProgress = () => (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className={`
            w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
            ${step.completed ? 'bg-green-500 text-white' : 
              step.current ? 'bg-blue-500 text-white' : 
              'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}
          `}>
            {step.completed ? <Check className="h-5 w-5" /> : index + 1}
          </div>
          <div className="ml-3">
            <div className={`text-sm font-medium ${
              step.completed || step.current ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
            }`}>
              {step.title}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {step.description}
            </div>
          </div>
          {index < steps.length - 1 && (
            <ChevronRight className="h-5 w-5 text-gray-400 mx-4" />
          )}
        </div>
      ))}
    </div>
  );

  const renderSourceSelection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Choose Import Source
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {sourceTypeOptions.map(option => {
            const Icon = option.icon;
            return (
              <button
                key={option.type}
                onClick={() => setSourceType(option.type)}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  sourceType === option.type
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-2" />
                <div className="font-medium text-gray-900 dark:text-white">{option.title}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{option.description}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Source-specific inputs */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        {sourceType === 'file' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Pattern Files
            </label>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".json,.yaml,.yml"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
            >
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <div className="text-gray-600 dark:text-gray-400">
                Click to select files or drag and drop
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Supports JSON and YAML files
              </div>
            </button>
          </div>
        )}

        {sourceType === 'url' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Pattern URL
            </label>
            <div className="flex space-x-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/pattern.json"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <button
                onClick={addUrlSource}
                disabled={!urlInput.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </div>
        )}

        {sourceType === 'git' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Git Repository
              </label>
              <input
                type="text"
                value={gitInput.repo}
                onChange={(e) => setGitInput({ ...gitInput, repo: e.target.value })}
                placeholder="https://github.com/user/repo.git"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Branch
                </label>
                <input
                  type="text"
                  value={gitInput.branch}
                  onChange={(e) => setGitInput({ ...gitInput, branch: e.target.value })}
                  placeholder="main"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Path (optional)
                </label>
                <input
                  type="text"
                  value={gitInput.path}
                  onChange={(e) => setGitInput({ ...gitInput, path: e.target.value })}
                  placeholder="patterns/"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <button
              onClick={addGitSource}
              disabled={!gitInput.repo.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Add Repository
            </button>
          </div>
        )}

        {sourceType === 'registry' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Pattern ID
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={registryInput}
                onChange={(e) => setRegistryInput(e.target.value)}
                placeholder="pattern-id or registry-url/pattern-id"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <button
                onClick={addRegistrySource}
                disabled={!registryInput.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Selected sources */}
      {importSources.length > 0 && (
        <div>
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
            Selected Sources ({importSources.length})
          </h4>
          <div className="space-y-2">
            {importSources.map((source, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {source.source}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {source.type}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeSource(index)}
                  className="p-1 text-gray-400 hover:text-red-600 rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderValidationResults = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Validation Results
      </h3>
      
      {Object.entries(validationResults).map(([source, result]) => (
        <div
          key={source}
          className={`p-4 rounded-lg border ${
            result.success
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                {result.success ? (
                  <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                )}
                <span className="font-medium text-gray-900 dark:text-white">
                  {source}
                </span>
              </div>
              
              {result.success && result.pattern && (
                <div className="ml-7">
                  <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    Pattern: <span className="font-medium">{result.pattern.name}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-gray-600 dark:text-gray-400">
                    <span>Category: {result.pattern.category}</span>
                    <span>Complexity: {result.pattern.complexity}</span>
                    <span>Components: {result.pattern.components.length}</span>
                  </div>
                </div>
              )}
              
              {result.errors && result.errors.length > 0 && (
                <div className="ml-7">
                  <div className="text-sm text-red-700 dark:text-red-300 mb-1">Errors:</div>
                  {result.errors.map((error: string, index: number) => (
                    <div key={index} className="text-xs text-red-600 dark:text-red-400">
                      • {error}
                    </div>
                  ))}
                </div>
              )}
              
              {result.warnings && result.warnings.length > 0 && (
                <div className="ml-7">
                  <div className="text-sm text-yellow-700 dark:text-yellow-300 mb-1">Warnings:</div>
                  {result.warnings.map((warning: string, index: number) => (
                    <div key={index} className="text-xs text-yellow-600 dark:text-yellow-400">
                      • {warning}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {result.success && result.pattern && (
              <button
                onClick={() => handlePatternPreview(result.pattern)}
                className="ml-4 p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded"
                title="Preview pattern"
              >
                <Eye className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderImportProgress = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Import Progress
      </h3>
      
      {importJobs.map(job => (
        <div key={job.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-gray-900 dark:text-white">
              {job.source.source}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {job.progress.stage}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${job.progress.progress}%` }}
            />
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {job.progress.message}
          </div>
          
          {job.error && (
            <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded text-sm text-red-700 dark:text-red-300">
              {job.error}
            </div>
          )}
        </div>
      ))}
      
      {importedPatterns.length > 0 && (
        <div className="mt-6">
          <h4 className="text-md font-semibold text-green-700 dark:text-green-400 mb-3">
            Successfully Imported ({importedPatterns.length})
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {importedPatterns.map(pattern => (
              <div key={pattern.id} className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="font-medium text-gray-900 dark:text-white">
                  {pattern.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {pattern.category} • {pattern.components.length} components
                </div>
                <button
                  onClick={() => handlePatternPreview(pattern)}
                  className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  Preview
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const canProceedToNext = () => {
    switch (currentStep) {
      case 0: return importSources.length > 0;
      case 1: return true; // Configuration step - always can proceed
      case 2: return Object.values(validationResults).some((r: any) => r.success);
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep === 0) {
      setCurrentStep(1);
    } else if (currentStep === 1) {
      validatePatterns();
    } else if (currentStep === 2) {
      performImport();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Upload className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Import Patterns
            </h2>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          {renderStepProgress()}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {currentStep === 0 && renderSourceSelection()}
          {currentStep === 1 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Configure Import Options
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-center">
                    <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                    <span className="text-blue-700 dark:text-blue-300">
                      Ready to validate {importSources.length} pattern source{importSources.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          {currentStep === 2 && renderValidationResults()}
          {currentStep === 3 && renderImportProgress()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                disabled={isImporting}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
              >
                Back
              </button>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {currentStep < 3 && (
              <button
                onClick={handleNext}
                disabled={!canProceedToNext() || isImporting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
              >
                {currentStep === 2 ? (
                  <>
                    <Play className="h-4 w-4" />
                    <span>Import</span>
                  </>
                ) : (
                  <>
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </button>
            )}
            
            {importedPatterns.length > 0 && (
              <button
                onClick={onClose}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Complete
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Pattern Preview Modal */}
      {showPreview && previewPattern && (
        <PatternPreview
          pattern={previewPattern}
          onClose={() => setShowPreview(false)}
          onImport={() => {}}
        />
      )}
    </div>
  );
};