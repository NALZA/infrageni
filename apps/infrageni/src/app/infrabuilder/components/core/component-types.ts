/**
 * Core types for the infrastructure component system
 */

// Component categories based on infrastructure patterns
export enum ComponentCategory {
  // Infrastructure containers
  NETWORK = 'network',
  COMPUTE = 'compute',
  STORAGE = 'storage',
  DATABASE = 'database',
  
  // Application services
  SERVERLESS = 'serverless',
  CONTAINERS = 'containers',
  
  // Integration & messaging
  MESSAGING = 'messaging',
  INTEGRATION = 'integration',
  API_GATEWAY = 'api-gateway',
  
  // Data & analytics
  ANALYTICS = 'analytics',
  DATA_PROCESSING = 'data-processing',
  STREAMING = 'streaming',
  
  // AI/ML
  AI_ML = 'ai-ml',
  
  // Security & compliance
  SECURITY = 'security',
  IDENTITY = 'identity',
  COMPLIANCE = 'compliance',
  
  // DevOps & monitoring
  DEVOPS = 'devops',
  MONITORING = 'monitoring',
  LOGGING = 'logging',
  
  // IoT & edge
  IOT = 'iot',
  EDGE = 'edge',
  
  // Management & governance
  MANAGEMENT = 'management',
  GOVERNANCE = 'governance',
  
  // Generic/abstract
  GENERIC = 'generic',
  EXTERNAL = 'external'
}

// Component subcategories for more granular organization
export enum ComponentSubcategory {
  // Network subcategories
  LOAD_BALANCER = 'load-balancer',
  VPN = 'vpn',
  CDN = 'cdn',
  DNS = 'dns',
  FIREWALL = 'firewall',
  
  // Compute subcategories
  VIRTUAL_MACHINE = 'virtual-machine',
  BARE_METAL = 'bare-metal',
  AUTO_SCALING = 'auto-scaling',
  
  // Storage subcategories
  OBJECT_STORAGE = 'object-storage',
  BLOCK_STORAGE = 'block-storage',
  FILE_STORAGE = 'file-storage',
  BACKUP = 'backup',
  
  // Database subcategories
  RELATIONAL = 'relational',
  NOSQL = 'nosql',
  CACHE = 'cache',
  DATA_WAREHOUSE = 'data-warehouse',
  
  // Container subcategories
  ORCHESTRATION = 'orchestration',
  REGISTRY = 'registry',
  RUNTIME = 'runtime',
  
  // And more as needed...
}

// Provider-specific mapping information
export interface ProviderMapping {
  name: string;
  description: string;
  iconPath: string;
  iconType: 'svg' | 'png' | 'jpg';
  serviceUrl?: string;
  documentationUrl?: string;
  pricingUrl?: string;
  tags: string[];
  metadata: Record<string, any>;
}

// Configuration options for components
export interface ComponentConfig {
  // Visual properties
  defaultSize: { width: number; height: number };
  minSize: { width: number; height: number };
  maxSize: { width: number; height: number };
  
  // Behavior properties
  isContainer: boolean;
  canContainTypes: ComponentCategory[];
  canBeContainedBy: ComponentCategory[];
  
  // Connection properties
  connectionPoints: ConnectionPoint[];
  allowedConnections: ComponentCategory[];
  
  // Validation rules
  validationRules: ValidationRule[];
  
  // Custom properties
  customProperties: ComponentProperty[];
}

// Connection points for components
export interface ConnectionPoint {
  id: string;
  name: string;
  type: 'input' | 'output' | 'bidirectional';
  position: { x: number; y: number }; // Relative to component
  protocol?: string;
  description?: string;
}

// Validation rules for components
export interface ValidationRule {
  id: string;
  name: string;
  type: 'required' | 'conditional' | 'warning' | 'error';
  condition: string; // JSONPath or similar
  message: string;
  severity: 'info' | 'warning' | 'error';
}

// Custom properties for components
export interface ComponentProperty {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'multi-select' | 'object';
  defaultValue?: any;
  required: boolean;
  description?: string;
  options?: Array<{ value: any; label: string }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    custom?: (value: any) => boolean;
  };
}

// Main component metadata interface
export interface ComponentMetadata {
  // Basic identification
  id: string;
  name: string;
  description: string;
  category: ComponentCategory;
  subcategory?: ComponentSubcategory;
  
  // Provider mappings
  providerMappings: Record<string, ProviderMapping>;
  
  // Configuration
  config: ComponentConfig;
  
  // Metadata
  version: string;
  tags: string[];
  documentation?: string;
  examples?: string[];
  
  // Lifecycle
  createdAt: string;
  updatedAt: string;
  deprecated?: boolean;
  deprecationMessage?: string;
  
  // Extended properties
  aliases?: string[];
  relatedComponents?: string[];
  requiredComponents?: string[];
  
  // Custom metadata
  customMetadata?: Record<string, any>;
}

// Component instance (when used in a diagram)
export interface ComponentInstance {
  id: string;
  componentId: string;
  name: string;
  
  // Position and size
  position: { x: number; y: number };
  size: { width: number; height: number };
  
  // Provider context
  provider: string;
  
  // Configuration values
  properties: Record<string, any>;
  
  // Relationships
  containedBy?: string; // Parent component instance ID
  contains: string[]; // Child component instance IDs
  connections: ComponentConnection[];
  
  // Visual properties
  style?: ComponentStyle;
  
  // Validation state
  validationState: {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  };
  
  // Metadata
  metadata: {
    createdAt: string;
    updatedAt: string;
    tags: string[];
    notes?: string;
  };
}

// Component connections
export interface ComponentConnection {
  id: string;
  fromInstanceId: string;
  toInstanceId: string;
  fromConnectionPoint: string;
  toConnectionPoint: string;
  
  // Connection properties
  type: 'data' | 'control' | 'dependency' | 'network';
  protocol?: string;
  bandwidth?: string;
  latency?: string;
  
  // Visual properties
  style?: ConnectionStyle;
  
  // Metadata
  label?: string;
  description?: string;
  tags: string[];
}

// Visual styling
export interface ComponentStyle {
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  opacity?: number;
  shadow?: boolean;
  theme?: 'light' | 'dark' | 'auto';
}

export interface ConnectionStyle {
  color?: string;
  width?: number;
  style?: 'solid' | 'dashed' | 'dotted';
  arrowType?: 'none' | 'arrow' | 'diamond' | 'circle';
}

// Component library configuration
export interface ComponentLibraryConfig {
  // Display options
  groupBy: 'category' | 'provider' | 'tags';
  sortBy: 'name' | 'category' | 'provider' | 'popularity';
  showFavorites: boolean;
  
  // Search options
  searchFields: Array<'name' | 'description' | 'tags' | 'provider'>;
  fuzzySearch: boolean;
  
  // Filter options
  enabledCategories: ComponentCategory[];
  enabledProviders: string[];
  showDeprecated: boolean;
  
  // Custom properties
  customFilters: Record<string, any>;
}

// Error types for component system
export enum ComponentErrorType {
  VALIDATION_ERROR = 'validation-error',
  CONFIGURATION_ERROR = 'configuration-error',
  DEPENDENCY_ERROR = 'dependency-error',
  PROVIDER_ERROR = 'provider-error',
  REGISTRY_ERROR = 'registry-error'
}

export interface ComponentError {
  type: ComponentErrorType;
  message: string;
  componentId?: string;
  instanceId?: string;
  details?: Record<string, any>;
  timestamp: string;
}

// Events for component system
export enum ComponentEventType {
  COMPONENT_REGISTERED = 'component-registered',
  COMPONENT_UPDATED = 'component-updated',
  COMPONENT_DEPRECATED = 'component-deprecated',
  INSTANCE_CREATED = 'instance-created',
  INSTANCE_UPDATED = 'instance-updated',
  INSTANCE_DELETED = 'instance-deleted',
  CONNECTION_CREATED = 'connection-created',
  CONNECTION_UPDATED = 'connection-updated',
  CONNECTION_DELETED = 'connection-deleted',
  VALIDATION_CHANGED = 'validation-changed'
}

export interface ComponentEvent {
  type: ComponentEventType;
  timestamp: string;
  data: Record<string, any>;
  source: string;
}