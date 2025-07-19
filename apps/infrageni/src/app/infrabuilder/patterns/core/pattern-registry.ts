/**
 * Pattern Registry - Central registry for infrastructure patterns and blueprints
 * Manages pattern definitions, metadata, validation, and discovery
 */

import {
  InfrastructurePattern,
  PatternCategory,
  PatternComplexity,
  PatternStatus,
  PatternValidationResult,
  ValidationError,
  ValidationWarning,
  ComponentReference,
  ComponentRelationship
} from './pattern-types';
import { ComponentRegistry } from '../../components/core/component-registry';

export interface PatternSearchFilters {
  categories?: PatternCategory[];
  complexity?: PatternComplexity[];
  providers?: string[];
  tags?: string[];
  status?: PatternStatus[];
  author?: string;
  minRating?: number;
  freeText?: string;
}

export interface PatternSearchResult {
  pattern: InfrastructurePattern;
  relevanceScore: number;
  matchedFields: string[];
}

export class PatternRegistry {
  private static instance: PatternRegistry;
  private patterns: Map<string, InfrastructurePattern> = new Map();
  private categoryIndex: Map<PatternCategory, InfrastructurePattern[]> = new Map();
  private tagIndex: Map<string, InfrastructurePattern[]> = new Map();
  private authorIndex: Map<string, InfrastructurePattern[]> = new Map();
  private componentRegistry: ComponentRegistry;
  private initialized = false;

  private constructor() {
    this.componentRegistry = ComponentRegistry.getInstance();
  }

  static getInstance(): PatternRegistry {
    if (!PatternRegistry.instance) {
      PatternRegistry.instance = new PatternRegistry();
    }
    return PatternRegistry.instance;
  }

  /**
   * Initialize the pattern registry
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    console.log('🏗️ Initializing Pattern Registry...');
    
    // Ensure component registry is initialized first
    await this.componentRegistry.initialize();
    
    // Load pattern definitions
    await this.loadCorePatterns();
    await this.loadCommunityPatterns();
    
    // Build search indexes
    this.buildCategoryIndex();
    this.buildTagIndex();
    this.buildAuthorIndex();
    
    this.initialized = true;
    console.log(`✅ Pattern Registry initialized with ${this.patterns.size} patterns`);
  }

  /**
   * Register a new pattern
   */
  registerPattern(pattern: InfrastructurePattern): PatternValidationResult {
    // Validate pattern before registration
    const validation = this.validatePattern(pattern);
    
    if (!validation.valid) {
      console.error(`❌ Pattern validation failed for ${pattern.id}:`, validation.errors);
      return validation;
    }

    // Register the pattern
    this.patterns.set(pattern.id, pattern);
    this.invalidateIndexes();
    
    console.log(`✅ Registered pattern: ${pattern.name} (${pattern.id})`);
    return validation;
  }

  /**
   * Get a pattern by ID
   */
  getPattern(patternId: string): InfrastructurePattern | undefined {
    return this.patterns.get(patternId);
  }

  /**
   * Get all patterns
   */
  getAllPatterns(): InfrastructurePattern[] {
    return Array.from(this.patterns.values());
  }

  /**
   * Get patterns by category
   */
  getPatternsByCategory(category: PatternCategory): InfrastructurePattern[] {
    return this.categoryIndex.get(category) || [];
  }

  /**
   * Get patterns by author
   */
  getPatternsByAuthor(author: string): InfrastructurePattern[] {
    return this.authorIndex.get(author) || [];
  }

  /**
   * Search patterns with filters
   */
  searchPatterns(filters: PatternSearchFilters): PatternSearchResult[] {
    let results = Array.from(this.patterns.values());

    // Apply category filter
    if (filters.categories && filters.categories.length > 0) {
      results = results.filter(p => filters.categories!.includes(p.category));
    }

    // Apply complexity filter
    if (filters.complexity && filters.complexity.length > 0) {
      results = results.filter(p => filters.complexity!.includes(p.complexity));
    }

    // Apply provider filter
    if (filters.providers && filters.providers.length > 0) {
      results = results.filter(p => 
        filters.providers!.some(provider => p.providers.includes(provider))
      );
    }

    // Apply status filter
    if (filters.status && filters.status.length > 0) {
      results = results.filter(p => filters.status!.includes(p.status));
    }

    // Apply tag filter
    if (filters.tags && filters.tags.length > 0) {
      results = results.filter(p =>
        filters.tags!.some(tag => p.tags.includes(tag))
      );
    }

    // Apply author filter
    if (filters.author) {
      results = results.filter(p => 
        p.author.toLowerCase().includes(filters.author!.toLowerCase())
      );
    }

    // Apply rating filter
    if (filters.minRating !== undefined) {
      results = results.filter(p => (p.rating || 0) >= filters.minRating!);
    }

    // Apply free text search
    if (filters.freeText) {
      const searchTerm = filters.freeText.toLowerCase();
      results = results.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        p.documentation.overview.toLowerCase().includes(searchTerm)
      );
    }

    // Calculate relevance scores and return results
    return results.map(pattern => ({
      pattern,
      relevanceScore: this.calculateRelevanceScore(pattern, filters),
      matchedFields: this.getMatchedFields(pattern, filters)
    })).sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  /**
   * Validate a pattern
   */
  validatePattern(pattern: InfrastructurePattern): PatternValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Basic validation
    if (!pattern.id) {
      errors.push({
        code: 'MISSING_ID',
        message: 'Pattern ID is required',
        severity: 'error'
      });
    }

    if (!pattern.name) {
      errors.push({
        code: 'MISSING_NAME',
        message: 'Pattern name is required',
        severity: 'error'
      });
    }

    if (!pattern.description) {
      errors.push({
        code: 'MISSING_DESCRIPTION',
        message: 'Pattern description is required',
        severity: 'error'
      });
    }

    // Validate components exist
    for (const componentRef of pattern.components) {
      const component = this.componentRegistry.getComponent(componentRef.componentId);
      if (!component) {
        errors.push({
          code: 'INVALID_COMPONENT',
          message: `Component ${componentRef.componentId} not found`,
          component: componentRef.instanceId,
          severity: 'error'
        });
      }
    }

    // Validate relationships
    for (const relationship of pattern.relationships) {
      const fromComponent = pattern.components.find(c => c.instanceId === relationship.fromInstanceId);
      const toComponent = pattern.components.find(c => c.instanceId === relationship.toInstanceId);
      
      if (!fromComponent) {
        errors.push({
          code: 'INVALID_RELATIONSHIP_FROM',
          message: `From component ${relationship.fromInstanceId} not found`,
          severity: 'error'
        });
      }
      
      if (!toComponent) {
        errors.push({
          code: 'INVALID_RELATIONSHIP_TO',
          message: `To component ${relationship.toInstanceId} not found`,
          severity: 'error'
        });
      }
    }

    // Validate dependencies
    this.validateDependencies(pattern, errors, warnings);

    // Check for circular dependencies
    this.checkCircularDependencies(pattern, errors);

    // Validate provider compatibility
    this.validateProviderCompatibility(pattern, warnings);

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      suggestions: []
    };
  }

  /**
   * Clone a pattern with modifications
   */
  clonePattern(sourcePatternId: string, modifications: Partial<InfrastructurePattern>): InfrastructurePattern | null {
    const sourcePattern = this.getPattern(sourcePatternId);
    if (!sourcePattern) {
      return null;
    }

    const clonedPattern: InfrastructurePattern = {
      ...sourcePattern,
      ...modifications,
      id: modifications.id || `${sourcePattern.id}-copy`,
      name: modifications.name || `${sourcePattern.name} (Copy)`,
      version: modifications.version || '1.0.0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      downloadCount: 0,
      rating: undefined,
      reviews: []
    };

    return clonedPattern;
  }

  /**
   * Get pattern statistics
   */
  getPatternStats(): {
    totalPatterns: number;
    byCategory: Record<PatternCategory, number>;
    byComplexity: Record<PatternComplexity, number>;
    byStatus: Record<PatternStatus, number>;
    topAuthors: { author: string; count: number }[];
    avgRating: number;
  } {
    const patterns = this.getAllPatterns();
    
    const byCategory = Object.values(PatternCategory).reduce((acc, cat) => {
      acc[cat] = patterns.filter(p => p.category === cat).length;
      return acc;
    }, {} as Record<PatternCategory, number>);

    const byComplexity = Object.values(PatternComplexity).reduce((acc, comp) => {
      acc[comp] = patterns.filter(p => p.complexity === comp).length;
      return acc;
    }, {} as Record<PatternComplexity, number>);

    const byStatus = Object.values(PatternStatus).reduce((acc, stat) => {
      acc[stat] = patterns.filter(p => p.status === stat).length;
      return acc;
    }, {} as Record<PatternStatus, number>);

    const authorCounts = patterns.reduce((acc, pattern) => {
      acc[pattern.author] = (acc[pattern.author] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topAuthors = Object.entries(authorCounts)
      .map(([author, count]) => ({ author, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const ratingsSum = patterns.reduce((sum, p) => sum + (p.rating || 0), 0);
    const ratedPatterns = patterns.filter(p => p.rating !== undefined).length;
    const avgRating = ratedPatterns > 0 ? ratingsSum / ratedPatterns : 0;

    return {
      totalPatterns: patterns.length,
      byCategory,
      byComplexity,
      byStatus,
      topAuthors,
      avgRating
    };
  }

  // Private helper methods

  private async loadCorePatterns(): Promise<void> {
    // TODO: Load core patterns from files
    console.log('📦 Loading core patterns...');
  }

  private async loadCommunityPatterns(): Promise<void> {
    // TODO: Load community patterns from external sources
    console.log('🌐 Loading community patterns...');
  }

  private buildCategoryIndex(): void {
    this.categoryIndex.clear();
    for (const pattern of this.patterns.values()) {
      if (!this.categoryIndex.has(pattern.category)) {
        this.categoryIndex.set(pattern.category, []);
      }
      this.categoryIndex.get(pattern.category)!.push(pattern);
    }
  }

  private buildTagIndex(): void {
    this.tagIndex.clear();
    for (const pattern of this.patterns.values()) {
      for (const tag of pattern.tags) {
        if (!this.tagIndex.has(tag)) {
          this.tagIndex.set(tag, []);
        }
        this.tagIndex.get(tag)!.push(pattern);
      }
    }
  }

  private buildAuthorIndex(): void {
    this.authorIndex.clear();
    for (const pattern of this.patterns.values()) {
      if (!this.authorIndex.has(pattern.author)) {
        this.authorIndex.set(pattern.author, []);
      }
      this.authorIndex.get(pattern.author)!.push(pattern);
    }
  }

  private invalidateIndexes(): void {
    // Mark indexes as needing rebuild
    this.buildCategoryIndex();
    this.buildTagIndex();
    this.buildAuthorIndex();
  }

  private validateDependencies(pattern: InfrastructurePattern, errors: ValidationError[], warnings: ValidationWarning[]): void {
    for (const component of pattern.components) {
      for (const depId of component.dependencies) {
        const dependency = pattern.components.find(c => c.instanceId === depId);
        if (!dependency) {
          errors.push({
            code: 'MISSING_DEPENDENCY',
            message: `Dependency ${depId} not found for component ${component.instanceId}`,
            component: component.instanceId,
            severity: 'error'
          });
        }
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

  private validateProviderCompatibility(pattern: InfrastructurePattern, warnings: ValidationWarning[]): void {
    // Check if all components are compatible with pattern's supported providers
    for (const provider of pattern.providers) {
      for (const componentRef of pattern.components) {
        const component = this.componentRegistry.getComponent(componentRef.componentId);
        if (component && !component.providerMappings[provider]) {
          warnings.push({
            code: 'PROVIDER_INCOMPATIBILITY',
            message: `Component ${componentRef.componentId} may not be compatible with provider ${provider}`,
            component: componentRef.instanceId,
            suggestion: `Consider using an alternative component or adding provider mapping`
          });
        }
      }
    }
  }

  private calculateRelevanceScore(pattern: InfrastructurePattern, filters: PatternSearchFilters): number {
    let score = 0;

    // Base score from rating
    score += (pattern.rating || 0) * 20;

    // Boost for exact category match
    if (filters.categories?.includes(pattern.category)) {
      score += 50;
    }

    // Boost for tag matches
    if (filters.tags) {
      const matchedTags = filters.tags.filter(tag => pattern.tags.includes(tag));
      score += matchedTags.length * 30;
    }

    // Boost for provider compatibility
    if (filters.providers) {
      const matchedProviders = filters.providers.filter(provider => pattern.providers.includes(provider));
      score += matchedProviders.length * 25;
    }

    // Boost for complexity match
    if (filters.complexity?.includes(pattern.complexity)) {
      score += 20;
    }

    // Boost for download count (popularity)
    score += Math.log10((pattern.downloadCount || 0) + 1) * 10;

    // Text match scoring
    if (filters.freeText) {
      const searchTerm = filters.freeText.toLowerCase();
      if (pattern.name.toLowerCase().includes(searchTerm)) {
        score += 100;
      }
      if (pattern.description.toLowerCase().includes(searchTerm)) {
        score += 50;
      }
    }

    return score;
  }

  private getMatchedFields(pattern: InfrastructurePattern, filters: PatternSearchFilters): string[] {
    const matched: string[] = [];

    if (filters.categories?.includes(pattern.category)) {
      matched.push('category');
    }

    if (filters.tags?.some(tag => pattern.tags.includes(tag))) {
      matched.push('tags');
    }

    if (filters.providers?.some(provider => pattern.providers.includes(provider))) {
      matched.push('providers');
    }

    if (filters.complexity?.includes(pattern.complexity)) {
      matched.push('complexity');
    }

    if (filters.freeText) {
      const searchTerm = filters.freeText.toLowerCase();
      if (pattern.name.toLowerCase().includes(searchTerm)) {
        matched.push('name');
      }
      if (pattern.description.toLowerCase().includes(searchTerm)) {
        matched.push('description');
      }
    }

    return matched;
  }
}