/**
 * Pattern Validation Framework
 * Comprehensive validation for infrastructure patterns including architecture validation,
 * security checks, cost analysis, and performance considerations
 */

import {
  InfrastructurePattern,
  PatternValidationResult,
  ValidationError,
  ValidationWarning,
  ValidationSuggestion,
  ComponentReference,
  ComponentRelationship,
  RelationshipType,
  PatternComplexity
} from './pattern-types';
import { ComponentRegistry } from '../../components/core/component-registry';
import { ComponentMetadata, ComponentCategory } from '../../components/core/component-types';

export interface ValidationConfig {
  strictMode: boolean;
  securityChecks: boolean;
  performanceAnalysis: boolean;
  costOptimization: boolean;
  complianceValidation: boolean;
  architectureValidation: boolean;
}

export interface ValidationContext {
  targetProvider?: string;
  environment?: 'development' | 'staging' | 'production';
  region?: string;
  complianceFrameworks?: string[];
  budgetConstraints?: number;
}

export class PatternValidator {
  private componentRegistry: ComponentRegistry;
  private validationRules: ValidationRule[];

  constructor() {
    this.componentRegistry = ComponentRegistry.getInstance();
    this.validationRules = this.initializeValidationRules();
  }

  /**
   * Comprehensive pattern validation
   */
  async validatePattern(
    pattern: InfrastructurePattern,
    config: ValidationConfig = this.getDefaultConfig(),
    context: ValidationContext = {}
  ): Promise<PatternValidationResult> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const suggestions: ValidationSuggestion[] = [];

    // Basic structural validation
    this.validateStructure(pattern, errors, warnings);

    // Component validation
    await this.validateComponents(pattern, errors, warnings, context);

    // Relationship validation
    this.validateRelationships(pattern, errors, warnings);

    // Architecture validation
    if (config.architectureValidation) {
      this.validateArchitecture(pattern, errors, warnings, suggestions);
    }

    // Security validation
    if (config.securityChecks) {
      await this.validateSecurity(pattern, errors, warnings, suggestions, context);
    }

    // Performance validation
    if (config.performanceAnalysis) {
      this.validatePerformance(pattern, warnings, suggestions, context);
    }

    // Cost optimization
    if (config.costOptimization) {
      this.validateCostOptimization(pattern, warnings, suggestions, context);
    }

    // Compliance validation
    if (config.complianceValidation && context.complianceFrameworks) {
      await this.validateCompliance(pattern, warnings, suggestions, context);
    }

    // Custom rule validation
    this.applyCustomRules(pattern, errors, warnings, suggestions, config, context);

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      suggestions
    };
  }

  /**
   * Validate pattern structure
   */
  private validateStructure(
    pattern: InfrastructurePattern,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    // Required fields
    if (!pattern.id) {
      errors.push({
        code: 'MISSING_FIELD',
        message: 'Pattern ID is required',
        field: 'id',
        severity: 'error'
      });
    }

    if (!pattern.name) {
      errors.push({
        code: 'MISSING_FIELD',
        message: 'Pattern name is required',
        field: 'name',
        severity: 'error'
      });
    }

    if (!pattern.description) {
      errors.push({
        code: 'MISSING_FIELD',
        message: 'Pattern description is required',
        field: 'description',
        severity: 'error'
      });
    }

    // ID format validation
    if (pattern.id && !/^[a-z0-9-]+$/.test(pattern.id)) {
      errors.push({
        code: 'INVALID_FORMAT',
        message: 'Pattern ID must contain only lowercase letters, numbers, and hyphens',
        field: 'id',
        severity: 'error'
      });
    }

    // Version format validation
    if (pattern.version && !/^\d+\.\d+\.\d+$/.test(pattern.version)) {
      warnings.push({
        code: 'INVALID_VERSION_FORMAT',
        message: 'Version should follow semantic versioning (x.y.z)',
        suggestion: 'Use semantic versioning format like 1.0.0'
      });
    }

    // Component count validation
    if (pattern.components.length === 0) {
      errors.push({
        code: 'NO_COMPONENTS',
        message: 'Pattern must contain at least one component',
        severity: 'error'
      });
    }

    if (pattern.components.length > 50) {
      warnings.push({
        code: 'TOO_MANY_COMPONENTS',
        message: 'Pattern contains many components, consider breaking into sub-patterns',
        suggestion: 'Consider creating a multi-tier pattern or breaking into smaller patterns'
      });
    }

    // Duplicate instance ID check
    const instanceIds = new Set<string>();
    for (const component of pattern.components) {
      if (instanceIds.has(component.instanceId)) {
        errors.push({
          code: 'DUPLICATE_INSTANCE_ID',
          message: `Duplicate instance ID: ${component.instanceId}`,
          component: component.instanceId,
          severity: 'error'
        });
      }
      instanceIds.add(component.instanceId);
    }
  }

  /**
   * Validate components
   */
  private async validateComponents(
    pattern: InfrastructurePattern,
    errors: ValidationError[],
    warnings: ValidationWarning[],
    context: ValidationContext
  ): Promise<void> {
    for (const componentRef of pattern.components) {
      // Check if component exists
      const component = this.componentRegistry.getComponent(componentRef.componentId);
      if (!component) {
        errors.push({
          code: 'COMPONENT_NOT_FOUND',
          message: `Component ${componentRef.componentId} not found in registry`,
          component: componentRef.instanceId,
          severity: 'error'
        });
        continue;
      }

      // Provider compatibility
      if (context.targetProvider && !component.providerMappings[context.targetProvider]) {
        warnings.push({
          code: 'PROVIDER_INCOMPATIBILITY',
          message: `Component ${componentRef.componentId} may not support provider ${context.targetProvider}`,
          component: componentRef.instanceId,
          suggestion: `Check if alternative components are available for ${context.targetProvider}`
        });
      }

      // Configuration validation
      this.validateComponentConfiguration(componentRef, component, errors, warnings);

      // Dependencies validation
      for (const depId of componentRef.dependencies) {
        const dependency = pattern.components.find(c => c.instanceId === depId);
        if (!dependency) {
          errors.push({
            code: 'MISSING_DEPENDENCY',
            message: `Dependency ${depId} not found`,
            component: componentRef.instanceId,
            severity: 'error'
          });
        }
      }
    }
  }

  /**
   * Validate component configuration
   */
  private validateComponentConfiguration(
    componentRef: ComponentReference,
    component: ComponentMetadata,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    // Check required properties
    for (const prop of component.config.customProperties || []) {
      if (prop.required && !componentRef.configuration[prop.id]) {
        errors.push({
          code: 'MISSING_REQUIRED_PROPERTY',
          message: `Required property ${prop.name} is missing`,
          component: componentRef.instanceId,
          field: prop.id,
          severity: 'error'
        });
      }
    }

    // Validate property values
    for (const [key, value] of Object.entries(componentRef.configuration)) {
      const propDef = component.config.customProperties?.find(p => p.id === key);
      if (propDef) {
        if (!this.validatePropertyValue(value, propDef)) {
          errors.push({
            code: 'INVALID_PROPERTY_VALUE',
            message: `Invalid value for property ${propDef.name}`,
            component: componentRef.instanceId,
            field: key,
            severity: 'error'
          });
        }
      }
    }

    // Size validation
    if (componentRef.position) {
      const minSize = component.config.minSize;
      const maxSize = component.config.maxSize;
      
      if (minSize && (componentRef.position.x < minSize.width || componentRef.position.y < minSize.height)) {
        warnings.push({
          code: 'COMPONENT_TOO_SMALL',
          message: `Component size is below recommended minimum`,
          component: componentRef.instanceId,
          suggestion: `Minimum size: ${minSize.width}x${minSize.height}`
        });
      }
      
      if (maxSize && (componentRef.position.x > maxSize.width || componentRef.position.y > maxSize.height)) {
        warnings.push({
          code: 'COMPONENT_TOO_LARGE',
          message: `Component size exceeds recommended maximum`,
          component: componentRef.instanceId,
          suggestion: `Maximum size: ${maxSize.width}x${maxSize.height}`
        });
      }
    }
  }

  /**
   * Validate relationships
   */
  private validateRelationships(
    pattern: InfrastructurePattern,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    for (const relationship of pattern.relationships) {
      // Check if referenced components exist
      const fromComponent = pattern.components.find(c => c.instanceId === relationship.fromInstanceId);
      const toComponent = pattern.components.find(c => c.instanceId === relationship.toInstanceId);

      if (!fromComponent) {
        errors.push({
          code: 'INVALID_RELATIONSHIP_SOURCE',
          message: `Source component ${relationship.fromInstanceId} not found`,
          severity: 'error'
        });
      }

      if (!toComponent) {
        errors.push({
          code: 'INVALID_RELATIONSHIP_TARGET',
          message: `Target component ${relationship.toInstanceId} not found`,
          severity: 'error'
        });
      }

      // Validate relationship type compatibility
      if (fromComponent && toComponent) {
        this.validateRelationshipCompatibility(relationship, fromComponent, toComponent, warnings);
      }

      // Check for relationship loops
      if (relationship.fromInstanceId === relationship.toInstanceId) {
        warnings.push({
          code: 'SELF_REFERENCING_RELATIONSHIP',
          message: `Component ${relationship.fromInstanceId} has a relationship to itself`,
          suggestion: 'Consider if this relationship is necessary'
        });
      }
    }

    // Check for circular dependencies
    this.checkCircularDependencies(pattern, errors);
  }

  /**
   * Validate architecture patterns
   */
  private validateArchitecture(
    pattern: InfrastructurePattern,
    errors: ValidationError[],
    warnings: ValidationWarning[],
    suggestions: ValidationSuggestion[]
  ): void {
    // Check for common anti-patterns
    this.checkAntiPatterns(pattern, warnings, suggestions);

    // Validate layered architecture
    this.validateLayeredArchitecture(pattern, warnings, suggestions);

    // Check for single points of failure
    this.checkSinglePointsOfFailure(pattern, warnings, suggestions);

    // Validate network topology
    this.validateNetworkTopology(pattern, warnings, suggestions);
  }

  /**
   * Validate security aspects
   */
  private async validateSecurity(
    pattern: InfrastructurePattern,
    errors: ValidationError[],
    warnings: ValidationWarning[],
    suggestions: ValidationSuggestion[],
    context: ValidationContext
  ): Promise<void> {
    // Check for security components
    this.checkSecurityComponents(pattern, warnings, suggestions);

    // Validate network security
    this.validateNetworkSecurity(pattern, warnings, suggestions);

    // Check for encryption
    this.checkEncryption(pattern, warnings, suggestions);

    // Validate access controls
    this.validateAccessControls(pattern, warnings, suggestions);

    // Check for security best practices
    this.checkSecurityBestPractices(pattern, warnings, suggestions, context);
  }

  /**
   * Validate performance characteristics
   */
  private validatePerformance(
    pattern: InfrastructurePattern,
    warnings: ValidationWarning[],
    suggestions: ValidationSuggestion[],
    context: ValidationContext
  ): void {
    // Check for performance bottlenecks
    this.checkPerformanceBottlenecks(pattern, warnings, suggestions);

    // Validate caching strategy
    this.validateCachingStrategy(pattern, suggestions);

    // Check load balancing
    this.checkLoadBalancing(pattern, suggestions);

    // Validate auto-scaling configuration
    this.validateAutoScaling(pattern, suggestions);
  }

  /**
   * Validate cost optimization
   */
  private validateCostOptimization(
    pattern: InfrastructurePattern,
    warnings: ValidationWarning[],
    suggestions: ValidationSuggestion[],
    context: ValidationContext
  ): void {
    // Check for cost optimization opportunities
    this.checkCostOptimizations(pattern, suggestions);

    // Validate resource sizing
    this.validateResourceSizing(pattern, suggestions);

    // Check for unused resources
    this.checkUnusedResources(pattern, warnings);
  }

  /**
   * Validate compliance requirements
   */
  private async validateCompliance(
    pattern: InfrastructurePattern,
    warnings: ValidationWarning[],
    suggestions: ValidationSuggestion[],
    context: ValidationContext
  ): Promise<void> {
    if (!context.complianceFrameworks) return;

    for (const framework of context.complianceFrameworks) {
      await this.validateComplianceFramework(pattern, framework, warnings, suggestions);
    }
  }

  // Helper methods for specific validations

  private validatePropertyValue(value: any, propDef: any): boolean {
    // Implementation depends on the property definition structure
    // This is a simplified validation
    if (propDef.type === 'number' && typeof value !== 'number') {
      return false;
    }
    if (propDef.type === 'string' && typeof value !== 'string') {
      return false;
    }
    if (propDef.type === 'boolean' && typeof value !== 'boolean') {
      return false;
    }
    return true;
  }

  private validateRelationshipCompatibility(
    relationship: ComponentRelationship,
    fromComponent: ComponentReference,
    toComponent: ComponentReference,
    warnings: ValidationWarning[]
  ): void {
    // Get component metadata
    const fromMeta = this.componentRegistry.getComponent(fromComponent.componentId);
    const toMeta = this.componentRegistry.getComponent(toComponent.componentId);

    if (!fromMeta || !toMeta) return;

    // Check if relationship type makes sense between these component types
    // This is a simplified check - in practice, you'd have more complex rules
    if (relationship.relationshipType === RelationshipType.CONTAINMENT) {
      if (!fromMeta.config.canContainTypes?.includes(toMeta.category)) {
        warnings.push({
          code: 'INCOMPATIBLE_CONTAINMENT',
          message: `${fromMeta.name} may not be able to contain ${toMeta.name}`,
          suggestion: 'Verify this containment relationship is valid'
        });
      }
    }
  }

  private checkCircularDependencies(pattern: InfrastructurePattern, errors: ValidationError[]): void {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const hasCircle = (componentId: string): boolean => {
      if (recursionStack.has(componentId)) {
        return true;
      }
      if (visited.has(componentId)) {
        return false;
      }

      visited.add(componentId);
      recursionStack.add(componentId);

      const component = pattern.components.find(c => c.instanceId === componentId);
      if (component) {
        for (const depId of component.dependencies) {
          if (hasCircle(depId)) {
            return true;
          }
        }
      }

      recursionStack.delete(componentId);
      return false;
    };

    for (const component of pattern.components) {
      if (hasCircle(component.instanceId)) {
        errors.push({
          code: 'CIRCULAR_DEPENDENCY',
          message: `Circular dependency detected involving component ${component.instanceId}`,
          component: component.instanceId,
          severity: 'error'
        });
        break;
      }
    }
  }

  private checkAntiPatterns(
    pattern: InfrastructurePattern,
    warnings: ValidationWarning[],
    suggestions: ValidationSuggestion[]
  ): void {
    // Check for common anti-patterns
    const databaseComponents = pattern.components.filter(c => {
      const meta = this.componentRegistry.getComponent(c.componentId);
      return meta?.category === ComponentCategory.DATABASE;
    });

    // Too many databases
    if (databaseComponents.length > 3) {
      suggestions.push({
        type: 'optimization',
        message: 'Consider consolidating databases or using database sharding patterns',
        impact: 'medium',
        effort: 'high'
      });
    }

    // No monitoring components
    const monitoringComponents = pattern.components.filter(c => {
      const meta = this.componentRegistry.getComponent(c.componentId);
      return meta?.category === ComponentCategory.MONITORING;
    });

    if (monitoringComponents.length === 0) {
      suggestions.push({
        type: 'optimization',
        message: 'Consider adding monitoring and observability components',
        impact: 'high',
        effort: 'medium'
      });
    }
  }

  private validateLayeredArchitecture(
    pattern: InfrastructurePattern,
    warnings: ValidationWarning[],
    suggestions: ValidationSuggestion[]
  ): void {
    // Check for proper separation of concerns
    const hasNetworkLayer = pattern.components.some(c => {
      const meta = this.componentRegistry.getComponent(c.componentId);
      return meta?.category === ComponentCategory.NETWORK;
    });

    const hasComputeLayer = pattern.components.some(c => {
      const meta = this.componentRegistry.getComponent(c.componentId);
      return meta?.category === ComponentCategory.COMPUTE;
    });

    const hasDataLayer = pattern.components.some(c => {
      const meta = this.componentRegistry.getComponent(c.componentId);
      return meta?.category === ComponentCategory.DATABASE || meta?.category === ComponentCategory.STORAGE;
    });

    if (!hasNetworkLayer && pattern.complexity !== PatternComplexity.BEGINNER) {
      suggestions.push({
        type: 'optimization',
        message: 'Consider adding network components for better isolation',
        impact: 'medium',
        effort: 'medium'
      });
    }

    if (!hasDataLayer && hasComputeLayer) {
      warnings.push({
        code: 'MISSING_DATA_LAYER',
        message: 'Pattern has compute components but no data storage',
        suggestion: 'Consider adding appropriate data storage components'
      });
    }
  }

  private checkSinglePointsOfFailure(
    pattern: InfrastructurePattern,
    warnings: ValidationWarning[],
    suggestions: ValidationSuggestion[]
  ): void {
    // Check for components that have no redundancy
    for (const component of pattern.components) {
      const meta = this.componentRegistry.getComponent(component.componentId);
      if (!meta) continue;

      // Check if this is a critical component type
      const isCritical = [
        ComponentCategory.DATABASE,
        ComponentCategory.COMPUTE,
        ComponentCategory.NETWORK
      ].includes(meta.category);

      if (isCritical && !component.instanceId.includes('backup') && !component.instanceId.includes('replica')) {
        // Check if there are multiple instances of this component type
        const sameTypeComponents = pattern.components.filter(c => c.componentId === component.componentId);
        if (sameTypeComponents.length === 1) {
          suggestions.push({
            type: 'optimization',
            message: `Consider adding redundancy for ${component.displayName}`,
            impact: 'high',
            effort: 'medium'
          });
        }
      }
    }
  }

  private validateNetworkTopology(
    pattern: InfrastructurePattern,
    warnings: ValidationWarning[],
    suggestions: ValidationSuggestion[]
  ): void {
    // Check network connectivity patterns
    const networkComponents = pattern.components.filter(c => {
      const meta = this.componentRegistry.getComponent(c.componentId);
      return meta?.category === ComponentCategory.NETWORK;
    });

    if (networkComponents.length === 0 && pattern.components.length > 1) {
      suggestions.push({
        type: 'security',
        message: 'Consider adding network components for better security isolation',
        impact: 'medium',
        effort: 'medium'
      });
    }
  }

  private checkSecurityComponents(
    pattern: InfrastructurePattern,
    warnings: ValidationWarning[],
    suggestions: ValidationSuggestion[]
  ): void {
    const securityComponents = pattern.components.filter(c => {
      const meta = this.componentRegistry.getComponent(c.componentId);
      return meta?.category === ComponentCategory.SECURITY;
    });

    if (securityComponents.length === 0 && pattern.complexity !== PatternComplexity.BEGINNER) {
      suggestions.push({
        type: 'security',
        message: 'Consider adding security components like firewalls or identity management',
        impact: 'high',
        effort: 'medium'
      });
    }
  }

  private validateNetworkSecurity(
    pattern: InfrastructurePattern,
    warnings: ValidationWarning[],
    suggestions: ValidationSuggestion[]
  ): void {
    // Check for network security best practices
    const hasFirewall = pattern.components.some(c => 
      c.displayName.toLowerCase().includes('firewall') || 
      c.componentId.includes('firewall')
    );

    const hasVPC = pattern.components.some(c => {
      const meta = this.componentRegistry.getComponent(c.componentId);
      return meta?.name.toLowerCase().includes('vpc') || meta?.name.toLowerCase().includes('virtual network');
    });

    if (!hasVPC && pattern.components.length > 2) {
      suggestions.push({
        type: 'security',
        message: 'Consider using VPC/Virtual Network for network isolation',
        impact: 'high',
        effort: 'low'
      });
    }

    if (!hasFirewall && pattern.components.length > 1) {
      suggestions.push({
        type: 'security',
        message: 'Consider adding firewall or security group components',
        impact: 'medium',
        effort: 'low'
      });
    }
  }

  private checkEncryption(
    pattern: InfrastructurePattern,
    warnings: ValidationWarning[],
    suggestions: ValidationSuggestion[]
  ): void {
    // Check if data storage components have encryption enabled
    const storageComponents = pattern.components.filter(c => {
      const meta = this.componentRegistry.getComponent(c.componentId);
      return meta?.category === ComponentCategory.STORAGE || meta?.category === ComponentCategory.DATABASE;
    });

    for (const component of storageComponents) {
      const hasEncryptionConfig = component.configuration.encryption === true ||
                                 component.configuration.encrypted === true;
      
      if (!hasEncryptionConfig) {
        suggestions.push({
          type: 'security',
          message: `Consider enabling encryption for ${component.displayName}`,
          impact: 'high',
          effort: 'low'
        });
      }
    }
  }

  private validateAccessControls(
    pattern: InfrastructurePattern,
    warnings: ValidationWarning[],
    suggestions: ValidationSuggestion[]
  ): void {
    // Check for identity and access management components
    const hasIdentityComponent = pattern.components.some(c => {
      const meta = this.componentRegistry.getComponent(c.componentId);
      return meta?.category === ComponentCategory.IDENTITY ||
             c.displayName.toLowerCase().includes('iam') ||
             c.displayName.toLowerCase().includes('identity');
    });

    if (!hasIdentityComponent && pattern.complexity !== PatternComplexity.BEGINNER) {
      suggestions.push({
        type: 'security',
        message: 'Consider adding identity and access management components',
        impact: 'high',
        effort: 'medium'
      });
    }
  }

  private checkSecurityBestPractices(
    pattern: InfrastructurePattern,
    warnings: ValidationWarning[],
    suggestions: ValidationSuggestion[],
    context: ValidationContext
  ): void {
    // Environment-specific security checks
    if (context.environment === 'production') {
      // Production should have enhanced security
      if (!pattern.components.some(c => c.displayName.toLowerCase().includes('monitor'))) {
        suggestions.push({
          type: 'security',
          message: 'Production environments should include monitoring and alerting',
          impact: 'high',
          effort: 'medium'
        });
      }
    }
  }

  private checkPerformanceBottlenecks(
    pattern: InfrastructurePattern,
    warnings: ValidationWarning[],
    suggestions: ValidationSuggestion[]
  ): void {
    // Check for potential performance issues
    const databaseComponents = pattern.components.filter(c => {
      const meta = this.componentRegistry.getComponent(c.componentId);
      return meta?.category === ComponentCategory.DATABASE;
    });

    const computeComponents = pattern.components.filter(c => {
      const meta = this.componentRegistry.getComponent(c.componentId);
      return meta?.category === ComponentCategory.COMPUTE;
    });

    // Check database to compute ratio
    if (databaseComponents.length > computeComponents.length) {
      warnings.push({
        code: 'POTENTIAL_BOTTLENECK',
        message: 'More database components than compute components may indicate performance issues',
        suggestion: 'Consider database optimization or compute scaling'
      });
    }
  }

  private validateCachingStrategy(
    pattern: InfrastructurePattern,
    suggestions: ValidationSuggestion[]
  ): void {
    const hasCaching = pattern.components.some(c => 
      c.displayName.toLowerCase().includes('cache') ||
      c.displayName.toLowerCase().includes('redis') ||
      c.displayName.toLowerCase().includes('memcached')
    );

    const hasDatabase = pattern.components.some(c => {
      const meta = this.componentRegistry.getComponent(c.componentId);
      return meta?.category === ComponentCategory.DATABASE;
    });

    if (hasDatabase && !hasCaching && pattern.complexity !== PatternComplexity.BEGINNER) {
      suggestions.push({
        type: 'performance',
        message: 'Consider adding caching layer for better performance',
        impact: 'medium',
        effort: 'medium'
      });
    }
  }

  private checkLoadBalancing(
    pattern: InfrastructurePattern,
    suggestions: ValidationSuggestion[]
  ): void {
    const computeComponents = pattern.components.filter(c => {
      const meta = this.componentRegistry.getComponent(c.componentId);
      return meta?.category === ComponentCategory.COMPUTE;
    });

    const hasLoadBalancer = pattern.components.some(c =>
      c.displayName.toLowerCase().includes('load balancer') ||
      c.displayName.toLowerCase().includes('alb') ||
      c.displayName.toLowerCase().includes('nlb')
    );

    if (computeComponents.length > 1 && !hasLoadBalancer) {
      suggestions.push({
        type: 'performance',
        message: 'Consider adding load balancer for multiple compute instances',
        impact: 'medium',
        effort: 'low'
      });
    }
  }

  private validateAutoScaling(
    pattern: InfrastructurePattern,
    suggestions: ValidationSuggestion[]
  ): void {
    const hasAutoScaling = pattern.components.some(c =>
      c.displayName.toLowerCase().includes('auto scaling') ||
      c.displayName.toLowerCase().includes('autoscaling') ||
      c.configuration.autoScaling === true
    );

    const hasComputeComponents = pattern.components.some(c => {
      const meta = this.componentRegistry.getComponent(c.componentId);
      return meta?.category === ComponentCategory.COMPUTE;
    });

    if (hasComputeComponents && !hasAutoScaling && pattern.complexity !== PatternComplexity.BEGINNER) {
      suggestions.push({
        type: 'performance',
        message: 'Consider adding auto-scaling for better resource utilization',
        impact: 'medium',
        effort: 'medium'
      });
    }
  }

  private checkCostOptimizations(
    pattern: InfrastructurePattern,
    suggestions: ValidationSuggestion[]
  ): void {
    // Check for cost optimization opportunities
    const hasSpotInstances = pattern.components.some(c =>
      c.configuration.instanceType?.includes('spot') ||
      c.configuration.pricing === 'spot'
    );

    const computeComponents = pattern.components.filter(c => {
      const meta = this.componentRegistry.getComponent(c.componentId);
      return meta?.category === ComponentCategory.COMPUTE;
    });

    if (computeComponents.length > 0 && !hasSpotInstances) {
      suggestions.push({
        type: 'cost',
        message: 'Consider using spot instances for non-critical workloads',
        impact: 'high',
        effort: 'low'
      });
    }
  }

  private validateResourceSizing(
    pattern: InfrastructurePattern,
    suggestions: ValidationSuggestion[]
  ): void {
    // Check for oversized resources
    for (const component of pattern.components) {
      if (component.configuration.instanceType?.includes('xlarge') && 
          pattern.complexity === PatternComplexity.BEGINNER) {
        suggestions.push({
          type: 'cost',
          message: `Consider smaller instance size for ${component.displayName}`,
          impact: 'medium',
          effort: 'low'
        });
      }
    }
  }

  private checkUnusedResources(
    pattern: InfrastructurePattern,
    warnings: ValidationWarning[]
  ): void {
    // Check for components with no relationships
    for (const component of pattern.components) {
      const hasIncomingRelation = pattern.relationships.some(r => r.toInstanceId === component.instanceId);
      const hasOutgoingRelation = pattern.relationships.some(r => r.fromInstanceId === component.instanceId);
      const hasDependencies = component.dependencies.length > 0;

      if (!hasIncomingRelation && !hasOutgoingRelation && !hasDependencies && pattern.components.length > 1) {
        warnings.push({
          code: 'ISOLATED_COMPONENT',
          message: `Component ${component.displayName} appears to be isolated`,
          component: component.instanceId,
          suggestion: 'Verify this component is needed or connect it to other components'
        });
      }
    }
  }

  private async validateComplianceFramework(
    pattern: InfrastructurePattern,
    framework: string,
    warnings: ValidationWarning[],
    suggestions: ValidationSuggestion[]
  ): Promise<void> {
    // Framework-specific validation
    switch (framework.toLowerCase()) {
      case 'hipaa':
        await this.validateHIPAA(pattern, warnings, suggestions);
        break;
      case 'pci-dss':
        await this.validatePCIDSS(pattern, warnings, suggestions);
        break;
      case 'soc2':
        await this.validateSOC2(pattern, warnings, suggestions);
        break;
      case 'gdpr':
        await this.validateGDPR(pattern, warnings, suggestions);
        break;
      default:
        warnings.push({
          code: 'UNKNOWN_COMPLIANCE_FRAMEWORK',
          message: `Unknown compliance framework: ${framework}`,
          suggestion: 'Supported frameworks: HIPAA, PCI-DSS, SOC2, GDPR'
        });
    }
  }

  private async validateHIPAA(
    pattern: InfrastructurePattern,
    warnings: ValidationWarning[],
    suggestions: ValidationSuggestion[]
  ): Promise<void> {
    // HIPAA-specific validation
    const hasEncryption = pattern.components.some(c => 
      c.configuration.encryption === true
    );

    if (!hasEncryption) {
      suggestions.push({
        type: 'security',
        message: 'HIPAA compliance requires encryption at rest and in transit',
        impact: 'high',
        effort: 'medium'
      });
    }

    const hasAuditLogging = pattern.components.some(c => 
      c.displayName.toLowerCase().includes('audit') ||
      c.displayName.toLowerCase().includes('log')
    );

    if (!hasAuditLogging) {
      suggestions.push({
        type: 'security',
        message: 'HIPAA compliance requires comprehensive audit logging',
        impact: 'high',
        effort: 'medium'
      });
    }
  }

  private async validatePCIDSS(
    pattern: InfrastructurePattern,
    warnings: ValidationWarning[],
    suggestions: ValidationSuggestion[]
  ): Promise<void> {
    // PCI-DSS specific validation
    const hasFirewall = pattern.components.some(c => 
      c.displayName.toLowerCase().includes('firewall')
    );

    if (!hasFirewall) {
      suggestions.push({
        type: 'security',
        message: 'PCI-DSS requires firewall protection',
        impact: 'high',
        effort: 'low'
      });
    }
  }

  private async validateSOC2(
    pattern: InfrastructurePattern,
    warnings: ValidationWarning[],
    suggestions: ValidationSuggestion[]
  ): Promise<void> {
    // SOC2 specific validation
    const hasMonitoring = pattern.components.some(c => {
      const meta = this.componentRegistry.getComponent(c.componentId);
      return meta?.category === ComponentCategory.MONITORING;
    });

    if (!hasMonitoring) {
      suggestions.push({
        type: 'security',
        message: 'SOC2 compliance requires comprehensive monitoring',
        impact: 'high',
        effort: 'medium'
      });
    }
  }

  private async validateGDPR(
    pattern: InfrastructurePattern,
    warnings: ValidationWarning[],
    suggestions: ValidationSuggestion[]
  ): Promise<void> {
    // GDPR specific validation
    const hasDataProcessing = pattern.components.some(c => {
      const meta = this.componentRegistry.getComponent(c.componentId);
      return meta?.category === ComponentCategory.DATABASE || meta?.category === ComponentCategory.STORAGE;
    });

    if (hasDataProcessing) {
      suggestions.push({
        type: 'security',
        message: 'GDPR compliance requires data protection impact assessment',
        impact: 'high',
        effort: 'high'
      });
    }
  }

  private applyCustomRules(
    pattern: InfrastructurePattern,
    errors: ValidationError[],
    warnings: ValidationWarning[],
    suggestions: ValidationSuggestion[],
    config: ValidationConfig,
    context: ValidationContext
  ): void {
    // Apply any custom validation rules
    for (const rule of this.validationRules) {
      rule.validate(pattern, errors, warnings, suggestions, config, context);
    }
  }

  private initializeValidationRules(): ValidationRule[] {
    // Initialize custom validation rules
    return [];
  }

  private getDefaultConfig(): ValidationConfig {
    return {
      strictMode: false,
      securityChecks: true,
      performanceAnalysis: true,
      costOptimization: true,
      complianceValidation: false,
      architectureValidation: true
    };
  }
}

// Interface for custom validation rules
export interface ValidationRule {
  name: string;
  description: string;
  validate(
    pattern: InfrastructurePattern,
    errors: ValidationError[],
    warnings: ValidationWarning[],
    suggestions: ValidationSuggestion[],
    config: ValidationConfig,
    context: ValidationContext
  ): void;
}

// Export the singleton instance
export const patternValidator = new PatternValidator();