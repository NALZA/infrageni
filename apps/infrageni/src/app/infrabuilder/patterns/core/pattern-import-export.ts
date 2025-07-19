/**
 * Pattern Import/Export System
 * Handles importing patterns from various sources and exporting to different formats
 */

import { 
  InfrastructurePattern, 
  ComponentReference, 
  PatternTemplate,
  PatternValidationResult,
  PatternCategory,
  PatternComplexity,
  PatternStatus
} from './pattern-types';
import { PatternRegistry } from './pattern-registry';
import { patternValidator } from './pattern-validator';
import { templateEngine } from './template-engine';

export interface ImportSource {
  type: 'file' | 'url' | 'git' | 'registry' | 'terraform' | 'cloudformation' | 'kubernetes';
  source: string;
  options?: Record<string, any>;
}

export interface ExportFormat {
  type: 'json' | 'yaml' | 'terraform' | 'cloudformation' | 'kubernetes' | 'arm' | 'pulumi';
  options?: Record<string, any>;
}

export interface ImportResult {
  success: boolean;
  pattern?: InfrastructurePattern;
  errors: string[];
  warnings: string[];
  validationResult?: PatternValidationResult;
}

export interface ExportResult {
  success: boolean;
  content?: string;
  filename?: string;
  errors: string[];
}

export interface ImportProgress {
  stage: 'downloading' | 'parsing' | 'validating' | 'converting' | 'complete';
  progress: number;
  message: string;
}

export interface BatchImportResult {
  total: number;
  successful: number;
  failed: number;
  results: ImportResult[];
  summary: {
    byCategory: Record<PatternCategory, number>;
    byComplexity: Record<PatternComplexity, number>;
    errors: string[];
  };
}

class PatternImportExport {
  private registry: PatternRegistry;
  private supportedFormats = new Set([
    'json', 'yaml', 'terraform', 'cloudformation', 'kubernetes', 'arm', 'pulumi'
  ]);

  constructor() {
    this.registry = PatternRegistry.getInstance();
  }

  /**
   * Import a pattern from various sources
   */
  async importPattern(
    source: ImportSource, 
    onProgress?: (progress: ImportProgress) => void
  ): Promise<ImportResult> {
    try {
      onProgress?.({ stage: 'downloading', progress: 0, message: 'Fetching pattern source...' });

      let rawData: string;
      
      switch (source.type) {
        case 'file':
          rawData = await this.readFile(source.source);
          break;
        case 'url':
          rawData = await this.fetchFromUrl(source.source);
          break;
        case 'git':
          rawData = await this.fetchFromGit(source.source, source.options);
          break;
        case 'registry':
          return await this.importFromRegistry(source.source, source.options);
        case 'terraform':
          return await this.importFromTerraform(source.source, source.options);
        case 'cloudformation':
          return await this.importFromCloudFormation(source.source, source.options);
        case 'kubernetes':
          return await this.importFromKubernetes(source.source, source.options);
        default:
          throw new Error(`Unsupported import source type: ${source.type}`);
      }

      onProgress?.({ stage: 'parsing', progress: 25, message: 'Parsing pattern data...' });
      
      const pattern = await this.parsePatternData(rawData, source.type);
      
      onProgress?.({ stage: 'validating', progress: 50, message: 'Validating pattern...' });
      
      const validationResult = await patternValidator.validatePattern(pattern);
      
      onProgress?.({ stage: 'converting', progress: 75, message: 'Converting to internal format...' });
      
      const convertedPattern = await this.convertToInternalFormat(pattern);
      
      onProgress?.({ stage: 'complete', progress: 100, message: 'Import complete!' });

      return {
        success: true,
        pattern: convertedPattern,
        errors: [],
        warnings: validationResult.warnings.map(w => w.message),
        validationResult
      };

    } catch (error) {
      return {
        success: false,
        errors: [error instanceof Error ? error.message : 'Unknown import error'],
        warnings: []
      };
    }
  }

  /**
   * Import multiple patterns from a batch source
   */
  async importPatternBatch(
    sources: ImportSource[],
    onProgress?: (overall: number, current: ImportProgress) => void
  ): Promise<BatchImportResult> {
    const results: ImportResult[] = [];
    const summary = {
      byCategory: {} as Record<PatternCategory, number>,
      byComplexity: {} as Record<PatternComplexity, number>,
      errors: [] as string[]
    };

    for (let i = 0; i < sources.length; i++) {
      const source = sources[i];
      const overallProgress = (i / sources.length) * 100;
      
      onProgress?.(overallProgress, { 
        stage: 'downloading', 
        progress: 0, 
        message: `Processing ${i + 1} of ${sources.length}...` 
      });

      const result = await this.importPattern(source, (progress) => {
        onProgress?.(overallProgress, progress);
      });

      results.push(result);

      if (result.success && result.pattern) {
        const category = result.pattern.category;
        const complexity = result.pattern.complexity;
        
        summary.byCategory[category] = (summary.byCategory[category] || 0) + 1;
        summary.byComplexity[complexity] = (summary.byComplexity[complexity] || 0) + 1;
      } else {
        summary.errors.push(...result.errors);
      }
    }

    const successful = results.filter(r => r.success).length;
    const failed = results.length - successful;

    return {
      total: sources.length,
      successful,
      failed,
      results,
      summary
    };
  }

  /**
   * Export a pattern to various formats
   */
  async exportPattern(
    pattern: InfrastructurePattern,
    format: ExportFormat
  ): Promise<ExportResult> {
    try {
      let content: string;
      let filename: string;

      switch (format.type) {
        case 'json':
          content = JSON.stringify(pattern, null, 2);
          filename = `${pattern.name.toLowerCase().replace(/\s+/g, '-')}.json`;
          break;
        case 'yaml':
          content = this.convertToYaml(pattern);
          filename = `${pattern.name.toLowerCase().replace(/\s+/g, '-')}.yaml`;
          break;
        case 'terraform':
          content = await this.convertToTerraform(pattern, format.options);
          filename = `${pattern.name.toLowerCase().replace(/\s+/g, '-')}.tf`;
          break;
        case 'cloudformation':
          content = await this.convertToCloudFormation(pattern, format.options);
          filename = `${pattern.name.toLowerCase().replace(/\s+/g, '-')}.yaml`;
          break;
        case 'kubernetes':
          content = await this.convertToKubernetes(pattern, format.options);
          filename = `${pattern.name.toLowerCase().replace(/\s+/g, '-')}.yaml`;
          break;
        case 'arm':
          content = await this.convertToARM(pattern, format.options);
          filename = `${pattern.name.toLowerCase().replace(/\s+/g, '-')}.json`;
          break;
        case 'pulumi':
          content = await this.convertToPulumi(pattern, format.options);
          filename = `${pattern.name.toLowerCase().replace(/\s+/g, '-')}.ts`;
          break;
        default:
          throw new Error(`Unsupported export format: ${format.type}`);
      }

      return {
        success: true,
        content,
        filename,
        errors: []
      };

    } catch (error) {
      return {
        success: false,
        errors: [error instanceof Error ? error.message : 'Unknown export error']
      };
    }
  }

  /**
   * Install a pattern into the workspace
   */
  async installPattern(
    pattern: InfrastructurePattern,
    workspace: string,
    options?: {
      parameterOverrides?: Record<string, any>;
      target?: string;
      validate?: boolean;
    }
  ): Promise<ImportResult> {
    try {
      // Register pattern if not already registered
      if (!this.registry.getPattern(pattern.id)) {
        this.registry.registerPattern(pattern);
      }

      // Apply parameter overrides
      let finalPattern = { ...pattern };
      if (options?.parameterOverrides) {
        finalPattern = this.applyParameterOverrides(pattern, options.parameterOverrides);
      }

      // Validate if requested
      if (options?.validate !== false) {
        const validationResult = await patternValidator.validatePattern(finalPattern);
        if (!validationResult.valid) {
          return {
            success: false,
            errors: validationResult.errors.map(e => e.message),
            warnings: validationResult.warnings.map(w => w.message),
            validationResult
          };
        }
      }

      // Generate deployment configuration
      const template = templateEngine.generateTemplate(finalPattern.id, options?.parameterOverrides);
      
      // Save to workspace
      await this.saveToWorkspace(workspace, finalPattern, template, options?.target);

      return {
        success: true,
        pattern: finalPattern,
        errors: [],
        warnings: []
      };

    } catch (error) {
      return {
        success: false,
        errors: [error instanceof Error ? error.message : 'Failed to install pattern'],
        warnings: []
      };
    }
  }

  /**
   * Export workspace configuration
   */
  async exportWorkspace(
    workspace: string,
    format: ExportFormat,
    options?: {
      includePatterns?: boolean;
      includeParameters?: boolean;
      includeTemplates?: boolean;
    }
  ): Promise<ExportResult> {
    try {
      const workspaceConfig = await this.loadWorkspaceConfig(workspace);
      
      const exportData = {
        workspace: workspace,
        patterns: options?.includePatterns ? workspaceConfig.patterns : undefined,
        parameters: options?.includeParameters ? workspaceConfig.parameters : undefined,
        templates: options?.includeTemplates ? workspaceConfig.templates : undefined,
        metadata: {
          exportedAt: new Date().toISOString(),
          version: '1.0.0'
        }
      };

      return this.exportPattern(exportData as any, format);

    } catch (error) {
      return {
        success: false,
        errors: [error instanceof Error ? error.message : 'Failed to export workspace']
      };
    }
  }

  // Private helper methods

  private async readFile(filePath: string): Promise<string> {
    // Implementation would depend on the runtime environment
    // For browser: FileReader API
    // For Node.js: fs.readFile
    throw new Error('File reading not implemented for this environment');
  }

  private async fetchFromUrl(url: string): Promise<string> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch from URL: ${response.status} ${response.statusText}`);
    }
    return response.text();
  }

  private async fetchFromGit(repository: string, options?: any): Promise<string> {
    // Implementation would use Git API or clone repository
    throw new Error('Git import not implemented');
  }

  private async importFromRegistry(registryId: string, options?: any): Promise<ImportResult> {
    try {
      const pattern = this.registry.getPattern(registryId);
      if (!pattern) {
        throw new Error(`Pattern not found in registry: ${registryId}`);
      }

      return {
        success: true,
        pattern,
        errors: [],
        warnings: []
      };
    } catch (error) {
      return {
        success: false,
        errors: [error instanceof Error ? error.message : 'Registry import failed'],
        warnings: []
      };
    }
  }

  private async importFromTerraform(source: string, options?: any): Promise<ImportResult> {
    // Parse Terraform configuration and convert to pattern
    throw new Error('Terraform import not implemented');
  }

  private async importFromCloudFormation(source: string, options?: any): Promise<ImportResult> {
    // Parse CloudFormation template and convert to pattern
    throw new Error('CloudFormation import not implemented');
  }

  private async importFromKubernetes(source: string, options?: any): Promise<ImportResult> {
    // Parse Kubernetes manifests and convert to pattern
    throw new Error('Kubernetes import not implemented');
  }

  private async parsePatternData(data: string, sourceType: string): Promise<InfrastructurePattern> {
    try {
      if (sourceType === 'file' || sourceType === 'url') {
        // Try JSON first
        try {
          return JSON.parse(data) as InfrastructurePattern;
        } catch {
          // Try YAML
          return this.parseYaml(data) as InfrastructurePattern;
        }
      }
      
      throw new Error(`Unsupported data format for source type: ${sourceType}`);
    } catch (error) {
      throw new Error(`Failed to parse pattern data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async convertToInternalFormat(pattern: any): Promise<InfrastructurePattern> {
    // Ensure pattern conforms to internal format
    const normalizedPattern: InfrastructurePattern = {
      id: pattern.id || this.generatePatternId(pattern.name),
      name: pattern.name,
      description: pattern.description,
      category: pattern.category || 'Web Applications',
      complexity: pattern.complexity || 'moderate',
      version: pattern.version || '1.0.0',
      status: pattern.status || 'stable',
      author: pattern.author || 'Unknown',
      license: pattern.license,
      tags: pattern.tags || [],
      components: pattern.components || [],
      relationships: pattern.relationships || [],
      parameters: pattern.parameters || [],
      useCases: pattern.useCases || [],
      designPrinciples: pattern.designPrinciples || [],
      providers: pattern.providers || [],
      estimatedCost: pattern.estimatedCost,
      costFactors: pattern.costFactors || [],
      rating: pattern.rating || 0,
      reviewCount: pattern.reviewCount || 0,
      downloadCount: pattern.downloadCount || 0,
      featured: pattern.featured || false,
      lastUpdated: pattern.lastUpdated || new Date().toISOString(),
      documentation: pattern.documentation || [],
      changelog: pattern.changelog || []
    };

    return normalizedPattern;
  }

  private generatePatternId(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  }

  private convertToYaml(pattern: InfrastructurePattern): string {
    // Simple YAML conversion - in a real implementation, use a YAML library
    return JSON.stringify(pattern, null, 2).replace(/"/g, '').replace(/,$/gm, '');
  }

  private parseYaml(yamlString: string): any {
    // Simple YAML parsing - in a real implementation, use a YAML library
    throw new Error('YAML parsing not implemented');
  }

  private async convertToTerraform(pattern: InfrastructurePattern, options?: any): Promise<string> {
    // Convert pattern to Terraform configuration
    const terraformConfig = {
      terraform: {
        required_version: '>= 1.0'
      },
      variable: this.generateTerraformVariables(pattern),
      resource: this.generateTerraformResources(pattern),
      output: this.generateTerraformOutputs(pattern)
    };

    return this.formatTerraformConfig(terraformConfig);
  }

  private async convertToCloudFormation(pattern: InfrastructurePattern, options?: any): Promise<string> {
    // Convert pattern to CloudFormation template
    throw new Error('CloudFormation conversion not implemented');
  }

  private async convertToKubernetes(pattern: InfrastructurePattern, options?: any): Promise<string> {
    // Convert pattern to Kubernetes manifests
    throw new Error('Kubernetes conversion not implemented');
  }

  private async convertToARM(pattern: InfrastructurePattern, options?: any): Promise<string> {
    // Convert pattern to Azure Resource Manager template
    throw new Error('ARM template conversion not implemented');
  }

  private async convertToPulumi(pattern: InfrastructurePattern, options?: any): Promise<string> {
    // Convert pattern to Pulumi TypeScript code
    throw new Error('Pulumi conversion not implemented');
  }

  private generateTerraformVariables(pattern: InfrastructurePattern): Record<string, any> {
    const variables: Record<string, any> = {};
    
    pattern.parameters?.forEach(param => {
      variables[param.name] = {
        description: param.description,
        type: this.mapToTerraformType(param.type),
        default: param.defaultValue
      };
    });

    return variables;
  }

  private generateTerraformResources(pattern: InfrastructurePattern): Record<string, any> {
    const resources: Record<string, any> = {};
    
    pattern.components.forEach(component => {
      const resourceType = this.mapToTerraformResourceType(component.type);
      const resourceName = this.sanitizeTerraformName(component.name);
      
      resources[resourceType] = resources[resourceType] || {};
      resources[resourceType][resourceName] = component.configuration || {};
    });

    return resources;
  }

  private generateTerraformOutputs(pattern: InfrastructurePattern): Record<string, any> {
    // Generate outputs based on component relationships and common output patterns
    return {};
  }

  private formatTerraformConfig(config: any): string {
    // Format Terraform HCL - simplified implementation
    let hcl = '';
    
    Object.entries(config).forEach(([blockType, blocks]) => {
      if (typeof blocks === 'object' && blocks !== null) {
        Object.entries(blocks).forEach(([blockName, blockConfig]) => {
          hcl += `${blockType} "${blockName}" {\n`;
          hcl += this.formatTerraformBlock(blockConfig as any, 2);
          hcl += '}\n\n';
        });
      }
    });

    return hcl;
  }

  private formatTerraformBlock(obj: any, indent: number): string {
    let result = '';
    const spaces = ' '.repeat(indent);
    
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        result += `${spaces}${key} = {\n`;
        result += this.formatTerraformBlock(value, indent + 2);
        result += `${spaces}}\n`;
      } else {
        result += `${spaces}${key} = ${JSON.stringify(value)}\n`;
      }
    });

    return result;
  }

  private mapToTerraformType(type: string): string {
    const typeMap: Record<string, string> = {
      'string': 'string',
      'number': 'number',
      'boolean': 'bool',
      'array': 'list(string)',
      'object': 'object({})'
    };
    return typeMap[type] || 'string';
  }

  private mapToTerraformResourceType(componentType: string): string {
    // Map component types to Terraform resource types
    const resourceMap: Record<string, string> = {
      'compute': 'aws_instance',
      'storage': 'aws_s3_bucket',
      'database': 'aws_rds_instance',
      'network': 'aws_vpc',
      'security': 'aws_security_group'
    };
    return resourceMap[componentType] || 'null_resource';
  }

  private sanitizeTerraformName(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/_{2,}/g, '_');
  }

  private applyParameterOverrides(pattern: InfrastructurePattern, overrides: Record<string, any>): InfrastructurePattern {
    const updatedPattern = { ...pattern };
    
    // Apply overrides to component configurations
    updatedPattern.components = pattern.components.map(component => {
      const updatedComponent = { ...component };
      
      // Apply parameter overrides to component configuration
      if (updatedComponent.configuration) {
        updatedComponent.configuration = this.substituteParameters(
          updatedComponent.configuration,
          overrides
        );
      }
      
      return updatedComponent;
    });

    return updatedPattern;
  }

  private substituteParameters(obj: any, parameters: Record<string, any>): any {
    if (typeof obj === 'string') {
      // Replace parameter references like ${parameter_name}
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

  private async saveToWorkspace(
    workspace: string, 
    pattern: InfrastructurePattern, 
    template: PatternTemplate, 
    target?: string
  ): Promise<void> {
    // Implementation would save pattern and template to workspace
    console.log(`Saving pattern ${pattern.id} to workspace ${workspace}`);
  }

  private async loadWorkspaceConfig(workspace: string): Promise<any> {
    // Implementation would load workspace configuration
    return {
      patterns: [],
      parameters: {},
      templates: []
    };
  }
}

export const patternImportExport = new PatternImportExport();