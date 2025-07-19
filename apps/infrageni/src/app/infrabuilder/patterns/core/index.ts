/**
 * Pattern System Core - Export all pattern-related functionality
 */

// Types
export * from './pattern-types';

// Core registry and validation
export { PatternRegistry } from './pattern-registry';
export { PatternValidator, patternValidator } from './pattern-validator';
export { TemplateEngine, templateEngine } from './template-engine';

// Re-export commonly used interfaces
export type {
  InfrastructurePattern,
  PatternCategory,
  PatternComplexity,
  PatternStatus,
  ComponentReference,
  ComponentRelationship,
  PatternValidationResult,
  ValidationError,
  ValidationWarning,
  ValidationSuggestion,
  PatternSearchFilters,
  PatternSearchResult
} from './pattern-types';

export type {
  ValidationConfig,
  ValidationContext,
  ValidationRule
} from './pattern-validator';

export type {
  PatternTemplate,
  TemplateContext,
  TemplateResult,
  ComponentTemplate,
  RelationshipTemplate,
  ParameterReference,
  ConditionalExpression
} from './template-engine';