import { ComponentRegistry } from './core/component-registry';

/**
 * Test script for the component registry
 * This can be run to verify the registry is working correctly
 */

async function testComponentRegistry() {
  console.log('🧪 Testing Component Registry...');
  
  const registry = ComponentRegistry.getInstance();
  
  try {
    // Initialize the registry
    await registry.initialize();
    
    // Get stats
    const stats = registry.getStats();
    console.log('📊 Registry Stats:', stats);
    
    // Test getting components by category
    const networkComponents = registry.getComponentsByCategory('network' as any);
    console.log('🌐 Network Components:', networkComponents.length);
    
    // Test getting components by provider
    const awsComponents = registry.getComponentsByProvider('aws');
    console.log('☁️ AWS Components:', awsComponents.length);
    
    const azureComponents = registry.getComponentsByProvider('azure');
    console.log('🔵 Azure Components:', azureComponents.length);
    
    const gcpComponents = registry.getComponentsByProvider('gcp');
    console.log('🟡 GCP Components:', gcpComponents.length);
    
    // Test search
    const searchResults = registry.searchComponents('database');
    console.log('🔍 Database Search Results:', searchResults.length);
    
    // Test getting specific component
    const vpcComponent = registry.getComponent('generic-vpc');
    console.log('📦 VPC Component:', vpcComponent ? vpcComponent.name : 'Not found');
    
    // Test provider mapping
    const awsVpcMapping = registry.getProviderMapping('generic-vpc', 'aws');
    console.log('🗺️ AWS VPC Mapping:', awsVpcMapping ? awsVpcMapping.name : 'Not found');
    
    console.log('✅ Component Registry Test Completed Successfully!');
    
  } catch (error) {
    console.error('❌ Component Registry Test Failed:', error);
  }
}

// Export for use in other files
export { testComponentRegistry };

// Uncomment to run the test
// testComponentRegistry();