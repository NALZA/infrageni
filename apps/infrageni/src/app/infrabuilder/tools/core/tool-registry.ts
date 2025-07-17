import { pluginSystem, ToolCategory, InfraToolPlugin } from './plugin-system';
import { PlantUMLExportTool } from '../export/plantuml-tool';
import { DrawIOExportTool } from '../export/drawio-tool';
import { GraphvizExportTool } from '../export/graphviz-tool';
import { HierarchicalLayoutTool } from '../layout/hierarchical-layout';
import { ForceDirectedLayoutTool } from '../layout/force-directed-layout';
import { NetworkTopologyLayoutTool } from '../layout/network-topology-layout';
import { ArchitectureValidatorTool } from '../validation/architecture-validator';
import { SecurityAnalyzerTool } from '../validation/security-analyzer';
import { CostEstimatorTool } from '../validation/cost-estimator';
import { TemplateLibraryTool } from '../templates/template-library';
import { PatternMatcherTool } from '../templates/pattern-matcher';

// Tool registry for managing all available tools
export class ToolRegistry {
  private static instance: ToolRegistry;
  private registeredTools: Map<string, InfraToolPlugin> = new Map();

  private constructor() {}

  static getInstance(): ToolRegistry {
    if (!ToolRegistry.instance) {
      ToolRegistry.instance = new ToolRegistry();
    }
    return ToolRegistry.instance;
  }

  // Initialize all built-in tools
  async initializeBuiltInTools(): Promise<void> {
    console.log('🔧 Initializing built-in tools...');

    // Export tools
    await this.registerTool(new PlantUMLExportTool());
    await this.registerTool(new DrawIOExportTool());
    await this.registerTool(new GraphvizExportTool());

    // Layout tools
    await this.registerTool(new HierarchicalLayoutTool());
    await this.registerTool(new ForceDirectedLayoutTool());
    await this.registerTool(new NetworkTopologyLayoutTool());

    // Validation tools
    await this.registerTool(new ArchitectureValidatorTool());
    await this.registerTool(new SecurityAnalyzerTool());
    await this.registerTool(new CostEstimatorTool());

    // Template tools
    await this.registerTool(new TemplateLibraryTool());
    await this.registerTool(new PatternMatcherTool());

    console.log(`✅ Initialized ${this.registeredTools.size} built-in tools`);
  }

  // Register a tool
  async registerTool(tool: InfraToolPlugin): Promise<void> {
    try {
      pluginSystem.registerPlugin(tool);
      this.registeredTools.set(tool.id, tool);
      console.log(`✅ Tool registered: ${tool.name} (${tool.id})`);
    } catch (error) {
      console.error(`❌ Failed to register tool ${tool.id}:`, error);
      throw error;
    }
  }

  // Unregister a tool
  unregisterTool(toolId: string): void {
    try {
      pluginSystem.unregisterPlugin(toolId);
      this.registeredTools.delete(toolId);
      console.log(`❌ Tool unregistered: ${toolId}`);
    } catch (error) {
      console.error(`❌ Failed to unregister tool ${toolId}:`, error);
      throw error;
    }
  }

  // Get tool by ID
  getTool(toolId: string): InfraToolPlugin | undefined {
    return this.registeredTools.get(toolId);
  }

  // Get tools by category
  getToolsByCategory(category: ToolCategory): InfraToolPlugin[] {
    return Array.from(this.registeredTools.values())
      .filter(tool => tool.category === category);
  }

  // Get all tools
  getAllTools(): InfraToolPlugin[] {
    return Array.from(this.registeredTools.values());
  }

  // Check if tool is available
  isToolAvailable(toolId: string): boolean {
    return this.registeredTools.has(toolId);
  }

  // Get tool categories with counts
  getToolCategoryStats(): Record<ToolCategory, number> {
    const stats: Record<ToolCategory, number> = {
      [ToolCategory.EXPORT]: 0,
      [ToolCategory.LAYOUT]: 0,
      [ToolCategory.VALIDATION]: 0,
      [ToolCategory.VISUALIZATION]: 0,
      [ToolCategory.TEMPLATE]: 0,
      [ToolCategory.ANALYSIS]: 0
    };

    for (const tool of this.registeredTools.values()) {
      stats[tool.category]++;
    }

    return stats;
  }

  // Search tools by name or description
  searchTools(query: string): InfraToolPlugin[] {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.registeredTools.values())
      .filter(tool => 
        tool.name.toLowerCase().includes(lowercaseQuery) ||
        tool.description.toLowerCase().includes(lowercaseQuery)
      );
  }

  // Get recommended tools based on context
  getRecommendedTools(context: {
    shapes: number;
    hasContainers: boolean;
    provider: string;
    operation: string;
  }): InfraToolPlugin[] {
    const recommendations: InfraToolPlugin[] = [];

    // Recommend layout tools for complex diagrams
    if (context.shapes > 10) {
      recommendations.push(...this.getToolsByCategory(ToolCategory.LAYOUT));
    }

    // Recommend validation tools for production diagrams
    if (context.hasContainers && context.shapes > 5) {
      recommendations.push(...this.getToolsByCategory(ToolCategory.VALIDATION));
    }

    // Recommend export tools for documentation
    if (context.operation === 'export') {
      recommendations.push(...this.getToolsByCategory(ToolCategory.EXPORT));
    }

    // Recommend templates for new projects
    if (context.shapes < 3) {
      recommendations.push(...this.getToolsByCategory(ToolCategory.TEMPLATE));
    }

    return recommendations;
  }

  // Get tool dependencies
  getToolDependencies(toolId: string): string[] {
    const tool = this.registeredTools.get(toolId);
    if (!tool) return [];

    // This would be extended to check actual dependencies
    // For now, return empty array
    return [];
  }

  // Validate tool compatibility
  isToolCompatible(toolId: string, context: any): boolean {
    const tool = this.registeredTools.get(toolId);
    if (!tool) return false;

    // Basic compatibility checks
    // This would be extended with more sophisticated checks
    return true;
  }
}

// Tool manager for easier access
export class ToolManager {
  private registry: ToolRegistry;

  constructor() {
    this.registry = ToolRegistry.getInstance();
  }

  // Initialize all tools
  async initialize(): Promise<void> {
    await this.registry.initializeBuiltInTools();
  }

  // Execute a tool
  async executeTool(toolId: string, params: any): Promise<any> {
    if (!this.registry.isToolAvailable(toolId)) {
      throw new Error(`Tool '${toolId}' is not available`);
    }

    return await pluginSystem.executePlugin(toolId, params);
  }

  // Get available tools
  getAvailableTools(): InfraToolPlugin[] {
    return this.registry.getAllTools();
  }

  // Get tools by category
  getToolsByCategory(category: ToolCategory): InfraToolPlugin[] {
    return this.registry.getToolsByCategory(category);
  }

  // Search tools
  searchTools(query: string): InfraToolPlugin[] {
    return this.registry.searchTools(query);
  }

  // Get tool recommendations
  getRecommendations(context: any): InfraToolPlugin[] {
    return this.registry.getRecommendedTools(context);
  }
}

// Export singleton instance
export const toolManager = new ToolManager();