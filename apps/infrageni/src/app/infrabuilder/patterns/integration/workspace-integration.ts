/**
 * Workspace Integration System
 * Seamless integration between patterns and the infrabuilder workspace
 */

import { 
  InfrastructurePattern, 
  ComponentReference, 
  PatternTemplate,
  PatternParameter
} from '../core/pattern-types';
import { patternImportExport } from '../core/pattern-import-export';
import { templateEngine } from '../core/template-engine';
import { PatternRegistry } from '../core/pattern-registry';

// Import workspace types
interface WorkspaceComponent {
  id: string;
  type: string;
  position: { x: number; y: number };
  configuration: Record<string, any>;
  connections: string[];
}

interface WorkspaceState {
  components: WorkspaceComponent[];
  connections: Array<{
    from: string;
    to: string;
    type: string;
  }>;
  metadata: {
    name: string;
    description: string;
    version: string;
    lastModified: Date;
  };
}

export interface PatternDeploymentOptions {
  position?: { x: number; y: number };
  autoLayout?: boolean;
  preserveExisting?: boolean;
  parameterOverrides?: Record<string, any>;
  naming?: {
    prefix?: string;
    suffix?: string;
    strategy?: 'preserve' | 'prefix' | 'increment';
  };
  validation?: {
    checkConflicts?: boolean;
    validateConnections?: boolean;
    enforceConstraints?: boolean;
  };
}

export interface DeploymentResult {
  success: boolean;
  deployedComponents: WorkspaceComponent[];
  errors: string[];
  warnings: string[];
  conflicts?: ConflictInfo[];
  layout?: LayoutInfo;
}

export interface ConflictInfo {
  type: 'naming' | 'position' | 'connection' | 'configuration';
  severity: 'error' | 'warning';
  message: string;
  component?: string;
  suggestion?: string;
}

export interface LayoutInfo {
  bounds: { width: number; height: number };
  center: { x: number; y: number };
  spacing: { horizontal: number; vertical: number };
}

export interface WorkspaceSnapshot {
  timestamp: Date;
  components: WorkspaceComponent[];
  metadata: any;
  patterns: string[];
}

class WorkspaceIntegration {
  private registry: PatternRegistry;
  private layoutStrategies = new Map<string, LayoutStrategy>();

  constructor() {
    this.registry = PatternRegistry.getInstance();
    this.initializeLayoutStrategies();
  }

  /**
   * Deploy a pattern to the workspace
   */
  async deployPattern(
    pattern: InfrastructurePattern,
    workspace: WorkspaceState,
    options: PatternDeploymentOptions = {}
  ): Promise<DeploymentResult> {
    try {
      // Validate pattern before deployment
      if (options.validation?.enforceConstraints) {
        const validationResult = await this.validatePatternForWorkspace(pattern, workspace);
        if (!validationResult.valid) {
          return {
            success: false,
            deployedComponents: [],
            errors: validationResult.errors,
            warnings: validationResult.warnings
          };
        }
      }

      // Check for conflicts
      const conflicts = options.validation?.checkConflicts 
        ? await this.detectConflicts(pattern, workspace, options)
        : [];

      const criticalConflicts = conflicts.filter(c => c.severity === 'error');
      if (criticalConflicts.length > 0) {
        return {
          success: false,
          deployedComponents: [],
          errors: criticalConflicts.map(c => c.message),
          warnings: conflicts.filter(c => c.severity === 'warning').map(c => c.message),
          conflicts
        };
      }

      // Apply parameter overrides
      const processedPattern = options.parameterOverrides
        ? this.applyParameterOverrides(pattern, options.parameterOverrides)
        : pattern;

      // Convert pattern components to workspace components
      const workspaceComponents = await this.convertToWorkspaceComponents(
        processedPattern,
        options
      );

      // Apply layout strategy
      const layoutResult = options.autoLayout !== false
        ? await this.applyLayout(workspaceComponents, workspace, options)
        : { components: workspaceComponents, layout: this.calculateBounds(workspaceComponents) };

      // Validate connections if requested
      if (options.validation?.validateConnections) {
        const connectionValidation = this.validateConnections(
          layoutResult.components,
          processedPattern.relationships || []
        );
        if (!connectionValidation.valid) {
          return {
            success: false,
            deployedComponents: [],
            errors: connectionValidation.errors,
            warnings: connectionValidation.warnings
          };
        }
      }

      return {
        success: true,
        deployedComponents: layoutResult.components,
        errors: [],
        warnings: conflicts.filter(c => c.severity === 'warning').map(c => c.message),
        conflicts: conflicts.filter(c => c.severity === 'warning'),
        layout: layoutResult.layout
      };

    } catch (error) {
      return {
        success: false,
        deployedComponents: [],
        errors: [error instanceof Error ? error.message : 'Unknown deployment error'],
        warnings: []
      };
    }
  }

  /**
   * Extract pattern from workspace components
   */
  async extractPattern(
    components: WorkspaceComponent[],
    metadata: {
      name: string;
      description: string;
      category?: string;
      author?: string;
    }
  ): Promise<InfrastructurePattern> {
    const pattern: InfrastructurePattern = {
      id: this.generatePatternId(metadata.name),
      name: metadata.name,
      description: metadata.description,
      category: metadata.category || 'Custom',
      complexity: this.analyzeComplexity(components),
      version: '1.0.0',
      status: 'draft',
      author: metadata.author || 'Workspace User',
      tags: this.extractTags(components),
      components: await this.convertFromWorkspaceComponents(components),
      relationships: this.extractRelationships(components),
      parameters: this.extractParameters(components),
      useCases: [],
      designPrinciples: [],
      providers: this.extractProviders(components),
      rating: 0,
      reviewCount: 0,
      downloadCount: 0,
      featured: false,
      lastUpdated: new Date().toISOString(),
      documentation: [],
      changelog: []
    };

    return pattern;
  }

  /**
   * Create workspace snapshot before pattern deployment
   */
  createSnapshot(workspace: WorkspaceState, label?: string): WorkspaceSnapshot {
    return {
      timestamp: new Date(),
      components: JSON.parse(JSON.stringify(workspace.components)),
      metadata: { ...workspace.metadata, snapshotLabel: label },
      patterns: this.getDeployedPatterns(workspace)
    };
  }

  /**
   * Restore workspace from snapshot
   */
  async restoreSnapshot(
    workspace: WorkspaceState,
    snapshot: WorkspaceSnapshot
  ): Promise<void> {
    workspace.components = JSON.parse(JSON.stringify(snapshot.components));
    workspace.metadata = { ...snapshot.metadata };
  }

  /**
   * Generate deployment preview
   */
  async previewDeployment(
    pattern: InfrastructurePattern,
    workspace: WorkspaceState,
    options: PatternDeploymentOptions = {}
  ): Promise<{
    preview: WorkspaceComponent[];
    layout: LayoutInfo;
    conflicts: ConflictInfo[];
    estimatedChanges: {
      added: number;
      modified: number;
      removed: number;
    };
  }> {
    // Simulate deployment without actually modifying workspace
    const workspaceComponents = await this.convertToWorkspaceComponents(pattern, options);
    const layoutResult = await this.applyLayout(workspaceComponents, workspace, options);
    const conflicts = await this.detectConflicts(pattern, workspace, options);

    return {
      preview: layoutResult.components,
      layout: layoutResult.layout,
      conflicts,
      estimatedChanges: {
        added: workspaceComponents.length,
        modified: 0,
        removed: 0
      }
    };
  }

  /**
   * Batch deploy multiple patterns
   */
  async deployPatternBatch(
    patterns: Array<{ pattern: InfrastructurePattern; options?: PatternDeploymentOptions }>,
    workspace: WorkspaceState,
    globalOptions?: {
      createSnapshot?: boolean;
      rollbackOnError?: boolean;
      parallelDeployment?: boolean;
    }
  ): Promise<Array<DeploymentResult & { patternId: string }>> {
    const results: Array<DeploymentResult & { patternId: string }> = [];
    let snapshot: WorkspaceSnapshot | null = null;

    // Create snapshot if requested
    if (globalOptions?.createSnapshot) {
      snapshot = this.createSnapshot(workspace, 'Pre-batch-deployment');
    }

    try {
      if (globalOptions?.parallelDeployment) {
        // Deploy patterns in parallel
        const deploymentPromises = patterns.map(async ({ pattern, options }) => {
          const result = await this.deployPattern(pattern, workspace, options);
          return { ...result, patternId: pattern.id };
        });

        const parallelResults = await Promise.all(deploymentPromises);
        results.push(...parallelResults);
      } else {
        // Deploy patterns sequentially
        for (const { pattern, options } of patterns) {
          const result = await this.deployPattern(pattern, workspace, options);
          results.push({ ...result, patternId: pattern.id });

          // If rollback on error is enabled and we have a failure, restore and exit
          if (!result.success && globalOptions?.rollbackOnError && snapshot) {
            await this.restoreSnapshot(workspace, snapshot);
            break;
          }

          // Update workspace with successfully deployed components
          if (result.success) {
            workspace.components.push(...result.deployedComponents);
          }
        }
      }

    } catch (error) {
      // Rollback on unexpected error
      if (globalOptions?.rollbackOnError && snapshot) {
        await this.restoreSnapshot(workspace, snapshot);
      }
      throw error;
    }

    return results;
  }

  // Private helper methods

  private async validatePatternForWorkspace(
    pattern: InfrastructurePattern,
    workspace: WorkspaceState
  ): Promise<{ valid: boolean; errors: string[]; warnings: string[] }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check if pattern components are compatible with workspace
    for (const component of pattern.components) {
      if (!this.isComponentTypeSupported(component.type)) {
        errors.push(`Unsupported component type: ${component.type}`);
      }
    }

    // Check for resource conflicts
    const resourceLimits = this.getWorkspaceResourceLimits(workspace);
    if (pattern.components.length + workspace.components.length > resourceLimits.maxComponents) {
      warnings.push(`Deployment will exceed recommended component count (${resourceLimits.maxComponents})`);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  private async detectConflicts(
    pattern: InfrastructurePattern,
    workspace: WorkspaceState,
    options: PatternDeploymentOptions
  ): Promise<ConflictInfo[]> {
    const conflicts: ConflictInfo[] = [];

    // Check naming conflicts
    const existingNames = new Set(workspace.components.map(c => c.id));
    for (const component of pattern.components) {
      const proposedName = this.generateComponentName(component, options.naming);
      if (existingNames.has(proposedName)) {
        conflicts.push({
          type: 'naming',
          severity: 'error',
          message: `Component name conflict: ${proposedName}`,
          component: component.name,
          suggestion: `Use naming prefix or increment strategy`
        });
      }
    }

    // Check position conflicts if specific position is requested
    if (options.position && !options.autoLayout) {
      const occupiedPositions = workspace.components.map(c => c.position);
      // Check for position overlaps
      // Implementation would check for spatial conflicts
    }

    return conflicts;
  }

  private applyParameterOverrides(
    pattern: InfrastructurePattern,
    overrides: Record<string, any>
  ): InfrastructurePattern {
    const processedPattern = JSON.parse(JSON.stringify(pattern));
    
    // Apply overrides to component configurations
    processedPattern.components = pattern.components.map(component => {
      const processedComponent = { ...component };
      
      if (processedComponent.configuration) {
        processedComponent.configuration = this.substituteParameters(
          processedComponent.configuration,
          overrides
        );
      }
      
      return processedComponent;
    });

    return processedPattern;
  }

  private substituteParameters(obj: any, parameters: Record<string, any>): any {
    if (typeof obj === 'string') {
      return obj.replace(/\$\{([^}]+)\}/g, (match, paramName) => {
        return parameters[paramName] !== undefined ? parameters[paramName] : match;
      });
    } else if (Array.isArray(obj)) {
      return obj.map(item => this.substituteParameters(item, parameters));
    } else if (typeof obj === 'object' && obj !== null) {
      const result: any = {};
      Object.entries(obj).forEach(([key, value]) => {
        result[key] = this.substituteParameters(value, parameters);
      });
      return result;
    }
    
    return obj;
  }

  private async convertToWorkspaceComponents(
    pattern: InfrastructurePattern,
    options: PatternDeploymentOptions
  ): Promise<WorkspaceComponent[]> {
    return pattern.components.map((component, index) => ({
      id: this.generateComponentName(component, options.naming),
      type: component.type,
      position: options.position ? {
        x: options.position.x + (index % 3) * 200,
        y: options.position.y + Math.floor(index / 3) * 150
      } : { x: index * 200, y: 0 },
      configuration: component.configuration || {},
      connections: []
    }));
  }

  private async convertFromWorkspaceComponents(
    components: WorkspaceComponent[]
  ): Promise<ComponentReference[]> {
    return components.map(component => ({
      name: component.id,
      type: component.type,
      description: `Extracted from workspace component ${component.id}`,
      configuration: component.configuration,
      required: true,
      dependencies: component.connections
    }));
  }

  private async applyLayout(
    components: WorkspaceComponent[],
    workspace: WorkspaceState,
    options: PatternDeploymentOptions
  ): Promise<{ components: WorkspaceComponent[]; layout: LayoutInfo }> {
    const strategy = this.layoutStrategies.get(options.autoLayout ? 'hierarchical' : 'grid') 
      || this.layoutStrategies.get('grid')!;
    
    const layoutResult = strategy.apply(components, workspace, options);
    
    return {
      components: layoutResult.components,
      layout: this.calculateBounds(layoutResult.components)
    };
  }

  private calculateBounds(components: WorkspaceComponent[]): LayoutInfo {
    if (components.length === 0) {
      return {
        bounds: { width: 0, height: 0 },
        center: { x: 0, y: 0 },
        spacing: { horizontal: 200, vertical: 150 }
      };
    }

    const positions = components.map(c => c.position);
    const minX = Math.min(...positions.map(p => p.x));
    const maxX = Math.max(...positions.map(p => p.x));
    const minY = Math.min(...positions.map(p => p.y));
    const maxY = Math.max(...positions.map(p => p.y));

    return {
      bounds: {
        width: maxX - minX + 200, // Add component width
        height: maxY - minY + 150  // Add component height
      },
      center: {
        x: (minX + maxX) / 2,
        y: (minY + maxY) / 2
      },
      spacing: { horizontal: 200, vertical: 150 }
    };
  }

  private validateConnections(
    components: WorkspaceComponent[],
    relationships: any[]
  ): { valid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Validate that all relationship references exist
    const componentIds = new Set(components.map(c => c.id));
    
    for (const relationship of relationships) {
      if (!componentIds.has(relationship.from)) {
        errors.push(`Connection source not found: ${relationship.from}`);
      }
      if (!componentIds.has(relationship.to)) {
        errors.push(`Connection target not found: ${relationship.to}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  private generateComponentName(component: ComponentReference, naming?: PatternDeploymentOptions['naming']): string {
    let name = component.name;
    
    if (naming?.prefix) {
      name = `${naming.prefix}${name}`;
    }
    
    if (naming?.suffix) {
      name = `${name}${naming.suffix}`;
    }
    
    return name;
  }

  private generatePatternId(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  }

  private analyzeComplexity(components: WorkspaceComponent[]): 'simple' | 'moderate' | 'complex' | 'expert' {
    const componentCount = components.length;
    if (componentCount <= 3) return 'simple';
    if (componentCount <= 7) return 'moderate';
    if (componentCount <= 15) return 'complex';
    return 'expert';
  }

  private extractTags(components: WorkspaceComponent[]): string[] {
    const tags = new Set<string>();
    
    components.forEach(component => {
      tags.add(component.type);
      // Extract additional tags from configuration
      if (component.configuration?.tags) {
        component.configuration.tags.forEach((tag: string) => tags.add(tag));
      }
    });
    
    return Array.from(tags);
  }

  private extractRelationships(components: WorkspaceComponent[]): any[] {
    const relationships: any[] = [];
    
    components.forEach(component => {
      component.connections.forEach(connectionId => {
        relationships.push({
          from: component.id,
          to: connectionId,
          type: 'dependency',
          description: `Connection from ${component.id} to ${connectionId}`
        });
      });
    });
    
    return relationships;
  }

  private extractParameters(components: WorkspaceComponent[]): PatternParameter[] {
    const parameters: PatternParameter[] = [];
    const paramSet = new Set<string>();
    
    components.forEach(component => {
      // Extract configurable properties as parameters
      Object.entries(component.configuration || {}).forEach(([key, value]) => {
        if (typeof value === 'string' && value.includes('${')) {
          const paramName = key;
          if (!paramSet.has(paramName)) {
            paramSet.add(paramName);
            parameters.push({
              name: paramName,
              type: 'string',
              description: `Configuration parameter for ${component.id}`,
              required: false,
              defaultValue: value
            });
          }
        }
      });
    });
    
    return parameters;
  }

  private extractProviders(components: WorkspaceComponent[]): string[] {
    const providers = new Set<string>();
    
    components.forEach(component => {
      // Infer provider from component type
      if (component.type.startsWith('aws-')) providers.add('AWS');
      if (component.type.startsWith('azure-')) providers.add('Azure');
      if (component.type.startsWith('gcp-')) providers.add('GCP');
    });
    
    return Array.from(providers);
  }

  private getDeployedPatterns(workspace: WorkspaceState): string[] {
    // Extract pattern metadata from workspace components
    const patterns = new Set<string>();
    
    workspace.components.forEach(component => {
      if (component.configuration?.patternId) {
        patterns.add(component.configuration.patternId);
      }
    });
    
    return Array.from(patterns);
  }

  private isComponentTypeSupported(type: string): boolean {
    // Check if component type is supported in the workspace
    const supportedTypes = new Set([
      'compute', 'storage', 'database', 'network', 'security',
      'aws-ec2', 'aws-s3', 'aws-rds', 'aws-vpc', 'aws-sg',
      'azure-vm', 'azure-storage', 'azure-sql', 'azure-vnet',
      'gcp-compute', 'gcp-storage', 'gcp-sql', 'gcp-vpc'
    ]);
    
    return supportedTypes.has(type);
  }

  private getWorkspaceResourceLimits(workspace: WorkspaceState): { maxComponents: number } {
    return {
      maxComponents: 100 // Configurable limit
    };
  }

  private initializeLayoutStrategies(): void {
    this.layoutStrategies.set('grid', new GridLayoutStrategy());
    this.layoutStrategies.set('hierarchical', new HierarchicalLayoutStrategy());
    this.layoutStrategies.set('circular', new CircularLayoutStrategy());
  }
}

// Layout strategy interfaces
interface LayoutStrategy {
  apply(
    components: WorkspaceComponent[],
    workspace: WorkspaceState,
    options: PatternDeploymentOptions
  ): { components: WorkspaceComponent[] };
}

class GridLayoutStrategy implements LayoutStrategy {
  apply(
    components: WorkspaceComponent[],
    workspace: WorkspaceState,
    options: PatternDeploymentOptions
  ): { components: WorkspaceComponent[] } {
    const baseX = options.position?.x || 0;
    const baseY = options.position?.y || 0;
    const spacing = { x: 200, y: 150 };
    const cols = Math.ceil(Math.sqrt(components.length));

    return {
      components: components.map((component, index) => ({
        ...component,
        position: {
          x: baseX + (index % cols) * spacing.x,
          y: baseY + Math.floor(index / cols) * spacing.y
        }
      }))
    };
  }
}

class HierarchicalLayoutStrategy implements LayoutStrategy {
  apply(
    components: WorkspaceComponent[],
    workspace: WorkspaceState,
    options: PatternDeploymentOptions
  ): { components: WorkspaceComponent[] } {
    // Simple hierarchical layout - arrange components in layers
    const baseX = options.position?.x || 0;
    const baseY = options.position?.y || 0;
    const layers = this.groupComponentsByLayer(components);
    
    let currentY = baseY;
    const layeredComponents: WorkspaceComponent[] = [];
    
    layers.forEach(layer => {
      const layerWidth = layer.length * 200;
      const startX = baseX - layerWidth / 2;
      
      layer.forEach((component, index) => {
        layeredComponents.push({
          ...component,
          position: {
            x: startX + index * 200,
            y: currentY
          }
        });
      });
      
      currentY += 150;
    });

    return { components: layeredComponents };
  }

  private groupComponentsByLayer(components: WorkspaceComponent[]): WorkspaceComponent[][] {
    // Simple grouping by component type
    const layers: WorkspaceComponent[][] = [];
    const typeGroups = new Map<string, WorkspaceComponent[]>();
    
    components.forEach(component => {
      const group = typeGroups.get(component.type) || [];
      group.push(component);
      typeGroups.set(component.type, group);
    });
    
    typeGroups.forEach(group => layers.push(group));
    return layers;
  }
}

class CircularLayoutStrategy implements LayoutStrategy {
  apply(
    components: WorkspaceComponent[],
    workspace: WorkspaceState,
    options: PatternDeploymentOptions
  ): { components: WorkspaceComponent[] } {
    const centerX = options.position?.x || 0;
    const centerY = options.position?.y || 0;
    const radius = Math.max(100, components.length * 30);
    
    return {
      components: components.map((component, index) => {
        const angle = (2 * Math.PI * index) / components.length;
        return {
          ...component,
          position: {
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle)
          }
        };
      })
    };
  }
}

export const workspaceIntegration = new WorkspaceIntegration();