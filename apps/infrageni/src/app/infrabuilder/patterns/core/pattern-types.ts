/**
 * Core types for the infrastructure pattern system
 * Enables reusable architecture blueprints and templates
 */

import { ComponentMetadata } from '../../components/core/component-types';

// Pattern complexity levels for user guidance
export enum PatternComplexity {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate', 
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

// Pattern categories for organization and discovery
export enum PatternCategory {
  // Application architectures
  WEB_APPLICATIONS = 'web-applications',
  MICROSERVICES = 'microservices',
  SERVERLESS = 'serverless',
  MOBILE_BACKEND = 'mobile-backend',
  
  // Data & analytics
  DATA_ANALYTICS = 'data-analytics',
  DATA_LAKES = 'data-lakes',
  REAL_TIME_ANALYTICS = 'real-time-analytics',
  ETL_PIPELINES = 'etl-pipelines',
  
  // AI/ML patterns
  ML_AI = 'ml-ai',
  MODEL_SERVING = 'model-serving',
  DATA_SCIENCE = 'data-science',
  
  // Security & compliance
  SECURITY = 'security',
  COMPLIANCE = 'compliance',
  IDENTITY_ACCESS = 'identity-access',
  NETWORK_SECURITY = 'network-security',
  
  // DevOps & operational
  DEVOPS = 'devops',
  CI_CD = 'ci-cd',
  MONITORING = 'monitoring',
  DISASTER_RECOVERY = 'disaster-recovery',
  
  // Infrastructure patterns
  HIGH_AVAILABILITY = 'high-availability',
  AUTO_SCALING = 'auto-scaling',
  LOAD_BALANCING = 'load-balancing',
  CACHING = 'caching',
  
  // Integration patterns
  API_INTEGRATION = 'api-integration',
  MESSAGE_QUEUING = 'message-queuing',
  EVENT_DRIVEN = 'event-driven',
  
  // Industry specific
  FINTECH = 'fintech',
  HEALTHCARE = 'healthcare',
  ECOMMERCE = 'ecommerce',
  GAMING = 'gaming'
}

// Pattern status for lifecycle management
export enum PatternStatus {
  DRAFT = 'draft',
  REVIEW = 'review',
  PUBLISHED = 'published',
  DEPRECATED = 'deprecated'
}

// Component reference within a pattern
export interface ComponentReference {
  componentId: string;
  instanceId: string;
  displayName: string;
  position: { x: number; y: number };
  configuration: Record<string, any>;
  required: boolean;
  dependencies: string[]; // Other instance IDs this depends on
  metadata: {
    description?: string;
    notes?: string;
    alternatives?: string[];
  };
}

// Relationship between components in a pattern
export interface ComponentRelationship {
  id: string;
  fromInstanceId: string;
  toInstanceId: string;
  relationshipType: RelationshipType;
  configuration: RelationshipConfig;
  metadata: {
    description?: string;
    protocols?: string[];
    security?: SecurityConfig;
  };
}

export enum RelationshipType {
  NETWORK_CONNECTION = 'network-connection',
  DATA_FLOW = 'data-flow',
  DEPENDENCY = 'dependency',
  CONTAINMENT = 'containment',
  LOAD_BALANCE = 'load-balance',
  REPLICATION = 'replication',
  BACKUP = 'backup'
}

export interface RelationshipConfig {
  bidirectional: boolean;
  protocols: string[];
  ports?: number[];
  security?: SecurityConfig;
  performance?: PerformanceConfig;
}

export interface SecurityConfig {
  encryption: boolean;
  authentication: string[];
  authorization: string[];
  compliance: string[];
}

export interface PerformanceConfig {
  latency?: string;
  throughput?: string;
  bandwidth?: string;
  availability?: string;
}

// Pattern parameter definition for customization
export interface PatternParameter {
  id: string;
  name: string;
  description: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'multiselect';
  required: boolean;
  defaultValue?: any;
  validation?: ParameterValidation;
  options?: ParameterOption[];
  affects: string[]; // Component instance IDs affected by this parameter
}

export interface ParameterValidation {
  min?: number;
  max?: number;
  pattern?: string;
  customValidator?: string;
}

export interface ParameterOption {
  value: any;
  label: string;
  description?: string;
}

// Cost estimation model
export interface CostModel {
  estimationType: 'monthly' | 'hourly' | 'per-request' | 'custom';
  components: CostComponent[];
  variables: CostVariable[];
  calculations: CostCalculation[];
  assumptions: string[];
}

export interface CostComponent {
  componentInstanceId: string;
  provider: string;
  service: string;
  estimatedCost: CostEstimate;
}

export interface CostEstimate {
  baseAmount: number;
  currency: string;
  unit: string;
  scalingFactors: ScalingFactor[];
}

export interface ScalingFactor {
  parameter: string;
  formula: string;
  description: string;
}

export interface CostVariable {
  id: string;
  name: string;
  description: string;
  defaultValue: number;
  unit: string;
}

export interface CostCalculation {
  id: string;
  formula: string;
  description: string;
  result: string;
}

// Pattern preview and visualization
export interface PatternPreview {
  thumbnail: string; // Base64 or URL
  description: string;
  features: string[];
  benefits: string[];
  useCases: string[];
  screenshots?: string[];
  demo?: DemoConfig;
}

export interface DemoConfig {
  type: 'interactive' | 'video' | 'static';
  url?: string;
  configuration?: Record<string, any>;
}

// Documentation structure
export interface PatternDocumentation {
  overview: string;
  architecture: ArchitectureDoc;
  deployment: DeploymentDoc;
  configuration: ConfigurationDoc;
  security: SecurityDoc;
  monitoring: MonitoringDoc;
  troubleshooting: TroubleshootingDoc;
  references: ReferenceDoc[];
}

export interface ArchitectureDoc {
  description: string;
  diagram?: string;
  components: ComponentDoc[];
  dataFlow: string;
  keyDecisions: DesignDecision[];
}

export interface ComponentDoc {
  instanceId: string;
  purpose: string;
  configuration: string;
  alternatives: string[];
}

export interface DesignDecision {
  decision: string;
  rationale: string;
  alternatives: string[];
  tradeoffs: string[];
}

export interface DeploymentDoc {
  prerequisites: string[];
  steps: DeploymentStep[];
  verification: string[];
  rollback: string[];
}

export interface DeploymentStep {
  title: string;
  description: string;
  commands?: string[];
  expectedOutput?: string;
  troubleshooting?: string[];
}

export interface ConfigurationDoc {
  parameters: ParameterDoc[];
  environments: EnvironmentConfig[];
  secrets: SecretConfig[];
  customization: CustomizationGuide[];
}

export interface ParameterDoc {
  parameterId: string;
  description: string;
  examples: string[];
  bestPractices: string[];
}

export interface EnvironmentConfig {
  name: string;
  description: string;
  parameters: Record<string, any>;
  notes: string[];
}

export interface SecretConfig {
  name: string;
  description: string;
  required: boolean;
  example?: string;
}

export interface CustomizationGuide {
  title: string;
  description: string;
  steps: string[];
  examples: string[];
}

export interface SecurityDoc {
  overview: string;
  threats: ThreatModel[];
  controls: SecurityControl[];
  compliance: ComplianceInfo[];
  bestPractices: string[];
}

export interface ThreatModel {
  threat: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  likelihood: 'low' | 'medium' | 'high';
  mitigation: string[];
}

export interface SecurityControl {
  control: string;
  description: string;
  implementation: string;
  components: string[];
}

export interface ComplianceInfo {
  framework: string;
  requirements: string[];
  evidence: string[];
  gaps: string[];
}

export interface MonitoringDoc {
  overview: string;
  metrics: MetricDoc[];
  alerts: AlertDoc[];
  dashboards: DashboardDoc[];
  logs: LoggingDoc[];
}

export interface MetricDoc {
  name: string;
  description: string;
  source: string;
  threshold: string;
  actions: string[];
}

export interface AlertDoc {
  name: string;
  condition: string;
  severity: 'info' | 'warning' | 'critical';
  response: string[];
}

export interface DashboardDoc {
  name: string;
  description: string;
  metrics: string[];
  url?: string;
}

export interface LoggingDoc {
  source: string;
  format: string;
  retention: string;
  analysis: string[];
}

export interface TroubleshootingDoc {
  commonIssues: TroubleshootingIssue[];
  diagnostics: DiagnosticGuide[];
  support: SupportInfo;
}

export interface TroubleshootingIssue {
  issue: string;
  symptoms: string[];
  causes: string[];
  solutions: string[];
}

export interface DiagnosticGuide {
  scenario: string;
  steps: string[];
  tools: string[];
  expectedResults: string[];
}

export interface SupportInfo {
  contacts: string[];
  resources: string[];
  escalation: string[];
}

export interface ReferenceDoc {
  title: string;
  type: 'documentation' | 'blog' | 'whitepaper' | 'tutorial' | 'video';
  url: string;
  description: string;
  relevance: 'high' | 'medium' | 'low';
}

// Main pattern interface
export interface InfrastructurePattern {
  // Basic metadata
  id: string;
  name: string;
  description: string;
  version: string;
  
  // Classification
  category: PatternCategory;
  subcategory?: string;
  complexity: PatternComplexity;
  status: PatternStatus;
  
  // Pattern structure
  components: ComponentReference[];
  relationships: ComponentRelationship[];
  parameters: PatternParameter[];
  
  // Customization & deployment
  costModel?: CostModel;
  preview: PatternPreview;
  documentation: PatternDocumentation;
  
  // Metadata
  tags: string[];
  author: string;
  organization?: string;
  license: string;
  
  // Lifecycle
  createdAt: string;
  updatedAt: string;
  deprecatedAt?: string;
  replacedBy?: string;
  
  // Usage tracking
  downloadCount?: number;
  rating?: number;
  reviews?: PatternReview[];
  
  // Provider compatibility
  providers: string[];
  requiredFeatures: string[];
  
  // Version history
  changelog: ChangelogEntry[];
  migrations: MigrationGuide[];
}

export interface PatternReview {
  userId: string;
  rating: number;
  comment: string;
  helpful: number;
  createdAt: string;
}

export interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
  breaking: boolean;
}

export interface MigrationGuide {
  fromVersion: string;
  toVersion: string;
  steps: string[];
  automatable: boolean;
}

// Pattern validation result
export interface PatternValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: ValidationSuggestion[];
}

export interface ValidationError {
  code: string;
  message: string;
  component?: string;
  field?: string;
  severity: 'error' | 'warning' | 'info';
}

export interface ValidationWarning {
  code: string;
  message: string;
  component?: string;
  suggestion?: string;
}

export interface ValidationSuggestion {
  type: 'optimization' | 'security' | 'cost' | 'performance';
  message: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
}