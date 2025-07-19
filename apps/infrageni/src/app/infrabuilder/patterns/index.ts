/**
 * Infrastructure Pattern Library - Main Export
 * Complete infrastructure pattern system for the InfraBuilder
 */

// Core pattern system
export * from './core/pattern-types';
export * from './core/pattern-registry';
export * from './core/pattern-validator';
export * from './core/template-engine';
export * from './core/pattern-import-export';

// Library providers
export * from './library/aws-patterns';
export * from './library/azure-patterns';
export * from './library/gcp-patterns';
export * from './library/multi-cloud-patterns';
export * from './library/common-patterns';

// UI components
export * from './ui/PatternBrowser';
export * from './ui/PatternCard';
export * from './ui/PatternPreview';
export * from './ui/PatternManager';
export * from './ui/PatternRatingSystem';

// Integration
export * from './integration/workspace-integration';

// Legacy exports for backward compatibility
export * from './core';
export * from './library';
export * from './pattern-loader';

// Default exports for easy access
export { PatternRegistry } from './core/pattern-registry';
export { patternValidator } from './core/pattern-validator';
export { templateEngine } from './core/template-engine';
export { patternImportExport } from './core/pattern-import-export';
export { workspaceIntegration } from './integration/workspace-integration';

// Library instances
export { awsPatterns } from './library/aws-patterns';
export { azurePatterns } from './library/azure-patterns';
export { gcpPatterns } from './library/gcp-patterns';
export { multiCloudPatterns } from './library/multi-cloud-patterns';
export { commonPatterns } from './library/common-patterns';

/**
 * Initialize the pattern library system
 * Call this function during application startup
 */
export const initializePatternLibrary = async () => {
  const { PatternRegistry } = await import('./core/pattern-registry');
  const { awsPatterns } = await import('./library/aws-patterns');
  const { azurePatterns } = await import('./library/azure-patterns');
  const { gcpPatterns } = await import('./library/gcp-patterns');
  const { multiCloudPatterns } = await import('./library/multi-cloud-patterns');
  const { commonPatterns } = await import('./library/common-patterns');
  
  const registry = PatternRegistry.getInstance();
  
  // Register all pattern libraries
  await awsPatterns.registerPatterns();
  await azurePatterns.registerPatterns();
  await gcpPatterns.registerPatterns();
  await multiCloudPatterns.registerPatterns();
  await commonPatterns.registerPatterns();
  
  console.log(`Pattern library initialized with ${registry.getAllPatterns().length} patterns`);
};

/**
 * Get pattern library statistics
 */
export const getPatternLibraryStats = () => {
  const { PatternRegistry } = require('./core/pattern-registry');
  const registry = PatternRegistry.getInstance();
  const patterns = registry.getAllPatterns();
  
  const stats = {
    total: patterns.length,
    byCategory: {} as Record<string, number>,
    byProvider: {} as Record<string, number>,
    byComplexity: {} as Record<string, number>,
    byStatus: {} as Record<string, number>,
    featured: patterns.filter((p: any) => p.featured).length,
    verified: patterns.filter((p: any) => p.rating >= 4.0).length
  };
  
  patterns.forEach((pattern: any) => {
    // By category
    stats.byCategory[pattern.category] = (stats.byCategory[pattern.category] || 0) + 1;
    
    // By provider
    pattern.providers?.forEach((provider: string) => {
      stats.byProvider[provider] = (stats.byProvider[provider] || 0) + 1;
    });
    
    // By complexity
    stats.byComplexity[pattern.complexity] = (stats.byComplexity[pattern.complexity] || 0) + 1;
    
    // By status
    stats.byStatus[pattern.status] = (stats.byStatus[pattern.status] || 0) + 1;
  });
  
  return stats;
};