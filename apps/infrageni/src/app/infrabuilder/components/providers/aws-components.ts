import { ComponentMetadata, ComponentCategory, ComponentSubcategory } from '../core/component-types';

/**
 * AWS-specific infrastructure components
 * Comprehensive list of AWS services with detailed configurations
 */

export async function getAwsComponents(): Promise<ComponentMetadata[]> {
  return [
    // Compute Services
    {
      id: 'aws-lambda',
      name: 'Lambda Function',
      description: 'Serverless compute service',
      category: ComponentCategory.SERVERLESS,
      providerMappings: {
        aws: {
          name: 'Lambda Function',
          description: 'AWS Lambda serverless function',
          iconPath: '/assets/provider-icons/aws/compute/Res_AWS-Lambda_Lambda-Function_48.svg',
          iconType: 'svg',
          serviceUrl: 'https://aws.amazon.com/lambda/',
          documentationUrl: 'https://docs.aws.amazon.com/lambda/',
          tags: ['lambda', 'serverless', 'compute'],
          metadata: { 
            runtimes: ['nodejs', 'python', 'java', 'dotnet', 'go', 'ruby'],
            maxExecutionTime: '15 minutes',
            memoryRange: '128MB - 10GB'
          }
        },
        generic: {
          name: 'Serverless Function',
          description: 'Generic serverless function',
          iconPath: '/assets/provider-icons/generic/serverless.svg',
          iconType: 'svg',
          tags: ['serverless', 'function'],
          metadata: {}
        }
      },
      config: {
        defaultSize: { width: 100, height: 60 },
        minSize: { width: 80, height: 50 },
        maxSize: { width: 150, height: 90 },
        isContainer: false,
        canContainTypes: [],
        canBeContainedBy: [ComponentCategory.NETWORK],
        connectionPoints: [
          { id: 'trigger', name: 'Trigger', type: 'input', position: { x: 0, y: 0.5 } },
          { id: 'output', name: 'Output', type: 'output', position: { x: 1, y: 0.5 } }
        ],
        allowedConnections: [ComponentCategory.API_GATEWAY, ComponentCategory.DATABASE, ComponentCategory.STORAGE],
        validationRules: [
          { id: 'runtime-required', name: 'Runtime Required', type: 'required', condition: '$.runtime', message: 'Runtime is required', severity: 'error' }
        ],
        customProperties: [
          { id: 'runtime', name: 'Runtime', type: 'select', defaultValue: 'nodejs18.x', required: true, description: 'Function runtime', options: [
            { value: 'nodejs18.x', label: 'Node.js 18.x' },
            { value: 'nodejs20.x', label: 'Node.js 20.x' },
            { value: 'python3.9', label: 'Python 3.9' },
            { value: 'python3.10', label: 'Python 3.10' },
            { value: 'python3.11', label: 'Python 3.11' },
            { value: 'java11', label: 'Java 11' },
            { value: 'java17', label: 'Java 17' },
            { value: 'dotnet6', label: '.NET 6' },
            { value: 'go1.x', label: 'Go 1.x' },
            { value: 'ruby3.2', label: 'Ruby 3.2' }
          ]},
          { id: 'memorySize', name: 'Memory (MB)', type: 'number', defaultValue: 128, required: false, description: 'Memory allocation in MB' },
          { id: 'timeout', name: 'Timeout (seconds)', type: 'number', defaultValue: 30, required: false, description: 'Function timeout in seconds' },
          { id: 'environment', name: 'Environment Variables', type: 'object', defaultValue: {}, required: false, description: 'Environment variables' }
        ]
      },
      version: '1.0.0',
      tags: ['aws', 'lambda', 'serverless', 'compute'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },

    {
      id: 'aws-elastic-beanstalk',
      name: 'Elastic Beanstalk',
      description: 'Platform as a Service for web applications',
      category: ComponentCategory.COMPUTE,
      providerMappings: {
        aws: {
          name: 'Elastic Beanstalk',
          description: 'AWS Elastic Beanstalk Application',
          iconPath: '/assets/provider-icons/aws/compute/Res_AWS-Elastic-Beanstalk_Application_48.svg',
          iconType: 'svg',
          serviceUrl: 'https://aws.amazon.com/elasticbeanstalk/',
          documentationUrl: 'https://docs.aws.amazon.com/elasticbeanstalk/',
          tags: ['beanstalk', 'paas', 'application'],
          metadata: { 
            platforms: ['java', 'dotnet', 'php', 'nodejs', 'python', 'ruby', 'go'],
            autoScaling: true,
            loadBalancing: true
          }
        },
        generic: {
          name: 'Platform as a Service',
          description: 'Generic PaaS platform',
          iconPath: '/assets/provider-icons/generic/paas.svg',
          iconType: 'svg',
          tags: ['paas', 'platform'],
          metadata: {}
        }
      },
      config: {
        defaultSize: { width: 140, height: 90 },
        minSize: { width: 100, height: 70 },
        maxSize: { width: 200, height: 130 },
        isContainer: true,
        canContainTypes: [ComponentCategory.COMPUTE],
        canBeContainedBy: [ComponentCategory.NETWORK],
        connectionPoints: [
          { id: 'web', name: 'Web Traffic', type: 'input', position: { x: 0.5, y: 0 } },
          { id: 'db', name: 'Database', type: 'output', position: { x: 0.5, y: 1 } }
        ],
        allowedConnections: [ComponentCategory.DATABASE, ComponentCategory.STORAGE, ComponentCategory.NETWORK],
        validationRules: [
          { id: 'platform-required', name: 'Platform Required', type: 'required', condition: '$.platform', message: 'Platform is required', severity: 'error' }
        ],
        customProperties: [
          { id: 'platform', name: 'Platform', type: 'select', defaultValue: 'java', required: true, description: 'Application platform', options: [
            { value: 'java', label: 'Java' },
            { value: 'dotnet', label: '.NET' },
            { value: 'php', label: 'PHP' },
            { value: 'nodejs', label: 'Node.js' },
            { value: 'python', label: 'Python' },
            { value: 'ruby', label: 'Ruby' },
            { value: 'go', label: 'Go' }
          ]},
          { id: 'instanceType', name: 'Instance Type', type: 'string', defaultValue: 't3.micro', required: false, description: 'EC2 instance type' },
          { id: 'minInstances', name: 'Min Instances', type: 'number', defaultValue: 1, required: false, description: 'Minimum number of instances' },
          { id: 'maxInstances', name: 'Max Instances', type: 'number', defaultValue: 4, required: false, description: 'Maximum number of instances' }
        ]
      },
      version: '1.0.0',
      tags: ['aws', 'beanstalk', 'paas', 'application'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },

    // Container Services
    {
      id: 'aws-ecs',
      name: 'ECS Service',
      description: 'Elastic Container Service',
      category: ComponentCategory.CONTAINERS,
      subcategory: ComponentSubcategory.ORCHESTRATION,
      providerMappings: {
        aws: {
          name: 'ECS Service',
          description: 'Amazon Elastic Container Service',
          iconPath: '/assets/provider-icons/aws/containers/Res_Amazon-Elastic-Container-Service_Service_48.svg',
          iconType: 'svg',
          serviceUrl: 'https://aws.amazon.com/ecs/',
          documentationUrl: 'https://docs.aws.amazon.com/ecs/',
          tags: ['ecs', 'containers', 'orchestration'],
          metadata: { 
            launchTypes: ['EC2', 'Fargate'],
            networkModes: ['awsvpc', 'bridge', 'host'],
            supportedPlatforms: ['Linux', 'Windows']
          }
        },
        generic: {
          name: 'Container Service',
          description: 'Generic container orchestration service',
          iconPath: '/assets/provider-icons/generic/containers.svg',
          iconType: 'svg',
          tags: ['containers', 'orchestration'],
          metadata: {}
        }
      },
      config: {
        defaultSize: { width: 120, height: 80 },
        minSize: { width: 90, height: 60 },
        maxSize: { width: 180, height: 120 },
        isContainer: false,
        canContainTypes: [],
        canBeContainedBy: [ComponentCategory.NETWORK],
        connectionPoints: [
          { id: 'load-balancer', name: 'Load Balancer', type: 'input', position: { x: 0.5, y: 0 } },
          { id: 'database', name: 'Database', type: 'output', position: { x: 0.5, y: 1 } }
        ],
        allowedConnections: [ComponentCategory.NETWORK, ComponentCategory.DATABASE, ComponentCategory.STORAGE],
        validationRules: [
          { id: 'launch-type-required', name: 'Launch Type Required', type: 'required', condition: '$.launchType', message: 'Launch type is required', severity: 'error' },
          { id: 'task-definition-required', name: 'Task Definition Required', type: 'required', condition: '$.taskDefinition', message: 'Task definition is required', severity: 'error' }
        ],
        customProperties: [
          { id: 'launchType', name: 'Launch Type', type: 'select', defaultValue: 'FARGATE', required: true, description: 'ECS launch type', options: [
            { value: 'FARGATE', label: 'Fargate' },
            { value: 'EC2', label: 'EC2' }
          ]},
          { id: 'taskDefinition', name: 'Task Definition', type: 'string', defaultValue: 'my-task', required: true, description: 'ECS task definition' },
          { id: 'desiredCount', name: 'Desired Count', type: 'number', defaultValue: 1, required: false, description: 'Number of desired tasks' },
          { id: 'cpu', name: 'CPU', type: 'number', defaultValue: 256, required: false, description: 'CPU units' },
          { id: 'memory', name: 'Memory', type: 'number', defaultValue: 512, required: false, description: 'Memory in MB' }
        ]
      },
      version: '1.0.0',
      tags: ['aws', 'ecs', 'containers', 'orchestration'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },

    {
      id: 'aws-ecr',
      name: 'ECR Repository',
      description: 'Elastic Container Registry',
      category: ComponentCategory.CONTAINERS,
      subcategory: ComponentSubcategory.REGISTRY,
      providerMappings: {
        aws: {
          name: 'ECR Repository',
          description: 'Amazon Elastic Container Registry',
          iconPath: '/assets/provider-icons/aws/containers/Res_Amazon-Elastic-Container-Registry_Registry_48.svg',
          iconType: 'svg',
          serviceUrl: 'https://aws.amazon.com/ecr/',
          documentationUrl: 'https://docs.aws.amazon.com/ecr/',
          tags: ['ecr', 'containers', 'registry'],
          metadata: { 
            encryption: true,
            imageScanning: true,
            lifecyclePolicies: true
          }
        },
        generic: {
          name: 'Container Registry',
          description: 'Generic container registry',
          iconPath: '/assets/provider-icons/generic/container-registry.svg',
          iconType: 'svg',
          tags: ['containers', 'registry'],
          metadata: {}
        }
      },
      config: {
        defaultSize: { width: 100, height: 70 },
        minSize: { width: 80, height: 50 },
        maxSize: { width: 150, height: 100 },
        isContainer: false,
        canContainTypes: [],
        canBeContainedBy: [ComponentCategory.NETWORK],
        connectionPoints: [
          { id: 'push', name: 'Push', type: 'input', position: { x: 0, y: 0.5 } },
          { id: 'pull', name: 'Pull', type: 'output', position: { x: 1, y: 0.5 } }
        ],
        allowedConnections: [ComponentCategory.CONTAINERS, ComponentCategory.DEVOPS],
        validationRules: [
          { id: 'repository-name-required', name: 'Repository Name Required', type: 'required', condition: '$.repositoryName', message: 'Repository name is required', severity: 'error' }
        ],
        customProperties: [
          { id: 'repositoryName', name: 'Repository Name', type: 'string', defaultValue: 'my-app', required: true, description: 'ECR repository name' },
          { id: 'imageTagMutability', name: 'Image Tag Mutability', type: 'select', defaultValue: 'MUTABLE', required: false, description: 'Image tag mutability', options: [
            { value: 'MUTABLE', label: 'Mutable' },
            { value: 'IMMUTABLE', label: 'Immutable' }
          ]},
          { id: 'scanOnPush', name: 'Scan on Push', type: 'boolean', defaultValue: true, required: false, description: 'Enable image scanning on push' }
        ]
      },
      version: '1.0.0',
      tags: ['aws', 'ecr', 'containers', 'registry'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },

    // Database Services
    {
      id: 'aws-dynamodb',
      name: 'DynamoDB',
      description: 'NoSQL database service',
      category: ComponentCategory.DATABASE,
      subcategory: ComponentSubcategory.NOSQL,
      providerMappings: {
        aws: {
          name: 'DynamoDB',
          description: 'Amazon DynamoDB NoSQL database',
          iconPath: '/assets/provider-icons/aws/database/Res_Amazon-DynamoDB_Table_48.svg',
          iconType: 'svg',
          serviceUrl: 'https://aws.amazon.com/dynamodb/',
          documentationUrl: 'https://docs.aws.amazon.com/dynamodb/',
          tags: ['dynamodb', 'nosql', 'database'],
          metadata: { 
            billingModes: ['ON_DEMAND', 'PROVISIONED'],
            pointInTimeRecovery: true,
            encryption: true
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
        defaultSize: { width: 120, height: 80 },
        minSize: { width: 90, height: 60 },
        maxSize: { width: 180, height: 120 },
        isContainer: false,
        canContainTypes: [],
        canBeContainedBy: [ComponentCategory.NETWORK],
        connectionPoints: [
          { id: 'app', name: 'Application', type: 'input', position: { x: 0.5, y: 0 } },
          { id: 'stream', name: 'Stream', type: 'output', position: { x: 1, y: 0.5 } }
        ],
        allowedConnections: [ComponentCategory.COMPUTE, ComponentCategory.SERVERLESS, ComponentCategory.CONTAINERS],
        validationRules: [
          { id: 'table-name-required', name: 'Table Name Required', type: 'required', condition: '$.tableName', message: 'Table name is required', severity: 'error' },
          { id: 'partition-key-required', name: 'Partition Key Required', type: 'required', condition: '$.partitionKey', message: 'Partition key is required', severity: 'error' }
        ],
        customProperties: [
          { id: 'tableName', name: 'Table Name', type: 'string', defaultValue: 'my-table', required: true, description: 'DynamoDB table name' },
          { id: 'partitionKey', name: 'Partition Key', type: 'string', defaultValue: 'id', required: true, description: 'Primary partition key' },
          { id: 'sortKey', name: 'Sort Key', type: 'string', defaultValue: '', required: false, description: 'Sort key (optional)' },
          { id: 'billingMode', name: 'Billing Mode', type: 'select', defaultValue: 'PAY_PER_REQUEST', required: false, description: 'Billing mode', options: [
            { value: 'PAY_PER_REQUEST', label: 'On-Demand' },
            { value: 'PROVISIONED', label: 'Provisioned' }
          ]},
          { id: 'pointInTimeRecovery', name: 'Point-in-Time Recovery', type: 'boolean', defaultValue: false, required: false, description: 'Enable point-in-time recovery' }
        ]
      },
      version: '1.0.0',
      tags: ['aws', 'dynamodb', 'nosql', 'database'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },

    {
      id: 'aws-elasticache',
      name: 'ElastiCache',
      description: 'In-memory caching service',
      category: ComponentCategory.DATABASE,
      subcategory: ComponentSubcategory.CACHE,
      providerMappings: {
        aws: {
          name: 'ElastiCache',
          description: 'Amazon ElastiCache',
          iconPath: '/assets/provider-icons/aws/database/Res_Amazon-ElastiCache_ElastiCache-for-Redis_48.svg',
          iconType: 'svg',
          serviceUrl: 'https://aws.amazon.com/elasticache/',
          documentationUrl: 'https://docs.aws.amazon.com/elasticache/',
          tags: ['elasticache', 'cache', 'redis', 'memcached'],
          metadata: { 
            engines: ['Redis', 'Memcached'],
            clusterMode: true,
            backup: true
          }
        },
        generic: {
          name: 'Cache',
          description: 'Generic caching service',
          iconPath: '/assets/provider-icons/generic/cache.svg',
          iconType: 'svg',
          tags: ['cache', 'memory'],
          metadata: {}
        }
      },
      config: {
        defaultSize: { width: 110, height: 70 },
        minSize: { width: 80, height: 50 },
        maxSize: { width: 160, height: 100 },
        isContainer: false,
        canContainTypes: [],
        canBeContainedBy: [ComponentCategory.NETWORK],
        connectionPoints: [
          { id: 'app', name: 'Application', type: 'input', position: { x: 0.5, y: 0 } }
        ],
        allowedConnections: [ComponentCategory.COMPUTE, ComponentCategory.SERVERLESS, ComponentCategory.CONTAINERS],
        validationRules: [
          { id: 'engine-required', name: 'Engine Required', type: 'required', condition: '$.engine', message: 'Cache engine is required', severity: 'error' },
          { id: 'node-type-required', name: 'Node Type Required', type: 'required', condition: '$.nodeType', message: 'Node type is required', severity: 'error' }
        ],
        customProperties: [
          { id: 'engine', name: 'Engine', type: 'select', defaultValue: 'redis', required: true, description: 'Cache engine', options: [
            { value: 'redis', label: 'Redis' },
            { value: 'memcached', label: 'Memcached' }
          ]},
          { id: 'nodeType', name: 'Node Type', type: 'string', defaultValue: 'cache.t3.micro', required: true, description: 'ElastiCache node type' },
          { id: 'numCacheNodes', name: 'Number of Nodes', type: 'number', defaultValue: 1, required: false, description: 'Number of cache nodes' },
          { id: 'port', name: 'Port', type: 'number', defaultValue: 6379, required: false, description: 'Cache port' }
        ]
      },
      version: '1.0.0',
      tags: ['aws', 'elasticache', 'cache', 'redis', 'memcached'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },

    // Network Services
    {
      id: 'aws-alb',
      name: 'Application Load Balancer',
      description: 'Layer 7 load balancer',
      category: ComponentCategory.NETWORK,
      subcategory: ComponentSubcategory.LOAD_BALANCER,
      providerMappings: {
        aws: {
          name: 'Application Load Balancer',
          description: 'AWS Application Load Balancer',
          iconPath: '/assets/provider-icons/aws/network/Res_Elastic-Load-Balancing_Application-Load-Balancer_48.svg',
          iconType: 'svg',
          serviceUrl: 'https://aws.amazon.com/elasticloadbalancing/',
          documentationUrl: 'https://docs.aws.amazon.com/elasticloadbalancing/',
          tags: ['alb', 'load-balancer', 'layer7'],
          metadata: { 
            targetTypes: ['instance', 'ip', 'lambda'],
            protocols: ['HTTP', 'HTTPS'],
            sticky: true
          }
        },
        generic: {
          name: 'Load Balancer',
          description: 'Generic load balancer',
          iconPath: '/assets/provider-icons/generic/load-balancer.svg',
          iconType: 'svg',
          tags: ['load-balancer', 'network'],
          metadata: {}
        }
      },
      config: {
        defaultSize: { width: 120, height: 60 },
        minSize: { width: 90, height: 45 },
        maxSize: { width: 180, height: 90 },
        isContainer: false,
        canContainTypes: [],
        canBeContainedBy: [ComponentCategory.NETWORK],
        connectionPoints: [
          { id: 'internet', name: 'Internet', type: 'input', position: { x: 0.5, y: 0 } },
          { id: 'target', name: 'Target', type: 'output', position: { x: 0.5, y: 1 } }
        ],
        allowedConnections: [ComponentCategory.COMPUTE, ComponentCategory.CONTAINERS, ComponentCategory.SERVERLESS],
        validationRules: [
          { id: 'name-required', name: 'Name Required', type: 'required', condition: '$.name', message: 'Load balancer name is required', severity: 'error' }
        ],
        customProperties: [
          { id: 'name', name: 'Name', type: 'string', defaultValue: 'my-alb', required: true, description: 'Load balancer name' },
          { id: 'scheme', name: 'Scheme', type: 'select', defaultValue: 'internet-facing', required: false, description: 'Load balancer scheme', options: [
            { value: 'internet-facing', label: 'Internet-facing' },
            { value: 'internal', label: 'Internal' }
          ]},
          { id: 'ipAddressType', name: 'IP Address Type', type: 'select', defaultValue: 'ipv4', required: false, description: 'IP address type', options: [
            { value: 'ipv4', label: 'IPv4' },
            { value: 'dualstack', label: 'Dual Stack' }
          ]},
          { id: 'enableDeletionProtection', name: 'Deletion Protection', type: 'boolean', defaultValue: false, required: false, description: 'Enable deletion protection' }
        ]
      },
      version: '1.0.0',
      tags: ['aws', 'alb', 'load-balancer', 'network'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },

    {
      id: 'aws-cloudfront',
      name: 'CloudFront',
      description: 'Content Delivery Network',
      category: ComponentCategory.NETWORK,
      subcategory: ComponentSubcategory.CDN,
      providerMappings: {
        aws: {
          name: 'CloudFront',
          description: 'Amazon CloudFront CDN',
          iconPath: '/assets/provider-icons/aws/network/Res_Amazon-CloudFront_Download-Distribution_48.svg',
          iconType: 'svg',
          serviceUrl: 'https://aws.amazon.com/cloudfront/',
          documentationUrl: 'https://docs.aws.amazon.com/cloudfront/',
          tags: ['cloudfront', 'cdn', 'distribution'],
          metadata: { 
            edgeLocations: 400,
            protocols: ['HTTP', 'HTTPS'],
            geoRestriction: true
          }
        },
        generic: {
          name: 'CDN',
          description: 'Generic Content Delivery Network',
          iconPath: '/assets/provider-icons/generic/cdn.svg',
          iconType: 'svg',
          tags: ['cdn', 'network'],
          metadata: {}
        }
      },
      config: {
        defaultSize: { width: 120, height: 60 },
        minSize: { width: 90, height: 45 },
        maxSize: { width: 180, height: 90 },
        isContainer: false,
        canContainTypes: [],
        canBeContainedBy: [ComponentCategory.NETWORK],
        connectionPoints: [
          { id: 'user', name: 'User', type: 'input', position: { x: 0.5, y: 0 } },
          { id: 'origin', name: 'Origin', type: 'output', position: { x: 0.5, y: 1 } }
        ],
        allowedConnections: [ComponentCategory.STORAGE, ComponentCategory.COMPUTE, ComponentCategory.NETWORK],
        validationRules: [
          { id: 'origin-required', name: 'Origin Required', type: 'required', condition: '$.origin', message: 'Origin is required', severity: 'error' }
        ],
        customProperties: [
          { id: 'origin', name: 'Origin', type: 'string', defaultValue: 'example.com', required: true, description: 'Origin domain name' },
          { id: 'priceClass', name: 'Price Class', type: 'select', defaultValue: 'PriceClass_All', required: false, description: 'Price class', options: [
            { value: 'PriceClass_100', label: 'Use Only US, Canada and Europe' },
            { value: 'PriceClass_200', label: 'Use Only US, Canada, Europe, Asia, Middle East and Africa' },
            { value: 'PriceClass_All', label: 'Use All Edge Locations' }
          ]},
          { id: 'enabled', name: 'Enabled', type: 'boolean', defaultValue: true, required: false, description: 'Enable distribution' },
          { id: 'compress', name: 'Compress Objects', type: 'boolean', defaultValue: true, required: false, description: 'Compress objects automatically' }
        ]
      },
      version: '1.0.0',
      tags: ['aws', 'cloudfront', 'cdn', 'network'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },

    {
      id: 'aws-api-gateway',
      name: 'API Gateway',
      description: 'Managed API gateway service',
      category: ComponentCategory.API_GATEWAY,
      providerMappings: {
        aws: {
          name: 'API Gateway',
          description: 'Amazon API Gateway',
          iconPath: '/assets/provider-icons/aws/network/Res_Amazon-API-Gateway_Endpoint_48.svg',
          iconType: 'svg',
          serviceUrl: 'https://aws.amazon.com/api-gateway/',
          documentationUrl: 'https://docs.aws.amazon.com/apigateway/',
          tags: ['api-gateway', 'api', 'rest'],
          metadata: { 
            apiTypes: ['REST', 'HTTP', 'WebSocket'],
            authentication: ['AWS_IAM', 'COGNITO_USER_POOLS', 'CUSTOM'],
            throttling: true
          }
        },
        generic: {
          name: 'API Gateway',
          description: 'Generic API gateway',
          iconPath: '/assets/provider-icons/generic/api-gateway.svg',
          iconType: 'svg',
          tags: ['api-gateway', 'api'],
          metadata: {}
        }
      },
      config: {
        defaultSize: { width: 120, height: 60 },
        minSize: { width: 90, height: 45 },
        maxSize: { width: 180, height: 90 },
        isContainer: false,
        canContainTypes: [],
        canBeContainedBy: [ComponentCategory.NETWORK],
        connectionPoints: [
          { id: 'client', name: 'Client', type: 'input', position: { x: 0, y: 0.5 } },
          { id: 'backend', name: 'Backend', type: 'output', position: { x: 1, y: 0.5 } }
        ],
        allowedConnections: [ComponentCategory.SERVERLESS, ComponentCategory.COMPUTE, ComponentCategory.CONTAINERS],
        validationRules: [
          { id: 'api-name-required', name: 'API Name Required', type: 'required', condition: '$.name', message: 'API name is required', severity: 'error' },
          { id: 'api-type-required', name: 'API Type Required', type: 'required', condition: '$.apiType', message: 'API type is required', severity: 'error' }
        ],
        customProperties: [
          { id: 'name', name: 'API Name', type: 'string', defaultValue: 'my-api', required: true, description: 'API Gateway name' },
          { id: 'apiType', name: 'API Type', type: 'select', defaultValue: 'REST', required: true, description: 'API type', options: [
            { value: 'REST', label: 'REST API' },
            { value: 'HTTP', label: 'HTTP API' },
            { value: 'WEBSOCKET', label: 'WebSocket API' }
          ]},
          { id: 'stage', name: 'Stage', type: 'string', defaultValue: 'prod', required: false, description: 'Deployment stage' },
          { id: 'throttling', name: 'Enable Throttling', type: 'boolean', defaultValue: true, required: false, description: 'Enable request throttling' }
        ]
      },
      version: '1.0.0',
      tags: ['aws', 'api-gateway', 'api', 'rest'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },

    // Storage Services
    {
      id: 'aws-ebs',
      name: 'EBS Volume',
      description: 'Elastic Block Store volume',
      category: ComponentCategory.STORAGE,
      subcategory: ComponentSubcategory.BLOCK_STORAGE,
      providerMappings: {
        aws: {
          name: 'EBS Volume',
          description: 'Amazon Elastic Block Store Volume',
          iconPath: '/assets/provider-icons/aws/storage/Res_Amazon-Elastic-Block-Store_Volume_48.svg',
          iconType: 'svg',
          serviceUrl: 'https://aws.amazon.com/ebs/',
          documentationUrl: 'https://docs.aws.amazon.com/ebs/',
          tags: ['ebs', 'storage', 'block'],
          metadata: { 
            volumeTypes: ['gp3', 'gp2', 'io1', 'io2', 'st1', 'sc1'],
            encryption: true,
            snapshots: true
          }
        },
        generic: {
          name: 'Block Storage',
          description: 'Generic block storage',
          iconPath: '/assets/provider-icons/generic/block-storage.svg',
          iconType: 'svg',
          tags: ['storage', 'block'],
          metadata: {}
        }
      },
      config: {
        defaultSize: { width: 100, height: 60 },
        minSize: { width: 80, height: 45 },
        maxSize: { width: 150, height: 90 },
        isContainer: false,
        canContainTypes: [],
        canBeContainedBy: [ComponentCategory.NETWORK],
        connectionPoints: [
          { id: 'instance', name: 'Instance', type: 'input', position: { x: 0.5, y: 0 } }
        ],
        allowedConnections: [ComponentCategory.COMPUTE],
        validationRules: [
          { id: 'size-required', name: 'Size Required', type: 'required', condition: '$.size', message: 'Volume size is required', severity: 'error' },
          { id: 'volume-type-required', name: 'Volume Type Required', type: 'required', condition: '$.volumeType', message: 'Volume type is required', severity: 'error' }
        ],
        customProperties: [
          { id: 'size', name: 'Size (GB)', type: 'number', defaultValue: 8, required: true, description: 'Volume size in GB' },
          { id: 'volumeType', name: 'Volume Type', type: 'select', defaultValue: 'gp3', required: true, description: 'EBS volume type', options: [
            { value: 'gp3', label: 'General Purpose SSD (gp3)' },
            { value: 'gp2', label: 'General Purpose SSD (gp2)' },
            { value: 'io1', label: 'Provisioned IOPS SSD (io1)' },
            { value: 'io2', label: 'Provisioned IOPS SSD (io2)' },
            { value: 'st1', label: 'Throughput Optimized HDD (st1)' },
            { value: 'sc1', label: 'Cold HDD (sc1)' }
          ]},
          { id: 'encrypted', name: 'Encrypted', type: 'boolean', defaultValue: true, required: false, description: 'Enable encryption' },
          { id: 'iops', name: 'IOPS', type: 'number', defaultValue: 3000, required: false, description: 'IOPS (for io1/io2/gp3)' }
        ]
      },
      version: '1.0.0',
      tags: ['aws', 'ebs', 'storage', 'block'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },

    {
      id: 'aws-efs',
      name: 'EFS File System',
      description: 'Elastic File System',
      category: ComponentCategory.STORAGE,
      subcategory: ComponentSubcategory.FILE_STORAGE,
      providerMappings: {
        aws: {
          name: 'EFS File System',
          description: 'Amazon Elastic File System',
          iconPath: '/assets/provider-icons/aws/storage/Res_Amazon-Elastic-File-System_File-System_48.svg',
          iconType: 'svg',
          serviceUrl: 'https://aws.amazon.com/efs/',
          documentationUrl: 'https://docs.aws.amazon.com/efs/',
          tags: ['efs', 'storage', 'file'],
          metadata: { 
            performanceModes: ['generalPurpose', 'maxIO'],
            throughputModes: ['bursting', 'provisioned'],
            storageClasses: ['Standard', 'IA']
          }
        },
        generic: {
          name: 'File Storage',
          description: 'Generic file storage',
          iconPath: '/assets/provider-icons/generic/file-storage.svg',
          iconType: 'svg',
          tags: ['storage', 'file'],
          metadata: {}
        }
      },
      config: {
        defaultSize: { width: 100, height: 60 },
        minSize: { width: 80, height: 45 },
        maxSize: { width: 150, height: 90 },
        isContainer: false,
        canContainTypes: [],
        canBeContainedBy: [ComponentCategory.NETWORK],
        connectionPoints: [
          { id: 'mount', name: 'Mount', type: 'input', position: { x: 0.5, y: 0 } }
        ],
        allowedConnections: [ComponentCategory.COMPUTE, ComponentCategory.CONTAINERS],
        validationRules: [
          { id: 'performance-mode-required', name: 'Performance Mode Required', type: 'required', condition: '$.performanceMode', message: 'Performance mode is required', severity: 'error' }
        ],
        customProperties: [
          { id: 'performanceMode', name: 'Performance Mode', type: 'select', defaultValue: 'generalPurpose', required: true, description: 'Performance mode', options: [
            { value: 'generalPurpose', label: 'General Purpose' },
            { value: 'maxIO', label: 'Max I/O' }
          ]},
          { id: 'throughputMode', name: 'Throughput Mode', type: 'select', defaultValue: 'bursting', required: false, description: 'Throughput mode', options: [
            { value: 'bursting', label: 'Bursting' },
            { value: 'provisioned', label: 'Provisioned' }
          ]},
          { id: 'encrypted', name: 'Encrypted', type: 'boolean', defaultValue: true, required: false, description: 'Enable encryption' },
          { id: 'lifecyclePolicy', name: 'Lifecycle Policy', type: 'select', defaultValue: 'AFTER_30_DAYS', required: false, description: 'Transition to IA', options: [
            { value: 'AFTER_7_DAYS', label: 'After 7 days' },
            { value: 'AFTER_14_DAYS', label: 'After 14 days' },
            { value: 'AFTER_30_DAYS', label: 'After 30 days' },
            { value: 'AFTER_60_DAYS', label: 'After 60 days' },
            { value: 'AFTER_90_DAYS', label: 'After 90 days' }
          ]}
        ]
      },
      version: '1.0.0',
      tags: ['aws', 'efs', 'storage', 'file'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ];
}