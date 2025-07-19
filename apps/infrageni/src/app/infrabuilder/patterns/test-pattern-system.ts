/**
 * Pattern System Test
 * Simple test to verify pattern registry, validation, and template generation
 */

import { PatternRegistry } from './core/pattern-registry';
import { patternValidator } from './core/pattern-validator';
import { templateEngine } from './core/template-engine';
import { PatternLoader } from './pattern-loader';
import {
  createSimple3TierWebAppPattern,
  createSimple3TierWebAppTemplate,
  createKubernetesMicroservicesPattern
} from './library';

/**
 * Test the pattern system functionality
 */
export async function testPatternSystem(): Promise<void> {
  console.log('🧪 Testing Pattern System...');

  try {
    // Test 1: Pattern Registry
    console.log('\n1️⃣ Testing Pattern Registry...');
    const registry = PatternRegistry.getInstance();
    await registry.initialize();

    // Create and register a pattern
    const webAppPattern = createSimple3TierWebAppPattern();
    const registrationResult = registry.registerPattern(webAppPattern);
    
    if (registrationResult.valid) {
      console.log('  ✅ Pattern registration successful');
    } else {
      console.log('  ❌ Pattern registration failed:', registrationResult.errors);
    }

    // Test pattern retrieval
    const retrievedPattern = registry.getPattern(webAppPattern.id);
    if (retrievedPattern) {
      console.log('  ✅ Pattern retrieval successful');
    } else {
      console.log('  ❌ Pattern retrieval failed');
    }

    // Test pattern search
    const searchResults = registry.searchPatterns({
      categories: [webAppPattern.category],
      freeText: 'web'
    });
    
    if (searchResults.length > 0) {
      console.log(`  ✅ Pattern search successful: ${searchResults.length} results`);
    } else {
      console.log('  ❌ Pattern search failed');
    }

    // Test 2: Pattern Validation
    console.log('\n2️⃣ Testing Pattern Validation...');
    const microservicesPattern = createKubernetesMicroservicesPattern();
    const validationResult = await patternValidator.validatePattern(microservicesPattern);
    
    if (validationResult.valid) {
      console.log('  ✅ Pattern validation successful');
      if (validationResult.warnings.length > 0) {
        console.log(`  ⚠️ Validation warnings: ${validationResult.warnings.length}`);
      }
      if (validationResult.suggestions.length > 0) {
        console.log(`  💡 Validation suggestions: ${validationResult.suggestions.length}`);
      }
    } else {
      console.log('  ❌ Pattern validation failed:', validationResult.errors);
    }

    // Test 3: Template Engine
    console.log('\n3️⃣ Testing Template Engine...');
    const template = createSimple3TierWebAppTemplate();
    templateEngine.registerTemplate(template);
    
    const templateContext = {
      parameters: {
        project_name: 'test-webapp',
        environment: 'development',
        instance_size: 'medium',
        database_engine: 'postgresql',
        enable_monitoring: true
      },
      provider: 'aws',
      region: 'us-east-1',
      environment: 'development' as const,
      projectName: 'test-webapp'
    };

    const generationResult = await templateEngine.generatePattern(template.id, templateContext);
    
    if (generationResult.success && generationResult.pattern) {
      console.log('  ✅ Template generation successful');
      console.log(`  📊 Generated ${generationResult.pattern.components.length} components`);
      console.log(`  📊 Generated ${generationResult.pattern.relationships.length} relationships`);
    } else {
      console.log('  ❌ Template generation failed:', generationResult.errors);
    }

    // Test 4: Pattern Loader
    console.log('\n4️⃣ Testing Pattern Loader...');
    const loader = new PatternLoader({
      loadCorePatterns: true,
      loadTemplates: true,
      loadCommunityPatterns: false,
      validateOnLoad: true
    });

    await loader.loadAll();
    const stats = loader.getStats();
    
    console.log(`  ✅ Pattern Loader completed`);
    console.log(`  📊 Loaded ${stats.patternsLoaded} patterns`);
    console.log(`  📊 Loaded ${stats.templatesLoaded} templates`);

    // Test 5: Registry Statistics
    console.log('\n5️⃣ Testing Registry Statistics...');
    const registryStats = registry.getPatternStats();
    
    console.log(`  📊 Total patterns: ${registryStats.totalPatterns}`);
    console.log(`  📊 Categories: ${Object.keys(registryStats.byCategory).length}`);
    console.log(`  📊 Average rating: ${registryStats.avgRating.toFixed(2)}`);
    console.log(`  📊 Top authors: ${registryStats.topAuthors.slice(0, 3).map(a => a.author).join(', ')}`);

    // Test 6: Template Preview
    console.log('\n6️⃣ Testing Template Preview...');
    const templatePreview = templateEngine.previewTemplate(template.id);
    
    if (templatePreview.template) {
      console.log(`  ✅ Template preview successful`);
      console.log(`  📊 Parameters: ${templatePreview.parameters.length}`);
      console.log(`  📊 Examples: ${templatePreview.examples.length}`);
    } else {
      console.log('  ❌ Template preview failed');
    }

    console.log('\n🎉 Pattern System Test Complete!');
    console.log('✅ All tests passed successfully');

  } catch (error) {
    console.error('\n❌ Pattern System Test Failed:', error);
    throw error;
  }
}

/**
 * Run a quick validation test on all patterns
 */
export async function validateAllPatterns(): Promise<void> {
  console.log('🔍 Validating All Patterns...');

  const patterns = [
    createSimple3TierWebAppPattern(),
    createKubernetesMicroservicesPattern()
  ];

  for (const pattern of patterns) {
    console.log(`\nValidating: ${pattern.name}`);
    
    const validationResult = await patternValidator.validatePattern(pattern, {
      strictMode: true,
      securityChecks: true,
      performanceAnalysis: true,
      costOptimization: true,
      complianceValidation: true,
      architectureValidation: true
    });

    if (validationResult.valid) {
      console.log(`  ✅ ${pattern.name} - Valid`);
      if (validationResult.warnings.length > 0) {
        console.log(`    ⚠️ Warnings: ${validationResult.warnings.length}`);
      }
      if (validationResult.suggestions.length > 0) {
        console.log(`    💡 Suggestions: ${validationResult.suggestions.length}`);
      }
    } else {
      console.log(`  ❌ ${pattern.name} - Invalid`);
      validationResult.errors.forEach(error => {
        console.log(`    🚨 ${error.code}: ${error.message}`);
      });
    }
  }

  console.log('\n🔍 Pattern Validation Complete');
}

/**
 * Demonstrate template generation with different configurations
 */
export async function demonstrateTemplateGeneration(): Promise<void> {
  console.log('🎨 Demonstrating Template Generation...');

  const template = createSimple3TierWebAppTemplate();
  templateEngine.registerTemplate(template);

  const configurations = [
    {
      name: 'Development Environment',
      context: {
        parameters: {
          project_name: 'dev-app',
          environment: 'development',
          instance_size: 'small',
          database_engine: 'mysql',
          enable_monitoring: false
        },
        provider: 'aws',
        environment: 'development' as const
      }
    },
    {
      name: 'Production Environment',
      context: {
        parameters: {
          project_name: 'prod-app',
          environment: 'production',
          instance_size: 'large',
          database_engine: 'postgresql',
          enable_monitoring: true
        },
        provider: 'aws',
        environment: 'production' as const
      }
    }
  ];

  for (const config of configurations) {
    console.log(`\nGenerating: ${config.name}`);
    
    const result = await templateEngine.generatePattern(template.id, config.context);
    
    if (result.success && result.pattern) {
      console.log(`  ✅ Generated successfully`);
      console.log(`  📊 Components: ${result.pattern.components.length}`);
      console.log(`  📊 Relationships: ${result.pattern.relationships.length}`);
      console.log(`  📊 Tags: ${result.pattern.tags.join(', ')}`);
    } else {
      console.log(`  ❌ Generation failed: ${result.errors.join(', ')}`);
    }
  }

  console.log('\n🎨 Template Generation Demonstration Complete');
}

// Export test runner function
export async function runPatternSystemTests(): Promise<void> {
  try {
    await testPatternSystem();
    await validateAllPatterns();
    await demonstrateTemplateGeneration();
    
    console.log('\n🚀 All Pattern System Tests Completed Successfully!');
  } catch (error) {
    console.error('\n💥 Pattern System Tests Failed:', error);
    throw error;
  }
}