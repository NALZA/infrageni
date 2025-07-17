import { ComponentMetadata, ComponentCategory, ComponentSubcategory } from '../core/component-types';

/**
 * Azure-specific infrastructure components
 * These components are specific to Microsoft Azure cloud services
 */

export async function getAzureComponents(): Promise<ComponentMetadata[]> {
  return [
    // Azure Compute Services
    {
      id: 'azure-functions',
      name: 'Azure Functions',
      description: 'Serverless compute service for running event-driven applications',
      category: ComponentCategory.SERVERLESS,
      providerMappings: {
        azure: {
          name: 'Azure Functions',
          description: 'Event-driven serverless compute platform',
          iconPath: '/assets/provider-icons/azure/compute/10029-icon-service-Function-Apps.svg',
          iconType: 'svg',
          serviceUrl: 'https://azure.microsoft.com/en-us/services/functions/',
          documentationUrl: 'https://docs.microsoft.com/en-us/azure/azure-functions/',
          tags: ['serverless', 'compute', 'functions', 'event-driven'],
          metadata: {
            runtimes: ['dotnet', 'node', 'python', 'java', 'powershell'],
            triggers: ['http', 'timer', 'blob', 'queue', 'eventhub'],
            supportedLanguages: ['C#', 'JavaScript', 'TypeScript', 'Python', 'Java', 'PowerShell']
          }
        },
        generic: {
          name: 'Serverless Function',
          description: 'Generic serverless function',
          iconPath: '/assets/provider-icons/generic/serverless-function.svg',
          iconType: 'svg',
          tags: ['serverless', 'function'],
          metadata: {}
        }
      },
      config: {
        defaultSize: { width: 120, height: 80 },
        minSize: { width: 80, height: 60 },
        maxSize: { width: 200, height: 120 },
        isContainer: false,
        canContainTypes: [],
        canBeContainedBy: [ComponentCategory.NETWORK, ComponentCategory.SERVERLESS],
        connectionPoints: [
          { id: 'trigger', name: 'Trigger', type: 'input', position: { x: 0, y: 0.5 } },
          { id: 'output', name: 'Output', type: 'output', position: { x: 1, y: 0.5 } }
        ],
        allowedConnections: [ComponentCategory.STORAGE, ComponentCategory.DATABASE, ComponentCategory.MESSAGING],
        validationRules: [
          { id: 'runtime-required', name: 'Runtime Required', type: 'required', condition: '$.runtime', message: 'Runtime is required', severity: 'error' }
        ],
        customProperties: [
          { id: 'runtime', name: 'Runtime', type: 'select', defaultValue: 'dotnet', required: true, description: 'Function runtime', options: [
            { value: 'dotnet', label: '.NET' },
            { value: 'node', label: 'Node.js' },
            { value: 'python', label: 'Python' },
            { value: 'java', label: 'Java' },
            { value: 'powershell', label: 'PowerShell' }
          ]},
          { id: 'hostingPlan', name: 'Hosting Plan', type: 'select', defaultValue: 'consumption', required: false, description: 'Hosting plan type', options: [
            { value: 'consumption', label: 'Consumption' },
            { value: 'premium', label: 'Premium' },
            { value: 'dedicated', label: 'Dedicated (App Service)' }
          ]},
          { id: 'timeout', name: 'Timeout (seconds)', type: 'number', defaultValue: 300, required: false, description: 'Function timeout in seconds' }
        ]
      },
      version: '1.0.0',
      tags: ['azure', 'serverless', 'compute', 'functions'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },

    {
      id: 'azure-app-service',
      name: 'Azure App Service',
      description: 'Platform-as-a-Service for building and hosting web applications',
      category: ComponentCategory.COMPUTE,
      providerMappings: {
        azure: {
          name: 'App Service',
          description: 'Fully managed platform for building web and mobile apps',
          iconPath: '/assets/provider-icons/azure/compute/10035-icon-service-App-Services.svg',
          iconType: 'svg',
          serviceUrl: 'https://azure.microsoft.com/en-us/services/app-service/',
          documentationUrl: 'https://docs.microsoft.com/en-us/azure/app-service/',
          tags: ['paas', 'web', 'mobile', 'hosting'],
          metadata: {
            appTypes: ['web', 'api', 'mobile'],
            runtimes: ['dotnet', 'node', 'python', 'java', 'php', 'ruby'],
            operatingSystems: ['windows', 'linux']
          }
        },
        generic: {
          name: 'Web Application',
          description: 'Generic web application platform',
          iconPath: '/assets/provider-icons/generic/web-app.svg',
          iconType: 'svg',
          tags: ['web', 'application'],
          metadata: {}
        }
      },
      config: {
        defaultSize: { width: 140, height: 90 },
        minSize: { width: 100, height: 70 },
        maxSize: { width: 220, height: 140 },
        isContainer: false,
        canContainTypes: [],
        canBeContainedBy: [ComponentCategory.NETWORK],
        connectionPoints: [
          { id: 'http', name: 'HTTP', type: 'input', position: { x: 0.5, y: 0 } },
          { id: 'database', name: 'Database', type: 'output', position: { x: 0.5, y: 1 } }
        ],
        allowedConnections: [ComponentCategory.DATABASE, ComponentCategory.STORAGE, ComponentCategory.IDENTITY],
        validationRules: [
          { id: 'app-name-required', name: 'App Name Required', type: 'required', condition: '$.appName', message: 'App name is required', severity: 'error' }
        ],
        customProperties: [
          { id: 'appName', name: 'App Name', type: 'string', defaultValue: 'my-app', required: true, description: 'Application name' },
          { id: 'runtime', name: 'Runtime Stack', type: 'select', defaultValue: 'dotnet', required: true, description: 'Runtime stack', options: [
            { value: 'dotnet', label: '.NET' },
            { value: 'node', label: 'Node.js' },
            { value: 'python', label: 'Python' },
            { value: 'java', label: 'Java' },
            { value: 'php', label: 'PHP' },
            { value: 'ruby', label: 'Ruby' }
          ]},
          { id: 'pricingTier', name: 'Pricing Tier', type: 'select', defaultValue: 'B1', required: false, description: 'App Service plan tier', options: [
            { value: 'F1', label: 'Free' },
            { value: 'B1', label: 'Basic B1' },
            { value: 'S1', label: 'Standard S1' },
            { value: 'P1', label: 'Premium P1' }
          ]}
        ]
      },
      version: '1.0.0',
      tags: ['azure', 'paas', 'web', 'application'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },

    {
      id: 'azure-container-instances',
      name: 'Azure Container Instances',
      description: 'Run containers without managing servers',
      category: ComponentCategory.CONTAINERS,
      subcategory: ComponentSubcategory.RUNTIME,
      providerMappings: {
        azure: {
          name: 'Container Instances',
          description: 'Serverless containers on Azure',
          iconPath: '/assets/provider-icons/azure/compute/10106-icon-service-Container-Instances.svg',
          iconType: 'svg',
          serviceUrl: 'https://azure.microsoft.com/en-us/services/container-instances/',
          documentationUrl: 'https://docs.microsoft.com/en-us/azure/container-instances/',
          tags: ['containers', 'serverless', 'compute'],
          metadata: {
            supportedImages: ['linux', 'windows'],
            networking: ['public', 'private', 'none']
          }
        },
        generic: {
          name: 'Container Instance',
          description: 'Generic container instance',
          iconPath: '/assets/provider-icons/generic/container.svg',
          iconType: 'svg',
          tags: ['container', 'instance'],
          metadata: {}
        }
      },
      config: {
        defaultSize: { width: 120, height: 80 },
        minSize: { width: 80, height: 60 },
        maxSize: { width: 200, height: 120 },
        isContainer: false,
        canContainTypes: [],
        canBeContainedBy: [ComponentCategory.NETWORK, ComponentCategory.CONTAINERS],
        connectionPoints: [
          { id: 'network', name: 'Network', type: 'bidirectional', position: { x: 0.5, y: 0 } },
          { id: 'storage', name: 'Storage', type: 'output', position: { x: 1, y: 0.5 } }
        ],
        allowedConnections: [ComponentCategory.STORAGE, ComponentCategory.DATABASE, ComponentCategory.NETWORK],
        validationRules: [
          { id: 'image-required', name: 'Container Image Required', type: 'required', condition: '$.image', message: 'Container image is required', severity: 'error' }
        ],
        customProperties: [
          { id: 'image', name: 'Container Image', type: 'string', defaultValue: 'nginx:latest', required: true, description: 'Container image name' },
          { id: 'cpu', name: 'CPU Cores', type: 'number', defaultValue: 1, required: false, description: 'Number of CPU cores' },
          { id: 'memory', name: 'Memory (GB)', type: 'number', defaultValue: 1, required: false, description: 'Memory in GB' },
          { id: 'restartPolicy', name: 'Restart Policy', type: 'select', defaultValue: 'Always', required: false, description: 'Container restart policy', options: [
            { value: 'Always', label: 'Always' },
            { value: 'Never', label: 'Never' },
            { value: 'OnFailure', label: 'On Failure' }
          ]}
        ]
      },
      version: '1.0.0',
      tags: ['azure', 'containers', 'serverless'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },

    // Azure Database Services
    {
      id: 'azure-cosmos-db',
      name: 'Azure Cosmos DB',
      description: 'Globally distributed, multi-model database service',
      category: ComponentCategory.DATABASE,
      subcategory: ComponentSubcategory.NOSQL,
      providerMappings: {
        azure: {
          name: 'Cosmos DB',
          description: 'Multi-model database with global distribution',
          iconPath: '/assets/provider-icons/azure/databases/10121-icon-service-Azure-Cosmos-DB.svg',
          iconType: 'svg',
          serviceUrl: 'https://azure.microsoft.com/en-us/services/cosmos-db/',
          documentationUrl: 'https://docs.microsoft.com/en-us/azure/cosmos-db/',
          tags: ['nosql', 'database', 'distributed', 'multi-model'],
          metadata: {
            apis: ['sql', 'mongodb', 'cassandra', 'gremlin', 'table'],
            consistencyLevels: ['strong', 'bounded-staleness', 'session', 'consistent-prefix', 'eventual']
          }
        },
        generic: {
          name: 'NoSQL Database',
          description: 'Generic NoSQL database',
          iconPath: '/assets/provider-icons/generic/nosql-database.svg',
          iconType: 'svg',
          tags: ['nosql', 'database'],
          metadata: {}
        }
      },
      config: {
        defaultSize: { width: 140, height: 90 },
        minSize: { width: 100, height: 70 },
        maxSize: { width: 220, height: 140 },
        isContainer: false,
        canContainTypes: [],
        canBeContainedBy: [ComponentCategory.NETWORK],
        connectionPoints: [
          { id: 'app', name: 'Application', type: 'input', position: { x: 0.5, y: 0 } },
          { id: 'replica', name: 'Replica', type: 'output', position: { x: 1, y: 0.5 } }
        ],
        allowedConnections: [ComponentCategory.COMPUTE, ComponentCategory.SERVERLESS, ComponentCategory.CONTAINERS],
        validationRules: [
          { id: 'api-required', name: 'API Required', type: 'required', condition: '$.api', message: 'API type is required', severity: 'error' }
        ],
        customProperties: [
          { id: 'api', name: 'API', type: 'select', defaultValue: 'sql', required: true, description: 'Database API', options: [
            { value: 'sql', label: 'SQL (Core)' },
            { value: 'mongodb', label: 'MongoDB' },
            { value: 'cassandra', label: 'Cassandra' },
            { value: 'gremlin', label: 'Gremlin (Graph)' },
            { value: 'table', label: 'Table' }
          ]},
          { id: 'consistencyLevel', name: 'Consistency Level', type: 'select', defaultValue: 'session', required: false, description: 'Consistency level', options: [
            { value: 'strong', label: 'Strong' },
            { value: 'bounded-staleness', label: 'Bounded Staleness' },
            { value: 'session', label: 'Session' },
            { value: 'consistent-prefix', label: 'Consistent Prefix' },
            { value: 'eventual', label: 'Eventual' }
          ]},
          { id: 'throughput', name: 'Throughput (RU/s)', type: 'number', defaultValue: 400, required: false, description: 'Request units per second' }
        ]
      },
      version: '1.0.0',
      tags: ['azure', 'database', 'nosql', 'distributed'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },

    {
      id: 'azure-cache-redis',
      name: 'Azure Cache for Redis',
      description: 'Fully managed in-memory cache service',
      category: ComponentCategory.DATABASE,
      subcategory: ComponentSubcategory.CACHE,
      providerMappings: {
        azure: {
          name: 'Cache for Redis',
          description: 'In-memory data structure store',
          iconPath: '/assets/provider-icons/azure/databases/10140-icon-service-Azure-Cache-for-Redis.svg',
          iconType: 'svg',
          serviceUrl: 'https://azure.microsoft.com/en-us/services/cache/',
          documentationUrl: 'https://docs.microsoft.com/en-us/azure/azure-cache-for-redis/',
          tags: ['cache', 'redis', 'in-memory', 'performance'],
          metadata: {
            tiers: ['basic', 'standard', 'premium'],
            redisVersion: '6.0'
          }
        },
        generic: {
          name: 'Cache',
          description: 'Generic cache service',
          iconPath: '/assets/provider-icons/generic/cache.svg',
          iconType: 'svg',
          tags: ['cache', 'memory'],
          metadata: {}
        }
      },
      config: {
        defaultSize: { width: 120, height: 80 },
        minSize: { width: 80, height: 60 },
        maxSize: { width: 200, height: 120 },
        isContainer: false,
        canContainTypes: [],
        canBeContainedBy: [ComponentCategory.NETWORK],
        connectionPoints: [
          { id: 'app', name: 'Application', type: 'input', position: { x: 0.5, y: 0 } }
        ],
        allowedConnections: [ComponentCategory.COMPUTE, ComponentCategory.SERVERLESS, ComponentCategory.CONTAINERS],
        validationRules: [
          { id: 'tier-required', name: 'Tier Required', type: 'required', condition: '$.tier', message: 'Pricing tier is required', severity: 'error' }
        ],
        customProperties: [
          { id: 'tier', name: 'Pricing Tier', type: 'select', defaultValue: 'standard', required: true, description: 'Cache tier', options: [
            { value: 'basic', label: 'Basic' },
            { value: 'standard', label: 'Standard' },
            { value: 'premium', label: 'Premium' }
          ]},
          { id: 'capacity', name: 'Capacity (GB)', type: 'select', defaultValue: '1', required: false, description: 'Cache capacity', options: [
            { value: '0.25', label: '0.25 GB' },
            { value: '1', label: '1 GB' },
            { value: '2.5', label: '2.5 GB' },
            { value: '6', label: '6 GB' },
            { value: '13', label: '13 GB' }
          ]},
          { id: 'enableNonSslPort', name: 'Enable Non-SSL Port', type: 'boolean', defaultValue: false, required: false, description: 'Enable non-SSL port (6379)' }
        ]
      },
      version: '1.0.0',
      tags: ['azure', 'cache', 'redis', 'performance'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },

    // Azure Networking Services
    {
      id: 'azure-application-gateway',
      name: 'Azure Application Gateway',
      description: 'Web traffic load balancer with application-level routing',
      category: ComponentCategory.NETWORK,
      subcategory: ComponentSubcategory.LOAD_BALANCER,
      providerMappings: {
        azure: {
          name: 'Application Gateway',
          description: 'Layer 7 load balancer with WAF capabilities',
          iconPath: '/assets/provider-icons/azure/networking/10062-icon-service-Application-Gateway.svg',
          iconType: 'svg',
          serviceUrl: 'https://azure.microsoft.com/en-us/services/application-gateway/',
          documentationUrl: 'https://docs.microsoft.com/en-us/azure/application-gateway/',
          tags: ['load-balancer', 'layer7', 'waf', 'ssl'],
          metadata: {
            tier: 'Standard_v2',
            wafEnabled: true,
            protocols: ['http', 'https']
          }
        },
        generic: {
          name: 'Application Load Balancer',
          description: 'Generic application load balancer',
          iconPath: '/assets/provider-icons/generic/load-balancer.svg',
          iconType: 'svg',
          tags: ['load-balancer', 'application'],
          metadata: {}
        }
      },
      config: {
        defaultSize: { width: 140, height: 90 },
        minSize: { width: 100, height: 70 },
        maxSize: { width: 220, height: 140 },
        isContainer: false,
        canContainTypes: [],
        canBeContainedBy: [ComponentCategory.NETWORK],
        connectionPoints: [
          { id: 'frontend', name: 'Frontend', type: 'input', position: { x: 0.5, y: 0 } },
          { id: 'backend', name: 'Backend', type: 'output', position: { x: 0.5, y: 1 } }
        ],
        allowedConnections: [ComponentCategory.COMPUTE, ComponentCategory.CONTAINERS],
        validationRules: [
          { id: 'backend-required', name: 'Backend Required', type: 'required', condition: '$.backendPool', message: 'Backend pool is required', severity: 'error' }
        ],
        customProperties: [
          { id: 'tier', name: 'Tier', type: 'select', defaultValue: 'Standard_v2', required: true, description: 'Application Gateway tier', options: [
            { value: 'Standard', label: 'Standard' },
            { value: 'Standard_v2', label: 'Standard v2' },
            { value: 'WAF', label: 'WAF' },
            { value: 'WAF_v2', label: 'WAF v2' }
          ]},
          { id: 'capacity', name: 'Capacity', type: 'number', defaultValue: 2, required: false, description: 'Number of instances' },
          { id: 'wafEnabled', name: 'WAF Enabled', type: 'boolean', defaultValue: false, required: false, description: 'Enable Web Application Firewall' }
        ]
      },
      version: '1.0.0',
      tags: ['azure', 'networking', 'load-balancer', 'waf'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },

    {
      id: 'azure-cdn',
      name: 'Azure CDN',
      description: 'Global content delivery network for fast content delivery',
      category: ComponentCategory.NETWORK,
      subcategory: ComponentSubcategory.CDN,
      providerMappings: {
        azure: {
          name: 'Content Delivery Network',
          description: 'Global CDN for fast content delivery',
          iconPath: '/assets/provider-icons/azure/networking/10064-icon-service-CDN-Profiles.svg',
          iconType: 'svg',
          serviceUrl: 'https://azure.microsoft.com/en-us/services/cdn/',
          documentationUrl: 'https://docs.microsoft.com/en-us/azure/cdn/',
          tags: ['cdn', 'content-delivery', 'performance', 'global'],
          metadata: {
            providers: ['microsoft', 'akamai', 'verizon'],
            protocols: ['http', 'https']
          }
        },
        generic: {
          name: 'CDN',
          description: 'Generic content delivery network',
          iconPath: '/assets/provider-icons/generic/cdn.svg',
          iconType: 'svg',
          tags: ['cdn', 'content-delivery'],
          metadata: {}
        }
      },
      config: {
        defaultSize: { width: 120, height: 80 },
        minSize: { width: 80, height: 60 },
        maxSize: { width: 200, height: 120 },
        isContainer: false,
        canContainTypes: [],
        canBeContainedBy: [ComponentCategory.NETWORK],
        connectionPoints: [
          { id: 'origin', name: 'Origin', type: 'input', position: { x: 0, y: 0.5 } },
          { id: 'users', name: 'Users', type: 'output', position: { x: 1, y: 0.5 } }
        ],
        allowedConnections: [ComponentCategory.STORAGE, ComponentCategory.COMPUTE],
        validationRules: [
          { id: 'origin-required', name: 'Origin Required', type: 'required', condition: '$.origin', message: 'Origin is required', severity: 'error' }
        ],
        customProperties: [
          { id: 'provider', name: 'CDN Provider', type: 'select', defaultValue: 'microsoft', required: true, description: 'CDN provider', options: [
            { value: 'microsoft', label: 'Microsoft' },
            { value: 'akamai', label: 'Akamai' },
            { value: 'verizon', label: 'Verizon' }
          ]},
          { id: 'pricingTier', name: 'Pricing Tier', type: 'select', defaultValue: 'standard', required: false, description: 'Pricing tier', options: [
            { value: 'standard', label: 'Standard' },
            { value: 'premium', label: 'Premium' }
          ]},
          { id: 'httpsOnly', name: 'HTTPS Only', type: 'boolean', defaultValue: false, required: false, description: 'Enforce HTTPS only' }
        ]
      },
      version: '1.0.0',
      tags: ['azure', 'cdn', 'networking', 'performance'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },

    // Azure Storage Services
    {
      id: 'azure-storage-account',
      name: 'Azure Storage Account',
      description: 'Scalable cloud storage for data objects',
      category: ComponentCategory.STORAGE,
      subcategory: ComponentSubcategory.OBJECT_STORAGE,
      providerMappings: {
        azure: {
          name: 'Storage Account',
          description: 'Scalable storage for blobs, files, queues, and tables',
          iconPath: '/assets/provider-icons/azure/storage/10086-icon-service-Storage-Accounts.svg',
          iconType: 'svg',
          serviceUrl: 'https://azure.microsoft.com/en-us/services/storage/',
          documentationUrl: 'https://docs.microsoft.com/en-us/azure/storage/',
          tags: ['storage', 'blob', 'file', 'queue', 'table'],
          metadata: {
            services: ['blob', 'file', 'queue', 'table'],
            tiers: ['hot', 'cool', 'archive']
          }
        },
        generic: {
          name: 'Object Storage',
          description: 'Generic object storage',
          iconPath: '/assets/provider-icons/generic/object-storage.svg',
          iconType: 'svg',
          tags: ['storage', 'object'],
          metadata: {}
        }
      },
      config: {
        defaultSize: { width: 120, height: 80 },
        minSize: { width: 80, height: 60 },
        maxSize: { width: 200, height: 120 },
        isContainer: false,
        canContainTypes: [],
        canBeContainedBy: [ComponentCategory.NETWORK],
        connectionPoints: [
          { id: 'app', name: 'Application', type: 'bidirectional', position: { x: 0.5, y: 0 } },
          { id: 'cdn', name: 'CDN', type: 'output', position: { x: 1, y: 0.5 } }
        ],
        allowedConnections: [ComponentCategory.COMPUTE, ComponentCategory.SERVERLESS, ComponentCategory.NETWORK],
        validationRules: [
          { id: 'account-name-required', name: 'Account Name Required', type: 'required', condition: '$.accountName', message: 'Storage account name is required', severity: 'error' }
        ],
        customProperties: [
          { id: 'accountName', name: 'Account Name', type: 'string', defaultValue: 'mystorageaccount', required: true, description: 'Storage account name' },
          { id: 'kind', name: 'Account Kind', type: 'select', defaultValue: 'StorageV2', required: true, description: 'Storage account kind', options: [
            { value: 'Storage', label: 'Storage (legacy)' },
            { value: 'StorageV2', label: 'General Purpose v2' },
            { value: 'BlobStorage', label: 'Blob Storage' },
            { value: 'FileStorage', label: 'File Storage' },
            { value: 'BlockBlobStorage', label: 'Block Blob Storage' }
          ]},
          { id: 'replication', name: 'Replication', type: 'select', defaultValue: 'LRS', required: false, description: 'Replication type', options: [
            { value: 'LRS', label: 'Locally Redundant (LRS)' },
            { value: 'ZRS', label: 'Zone Redundant (ZRS)' },
            { value: 'GRS', label: 'Geo Redundant (GRS)' },
            { value: 'RAGRS', label: 'Read-Access Geo Redundant (RA-GRS)' }
          ]},
          { id: 'accessTier', name: 'Access Tier', type: 'select', defaultValue: 'hot', required: false, description: 'Default access tier', options: [
            { value: 'hot', label: 'Hot' },
            { value: 'cool', label: 'Cool' }
          ]}
        ]
      },
      version: '1.0.0',
      tags: ['azure', 'storage', 'blob', 'scalable'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },

    // Azure Security & Identity Services
    {
      id: 'azure-key-vault',
      name: 'Azure Key Vault',
      description: 'Secure storage for secrets, keys, and certificates',
      category: ComponentCategory.SECURITY,
      providerMappings: {
        azure: {
          name: 'Key Vault',
          description: 'Secure storage for application secrets',
          iconPath: '/assets/provider-icons/azure/security/10245-icon-service-Key-Vaults.svg',
          iconType: 'svg',
          serviceUrl: 'https://azure.microsoft.com/en-us/services/key-vault/',
          documentationUrl: 'https://docs.microsoft.com/en-us/azure/key-vault/',
          tags: ['security', 'secrets', 'keys', 'certificates'],
          metadata: {
            objectTypes: ['secrets', 'keys', 'certificates'],
            tiers: ['standard', 'premium']
          }
        },
        generic: {
          name: 'Secrets Manager',
          description: 'Generic secrets management',
          iconPath: '/assets/provider-icons/generic/secrets-manager.svg',
          iconType: 'svg',
          tags: ['security', 'secrets'],
          metadata: {}
        }
      },
      config: {
        defaultSize: { width: 120, height: 80 },
        minSize: { width: 80, height: 60 },
        maxSize: { width: 200, height: 120 },
        isContainer: false,
        canContainTypes: [],
        canBeContainedBy: [ComponentCategory.NETWORK],
        connectionPoints: [
          { id: 'app', name: 'Application', type: 'output', position: { x: 0.5, y: 1 } }
        ],
        allowedConnections: [ComponentCategory.COMPUTE, ComponentCategory.SERVERLESS, ComponentCategory.CONTAINERS],
        validationRules: [
          { id: 'vault-name-required', name: 'Vault Name Required', type: 'required', condition: '$.vaultName', message: 'Key vault name is required', severity: 'error' }
        ],
        customProperties: [
          { id: 'vaultName', name: 'Vault Name', type: 'string', defaultValue: 'my-key-vault', required: true, description: 'Key vault name' },
          { id: 'tier', name: 'Pricing Tier', type: 'select', defaultValue: 'standard', required: false, description: 'Pricing tier', options: [
            { value: 'standard', label: 'Standard' },
            { value: 'premium', label: 'Premium' }
          ]},
          { id: 'softDeleteEnabled', name: 'Soft Delete Enabled', type: 'boolean', defaultValue: true, required: false, description: 'Enable soft delete' },
          { id: 'purgeProtection', name: 'Purge Protection', type: 'boolean', defaultValue: false, required: false, description: 'Enable purge protection' }
        ]
      },
      version: '1.0.0',
      tags: ['azure', 'security', 'secrets', 'encryption'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },

    // Azure Monitoring Services
    {
      id: 'azure-monitor',
      name: 'Azure Monitor',
      description: 'Comprehensive monitoring solution for applications and infrastructure',
      category: ComponentCategory.MONITORING,
      providerMappings: {
        azure: {
          name: 'Monitor',
          description: 'Full-stack monitoring solution',
          iconPath: '/assets/provider-icons/azure/devops/10244-icon-service-Monitor.svg',
          iconType: 'svg',
          serviceUrl: 'https://azure.microsoft.com/en-us/services/monitor/',
          documentationUrl: 'https://docs.microsoft.com/en-us/azure/azure-monitor/',
          tags: ['monitoring', 'metrics', 'logs', 'alerts'],
          metadata: {
            dataTypes: ['metrics', 'logs', 'traces'],
            sources: ['azure-resources', 'applications', 'guest-os']
          }
        },
        generic: {
          name: 'Monitoring',
          description: 'Generic monitoring service',
          iconPath: '/assets/provider-icons/generic/monitoring.svg',
          iconType: 'svg',
          tags: ['monitoring', 'metrics'],
          metadata: {}
        }
      },
      config: {
        defaultSize: { width: 120, height: 80 },
        minSize: { width: 80, height: 60 },
        maxSize: { width: 200, height: 120 },
        isContainer: false,
        canContainTypes: [],
        canBeContainedBy: [ComponentCategory.NETWORK],
        connectionPoints: [
          { id: 'sources', name: 'Data Sources', type: 'input', position: { x: 0, y: 0.5 } },
          { id: 'alerts', name: 'Alerts', type: 'output', position: { x: 1, y: 0.5 } }
        ],
        allowedConnections: [ComponentCategory.COMPUTE, ComponentCategory.SERVERLESS, ComponentCategory.DATABASE],
        validationRules: [],
        customProperties: [
          { id: 'workspaceName', name: 'Workspace Name', type: 'string', defaultValue: 'my-workspace', required: false, description: 'Log Analytics workspace name' },
          { id: 'retentionDays', name: 'Retention (days)', type: 'number', defaultValue: 30, required: false, description: 'Data retention in days' },
          { id: 'alertsEnabled', name: 'Alerts Enabled', type: 'boolean', defaultValue: true, required: false, description: 'Enable alerting' }
        ]
      },
      version: '1.0.0',
      tags: ['azure', 'monitoring', 'observability', 'alerts'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ];
}