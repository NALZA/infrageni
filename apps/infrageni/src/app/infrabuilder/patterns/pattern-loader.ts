/**
 * Pattern Loader
 * Loads and registers all infrastructure patterns and templates
 */

import { PatternRegistry } from './core/pattern-registry';
import { templateEngine } from './core/template-engine';

// Import all pattern functions
import {
  createSimple3TierWebAppPattern,
  createSimple3TierWebAppTemplate,
  createKubernetesMicroservicesPattern,
  createEventDrivenMicroservicesPattern,
  createMicroservicesTemplate,
  createModernDataLakePattern,
  createMLPipelinePattern,
  createDataAnalyticsTemplate,
  createZeroTrustPattern,
  createComplianceGovernancePattern,
  createSecurityTemplate
} from './library';

/**
 * Pattern loader configuration
 */
export interface PatternLoaderConfig {
  loadCorePatterns: boolean;
  loadTemplates: boolean;
  loadCommunityPatterns: boolean;
  validateOnLoad: boolean;
}

/**
 * Default loader configuration
 */
const DEFAULT_CONFIG: PatternLoaderConfig = {
  loadCorePatterns: true,
  loadTemplates: true,
  loadCommunityPatterns: false,
  validateOnLoad: true
};

/**
 * Pattern loader class
 */
export class PatternLoader {
  private patternRegistry: PatternRegistry;
  private config: PatternLoaderConfig;
  private loadedPatterns: Set<string> = new Set();
  private loadedTemplates: Set<string> = new Set();

  constructor(config: Partial<PatternLoaderConfig> = {}) {
    this.patternRegistry = PatternRegistry.getInstance();
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Load all patterns and templates
   */
  async loadAll(): Promise<void> {
    console.log('🏗️ Loading infrastructure patterns...');

    if (this.config.loadCorePatterns) {
      await this.loadCorePatterns();
    }

    if (this.config.loadTemplates) {
      await this.loadTemplates();
    }

    if (this.config.loadCommunityPatterns) {
      await this.loadCommunityPatterns();
    }

    console.log(`✅ Pattern loading complete. Loaded ${this.loadedPatterns.size} patterns and ${this.loadedTemplates.size} templates`);
  }

  /**
   * Load core infrastructure patterns
   */
  private async loadCorePatterns(): Promise<void> {
    console.log('📦 Loading core patterns...');

    const corePatterns = [
      // Web Application Patterns
      {
        name: 'Simple 3-Tier Web Application',
        factory: createSimple3TierWebAppPattern,
        category: 'Web Applications'
      },

      // Microservices Patterns
      {
        name: 'Kubernetes Microservices',
        factory: createKubernetesMicroservicesPattern,
        category: 'Microservices'
      },
      {
        name: 'Event-Driven Microservices',
        factory: createEventDrivenMicroservicesPattern,
        category: 'Microservices'
      },

      // Data Analytics Patterns
      {
        name: 'Modern Data Lake',
        factory: createModernDataLakePattern,
        category: 'Data Analytics'
      },
      {
        name: 'ML Training and Inference Pipeline',
        factory: createMLPipelinePattern,
        category: 'Machine Learning'
      },

      // Security Patterns
      {
        name: 'Zero Trust Architecture',
        factory: createZeroTrustPattern,
        category: 'Security'
      },
      {
        name: 'Compliance and Governance Framework',
        factory: createComplianceGovernancePattern,
        category: 'Compliance'
      }
    ];

    for (const patternDef of corePatterns) {
      try {
        const pattern = patternDef.factory();
        
        if (this.config.validateOnLoad) {
          const validation = this.patternRegistry.validatePattern(pattern);
          if (!validation.valid) {
            console.warn(`⚠️ Pattern validation failed for ${pattern.name}:`, validation.errors);
            continue;
          }
        }

        const registrationResult = this.patternRegistry.registerPattern(pattern);
        if (registrationResult.valid) {
          this.loadedPatterns.add(pattern.id);
          console.log(`  ✅ Loaded: ${patternDef.name} (${patternDef.category})`);
        } else {
          console.error(`  ❌ Failed to register: ${patternDef.name}`, registrationResult.errors);
        }
      } catch (error) {
        console.error(`  ❌ Error loading pattern ${patternDef.name}:`, error);
      }
    }

    console.log(`📦 Core patterns loaded: ${this.loadedPatterns.size} patterns`);
  }

  /**
   * Load pattern templates
   */
  private async loadTemplates(): Promise<void> {
    console.log('📋 Loading pattern templates...');

    const templates = [
      // Web Application Templates
      {
        name: 'Simple 3-Tier Web Application Template',
        factory: createSimple3TierWebAppTemplate,
        category: 'Web Applications'
      },

      // Microservices Templates
      {
        name: 'Microservices Architecture Template',
        factory: createMicroservicesTemplate,
        category: 'Microservices'
      },

      // Data Analytics Templates
      {
        name: 'Data Analytics Architecture Template',
        factory: createDataAnalyticsTemplate,
        category: 'Data Analytics'
      },

      // Security Templates
      {
        name: 'Security Architecture Template',
        factory: createSecurityTemplate,
        category: 'Security'
      }
    ];

    for (const templateDef of templates) {
      try {
        const template = templateDef.factory();
        templateEngine.registerTemplate(template);
        this.loadedTemplates.add(template.id);
        console.log(`  ✅ Loaded: ${templateDef.name} (${templateDef.category})`);
      } catch (error) {
        console.error(`  ❌ Error loading template ${templateDef.name}:`, error);
      }
    }

    console.log(`📋 Templates loaded: ${this.loadedTemplates.size} templates`);
  }

  /**
   * Load community patterns (placeholder for future implementation)
   */
  private async loadCommunityPatterns(): Promise<void> {
    console.log('🌐 Loading community patterns...');
    
    // TODO: Implement community pattern loading
    // This could involve:
    // - Loading from external repositories
    // - Loading from configuration files
    // - Loading from remote pattern registries
    
    console.log('🌐 Community patterns loading not yet implemented');
  }

  /**
   * Get loader statistics
   */
  getStats(): {
    patternsLoaded: number;
    templatesLoaded: number;
    loadedPatternIds: string[];
    loadedTemplateIds: string[];
  } {
    return {
      patternsLoaded: this.loadedPatterns.size,
      templatesLoaded: this.loadedTemplates.size,
      loadedPatternIds: Array.from(this.loadedPatterns),
      loadedTemplateIds: Array.from(this.loadedTemplates)
    };
  }

  /**
   * Reload all patterns and templates
   */
  async reload(): Promise<void> {
    this.loadedPatterns.clear();
    this.loadedTemplates.clear();
    await this.loadAll();
  }

  /**
   * Check if a pattern is loaded
   */
  isPatternLoaded(patternId: string): boolean {
    return this.loadedPatterns.has(patternId);
  }

  /**
   * Check if a template is loaded
   */
  isTemplateLoaded(templateId: string): boolean {
    return this.loadedTemplates.has(templateId);
  }
}

/**
 * Default pattern loader instance
 */
export const patternLoader = new PatternLoader();

/**
 * Initialize patterns and templates
 */
export async function initializePatterns(config?: Partial<PatternLoaderConfig>): Promise<void> {
  const loader = config ? new PatternLoader(config) : patternLoader;
  await loader.loadAll();
}

/**
 * Get pattern loading statistics
 */
export function getPatternStats() {
  return patternLoader.getStats();
}