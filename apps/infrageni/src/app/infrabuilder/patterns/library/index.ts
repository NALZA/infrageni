/**
 * Pattern Library Index
 * Central export for all infrastructure pattern libraries
 */

// Web Application Patterns
export {
  createSimple3TierWebAppPattern,
  createSimple3TierWebAppTemplate
} from './web-app-patterns';

// Microservices Patterns
export {
  createKubernetesMicroservicesPattern,
  createEventDrivenMicroservicesPattern,
  createMicroservicesTemplate
} from './microservices-patterns';

// Data Analytics and ML Patterns
export {
  createModernDataLakePattern,
  createMLPipelinePattern,
  createDataAnalyticsTemplate
} from './data-analytics-patterns';

// Security and Compliance Patterns
export {
  createZeroTrustPattern,
  createComplianceGovernancePattern,
  createSecurityTemplate
} from './security-patterns';

// Pattern Categories
export const PATTERN_CATEGORIES = {
  WEB_APPLICATIONS: 'Web Applications',
  MICROSERVICES: 'Microservices',
  DATA_ANALYTICS: 'Data Analytics',
  MACHINE_LEARNING: 'Machine Learning',
  SECURITY: 'Security',
  COMPLIANCE: 'Compliance'
} as const;

// Pattern Library Metadata
export const PATTERN_LIBRARY_INFO = {
  version: '1.0.0',
  totalPatterns: 6,
  totalTemplates: 4,
  categories: Object.keys(PATTERN_CATEGORIES).length,
  lastUpdated: '2024-01-01T00:00:00Z'
};