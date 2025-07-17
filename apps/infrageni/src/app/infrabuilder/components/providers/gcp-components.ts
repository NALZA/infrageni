import { ComponentMetadata, ComponentCategory, ComponentSubcategory } from '../core/component-types';

/**
 * Google Cloud Platform (GCP) specific infrastructure components
 * These components are specific to Google Cloud Platform services
 */

export async function getGcpComponents(): Promise<ComponentMetadata[]> {
  return [
    // GCP Compute Services
    {
      id: 'gcp-cloud-functions',
      name: 'Cloud Functions',
      description: 'Serverless execution environment for building and connecting cloud services',
      category: ComponentCategory.SERVERLESS,
      providerMappings: {
        gcp: {
          name: 'Cloud Functions',
          description: 'Event-driven serverless compute platform',
          iconPath: '/assets/provider-icons/gcp/Cloud-Functions.svg',
          iconType: 'svg',
          serviceUrl: 'https://cloud.google.com/functions',
          documentationUrl: 'https://cloud.google.com/functions/docs',
          tags: ['serverless', 'compute', 'functions', 'event-driven'],
          metadata: {
            runtimes: ['nodejs', 'python', 'go', 'java', 'dotnet', 'ruby', 'php'],
            triggers: ['http', 'pubsub', 'storage', 'firestore', 'firebase'],
            generations: ['1st gen', '2nd gen']
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
          { id: 'runtime', name: 'Runtime', type: 'select', defaultValue: 'nodejs18', required: true, description: 'Function runtime', options: [
            { value: 'nodejs18', label: 'Node.js 18' },
            { value: 'nodejs16', label: 'Node.js 16' },
            { value: 'python39', label: 'Python 3.9' },
            { value: 'python310', label: 'Python 3.10' },
            { value: 'go119', label: 'Go 1.19' },
            { value: 'java11', label: 'Java 11' },
            { value: 'dotnet3', label: '.NET 3' },
            { value: 'ruby27', label: 'Ruby 2.7' },
            { value: 'php74', label: 'PHP 7.4' }
          ]},
          { id: 'generation', name: 'Generation', type: 'select', defaultValue: '2nd gen', required: false, description: 'Function generation', options: [
            { value: '1st gen', label: '1st Generation' },
            { value: '2nd gen', label: '2nd Generation' }
          ]},
          { id: 'memory', name: 'Memory (MB)', type: 'select', defaultValue: '256', required: false, description: 'Memory allocation', options: [
            { value: '128', label: '128 MB' },
            { value: '256', label: '256 MB' },
            { value: '512', label: '512 MB' },
            { value: '1024', label: '1 GB' },
            { value: '2048', label: '2 GB' },
            { value: '4096', label: '4 GB' }
          ]},
          { id: 'timeout', name: 'Timeout (seconds)', type: 'number', defaultValue: 60, required: false, description: 'Function timeout' }
        ]
      },
      version: '1.0.0',
      tags: ['gcp', 'serverless', 'compute', 'functions'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },

    {
      id: 'gcp-app-engine',
      name: 'App Engine',
      description: 'Platform-as-a-Service for building scalable web applications',
      category: ComponentCategory.COMPUTE,
      providerMappings: {
        gcp: {
          name: 'App Engine',
          description: 'Fully managed serverless platform',
          iconPath: '/assets/provider-icons/gcp/App-Engine.svg',
          iconType: 'svg',
          serviceUrl: 'https://cloud.google.com/appengine',
          documentationUrl: 'https://cloud.google.com/appengine/docs',
          tags: ['paas', 'web', 'serverless', 'hosting'],
          metadata: {
            environments: ['standard', 'flexible'],
            runtimes: ['nodejs', 'python', 'java', 'go', 'php', 'ruby'],
            scaling: ['automatic', 'basic', 'manual']
          }
        },
        generic: {
          name: 'Web Application Platform',
          description: 'Generic web application platform',
          iconPath: '/assets/provider-icons/generic/web-app.svg',
          iconType: 'svg',
          tags: ['web', 'application', 'platform'],
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
          { id: 'services', name: 'Services', type: 'output', position: { x: 0.5, y: 1 } }
        ],
        allowedConnections: [ComponentCategory.DATABASE, ComponentCategory.STORAGE, ComponentCategory.MESSAGING],
        validationRules: [
          { id: 'service-name-required', name: 'Service Name Required', type: 'required', condition: '$.serviceName', message: 'Service name is required', severity: 'error' }
        ],
        customProperties: [
          { id: 'serviceName', name: 'Service Name', type: 'string', defaultValue: 'default', required: true, description: 'App Engine service name' },
          { id: 'environment', name: 'Environment', type: 'select', defaultValue: 'standard', required: true, description: 'App Engine environment', options: [
            { value: 'standard', label: 'Standard' },
            { value: 'flexible', label: 'Flexible' }
          ]},
          { id: 'runtime', name: 'Runtime', type: 'select', defaultValue: 'nodejs18', required: true, description: 'Runtime environment', options: [
            { value: 'nodejs18', label: 'Node.js 18' },
            { value: 'python39', label: 'Python 3.9' },
            { value: 'java11', label: 'Java 11' },
            { value: 'go119', label: 'Go 1.19' },
            { value: 'php74', label: 'PHP 7.4' },
            { value: 'ruby27', label: 'Ruby 2.7' }
          ]},
          { id: 'scalingType', name: 'Scaling Type', type: 'select', defaultValue: 'automatic', required: false, description: 'Scaling type', options: [
            { value: 'automatic', label: 'Automatic' },
            { value: 'basic', label: 'Basic' },
            { value: 'manual', label: 'Manual' }
          ]}
        ]
      },
      version: '1.0.0',
      tags: ['gcp', 'paas', 'web', 'serverless'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },

    {
      id: 'gcp-cloud-run',
      name: 'Cloud Run',
      description: 'Fully managed serverless platform for containerized applications',
      category: ComponentCategory.CONTAINERS,
      subcategory: ComponentSubcategory.RUNTIME,
      providerMappings: {
        gcp: {
          name: 'Cloud Run',
          description: 'Serverless containers',
          iconPath: '/assets/provider-icons/gcp/Cloud-Run.svg',
          iconType: 'svg',
          serviceUrl: 'https://cloud.google.com/run',
          documentationUrl: 'https://cloud.google.com/run/docs',
          tags: ['containers', 'serverless', 'compute'],
          metadata: {
            concurrency: 1000,
            timeout: 3600,
            cpu: ['1', '2', '4', '8'],
            memory: ['128Mi', '256Mi', '512Mi', '1Gi', '2Gi', '4Gi', '8Gi']
          }
        },
        generic: {
          name: 'Serverless Container',
          description: 'Generic serverless container',
          iconPath: '/assets/provider-icons/generic/container.svg',
          iconType: 'svg',
          tags: ['container', 'serverless'],
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
          { id: 'http', name: 'HTTP', type: 'input', position: { x: 0.5, y: 0 } },
          { id: 'services', name: 'Services', type: 'output', position: { x: 0.5, y: 1 } }
        ],
        allowedConnections: [ComponentCategory.STORAGE, ComponentCategory.DATABASE, ComponentCategory.MESSAGING],
        validationRules: [
          { id: 'image-required', name: 'Container Image Required', type: 'required', condition: '$.image', message: 'Container image is required', severity: 'error' }
        ],
        customProperties: [
          { id: 'image', name: 'Container Image', type: 'string', defaultValue: 'gcr.io/my-project/my-app:latest', required: true, description: 'Container image URL' },
          { id: 'cpu', name: 'CPU', type: 'select', defaultValue: '1', required: false, description: 'CPU allocation', options: [
            { value: '1', label: '1 vCPU' },
            { value: '2', label: '2 vCPUs' },
            { value: '4', label: '4 vCPUs' },
            { value: '8', label: '8 vCPUs' }
          ]},
          { id: 'memory', name: 'Memory', type: 'select', defaultValue: '512Mi', required: false, description: 'Memory allocation', options: [
            { value: '128Mi', label: '128 MB' },
            { value: '256Mi', label: '256 MB' },
            { value: '512Mi', label: '512 MB' },
            { value: '1Gi', label: '1 GB' },
            { value: '2Gi', label: '2 GB' },
            { value: '4Gi', label: '4 GB' },
            { value: '8Gi', label: '8 GB' }
          ]},
          { id: 'maxInstances', name: 'Max Instances', type: 'number', defaultValue: 100, required: false, description: 'Maximum number of instances' }
        ]
      },
      version: '1.0.0',
      tags: ['gcp', 'containers', 'serverless', 'cloud-run'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },

    // GCP Database Services
    {
      id: 'gcp-cloud-firestore',
      name: 'Cloud Firestore',
      description: 'NoSQL document database for mobile and web applications',
      category: ComponentCategory.DATABASE,
      subcategory: ComponentSubcategory.NOSQL,
      providerMappings: {
        gcp: {
          name: 'Cloud Firestore',
          description: 'NoSQL document database',
          iconPath: '/assets/provider-icons/gcp/Cloud-Firestore.svg',
          iconType: 'svg',
          serviceUrl: 'https://cloud.google.com/firestore',
          documentationUrl: 'https://cloud.google.com/firestore/docs',
          tags: ['nosql', 'database', 'document', 'realtime'],
          metadata: {
            modes: ['native', 'datastore'],
            features: ['realtime', 'offline', 'multi-region']
          }
        },
        generic: {
          name: 'NoSQL Database',
          description: 'Generic NoSQL database',
          iconPath: '/assets/provider-icons/generic/nosql-database.svg',
          iconType: 'svg',
          tags: ['nosql', 'database', 'document'],
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
          { id: 'realtime', name: 'Realtime', type: 'output', position: { x: 1, y: 0.5 } }
        ],
        allowedConnections: [ComponentCategory.COMPUTE, ComponentCategory.SERVERLESS, ComponentCategory.CONTAINERS],
        validationRules: [
          { id: 'database-id-required', name: 'Database ID Required', type: 'required', condition: '$.databaseId', message: 'Database ID is required', severity: 'error' }
        ],
        customProperties: [
          { id: 'databaseId', name: 'Database ID', type: 'string', defaultValue: '(default)', required: true, description: 'Firestore database ID' },
          { id: 'mode', name: 'Mode', type: 'select', defaultValue: 'native', required: true, description: 'Firestore mode', options: [
            { value: 'native', label: 'Native Mode' },
            { value: 'datastore', label: 'Datastore Mode' }
          ]},
          { id: 'location', name: 'Location', type: 'select', defaultValue: 'us-central1', required: false, description: 'Database location', options: [
            { value: 'us-central1', label: 'US Central (Iowa)' },
            { value: 'us-east1', label: 'US East (South Carolina)' },
            { value: 'europe-west1', label: 'Europe West (Belgium)' },
            { value: 'asia-southeast1', label: 'Asia Southeast (Singapore)' }
          ]},
          { id: 'multiRegion', name: 'Multi-Region', type: 'boolean', defaultValue: false, required: false, description: 'Enable multi-region' }
        ]
      },
      version: '1.0.0',
      tags: ['gcp', 'database', 'nosql', 'firestore'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },

    {
      id: 'gcp-cloud-spanner',
      name: 'Cloud Spanner',
      description: 'Horizontally scalable, globally consistent relational database',
      category: ComponentCategory.DATABASE,
      subcategory: ComponentSubcategory.RELATIONAL,
      providerMappings: {
        gcp: {
          name: 'Cloud Spanner',
          description: 'Globally distributed relational database',
          iconPath: '/assets/provider-icons/gcp/Cloud-Spanner.svg',
          iconType: 'svg',
          serviceUrl: 'https://cloud.google.com/spanner',
          documentationUrl: 'https://cloud.google.com/spanner/docs',
          tags: ['relational', 'database', 'distributed', 'global'],
          metadata: {
            consistencyModel: 'strong',
            apis: ['sql', 'read-write', 'read-only'],
            scaling: 'horizontal'
          }
        },
        generic: {
          name: 'Distributed Database',
          description: 'Generic distributed database',
          iconPath: '/assets/provider-icons/generic/distributed-database.svg',
          iconType: 'svg',
          tags: ['database', 'distributed', 'relational'],
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
          { id: 'instance-id-required', name: 'Instance ID Required', type: 'required', condition: '$.instanceId', message: 'Instance ID is required', severity: 'error' }
        ],
        customProperties: [
          { id: 'instanceId', name: 'Instance ID', type: 'string', defaultValue: 'my-spanner-instance', required: true, description: 'Spanner instance ID' },
          { id: 'nodes', name: 'Nodes', type: 'number', defaultValue: 1, required: false, description: 'Number of nodes' },
          { id: 'config', name: 'Instance Config', type: 'select', defaultValue: 'regional-us-central1', required: false, description: 'Instance configuration', options: [
            { value: 'regional-us-central1', label: 'Regional (US Central)' },
            { value: 'regional-us-east1', label: 'Regional (US East)' },
            { value: 'regional-europe-west1', label: 'Regional (Europe West)' },
            { value: 'multi-region-us', label: 'Multi-Region (US)' },
            { value: 'multi-region-eu', label: 'Multi-Region (EU)' }
          ]},
          { id: 'processingUnits', name: 'Processing Units', type: 'number', defaultValue: 1000, required: false, description: 'Processing units (alternative to nodes)' }
        ]
      },
      version: '1.0.0',
      tags: ['gcp', 'database', 'spanner', 'distributed'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },

    {
      id: 'gcp-memorystore',
      name: 'Memorystore',
      description: 'Fully managed in-memory data store service',
      category: ComponentCategory.DATABASE,
      subcategory: ComponentSubcategory.CACHE,
      providerMappings: {
        gcp: {
          name: 'Memorystore',
          description: 'Managed Redis and Memcached',
          iconPath: '/assets/provider-icons/gcp/Memorystore.svg',
          iconType: 'svg',
          serviceUrl: 'https://cloud.google.com/memorystore',
          documentationUrl: 'https://cloud.google.com/memorystore/docs',
          tags: ['cache', 'redis', 'memcached', 'in-memory'],
          metadata: {
            engines: ['redis', 'memcached'],
            tiers: ['basic', 'standard'],
            redisVersions: ['6.x', '5.0', '4.0']
          }
        },
        generic: {
          name: 'In-Memory Cache',
          description: 'Generic in-memory cache',
          iconPath: '/assets/provider-icons/generic/cache.svg',
          iconType: 'svg',
          tags: ['cache', 'memory', 'performance'],
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
          { id: 'instance-id-required', name: 'Instance ID Required', type: 'required', condition: '$.instanceId', message: 'Instance ID is required', severity: 'error' }
        ],
        customProperties: [
          { id: 'instanceId', name: 'Instance ID', type: 'string', defaultValue: 'my-redis-instance', required: true, description: 'Memorystore instance ID' },
          { id: 'engine', name: 'Engine', type: 'select', defaultValue: 'redis', required: true, description: 'Cache engine', options: [
            { value: 'redis', label: 'Redis' },
            { value: 'memcached', label: 'Memcached' }
          ]},
          { id: 'tier', name: 'Tier', type: 'select', defaultValue: 'standard', required: false, description: 'Service tier', options: [
            { value: 'basic', label: 'Basic' },
            { value: 'standard', label: 'Standard' }
          ]},
          { id: 'memorySizeGb', name: 'Memory Size (GB)', type: 'number', defaultValue: 1, required: false, description: 'Memory size in GB' },
          { id: 'version', name: 'Version', type: 'select', defaultValue: '6.x', required: false, description: 'Engine version', options: [
            { value: '6.x', label: '6.x' },
            { value: '5.0', label: '5.0' },
            { value: '4.0', label: '4.0' }
          ]}
        ]
      },
      version: '1.0.0',
      tags: ['gcp', 'cache', 'redis', 'memcached'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },

    // GCP Networking Services
    {
      id: 'gcp-cloud-load-balancing',
      name: 'Cloud Load Balancing',
      description: 'Fully distributed, software-defined managed service',
      category: ComponentCategory.NETWORK,
      subcategory: ComponentSubcategory.LOAD_BALANCER,
      providerMappings: {
        gcp: {
          name: 'Cloud Load Balancing',
          description: 'Global load balancing service',
          iconPath: '/assets/provider-icons/gcp/Cloud-Load-Balancing.svg',
          iconType: 'svg',
          serviceUrl: 'https://cloud.google.com/load-balancing',
          documentationUrl: 'https://cloud.google.com/load-balancing/docs',
          tags: ['load-balancer', 'global', 'http', 'tcp'],
          metadata: {
            types: ['http', 'https', 'tcp', 'ssl', 'internal', 'network'],
            scopes: ['global', 'regional']
          }
        },
        generic: {
          name: 'Load Balancer',
          description: 'Generic load balancer',
          iconPath: '/assets/provider-icons/generic/load-balancer.svg',
          iconType: 'svg',
          tags: ['load-balancer', 'traffic'],
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
          { id: 'lb-type-required', name: 'Load Balancer Type Required', type: 'required', condition: '$.lbType', message: 'Load balancer type is required', severity: 'error' }
        ],
        customProperties: [
          { id: 'lbType', name: 'Load Balancer Type', type: 'select', defaultValue: 'http', required: true, description: 'Load balancer type', options: [
            { value: 'http', label: 'HTTP(S)' },
            { value: 'tcp', label: 'TCP' },
            { value: 'ssl', label: 'SSL' },
            { value: 'internal', label: 'Internal' },
            { value: 'network', label: 'Network' }
          ]},
          { id: 'scope', name: 'Scope', type: 'select', defaultValue: 'global', required: false, description: 'Load balancer scope', options: [
            { value: 'global', label: 'Global' },
            { value: 'regional', label: 'Regional' }
          ]},
          { id: 'protocol', name: 'Protocol', type: 'select', defaultValue: 'HTTP', required: false, description: 'Backend protocol', options: [
            { value: 'HTTP', label: 'HTTP' },
            { value: 'HTTPS', label: 'HTTPS' },
            { value: 'TCP', label: 'TCP' },
            { value: 'UDP', label: 'UDP' }
          ]},
          { id: 'healthCheck', name: 'Health Check', type: 'boolean', defaultValue: true, required: false, description: 'Enable health check' }
        ]
      },
      version: '1.0.0',
      tags: ['gcp', 'networking', 'load-balancer', 'global'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },

    {
      id: 'gcp-cloud-cdn',
      name: 'Cloud CDN',
      description: 'Global content delivery network',
      category: ComponentCategory.NETWORK,
      subcategory: ComponentSubcategory.CDN,
      providerMappings: {
        gcp: {
          name: 'Cloud CDN',
          description: 'Global content delivery network',
          iconPath: '/assets/provider-icons/gcp/Cloud-CDN.svg',
          iconType: 'svg',
          serviceUrl: 'https://cloud.google.com/cdn',
          documentationUrl: 'https://cloud.google.com/cdn/docs',
          tags: ['cdn', 'content-delivery', 'performance', 'global'],
          metadata: {
            cacheModes: ['cache-all', 'use-origin-headers', 'force-cache-all'],
            protocols: ['http', 'https']
          }
        },
        generic: {
          name: 'CDN',
          description: 'Generic content delivery network',
          iconPath: '/assets/provider-icons/generic/cdn.svg',
          iconType: 'svg',
          tags: ['cdn', 'content-delivery', 'performance'],
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
        allowedConnections: [ComponentCategory.STORAGE, ComponentCategory.COMPUTE, ComponentCategory.NETWORK],
        validationRules: [
          { id: 'origin-required', name: 'Origin Required', type: 'required', condition: '$.origin', message: 'Origin is required', severity: 'error' }
        ],
        customProperties: [
          { id: 'cacheMode', name: 'Cache Mode', type: 'select', defaultValue: 'use-origin-headers', required: false, description: 'Cache mode', options: [
            { value: 'cache-all', label: 'Cache All' },
            { value: 'use-origin-headers', label: 'Use Origin Headers' },
            { value: 'force-cache-all', label: 'Force Cache All' }
          ]},
          { id: 'defaultTtl', name: 'Default TTL (seconds)', type: 'number', defaultValue: 3600, required: false, description: 'Default time to live' },
          { id: 'maxTtl', name: 'Max TTL (seconds)', type: 'number', defaultValue: 86400, required: false, description: 'Maximum time to live' },
          { id: 'enableCompression', name: 'Enable Compression', type: 'boolean', defaultValue: true, required: false, description: 'Enable gzip compression' }
        ]
      },
      version: '1.0.0',
      tags: ['gcp', 'cdn', 'networking', 'performance'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },

    // GCP Storage Services
    {
      id: 'gcp-cloud-storage',
      name: 'Cloud Storage',
      description: 'Unified object storage for developers and enterprises',
      category: ComponentCategory.STORAGE,
      subcategory: ComponentSubcategory.OBJECT_STORAGE,
      providerMappings: {
        gcp: {
          name: 'Cloud Storage',
          description: 'Object storage service',
          iconPath: '/assets/provider-icons/gcp/Cloud-Storage.svg',
          iconType: 'svg',
          serviceUrl: 'https://cloud.google.com/storage',
          documentationUrl: 'https://cloud.google.com/storage/docs',
          tags: ['storage', 'object', 'bucket', 'scalable'],
          metadata: {
            storageClasses: ['standard', 'nearline', 'coldline', 'archive'],
            locations: ['multi-region', 'dual-region', 'region']
          }
        },
        generic: {
          name: 'Object Storage',
          description: 'Generic object storage',
          iconPath: '/assets/provider-icons/generic/object-storage.svg',
          iconType: 'svg',
          tags: ['storage', 'object', 'scalable'],
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
          { id: 'bucket-name-required', name: 'Bucket Name Required', type: 'required', condition: '$.bucketName', message: 'Bucket name is required', severity: 'error' }
        ],
        customProperties: [
          { id: 'bucketName', name: 'Bucket Name', type: 'string', defaultValue: 'my-bucket', required: true, description: 'Storage bucket name' },
          { id: 'storageClass', name: 'Storage Class', type: 'select', defaultValue: 'standard', required: false, description: 'Storage class', options: [
            { value: 'standard', label: 'Standard' },
            { value: 'nearline', label: 'Nearline' },
            { value: 'coldline', label: 'Coldline' },
            { value: 'archive', label: 'Archive' }
          ]},
          { id: 'location', name: 'Location', type: 'select', defaultValue: 'us-central1', required: false, description: 'Bucket location', options: [
            { value: 'us', label: 'US (Multi-region)' },
            { value: 'eu', label: 'EU (Multi-region)' },
            { value: 'asia', label: 'Asia (Multi-region)' },
            { value: 'us-central1', label: 'US Central 1' },
            { value: 'us-east1', label: 'US East 1' },
            { value: 'europe-west1', label: 'Europe West 1' }
          ]},
          { value: 'versioning', name: 'Versioning', type: 'boolean', defaultValue: false, required: false, description: 'Enable versioning' },
          { value: 'lifecycle', name: 'Lifecycle Management', type: 'boolean', defaultValue: false, required: false, description: 'Enable lifecycle management' }
        ]
      },
      version: '1.0.0',
      tags: ['gcp', 'storage', 'object', 'bucket'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },

    // GCP Messaging Services
    {
      id: 'gcp-pub-sub',
      name: 'Cloud Pub/Sub',
      description: 'Asynchronous messaging service for event-driven systems',
      category: ComponentCategory.MESSAGING,
      providerMappings: {
        gcp: {
          name: 'Cloud Pub/Sub',
          description: 'Messaging and event streaming',
          iconPath: '/assets/provider-icons/gcp/Cloud-Pub-Sub.svg',
          iconType: 'svg',
          serviceUrl: 'https://cloud.google.com/pubsub',
          documentationUrl: 'https://cloud.google.com/pubsub/docs',
          tags: ['messaging', 'pubsub', 'event-driven', 'streaming'],
          metadata: {
            features: ['exactly-once', 'ordering', 'replay', 'filtering'],
            integrations: ['dataflow', 'cloud-functions', 'cloud-run']
          }
        },
        generic: {
          name: 'Message Queue',
          description: 'Generic message queue',
          iconPath: '/assets/provider-icons/generic/message-queue.svg',
          iconType: 'svg',
          tags: ['messaging', 'queue', 'event-driven'],
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
          { id: 'publisher', name: 'Publisher', type: 'input', position: { x: 0, y: 0.5 } },
          { id: 'subscriber', name: 'Subscriber', type: 'output', position: { x: 1, y: 0.5 } }
        ],
        allowedConnections: [ComponentCategory.COMPUTE, ComponentCategory.SERVERLESS, ComponentCategory.CONTAINERS],
        validationRules: [
          { id: 'topic-name-required', name: 'Topic Name Required', type: 'required', condition: '$.topicName', message: 'Topic name is required', severity: 'error' }
        ],
        customProperties: [
          { id: 'topicName', name: 'Topic Name', type: 'string', defaultValue: 'my-topic', required: true, description: 'Pub/Sub topic name' },
          { id: 'messageRetentionDuration', name: 'Message Retention (days)', type: 'number', defaultValue: 7, required: false, description: 'Message retention duration' },
          { id: 'exactlyOnceDelivery', name: 'Exactly Once Delivery', type: 'boolean', defaultValue: false, required: false, description: 'Enable exactly once delivery' },
          { id: 'messageOrdering', name: 'Message Ordering', type: 'boolean', defaultValue: false, required: false, description: 'Enable message ordering' }
        ]
      },
      version: '1.0.0',
      tags: ['gcp', 'messaging', 'pubsub', 'event-driven'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },

    // GCP Security Services
    {
      id: 'gcp-secret-manager',
      name: 'Secret Manager',
      description: 'Store and manage access to tokens, passwords, certificates, and other secrets',
      category: ComponentCategory.SECURITY,
      providerMappings: {
        gcp: {
          name: 'Secret Manager',
          description: 'Secure secret storage',
          iconPath: '/assets/provider-icons/gcp/Secret-Manager.svg',
          iconType: 'svg',
          serviceUrl: 'https://cloud.google.com/secret-manager',
          documentationUrl: 'https://cloud.google.com/secret-manager/docs',
          tags: ['security', 'secrets', 'encryption', 'credentials'],
          metadata: {
            features: ['versioning', 'rotation', 'replication', 'audit'],
            integrations: ['cloud-kms', 'iam', 'cloud-functions']
          }
        },
        generic: {
          name: 'Secrets Manager',
          description: 'Generic secrets management',
          iconPath: '/assets/provider-icons/generic/secrets-manager.svg',
          iconType: 'svg',
          tags: ['security', 'secrets', 'encryption'],
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
          { id: 'secret-name-required', name: 'Secret Name Required', type: 'required', condition: '$.secretName', message: 'Secret name is required', severity: 'error' }
        ],
        customProperties: [
          { id: 'secretName', name: 'Secret Name', type: 'string', defaultValue: 'my-secret', required: true, description: 'Secret name' },
          { id: 'replication', name: 'Replication', type: 'select', defaultValue: 'auto', required: false, description: 'Replication policy', options: [
            { value: 'auto', label: 'Automatic' },
            { value: 'user-managed', label: 'User Managed' }
          ]},
          { id: 'rotation', name: 'Automatic Rotation', type: 'boolean', defaultValue: false, required: false, description: 'Enable automatic rotation' },
          { id: 'ttl', name: 'TTL (days)', type: 'number', defaultValue: 0, required: false, description: 'Time to live (0 = no expiration)' }
        ]
      },
      version: '1.0.0',
      tags: ['gcp', 'security', 'secrets', 'encryption'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ];
}