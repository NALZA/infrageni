/**
 * Template Engine - Dynamic pattern generation and customization
 * Enables parameterized pattern creation and blueprint instantiation
 */

import {
  InfrastructurePattern,
  ComponentReference,
  ComponentRelationship,
  PatternParameter,
  PatternCategory,
  PatternComplexity,
  PatternStatus
} from './pattern-types';
import { ComponentRegistry } from '../../components/core/component-registry';
import { PatternRegistry } from './pattern-registry';

export interface TemplateContext {
  parameters: Record<string, any>;
  provider: string;
  region?: string;
  environment?: 'development' | 'staging' | 'production';
  projectName?: string;
  tags?: Record<string, string>;
}

export interface TemplateResult {
  success: boolean;
  pattern?: InfrastructurePattern;
  errors: string[];
  warnings: string[];
}

export interface PatternTemplate {
  id: string;
  name: string;
  description: string;
  category: PatternCategory;
  complexity: PatternComplexity;
  parameters: PatternParameter[];
  componentTemplates: ComponentTemplate[];
  relationshipTemplates: RelationshipTemplate[];
  conditionalLogic: ConditionalRule[];
  metadata: TemplateMetadata;
}

export interface ComponentTemplate {
  instanceId: string;
  componentId: string;
  displayName: string;
  position: PositionTemplate;
  configuration: ConfigurationTemplate;
  conditional?: ConditionalExpression;
  required: boolean;
  dependencies: string[];
}

export interface PositionTemplate {
  x: number | ParameterReference;
  y: number | ParameterReference;
}

export interface ConfigurationTemplate {
  [key: string]: any | ParameterReference | ConditionalValue;
}

export interface RelationshipTemplate {
  id: string;
  fromInstanceId: string;
  toInstanceId: string;
  relationshipType: string;
  configuration: ConfigurationTemplate;
  conditional?: ConditionalExpression;
}

export interface ParameterReference {
  type: 'parameter';
  name: string;
  defaultValue?: any;
  transform?: TransformFunction;
}

export interface ConditionalValue {
  type: 'conditional';
  condition: ConditionalExpression;
  trueValue: any;
  falseValue: any;
}

export interface ConditionalExpression {
  type: 'and' | 'or' | 'not' | 'equals' | 'greater' | 'less' | 'contains';
  left?: ConditionalExpression | ParameterReference | any;
  right?: ConditionalExpression | ParameterReference | any;
  operand?: ConditionalExpression;
}

export interface ConditionalRule {
  condition: ConditionalExpression;
  actions: TemplateAction[];
}

export interface TemplateAction {
  type: 'add_component' | 'remove_component' | 'add_relationship' | 'modify_configuration';
  target: string;
  data: any;
}

export interface TransformFunction {
  name: string;
  args: any[];
}

export interface TemplateMetadata {
  author: string;
  version: string;
  created: string;
  updated: string;
  tags: string[];
  examples: TemplateExample[];
}

export interface TemplateExample {
  name: string;
  description: string;
  parameters: Record<string, any>;
  expectedComponents: number;
}

export class TemplateEngine {
  private componentRegistry: ComponentRegistry;
  private patternRegistry: PatternRegistry;
  private templates: Map<string, PatternTemplate> = new Map();
  private transformFunctions: Map<string, Function> = new Map();

  constructor() {
    this.componentRegistry = ComponentRegistry.getInstance();
    this.patternRegistry = PatternRegistry.getInstance();
    this.initializeTransformFunctions();
  }

  /**
   * Register a pattern template
   */
  registerTemplate(template: PatternTemplate): void {
    this.templates.set(template.id, template);
    console.log(`✅ Registered template: ${template.name} (${template.id})`);
  }

  /**
   * Get a template by ID
   */
  getTemplate(templateId: string): PatternTemplate | undefined {
    return this.templates.get(templateId);
  }

  /**
   * Get all templates
   */
  getAllTemplates(): PatternTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * Generate a pattern from a template
   */
  async generatePattern(templateId: string, context: TemplateContext): Promise<TemplateResult> {
    const template = this.getTemplate(templateId);
    if (!template) {
      return {
        success: false,
        errors: [`Template ${templateId} not found`],
        warnings: []
      };
    }

    try {
      // Validate parameters
      const paramValidation = this.validateParameters(template, context.parameters);
      if (!paramValidation.valid) {
        return {
          success: false,
          errors: paramValidation.errors,
          warnings: paramValidation.warnings
        };
      }

      // Generate pattern ID
      const patternId = this.generatePatternId(template, context);

      // Process components
      const components = await this.processComponentTemplates(template, context);
      
      // Process relationships
      const relationships = await this.processRelationshipTemplates(template, context, components);

      // Apply conditional logic
      const { finalComponents, finalRelationships } = await this.applyConditionalLogic(
        template, context, components, relationships
      );

      // Create the pattern
      const pattern: InfrastructurePattern = {
        id: patternId,
        name: this.resolveValue(template.name, context),
        description: this.resolveValue(template.description, context),
        version: '1.0.0',
        category: template.category,
        complexity: template.complexity,
        status: PatternStatus.PUBLISHED,
        components: finalComponents,
        relationships: finalRelationships,
        parameters: template.parameters,
        preview: {
          thumbnail: '',
          description: this.resolveValue(template.description, context),
          features: [],
          benefits: [],
          useCases: []
        },
        documentation: {
          overview: this.resolveValue(template.description, context),
          architecture: {
            description: '',
            components: [],
            dataFlow: '',
            keyDecisions: []
          },
          deployment: {
            prerequisites: [],
            steps: [],
            verification: [],
            rollback: []
          },
          configuration: {
            parameters: [],
            environments: [],
            secrets: [],
            customization: []
          },
          security: {
            overview: '',
            threats: [],
            controls: [],
            compliance: [],
            bestPractices: []
          },
          monitoring: {
            overview: '',
            metrics: [],
            alerts: [],
            dashboards: [],
            logs: []
          },
          troubleshooting: {
            commonIssues: [],
            diagnostics: [],
            support: {
              contacts: [],
              resources: [],
              escalation: []
            }
          },
          references: []
        },
        tags: context.tags ? Object.values(context.tags) : [],
        author: template.metadata.author,
        license: 'MIT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        providers: [context.provider],
        requiredFeatures: [],
        changelog: [],
        migrations: []
      };

      return {
        success: true,
        pattern,
        errors: [],
        warnings: paramValidation.warnings
      };

    } catch (error) {
      return {
        success: false,
        errors: [`Template generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
        warnings: []
      };
    }
  }

  /**
   * Preview template parameters
   */
  previewTemplate(templateId: string): {
    template?: PatternTemplate;
    parameters: PatternParameter[];
    examples: TemplateExample[];
  } {
    const template = this.getTemplate(templateId);
    if (!template) {
      return { parameters: [], examples: [] };
    }

    return {
      template,
      parameters: template.parameters,
      examples: template.metadata.examples
    };
  }

  /**
   * Validate template parameters
   */
  validateParameters(template: PatternTemplate, parameters: Record<string, any>): {
    valid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check required parameters
    for (const param of template.parameters) {
      if (param.required && !(param.id in parameters)) {
        errors.push(`Required parameter '${param.name}' is missing`);
      }
    }

    // Validate parameter values
    for (const [paramId, value] of Object.entries(parameters)) {
      const paramDef = template.parameters.find(p => p.id === paramId);
      if (!paramDef) {
        warnings.push(`Unknown parameter '${paramId}' will be ignored`);
        continue;
      }

      const validation = this.validateParameterValue(paramDef, value);
      if (!validation.valid) {
        errors.push(`Invalid value for parameter '${paramDef.name}': ${validation.error}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Create a template from an existing pattern
   */
  createTemplateFromPattern(pattern: InfrastructurePattern, templateMetadata: TemplateMetadata): PatternTemplate {
    const template: PatternTemplate = {
      id: `${pattern.id}-template`,
      name: `${pattern.name} Template`,
      description: `Template based on ${pattern.name}`,
      category: pattern.category,
      complexity: pattern.complexity,
      parameters: this.extractParametersFromPattern(pattern),
      componentTemplates: this.convertComponentsToTemplates(pattern.components),
      relationshipTemplates: this.convertRelationshipsToTemplates(pattern.relationships),
      conditionalLogic: [],
      metadata: templateMetadata
    };

    return template;
  }

  // Private helper methods

  private generatePatternId(template: PatternTemplate, context: TemplateContext): string {
    const timestamp = Date.now();
    const projectPrefix = context.projectName ? `${context.projectName}-` : '';
    return `${projectPrefix}${template.id}-${timestamp}`;
  }

  private async processComponentTemplates(
    template: PatternTemplate,
    context: TemplateContext
  ): Promise<ComponentReference[]> {
    const components: ComponentReference[] = [];

    for (const componentTemplate of template.componentTemplates) {
      // Check conditional logic
      if (componentTemplate.conditional && !this.evaluateCondition(componentTemplate.conditional, context)) {
        continue;
      }

      // Resolve component reference
      const component: ComponentReference = {
        componentId: this.resolveValue(componentTemplate.componentId, context),
        instanceId: this.resolveValue(componentTemplate.instanceId, context),
        displayName: this.resolveValue(componentTemplate.displayName, context),
        position: {
          x: this.resolveValue(componentTemplate.position.x, context),
          y: this.resolveValue(componentTemplate.position.y, context)
        },
        configuration: this.resolveConfiguration(componentTemplate.configuration, context),
        required: componentTemplate.required,
        dependencies: componentTemplate.dependencies.map(dep => this.resolveValue(dep, context)),
        metadata: {
          description: this.resolveValue(componentTemplate.displayName, context)
        }
      };

      components.push(component);
    }

    return components;
  }

  private async processRelationshipTemplates(
    template: PatternTemplate,
    context: TemplateContext,
    components: ComponentReference[]
  ): Promise<ComponentRelationship[]> {
    const relationships: ComponentRelationship[] = [];

    for (const relationshipTemplate of template.relationshipTemplates) {
      // Check conditional logic
      if (relationshipTemplate.conditional && !this.evaluateCondition(relationshipTemplate.conditional, context)) {
        continue;
      }

      // Verify that referenced components exist
      const fromExists = components.some(c => c.instanceId === relationshipTemplate.fromInstanceId);
      const toExists = components.some(c => c.instanceId === relationshipTemplate.toInstanceId);

      if (!fromExists || !toExists) {
        console.warn(`Skipping relationship ${relationshipTemplate.id}: referenced components not found`);
        continue;
      }

      const relationship: ComponentRelationship = {
        id: this.resolveValue(relationshipTemplate.id, context),
        fromInstanceId: this.resolveValue(relationshipTemplate.fromInstanceId, context),
        toInstanceId: this.resolveValue(relationshipTemplate.toInstanceId, context),
        relationshipType: relationshipTemplate.relationshipType as any,
        configuration: {
          bidirectional: false,
          protocols: [],
          ...this.resolveConfiguration(relationshipTemplate.configuration, context)
        },
        metadata: {
          description: `Relationship between ${relationshipTemplate.fromInstanceId} and ${relationshipTemplate.toInstanceId}`
        }
      };

      relationships.push(relationship);
    }

    return relationships;
  }

  private async applyConditionalLogic(
    template: PatternTemplate,
    context: TemplateContext,
    components: ComponentReference[],
    relationships: ComponentRelationship[]
  ): Promise<{ finalComponents: ComponentReference[]; finalRelationships: ComponentRelationship[] }> {
    let finalComponents = [...components];
    let finalRelationships = [...relationships];

    for (const rule of template.conditionalLogic) {
      if (this.evaluateCondition(rule.condition, context)) {
        for (const action of rule.actions) {
          const result = await this.executeTemplateAction(action, finalComponents, finalRelationships, context);
          finalComponents = result.components;
          finalRelationships = result.relationships;
        }
      }
    }

    return { finalComponents, finalRelationships };
  }

  private resolveValue(value: any, context: TemplateContext): any {
    if (typeof value === 'string') {
      // Simple string interpolation
      return value.replace(/\{\{(\w+)\}\}/g, (match, paramName) => {
        return context.parameters[paramName] ?? match;
      });
    }

    if (typeof value === 'object' && value !== null) {
      if (value.type === 'parameter') {
        const paramValue = context.parameters[value.name];
        if (paramValue !== undefined) {
          return value.transform ? this.applyTransform(paramValue, value.transform) : paramValue;
        }
        return value.defaultValue;
      }

      if (value.type === 'conditional') {
        const conditionResult = this.evaluateCondition(value.condition, context);
        return conditionResult ? value.trueValue : value.falseValue;
      }
    }

    return value;
  }

  private resolveConfiguration(configTemplate: ConfigurationTemplate, context: TemplateContext): Record<string, any> {
    const resolved: Record<string, any> = {};

    for (const [key, value] of Object.entries(configTemplate)) {
      resolved[key] = this.resolveValue(value, context);
    }

    return resolved;
  }

  private evaluateCondition(condition: ConditionalExpression, context: TemplateContext): boolean {
    switch (condition.type) {
      case 'equals':
        return this.resolveValue(condition.left, context) === this.resolveValue(condition.right, context);
      
      case 'greater':
        return this.resolveValue(condition.left, context) > this.resolveValue(condition.right, context);
      
      case 'less':
        return this.resolveValue(condition.left, context) < this.resolveValue(condition.right, context);
      
      case 'contains':
        const leftValue = this.resolveValue(condition.left, context);
        const rightValue = this.resolveValue(condition.right, context);
        return Array.isArray(leftValue) ? leftValue.includes(rightValue) : 
               typeof leftValue === 'string' ? leftValue.includes(rightValue) : false;
      
      case 'and':
        return condition.left && condition.right ? 
               this.evaluateCondition(condition.left as ConditionalExpression, context) &&
               this.evaluateCondition(condition.right as ConditionalExpression, context) : false;
      
      case 'or':
        return condition.left && condition.right ? 
               this.evaluateCondition(condition.left as ConditionalExpression, context) ||
               this.evaluateCondition(condition.right as ConditionalExpression, context) : false;
      
      case 'not':
        return condition.operand ? !this.evaluateCondition(condition.operand, context) : false;
      
      default:
        return false;
    }
  }

  private applyTransform(value: any, transform: TransformFunction): any {
    const func = this.transformFunctions.get(transform.name);
    if (func) {
      return func(value, ...transform.args);
    }
    return value;
  }

  private async executeTemplateAction(
    action: TemplateAction,
    components: ComponentReference[],
    relationships: ComponentRelationship[],
    context: TemplateContext
  ): Promise<{ components: ComponentReference[]; relationships: ComponentRelationship[] }> {
    switch (action.type) {
      case 'add_component':
        // Add component logic
        const newComponent = this.resolveValue(action.data, context) as ComponentReference;
        return {
          components: [...components, newComponent],
          relationships
        };

      case 'remove_component':
        // Remove component logic
        return {
          components: components.filter(c => c.instanceId !== action.target),
          relationships: relationships.filter(r => 
            r.fromInstanceId !== action.target && r.toInstanceId !== action.target
          )
        };

      case 'add_relationship':
        // Add relationship logic
        const newRelationship = this.resolveValue(action.data, context) as ComponentRelationship;
        return {
          components,
          relationships: [...relationships, newRelationship]
        };

      default:
        return { components, relationships };
    }
  }

  private validateParameterValue(param: PatternParameter, value: any): { valid: boolean; error?: string } {
    // Type validation
    switch (param.type) {
      case 'string':
        if (typeof value !== 'string') {
          return { valid: false, error: 'Expected string value' };
        }
        break;
      
      case 'number':
        if (typeof value !== 'number') {
          return { valid: false, error: 'Expected number value' };
        }
        break;
      
      case 'boolean':
        if (typeof value !== 'boolean') {
          return { valid: false, error: 'Expected boolean value' };
        }
        break;
      
      case 'select':
      case 'multiselect':
        if (param.options) {
          const validValues = param.options.map(opt => opt.value);
          if (param.type === 'select') {
            if (!validValues.includes(value)) {
              return { valid: false, error: `Value must be one of: ${validValues.join(', ')}` };
            }
          } else {
            if (!Array.isArray(value) || !value.every(v => validValues.includes(v))) {
              return { valid: false, error: `Values must be from: ${validValues.join(', ')}` };
            }
          }
        }
        break;
    }

    // Custom validation
    if (param.validation) {
      if (param.validation.min !== undefined && value < param.validation.min) {
        return { valid: false, error: `Value must be at least ${param.validation.min}` };
      }
      
      if (param.validation.max !== undefined && value > param.validation.max) {
        return { valid: false, error: `Value must be at most ${param.validation.max}` };
      }
      
      if (param.validation.pattern && typeof value === 'string') {
        const regex = new RegExp(param.validation.pattern);
        if (!regex.test(value)) {
          return { valid: false, error: 'Value does not match required pattern' };
        }
      }
    }

    return { valid: true };
  }

  private extractParametersFromPattern(pattern: InfrastructurePattern): PatternParameter[] {
    // Extract common configuration values as parameters
    const parameters: PatternParameter[] = [];
    
    // Add basic parameters
    parameters.push({
      id: 'project_name',
      name: 'Project Name',
      description: 'Name of the project',
      type: 'string',
      required: true,
      defaultValue: pattern.name,
      affects: pattern.components.map(c => c.instanceId)
    });

    parameters.push({
      id: 'environment',
      name: 'Environment',
      description: 'Deployment environment',
      type: 'select',
      required: true,
      defaultValue: 'development',
      options: [
        { value: 'development', label: 'Development' },
        { value: 'staging', label: 'Staging' },
        { value: 'production', label: 'Production' }
      ],
      affects: pattern.components.map(c => c.instanceId)
    });

    return parameters;
  }

  private convertComponentsToTemplates(components: ComponentReference[]): ComponentTemplate[] {
    return components.map(component => ({
      instanceId: component.instanceId,
      componentId: component.componentId,
      displayName: component.displayName,
      position: {
        x: component.position.x,
        y: component.position.y
      },
      configuration: component.configuration,
      required: component.required,
      dependencies: component.dependencies
    }));
  }

  private convertRelationshipsToTemplates(relationships: ComponentRelationship[]): RelationshipTemplate[] {
    return relationships.map(relationship => ({
      id: relationship.id,
      fromInstanceId: relationship.fromInstanceId,
      toInstanceId: relationship.toInstanceId,
      relationshipType: relationship.relationshipType,
      configuration: relationship.configuration
    }));
  }

  private initializeTransformFunctions(): void {
    // String transforms
    this.transformFunctions.set('uppercase', (value: string) => value.toUpperCase());
    this.transformFunctions.set('lowercase', (value: string) => value.toLowerCase());
    this.transformFunctions.set('kebab-case', (value: string) => 
      value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    );
    this.transformFunctions.set('snake-case', (value: string) => 
      value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')
    );

    // Number transforms
    this.transformFunctions.set('multiply', (value: number, factor: number) => value * factor);
    this.transformFunctions.set('add', (value: number, addend: number) => value + addend);
    this.transformFunctions.set('round', (value: number) => Math.round(value));

    // Array transforms
    this.transformFunctions.set('join', (value: any[], separator: string = ',') => value.join(separator));
    this.transformFunctions.set('first', (value: any[]) => value[0]);
    this.transformFunctions.set('last', (value: any[]) => value[value.length - 1]);

    // Conditional transforms
    this.transformFunctions.set('default', (value: any, defaultValue: any) => value ?? defaultValue);
  }
}

// Export singleton instance
export const templateEngine = new TemplateEngine();