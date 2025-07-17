import { ComponentMetadata, ComponentConfig, ComponentCategory } from './component-types';

/**
 * Component Registry - Central registry for all infrastructure components
 * Manages component definitions, metadata, and provider mappings
 */
export class ComponentRegistry {
  private static instance: ComponentRegistry;
  private components: Map<string, ComponentMetadata> = new Map();
  private categories: Map<ComponentCategory, ComponentMetadata[]> = new Map();
  private providerMappings: Map<string, Map<string, ComponentMetadata>> = new Map();
  private initialized = false;

  private constructor() {}

  static getInstance(): ComponentRegistry {
    if (!ComponentRegistry.instance) {
      ComponentRegistry.instance = new ComponentRegistry();
    }
    return ComponentRegistry.instance;
  }

  /**
   * Initialize the registry with component definitions
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    console.log('🔧 Initializing Component Registry...');
    
    // Load component definitions
    await this.loadCoreComponents();
    await this.loadProviderComponents();
    
    // Build indexes
    this.buildCategoryIndex();
    this.buildProviderIndex();
    
    this.initialized = true;
    console.log(`✅ Component Registry initialized with ${this.components.size} components`);
  }

  /**
   * Register a component in the registry
   */
  registerComponent(component: ComponentMetadata): void {
    this.components.set(component.id, component);
    this.invalidateIndexes();
  }

  /**
   * Get component by ID
   */
  getComponent(id: string): ComponentMetadata | undefined {
    return this.components.get(id);
  }

  /**
   * Get all components
   */
  getAllComponents(): ComponentMetadata[] {
    return Array.from(this.components.values());
  }

  /**
   * Get components by category
   */
  getComponentsByCategory(category: ComponentCategory): ComponentMetadata[] {
    return this.categories.get(category) || [];
  }

  /**
   * Get components by provider
   */
  getComponentsByProvider(provider: string): ComponentMetadata[] {
    const providerMap = this.providerMappings.get(provider);
    return providerMap ? Array.from(providerMap.values()) : [];
  }

  /**
   * Search components
   */
  searchComponents(query: string): ComponentMetadata[] {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.components.values()).filter(component =>
      component.name.toLowerCase().includes(lowercaseQuery) ||
      component.description.toLowerCase().includes(lowercaseQuery) ||
      component.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      Object.values(component.providerMappings).some(mapping =>
        mapping.name.toLowerCase().includes(lowercaseQuery)
      )
    );
  }

  /**
   * Get component categories
   */
  getCategories(): ComponentCategory[] {
    return Array.from(this.categories.keys());
  }

  /**
   * Get component provider mappings
   */
  getProviderMapping(componentId: string, provider: string): ComponentMetadata['providerMappings'][string] | undefined {
    const component = this.components.get(componentId);
    return component?.providerMappings[provider];
  }

  /**
   * Validate component configuration
   */
  validateComponent(component: ComponentMetadata): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required fields
    if (!component.id) errors.push('Component ID is required');
    if (!component.name) errors.push('Component name is required');
    if (!component.category) errors.push('Component category is required');

    // Provider mappings validation
    if (Object.keys(component.providerMappings).length === 0) {
      errors.push('At least one provider mapping is required');
    }

    // Icon validation
    Object.entries(component.providerMappings).forEach(([provider, mapping]) => {
      if (!mapping.iconPath) {
        errors.push(`Icon path is required for provider: ${provider}`);
      }
    });

    return { valid: errors.length === 0, errors };
  }

  /**
   * Load core/generic components
   */
  private async loadCoreComponents(): Promise<void> {
    const { getCoreComponents } = await import('./core-components');
    const coreComponents = getCoreComponents();
    
    coreComponents.forEach(component => {
      this.registerComponent(component);
    });
  }

  /**
   * Load provider-specific components
   */
  private async loadProviderComponents(): Promise<void> {
    const { getAwsComponents } = await import('./aws-components');
    const { getAzureComponents } = await import('./azure-components');
    const { getGcpComponents } = await import('./gcp-components');
    
    const awsComponents = await getAwsComponents();
    const azureComponents = await getAzureComponents();
    const gcpComponents = await getGcpComponents();
    
    [...awsComponents, ...azureComponents, ...gcpComponents].forEach(component => {
      this.registerComponent(component);
    });
  }

  /**
   * Build category index
   */
  private buildCategoryIndex(): void {
    this.categories.clear();
    
    for (const component of this.components.values()) {
      const category = component.category;
      if (!this.categories.has(category)) {
        this.categories.set(category, []);
      }
      this.categories.get(category)!.push(component);
    }
  }

  /**
   * Build provider index
   */
  private buildProviderIndex(): void {
    this.providerMappings.clear();
    
    for (const component of this.components.values()) {
      for (const provider of Object.keys(component.providerMappings)) {
        if (!this.providerMappings.has(provider)) {
          this.providerMappings.set(provider, new Map());
        }
        this.providerMappings.get(provider)!.set(component.id, component);
      }
    }
  }

  /**
   * Invalidate indexes when components change
   */
  private invalidateIndexes(): void {
    this.buildCategoryIndex();
    this.buildProviderIndex();
  }

  /**
   * Get registry statistics
   */
  getStats(): {
    totalComponents: number;
    categoryCounts: Record<ComponentCategory, number>;
    providerCounts: Record<string, number>;
  } {
    const categoryCounts: Record<ComponentCategory, number> = {} as any;
    const providerCounts: Record<string, number> = {};

    // Count by category
    for (const [category, components] of this.categories) {
      categoryCounts[category] = components.length;
    }

    // Count by provider
    for (const [provider, components] of this.providerMappings) {
      providerCounts[provider] = components.size;
    }

    return {
      totalComponents: this.components.size,
      categoryCounts,
      providerCounts
    };
  }
}

// Export singleton instance
export const componentRegistry = ComponentRegistry.getInstance();