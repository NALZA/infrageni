# Infrastructure Component Library

A comprehensive, scalable component library for infrastructure architecture diagrams with support for multiple cloud providers.

## 🏗️ Architecture Overview

The refactored component library follows a modular, extensible architecture:

```
components/
├── core/                      # Core system files
│   ├── component-types.ts     # TypeScript interfaces and types
│   ├── component-registry.ts  # Central component registry
│   └── core-components.ts     # Generic/provider-agnostic components
├── providers/                 # Provider-specific components
│   ├── aws-components.ts      # AWS-specific components
│   ├── azure-components.ts    # Azure-specific components
│   └── gcp-components.ts      # GCP-specific components
├── test-registry.ts           # Test utilities
└── README.md                  # This file
```

## 🚀 Key Features

### 1. **Provider-Agnostic Design**
- Generic components that map to specific provider services
- Unified interface across all cloud providers
- Easy switching between providers

### 2. **Comprehensive Type Safety**
- Full TypeScript support with detailed interfaces
- Compile-time validation of component configurations
- IntelliSense support for component properties

### 3. **Scalable Architecture**
- Plugin-based provider system
- Centralized component registry
- Hierarchical categorization system

### 4. **Rich Component Metadata**
- Detailed provider mappings with icons and URLs
- Validation rules and custom properties
- Connection points and relationship definitions

### 5. **Extensible Configuration**
- Custom properties per component
- Validation rules with severity levels
- Connection and containment rules

## 📊 Component Coverage

### Core Components (8 components)
- **Network**: VPC, Subnet, Availability Zone
- **Compute**: Virtual Machine/Instance  
- **Database**: Relational Database
- **Storage**: Object Storage
- **External**: External Systems, Users

### AWS Components (11 components)
- **Serverless**: Lambda
- **Compute**: Elastic Beanstalk, ECS, ECR
- **Database**: DynamoDB, ElastiCache
- **Network**: Application Load Balancer, CloudFront, API Gateway
- **Storage**: EBS, EFS

### Azure Components (10 components)
- **Serverless**: Azure Functions
- **Compute**: App Service, Container Instances
- **Database**: Cosmos DB, Cache for Redis
- **Network**: Application Gateway, CDN
- **Storage**: Storage Account
- **Security**: Key Vault
- **Monitoring**: Azure Monitor

### GCP Components (12 components)
- **Serverless**: Cloud Functions
- **Compute**: App Engine, Cloud Run
- **Database**: Cloud Firestore, Cloud Spanner, Memorystore
- **Network**: Cloud Load Balancing, Cloud CDN
- **Storage**: Cloud Storage
- **Messaging**: Cloud Pub/Sub
- **Security**: Secret Manager

## 🔧 Usage

### Initialize the Registry
```typescript
import { ComponentRegistry } from './core/component-registry';

const registry = ComponentRegistry.getInstance();
await registry.initialize();
```

### Get Components by Category
```typescript
import { ComponentCategory } from './core/component-types';

const networkComponents = registry.getComponentsByCategory(ComponentCategory.NETWORK);
const computeComponents = registry.getComponentsByCategory(ComponentCategory.COMPUTE);
```

### Get Components by Provider
```typescript
const awsComponents = registry.getComponentsByProvider('aws');
const azureComponents = registry.getComponentsByProvider('azure');
const gcpComponents = registry.getComponentsByProvider('gcp');
```

### Search Components
```typescript
const databaseComponents = registry.searchComponents('database');
const serverlessComponents = registry.searchComponents('serverless');
```

### Get Specific Component
```typescript
const vpcComponent = registry.getComponent('generic-vpc');
const lambdaComponent = registry.getComponent('aws-lambda');
```

### Get Provider Mapping
```typescript
const awsVpcMapping = registry.getProviderMapping('generic-vpc', 'aws');
// Returns: { name: 'VPC', iconPath: '/assets/...', ... }
```

## 🎯 Component Categories

Components are organized into hierarchical categories:

### Primary Categories
- **NETWORK**: Networking infrastructure
- **COMPUTE**: Computing resources
- **STORAGE**: Data storage services
- **DATABASE**: Database services
- **SERVERLESS**: Serverless computing
- **CONTAINERS**: Container services
- **MESSAGING**: Message queues and event streaming
- **INTEGRATION**: Integration services
- **API_GATEWAY**: API management
- **ANALYTICS**: Analytics and data processing
- **AI_ML**: Machine learning services
- **SECURITY**: Security services
- **IDENTITY**: Identity and access management
- **MONITORING**: Monitoring and observability
- **DEVOPS**: DevOps tools
- **IOT**: Internet of Things
- **EDGE**: Edge computing
- **EXTERNAL**: External systems

### Subcategories
- **LOAD_BALANCER**: Load balancing services
- **CDN**: Content delivery networks
- **VIRTUAL_MACHINE**: Virtual machines
- **OBJECT_STORAGE**: Object storage
- **RELATIONAL**: Relational databases
- **NOSQL**: NoSQL databases
- **CACHE**: Caching services
- And many more...

## 🔍 Component Properties

Each component includes comprehensive metadata:

```typescript
interface ComponentMetadata {
  id: string;                    // Unique identifier
  name: string;                  // Display name
  description: string;           // Component description
  category: ComponentCategory;   // Primary category
  subcategory?: ComponentSubcategory; // Optional subcategory
  providerMappings: Record<string, ProviderMapping>; // Provider-specific info
  config: ComponentConfig;       // Configuration options
  version: string;               // Component version
  tags: string[];               // Search tags
  // ... additional metadata
}
```

## 🛠️ Validation System

Components include built-in validation:

```typescript
interface ValidationRule {
  id: string;                    // Rule identifier
  name: string;                  // Human-readable name
  type: 'required' | 'conditional' | 'warning' | 'error';
  condition: string;             // JSONPath condition
  message: string;               // Error message
  severity: 'info' | 'warning' | 'error';
}
```

## 🔗 Connection System

Components define connection points and allowed relationships:

```typescript
interface ConnectionPoint {
  id: string;                    // Connection identifier
  name: string;                  // Display name
  type: 'input' | 'output' | 'bidirectional';
  position: { x: number; y: number }; // Relative position
  protocol?: string;             // Communication protocol
}
```

## 📦 Provider Mappings

Each component maps to specific provider services:

```typescript
interface ProviderMapping {
  name: string;                  // Provider-specific name
  description: string;           // Provider-specific description
  iconPath: string;              // Icon asset path
  iconType: 'svg' | 'png' | 'jpg';
  serviceUrl?: string;           // Service homepage
  documentationUrl?: string;     // Documentation URL
  tags: string[];               // Provider-specific tags
  metadata: Record<string, any>; // Provider-specific metadata
}
```

## 🧪 Testing

Run the test suite to verify the registry:

```typescript
import { testComponentRegistry } from './test-registry';

await testComponentRegistry();
```

## 🎨 Integration with UI

The component library integrates with the existing component library UI:

1. **Component Registry**: Centralized component management
2. **Search**: Full-text search across all components
3. **Categorization**: Hierarchical organization
4. **Favorites**: User preference management
5. **Provider Switching**: Dynamic provider-specific views

## 📈 Statistics

Current component library includes:
- **41 total components** across all providers
- **8 core/generic components**
- **11 AWS-specific components**
- **10 Azure-specific components**
- **12 GCP-specific components**
- **20+ categories** with subcategories
- **Full TypeScript support** with comprehensive interfaces

## 🔄 Future Enhancements

### Planned Features
1. **Additional Providers**: Oracle Cloud, IBM Cloud, Alibaba Cloud
2. **Component Validation Framework**: Runtime validation system
3. **Visual Component Editor**: GUI for creating/editing components
4. **Component Marketplace**: Community-contributed components
5. **Auto-Discovery**: Automatic component discovery from provider APIs
6. **Component Versioning**: Version management and migration
7. **Template System**: Pre-built architecture templates

### Integration Tasks
1. **tldraw Integration**: Connect with existing shape system
2. **UI Updates**: Modernize component library interface
3. **Performance Optimization**: Lazy loading and caching
4. **Export/Import**: Component definition exchange
5. **Documentation**: Interactive component documentation

## 🤝 Contributing

To add new components:

1. Define the component in the appropriate provider file
2. Follow the `ComponentMetadata` interface
3. Include comprehensive provider mappings
4. Add validation rules and custom properties
5. Test with the registry system
6. Update documentation

## 📄 License

This component library is part of the Infrageni infrastructure design platform.