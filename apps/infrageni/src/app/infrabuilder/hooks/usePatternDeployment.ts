/**
 * Pattern Deployment Hook
 * Handles pattern deployment to the canvas workspace
 */

import { useState, useCallback } from 'react';
import { useEditor, TLShapeId } from 'tldraw';
import { InfrastructurePattern } from '../patterns/core/pattern-types';
import { workspaceIntegration, PatternDeploymentOptions, DeploymentResult } from '../patterns/integration/workspace-integration';
import { createComponentShape } from '../shapes';
import { ComponentRegistry } from '../components/core/component-registry';

export interface PatternDeploymentHookOptions {
  onDeploymentSuccess?: (pattern: InfrastructurePattern, result: DeploymentResult) => void;
  onDeploymentError?: (pattern: InfrastructurePattern, error: string) => void;
  defaultPosition?: { x: number; y: number };
  autoLayout?: boolean;
}

export interface PatternDeploymentStatus {
  isDeploying: boolean;
  progress: number;
  currentStep: string;
  error: string | null;
  deployedShapeIds: TLShapeId[];
}

export const usePatternDeployment = (options: PatternDeploymentHookOptions = {}) => {
  const editor = useEditor();
  const [deploymentStatus, setDeploymentStatus] = useState<PatternDeploymentStatus>({
    isDeploying: false,
    progress: 0,
    currentStep: '',
    error: null,
    deployedShapeIds: []
  });

  // Get current workspace state from editor
  const getWorkspaceState = useCallback(() => {
    if (!editor) return null;

    const shapes = editor.getCurrentPageShapes();
    const connections = shapes
      .filter(shape => shape.type === 'arrow')
      .map(arrow => ({
        from: arrow.props?.start?.boundShapeId || '',
        to: arrow.props?.end?.boundShapeId || '',
        type: 'connection'
      }));

    return {
      components: shapes
        .filter(shape => shape.type !== 'arrow')
        .map(shape => ({
          id: shape.id,
          type: shape.props?.componentId || shape.type,
          position: { x: shape.x, y: shape.y },
          configuration: shape.props || {},
          connections: connections
            .filter(conn => conn.from === shape.id || conn.to === shape.id)
            .map(conn => conn.from === shape.id ? conn.to : conn.from)
        })),
      connections,
      metadata: {
        name: 'InfraBuilder Workspace',
        description: 'Current workspace state',
        version: '1.0.0',
        lastModified: new Date()
      }
    };
  }, [editor]);

  // Deploy pattern to canvas
  const deployPattern = useCallback(async (
    pattern: InfrastructurePattern,
    deploymentOptions: PatternDeploymentOptions = {}
  ) => {
    if (!editor) {
      throw new Error('Editor not available');
    }

    try {
      setDeploymentStatus({
        isDeploying: true,
        progress: 0,
        currentStep: 'Preparing deployment...',
        error: null,
        deployedShapeIds: []
      });

      // Get current workspace state
      const workspaceState = getWorkspaceState();
      if (!workspaceState) {
        throw new Error('Failed to get workspace state');
      }

      setDeploymentStatus(prev => ({
        ...prev,
        progress: 20,
        currentStep: 'Validating pattern...'
      }));

      // Set deployment options with defaults
      const finalOptions: PatternDeploymentOptions = {
        position: options.defaultPosition || { x: 100, y: 100 },
        autoLayout: options.autoLayout ?? true,
        preserveExisting: true,
        validation: {
          checkConflicts: true,
          validateConnections: true,
          enforceConstraints: true
        },
        ...deploymentOptions
      };

      setDeploymentStatus(prev => ({
        ...prev,
        progress: 40,
        currentStep: 'Deploying components...'
      }));

      // Deploy pattern using workspace integration
      const result = await workspaceIntegration.deployPattern(
        pattern,
        workspaceState,
        finalOptions
      );

      if (!result.success) {
        throw new Error(result.errors.join(', '));
      }

      setDeploymentStatus(prev => ({
        ...prev,
        progress: 60,
        currentStep: 'Creating canvas shapes...'
      }));

      // Create shapes on canvas
      const componentRegistry = ComponentRegistry.getInstance();
      const deployedShapeIds: TLShapeId[] = [];

      for (const component of result.deployedComponents) {
        try {
          // Get component metadata from registry
          const componentMetadata = componentRegistry.getComponent(component.type);
          
          if (componentMetadata) {
            // Create shape using the component registry system
            const shapeId = createComponentShape(
              editor,
              componentMetadata.id,
              component.position,
              component.configuration
            );
            
            if (shapeId) {
              deployedShapeIds.push(shapeId);
            }
          } else {
            // Fallback to basic shape creation
            const shapeId = `shape:${Date.now()}-${Math.random().toString(36).substr(2, 9)}` as TLShapeId;
            
            editor.createShape({
              id: shapeId,
              type: 'geo',
              x: component.position.x,
              y: component.position.y,
              props: {
                w: 120,
                h: 80,
                geo: 'rectangle',
                fill: 'solid',
                color: 'blue',
                text: component.id,
                ...component.configuration
              }
            });
            
            deployedShapeIds.push(shapeId);
          }
        } catch (shapeError) {
          console.warn(`Failed to create shape for component ${component.id}:`, shapeError);
        }
      }

      setDeploymentStatus(prev => ({
        ...prev,
        progress: 80,
        currentStep: 'Creating connections...'
      }));

      // Create connections between components
      if (pattern.relationships) {
        for (const relationship of pattern.relationships) {
          try {
            const fromShape = deployedShapeIds.find(id => 
              editor.getShape(id)?.props?.componentId === relationship.from
            );
            const toShape = deployedShapeIds.find(id => 
              editor.getShape(id)?.props?.componentId === relationship.to
            );

            if (fromShape && toShape) {
              const arrowId = `arrow:${Date.now()}-${Math.random().toString(36).substr(2, 9)}` as TLShapeId;
              
              editor.createShape({
                id: arrowId,
                type: 'arrow',
                props: {
                  start: { type: 'binding', boundShapeId: fromShape, normalizedAnchor: { x: 0.5, y: 0.5 } },
                  end: { type: 'binding', boundShapeId: toShape, normalizedAnchor: { x: 0.5, y: 0.5 } },
                  color: 'blue',
                  fill: 'none'
                }
              });
            }
          } catch (connectionError) {
            console.warn(`Failed to create connection ${relationship.from} -> ${relationship.to}:`, connectionError);
          }
        }
      }

      setDeploymentStatus(prev => ({
        ...prev,
        progress: 100,
        currentStep: 'Deployment complete!'
      }));

      // Center view on deployed components if auto-layout is enabled
      if (finalOptions.autoLayout && deployedShapeIds.length > 0) {
        editor.select(...deployedShapeIds);
        editor.zoomToSelection();
      }

      // Success callback
      options.onDeploymentSuccess?.(pattern, {
        ...result,
        deployedComponents: result.deployedComponents.map((comp, index) => ({
          ...comp,
          canvasShapeId: deployedShapeIds[index]
        }))
      });

      // Reset status after a delay
      setTimeout(() => {
        setDeploymentStatus({
          isDeploying: false,
          progress: 0,
          currentStep: '',
          error: null,
          deployedShapeIds
        });
      }, 2000);

      return {
        success: true,
        deployedShapeIds,
        result
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown deployment error';
      
      setDeploymentStatus({
        isDeploying: false,
        progress: 0,
        currentStep: '',
        error: errorMessage,
        deployedShapeIds: []
      });

      options.onDeploymentError?.(pattern, errorMessage);

      return {
        success: false,
        error: errorMessage
      };
    }
  }, [editor, options, getWorkspaceState]);

  // Clear deployment status
  const clearStatus = useCallback(() => {
    setDeploymentStatus({
      isDeploying: false,
      progress: 0,
      currentStep: '',
      error: null,
      deployedShapeIds: []
    });
  }, []);

  // Get deployment preview without actually deploying
  const getDeploymentPreview = useCallback(async (
    pattern: InfrastructurePattern,
    deploymentOptions: PatternDeploymentOptions = {}
  ) => {
    const workspaceState = getWorkspaceState();
    if (!workspaceState) {
      throw new Error('Failed to get workspace state');
    }

    const finalOptions: PatternDeploymentOptions = {
      position: options.defaultPosition || { x: 100, y: 100 },
      autoLayout: options.autoLayout ?? true,
      preserveExisting: true,
      validation: {
        checkConflicts: true,
        validateConnections: true,
        enforceConstraints: true
      },
      ...deploymentOptions
    };

    return workspaceIntegration.previewDeployment(
      pattern,
      workspaceState,
      finalOptions
    );
  }, [getWorkspaceState, options]);

  return {
    deploymentStatus,
    deployPattern,
    getDeploymentPreview,
    clearStatus,
    isDeploying: deploymentStatus.isDeploying
  };
};