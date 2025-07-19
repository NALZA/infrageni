/**
 * Pattern Preview Overlay Component
 * Canvas overlay for previewing patterns before deployment
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Play, 
  Eye, 
  Download, 
  Star,
  Clock,
  Layers,
  Settings,
  ZoomIn,
  ZoomOut,
  Move3D,
  RotateCcw,
  Check,
  AlertTriangle,
  Info
} from 'lucide-react';
import { InfrastructurePattern } from '../patterns/core/pattern-types';
import { usePatternDeployment } from '../hooks/usePatternDeployment';
import { workspaceIntegration } from '../patterns/integration/workspace-integration';

export interface PatternPreviewOverlayProps {
  pattern: InfrastructurePattern;
  position: { x: number; y: number };
  onClose: () => void;
  onDeploy: (pattern: InfrastructurePattern) => void;
  workspaceState?: any;
}

interface PreviewComponent {
  id: string;
  name: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isContainer: boolean;
  connections: string[];
}

interface PreviewConnection {
  from: string;
  to: string;
  type: string;
}

interface DeploymentPreview {
  components: PreviewComponent[];
  connections: PreviewConnection[];
  conflicts: any[];
  estimatedChanges: {
    added: number;
    modified: number;
    removed: number;
  };
  layout: {
    bounds: { width: number; height: number };
    center: { x: number; y: number };
  };
}

export const PatternPreviewOverlay: React.FC<PatternPreviewOverlayProps> = ({
  pattern,
  position,
  onClose,
  onDeploy,
  workspaceState
}) => {
  const [preview, setPreview] = useState<DeploymentPreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const [showDetails, setShowDetails] = useState(false);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const { deployPattern, deploymentStatus } = usePatternDeployment({
    defaultPosition: position,
    onDeploymentSuccess: () => {
      onDeploy(pattern);
      onClose();
    }
  });

  // Load deployment preview
  useEffect(() => {
    loadPreview();
  }, [pattern, workspaceState]);

  // Handle mouse events for panning
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isPanning) return;
      
      const deltaX = e.clientX - lastPanPoint.x;
      const deltaY = e.clientY - lastPanPoint.y;
      
      setPan(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      setIsPanning(false);
    };

    if (isPanning) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isPanning, lastPanPoint]);

  const loadPreview = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!workspaceState) {
        // Mock preview if no workspace state
        const mockPreview: DeploymentPreview = {
          components: pattern.components.map((comp, index) => ({
            id: comp.name,
            name: comp.name,
            type: comp.type,
            x: 50 + (index % 3) * 120,
            y: 50 + Math.floor(index / 3) * 100,
            width: 100,
            height: 80,
            isContainer: comp.type.includes('container') || comp.type.includes('group'),
            connections: comp.dependencies || []
          })),
          connections: pattern.relationships?.map(rel => ({
            from: rel.from,
            to: rel.to,
            type: rel.type
          })) || [],
          conflicts: [],
          estimatedChanges: {
            added: pattern.components.length,
            modified: 0,
            removed: 0
          },
          layout: {
            bounds: { width: 400, height: 300 },
            center: { x: 200, y: 150 }
          }
        };
        
        setPreview(mockPreview);
      } else {
        // Get actual preview from workspace integration
        const previewResult = await workspaceIntegration.previewDeployment(
          pattern,
          workspaceState,
          {
            position: position,
            autoLayout: true,
            preserveExisting: true,
            validation: {
              checkConflicts: true,
              validateConnections: true,
              enforceConstraints: true
            }
          }
        );

        const deploymentPreview: DeploymentPreview = {
          components: previewResult.preview.map(comp => ({
            id: comp.id,
            name: comp.id,
            type: comp.type,
            x: comp.position.x - position.x,
            y: comp.position.y - position.y,
            width: 100,
            height: 80,
            isContainer: comp.configuration?.isContainer || false,
            connections: comp.connections
          })),
          connections: pattern.relationships?.map(rel => ({
            from: rel.from,
            to: rel.to,
            type: rel.type
          })) || [],
          conflicts: previewResult.conflicts,
          estimatedChanges: previewResult.estimatedChanges,
          layout: previewResult.layout
        };

        setPreview(deploymentPreview);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load preview');
    } finally {
      setLoading(false);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // Left click
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.3));
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleDeploy = () => {
    deployPattern(pattern);
  };

  const renderComponent = (component: PreviewComponent) => {
    const hasConflicts = preview?.conflicts.some(c => c.component === component.id);
    
    return (
      <g key={component.id}>
        {/* Component rectangle */}
        <rect
          x={component.x}
          y={component.y}
          width={component.width}
          height={component.height}
          rx={8}
          fill={
            hasConflicts ? '#FEF2F2' :
            component.isContainer ? '#EBF8FF' : '#F7FAFC'
          }
          stroke={
            hasConflicts ? '#F87171' :
            component.isContainer ? '#3B82F6' : '#CBD5E0'
          }
          strokeWidth={hasConflicts ? 2 : 1}
          strokeDasharray={component.isContainer ? '5,5' : 'none'}
          className="transition-all duration-200 hover:stroke-blue-500"
        />
        
        {/* Component icon/type indicator */}
        <circle
          cx={component.x + 15}
          cy={component.y + 15}
          r={8}
          fill="#3B82F6"
          className="opacity-80"
        />
        
        {/* Component name */}
        <text
          x={component.x + component.width / 2}
          y={component.y + component.height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="12"
          fill="#374151"
          className="font-medium"
        >
          {component.name.length > 12 ? 
            `${component.name.substring(0, 12)}...` : 
            component.name
          }
        </text>
        
        {/* Conflict indicator */}
        {hasConflicts && (
          <g>
            <circle
              cx={component.x + component.width - 12}
              cy={component.y + 12}
              r={8}
              fill="#EF4444"
            />
            <text
              x={component.x + component.width - 12}
              y={component.y + 12}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="10"
              fill="white"
              fontWeight="bold"
            >
              !
            </text>
          </g>
        )}
      </g>
    );
  };

  const renderConnection = (connection: PreviewConnection) => {
    if (!preview) return null;
    
    const fromComponent = preview.components.find(c => c.id === connection.from);
    const toComponent = preview.components.find(c => c.id === connection.to);
    
    if (!fromComponent || !toComponent) return null;
    
    const fromX = fromComponent.x + fromComponent.width / 2;
    const fromY = fromComponent.y + fromComponent.height;
    const toX = toComponent.x + toComponent.width / 2;
    const toY = toComponent.y;
    
    return (
      <g key={`${connection.from}-${connection.to}`}>
        {/* Connection line */}
        <path
          d={`M ${fromX} ${fromY} Q ${fromX} ${fromY + 20} ${toX} ${toY}`}
          stroke="#6B7280"
          strokeWidth={2}
          fill="none"
          markerEnd="url(#arrowhead)"
          className="opacity-70"
        />
      </g>
    );
  };

  if (loading) {
    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <div className="bg-white dark:bg-gray-900 rounded-lg p-8 max-w-md" onClick={e => e.stopPropagation()}>
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-700 dark:text-gray-300">Loading pattern preview...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md" onClick={e => e.stopPropagation()}>
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Preview Error</h3>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{error}</p>
          <div className="flex space-x-3">
            <button
              onClick={loadPreview}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Pattern Preview
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">{pattern.name}</span>
              <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                {pattern.complexity}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center space-x-2"
            >
              <Info className="h-4 w-4" />
              <span>Details</span>
            </button>
            
            <button
              onClick={handleDeploy}
              disabled={deploymentStatus.isDeploying}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
            >
              {deploymentStatus.isDeploying ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Deploying...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  <span>Deploy</span>
                </>
              )}
            </button>
            
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Canvas */}
          <div className="flex-1 relative bg-gray-50 dark:bg-gray-800">
            {/* Controls */}
            <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 flex space-x-1">
                <button
                  onClick={handleZoomIn}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                  title="Zoom in"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                  title="Zoom out"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <button
                  onClick={resetView}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                  title="Reset view"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
              
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2">
                <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
                  Zoom: {Math.round(zoom * 100)}%
                </div>
              </div>
            </div>

            {/* Canvas content */}
            <div
              ref={canvasRef}
              className="w-full h-full overflow-hidden cursor-move"
              onMouseDown={handleMouseDown}
            >
              {preview && (
                <svg
                  ref={svgRef}
                  width="100%"
                  height="100%"
                  viewBox="0 0 800 600"
                  className="select-none"
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
                  }}
                >
                  {/* Define arrow marker */}
                  <defs>
                    <marker
                      id="arrowhead"
                      markerWidth="10"
                      markerHeight="7"
                      refX="9"
                      refY="3.5"
                      orient="auto"
                    >
                      <polygon
                        points="0 0, 10 3.5, 0 7"
                        fill="#6B7280"
                      />
                    </marker>
                  </defs>

                  {/* Render connections first (behind components) */}
                  {preview.connections.map(renderConnection)}

                  {/* Render components */}
                  {preview.components.map(renderComponent)}
                </svg>
              )}
            </div>

            {/* Status */}
            {preview && (
              <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      <span>{preview.estimatedChanges.added} new</span>
                    </div>
                    {preview.conflicts.length > 0 && (
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-red-500 rounded"></div>
                        <span>{preview.conflicts.length} conflicts</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Details panel */}
          {showDetails && preview && (
            <div className="w-80 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-y-auto">
              <div className="p-4 space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Pattern Details
                  </h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p>{pattern.description}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span>{pattern.rating.toFixed(1)} ({pattern.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Deployment Summary
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Components:</span>
                      <span className="text-gray-900 dark:text-white">{preview.components.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Connections:</span>
                      <span className="text-gray-900 dark:text-white">{preview.connections.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Conflicts:</span>
                      <span className={preview.conflicts.length > 0 ? 'text-red-600' : 'text-green-600'}>
                        {preview.conflicts.length}
                      </span>
                    </div>
                  </div>
                </div>

                {preview.conflicts.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-2">
                      Conflicts
                    </h3>
                    <div className="space-y-2">
                      {preview.conflicts.map((conflict, index) => (
                        <div key={index} className="p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                          <div className="text-sm text-red-700 dark:text-red-400 font-medium">
                            {conflict.type}
                          </div>
                          <div className="text-xs text-red-600 dark:text-red-500">
                            {conflict.message}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Components
                  </h3>
                  <div className="space-y-2">
                    {preview.components.map(component => (
                      <div key={component.id} className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {component.name}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {component.type}
                          {component.isContainer && ' (Container)'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};