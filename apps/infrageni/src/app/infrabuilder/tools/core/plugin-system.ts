import { TLEditor, TLShape } from 'tldraw';
import { CloudProvider } from '../../types';

// Core plugin interface
export interface InfraToolPlugin {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  version: string;
  initialize(context: ToolContext): Promise<void>;
  execute(params: ToolParams): Promise<ToolResult>;
  cleanup?(): Promise<void>;
}

// Tool categories
export enum ToolCategory {
  EXPORT = 'export',
  LAYOUT = 'layout',
  VALIDATION = 'validation',
  VISUALIZATION = 'visualization',
  TEMPLATE = 'template',
  ANALYSIS = 'analysis'
}

// Tool context provided to plugins
export interface ToolContext {
  canvas: TLEditor;
  shapes: TLShape[];
  provider: CloudProvider;
  settings: ToolSettings;
  metadata: CanvasMetadata;
}

// Tool execution parameters
export interface ToolParams {
  [key: string]: any;
  options?: ToolOptions;
}

// Tool execution result
export interface ToolResult {
  success: boolean;
  data?: any;
  error?: string;
  metadata?: {
    executionTime: number;
    processingStats?: Record<string, any>;
  };
}

// Tool settings
export interface ToolSettings {
  autoSave: boolean;
  previewMode: boolean;
  validateOnExport: boolean;
  defaultProvider: CloudProvider;
  customSettings: Record<string, any>;
}

// Tool options
export interface ToolOptions {
  async?: boolean;
  timeout?: number;
  retries?: number;
  cacheResults?: boolean;
}

// Canvas metadata
export interface CanvasMetadata {
  created: string;
  modified: string;
  version: string;
  author?: string;
  description?: string;
  tags?: string[];
}

// Plugin registration info
export interface PluginRegistration {
  plugin: InfraToolPlugin;
  enabled: boolean;
  config: Record<string, any>;
  dependencies?: string[];
}

// Plugin system events
export enum PluginEvent {
  BEFORE_INITIALIZE = 'before-initialize',
  AFTER_INITIALIZE = 'after-initialize',
  BEFORE_EXECUTE = 'before-execute',
  AFTER_EXECUTE = 'after-execute',
  ERROR = 'error',
  CLEANUP = 'cleanup'
}

// Event handler type
export type PluginEventHandler = (event: PluginEvent, data?: any) => void;

// Plugin system manager
export class PluginSystem {
  private plugins: Map<string, PluginRegistration> = new Map();
  private eventHandlers: Map<PluginEvent, PluginEventHandler[]> = new Map();
  private initialized = false;

  // Register a plugin
  registerPlugin(plugin: InfraToolPlugin, config: Record<string, any> = {}): void {
    if (this.plugins.has(plugin.id)) {
      throw new Error(`Plugin with ID '${plugin.id}' is already registered`);
    }

    this.plugins.set(plugin.id, {
      plugin,
      enabled: true,
      config,
      dependencies: config.dependencies || []
    });

    console.log(`✅ Plugin registered: ${plugin.name} (${plugin.id})`);
  }

  // Unregister a plugin
  unregisterPlugin(pluginId: string): void {
    const registration = this.plugins.get(pluginId);
    if (!registration) {
      throw new Error(`Plugin with ID '${pluginId}' is not registered`);
    }

    // Cleanup if plugin has cleanup method
    if (registration.plugin.cleanup) {
      registration.plugin.cleanup();
    }

    this.plugins.delete(pluginId);
    console.log(`❌ Plugin unregistered: ${pluginId}`);
  }

  // Initialize all plugins
  async initializePlugins(context: ToolContext): Promise<void> {
    if (this.initialized) return;

    this.emitEvent(PluginEvent.BEFORE_INITIALIZE);

    // Sort plugins by dependencies
    const sortedPlugins = this.sortPluginsByDependencies();

    for (const registration of sortedPlugins) {
      if (registration.enabled) {
        try {
          await registration.plugin.initialize(context);
          console.log(`🚀 Plugin initialized: ${registration.plugin.name}`);
        } catch (error) {
          console.error(`❌ Failed to initialize plugin ${registration.plugin.id}:`, error);
          this.emitEvent(PluginEvent.ERROR, { pluginId: registration.plugin.id, error });
        }
      }
    }

    this.initialized = true;
    this.emitEvent(PluginEvent.AFTER_INITIALIZE);
  }

  // Execute a plugin tool
  async executePlugin(pluginId: string, params: ToolParams): Promise<ToolResult> {
    const registration = this.plugins.get(pluginId);
    if (!registration) {
      return {
        success: false,
        error: `Plugin with ID '${pluginId}' is not registered`
      };
    }

    if (!registration.enabled) {
      return {
        success: false,
        error: `Plugin '${pluginId}' is disabled`
      };
    }

    this.emitEvent(PluginEvent.BEFORE_EXECUTE, { pluginId, params });

    const startTime = Date.now();
    try {
      const result = await registration.plugin.execute(params);
      const executionTime = Date.now() - startTime;

      const enhancedResult = {
        ...result,
        metadata: {
          ...result.metadata,
          executionTime
        }
      };

      this.emitEvent(PluginEvent.AFTER_EXECUTE, { pluginId, result: enhancedResult });
      return enhancedResult;
    } catch (error) {
      const executionTime = Date.now() - startTime;
      const errorResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: { executionTime }
      };

      this.emitEvent(PluginEvent.ERROR, { pluginId, error });
      return errorResult;
    }
  }

  // Get plugin by ID
  getPlugin(pluginId: string): InfraToolPlugin | undefined {
    return this.plugins.get(pluginId)?.plugin;
  }

  // Get all plugins by category
  getPluginsByCategory(category: ToolCategory): InfraToolPlugin[] {
    return Array.from(this.plugins.values())
      .filter(reg => reg.plugin.category === category && reg.enabled)
      .map(reg => reg.plugin);
  }

  // Get all registered plugins
  getAllPlugins(): InfraToolPlugin[] {
    return Array.from(this.plugins.values())
      .filter(reg => reg.enabled)
      .map(reg => reg.plugin);
  }

  // Enable/disable plugin
  setPluginEnabled(pluginId: string, enabled: boolean): void {
    const registration = this.plugins.get(pluginId);
    if (registration) {
      registration.enabled = enabled;
      console.log(`${enabled ? '✅' : '❌'} Plugin ${enabled ? 'enabled' : 'disabled'}: ${pluginId}`);
    }
  }

  // Add event handler
  addEventListener(event: PluginEvent, handler: PluginEventHandler): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);
  }

  // Remove event handler
  removeEventListener(event: PluginEvent, handler: PluginEventHandler): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  // Emit event to all handlers
  private emitEvent(event: PluginEvent, data?: any): void {
    const handlers = this.eventHandlers.get(event) || [];
    handlers.forEach(handler => {
      try {
        handler(event, data);
      } catch (error) {
        console.error(`Error in event handler for ${event}:`, error);
      }
    });
  }

  // Sort plugins by dependencies (topological sort)
  private sortPluginsByDependencies(): PluginRegistration[] {
    const registrations = Array.from(this.plugins.values());
    const sorted: PluginRegistration[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const visit = (registration: PluginRegistration) => {
      if (visiting.has(registration.plugin.id)) {
        throw new Error(`Circular dependency detected involving plugin: ${registration.plugin.id}`);
      }
      if (visited.has(registration.plugin.id)) {
        return;
      }

      visiting.add(registration.plugin.id);

      // Visit dependencies first
      for (const depId of registration.dependencies || []) {
        const depRegistration = this.plugins.get(depId);
        if (depRegistration) {
          visit(depRegistration);
        }
      }

      visiting.delete(registration.plugin.id);
      visited.add(registration.plugin.id);
      sorted.push(registration);
    };

    for (const registration of registrations) {
      visit(registration);
    }

    return sorted;
  }

  // Cleanup all plugins
  async cleanup(): Promise<void> {
    this.emitEvent(PluginEvent.CLEANUP);
    
    for (const registration of this.plugins.values()) {
      if (registration.plugin.cleanup) {
        try {
          await registration.plugin.cleanup();
        } catch (error) {
          console.error(`Error cleaning up plugin ${registration.plugin.id}:`, error);
        }
      }
    }
    
    this.initialized = false;
    this.plugins.clear();
    this.eventHandlers.clear();
  }
}

// Global plugin system instance
export const pluginSystem = new PluginSystem();