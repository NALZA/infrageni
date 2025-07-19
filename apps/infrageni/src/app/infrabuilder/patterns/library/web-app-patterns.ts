/**
 * Web Application Pattern Library
 * Common web application architecture patterns and templates
 */

import {
  InfrastructurePattern,
  PatternCategory,
  PatternComplexity,
  PatternStatus,
  ComponentReference,
  ComponentRelationship,
  RelationshipType,
  PatternTemplate,
  PatternParameter
} from '../core/pattern-types';

/**
 * Simple 3-Tier Web Application Pattern
 * Web Server + Application Server + Database
 */
export function createSimple3TierWebAppPattern(): InfrastructurePattern {
  const components: ComponentReference[] = [
    {
      componentId: 'generic-vpc',
      instanceId: 'main-vpc',
      displayName: 'Main VPC',
      position: { x: 50, y: 50 },
      configuration: {
        cidrBlock: '10.0.0.0/16',
        enableDnsHostnames: true
      },
      required: true,
      dependencies: [],
      metadata: {
        description: 'Main virtual private cloud for the application'
      }
    },
    {
      componentId: 'generic-subnet',
      instanceId: 'public-subnet',
      displayName: 'Public Subnet',
      position: { x: 100, y: 150 },
      configuration: {
        cidrBlock: '10.0.1.0/24',
        isPublic: true
      },
      required: true,
      dependencies: ['main-vpc'],
      metadata: {
        description: 'Public subnet for load balancer and web tier'
      }
    },
    {
      componentId: 'generic-subnet',
      instanceId: 'private-subnet',
      displayName: 'Private Subnet',
      position: { x: 300, y: 150 },
      configuration: {
        cidrBlock: '10.0.2.0/24',
        isPublic: false
      },
      required: true,
      dependencies: ['main-vpc'],
      metadata: {
        description: 'Private subnet for application and database tiers'
      }
    },
    {
      componentId: 'generic-compute',
      instanceId: 'web-server',
      displayName: 'Web Server',
      position: { x: 150, y: 250 },
      configuration: {
        instanceType: 't3.medium',
        operatingSystem: 'linux'
      },
      required: true,
      dependencies: ['public-subnet'],
      metadata: {
        description: 'Web server hosting the frontend application'
      }
    },
    {
      componentId: 'generic-compute',
      instanceId: 'app-server',
      displayName: 'Application Server',
      position: { x: 350, y: 250 },
      configuration: {
        instanceType: 't3.large',
        operatingSystem: 'linux'
      },
      required: true,
      dependencies: ['private-subnet'],
      metadata: {
        description: 'Application server running business logic'
      }
    },
    {
      componentId: 'generic-database',
      instanceId: 'database',
      displayName: 'Database',
      position: { x: 550, y: 250 },
      configuration: {
        engine: 'mysql',
        version: '8.0',
        instanceClass: 'db.t3.micro',
        multiAz: false
      },
      required: true,
      dependencies: ['private-subnet'],
      metadata: {
        description: 'Primary database for application data'
      }
    }
  ];

  const relationships: ComponentRelationship[] = [
    {
      id: 'vpc-public-subnet',
      fromInstanceId: 'main-vpc',
      toInstanceId: 'public-subnet',
      relationshipType: RelationshipType.CONTAINMENT,
      configuration: {
        bidirectional: false,
        protocols: ['tcp'],
        security: {
          encryption: true,
          authentication: ['iam'],
          authorization: ['security-groups'],
          compliance: []
        }
      },
      metadata: {
        description: 'VPC contains public subnet'
      }
    },
    {
      id: 'vpc-private-subnet',
      fromInstanceId: 'main-vpc',
      toInstanceId: 'private-subnet',
      relationshipType: RelationshipType.CONTAINMENT,
      configuration: {
        bidirectional: false,
        protocols: ['tcp'],
        security: {
          encryption: true,
          authentication: ['iam'],
          authorization: ['security-groups'],
          compliance: []
        }
      },
      metadata: {
        description: 'VPC contains private subnet'
      }
    },
    {
      id: 'web-app-connection',
      fromInstanceId: 'web-server',
      toInstanceId: 'app-server',
      relationshipType: RelationshipType.NETWORK_CONNECTION,
      configuration: {
        bidirectional: true,
        protocols: ['http', 'https'],
        ports: [80, 443, 8080],
        security: {
          encryption: true,
          authentication: ['api-key'],
          authorization: ['rbac'],
          compliance: []
        }
      },
      metadata: {
        description: 'Web server communicates with application server',
        protocols: ['HTTP/HTTPS']
      }
    },
    {
      id: 'app-db-connection',
      fromInstanceId: 'app-server',
      toInstanceId: 'database',
      relationshipType: RelationshipType.DATA_FLOW,
      configuration: {
        bidirectional: true,
        protocols: ['mysql'],
        ports: [3306],
        security: {
          encryption: true,
          authentication: ['username-password', 'iam'],
          authorization: ['database-roles'],
          compliance: []
        }
      },
      metadata: {
        description: 'Application server connects to database',
        protocols: ['MySQL']
      }
    }
  ];

  return {
    id: 'simple-3tier-webapp',
    name: 'Simple 3-Tier Web Application',
    description: 'A basic 3-tier web application architecture with web server, application server, and database',
    version: '1.0.0',
    category: PatternCategory.WEB_APPLICATIONS,
    complexity: PatternComplexity.BEGINNER,
    status: PatternStatus.PUBLISHED,
    components,
    relationships,
    parameters: [
      {
        id: 'instance_size',
        name: 'Instance Size',
        description: 'Size of compute instances',
        type: 'select',
        required: false,
        defaultValue: 'small',
        options: [
          { value: 'small', label: 'Small (t3.micro)' },
          { value: 'medium', label: 'Medium (t3.medium)' },
          { value: 'large', label: 'Large (t3.large)' }
        ],
        affects: ['web-server', 'app-server']
      },
      {
        id: 'database_engine',
        name: 'Database Engine',
        description: 'Database engine to use',
        type: 'select',
        required: false,
        defaultValue: 'mysql',
        options: [
          { value: 'mysql', label: 'MySQL' },
          { value: 'postgresql', label: 'PostgreSQL' },
          { value: 'oracle', label: 'Oracle' }
        ],
        affects: ['database']
      }
    ],
    preview: {
      thumbnail: '',
      description: 'Simple 3-tier architecture for web applications',
      features: [
        'Load balancer in public subnet',
        'Application servers in private subnet',
        'Managed database with backup',
        'Network isolation and security groups'
      ],
      benefits: [
        'Clear separation of concerns',
        'Scalable architecture',
        'Security best practices',
        'Cost-effective for small to medium applications'
      ],
      useCases: [
        'Corporate websites',
        'E-commerce platforms',
        'Content management systems',
        'Small business applications'
      ]
    },
    documentation: {
      overview: 'This pattern implements a classic 3-tier web application architecture with clear separation between presentation, application logic, and data layers.',
      architecture: {
        description: 'Three-tier architecture with web, application, and data layers',
        components: [
          {
            instanceId: 'web-server',
            purpose: 'Serves static content and handles user requests',
            configuration: 'Configured with web server software (nginx, apache)',
            alternatives: ['CDN + Static hosting', 'Load balancer + multiple instances']
          },
          {
            instanceId: 'app-server',
            purpose: 'Executes business logic and processes requests',
            configuration: 'Application runtime environment',
            alternatives: ['Serverless functions', 'Container orchestration']
          },
          {
            instanceId: 'database',
            purpose: 'Stores and manages application data',
            configuration: 'Relational database with backups',
            alternatives: ['NoSQL database', 'Database cluster', 'Database as a service']
          }
        ],
        dataFlow: 'User requests flow from web server to application server to database',
        keyDecisions: [
          {
            decision: 'Use separate subnets for public and private resources',
            rationale: 'Improves security by isolating backend components',
            alternatives: ['Single subnet', 'Multiple availability zones'],
            tradeoffs: ['Increased complexity', 'Better security isolation']
          }
        ]
      },
      deployment: {
        prerequisites: [
          'Cloud provider account',
          'Appropriate permissions',
          'SSH key pair for instance access'
        ],
        steps: [
          {
            title: 'Create VPC and subnets',
            description: 'Set up network infrastructure',
            commands: ['terraform init', 'terraform plan', 'terraform apply'],
            expectedOutput: 'VPC and subnets created successfully'
          },
          {
            title: 'Launch compute instances',
            description: 'Deploy web and application servers',
            commands: ['deploy-instances.sh'],
            expectedOutput: 'Instances running and accessible'
          },
          {
            title: 'Configure database',
            description: 'Set up database instance and initial schema',
            commands: ['setup-database.sh'],
            expectedOutput: 'Database accessible from application server'
          }
        ],
        verification: [
          'Test web server response',
          'Verify application server connectivity',
          'Confirm database connection'
        ],
        rollback: [
          'Stop application traffic',
          'Backup current state',
          'Restore previous configuration'
        ]
      },
      configuration: {
        parameters: [],
        environments: [
          {
            name: 'development',
            description: 'Development environment with minimal resources',
            parameters: {
              instance_size: 'small',
              database_engine: 'mysql'
            },
            notes: ['Single instance deployment', 'Development database']
          },
          {
            name: 'production',
            description: 'Production environment with high availability',
            parameters: {
              instance_size: 'large',
              database_engine: 'mysql'
            },
            notes: ['Multi-AZ deployment', 'Production-grade database']
          }
        ],
        secrets: [
          {
            name: 'database_password',
            description: 'Database admin password',
            required: true
          },
          {
            name: 'api_keys',
            description: 'Third-party API keys',
            required: false
          }
        ],
        customization: []
      },
      security: {
        overview: 'Security implemented through network isolation, access controls, and encryption',
        threats: [
          {
            threat: 'Direct database access',
            impact: 'high',
            likelihood: 'medium',
            mitigation: ['Private subnet placement', 'Security groups', 'Database authentication']
          }
        ],
        controls: [
          {
            control: 'Network segmentation',
            description: 'Separate public and private subnets',
            implementation: 'VPC with public/private subnet configuration',
            components: ['main-vpc', 'public-subnet', 'private-subnet']
          }
        ],
        compliance: [],
        bestPractices: [
          'Use strong authentication',
          'Enable encryption at rest and in transit',
          'Regular security updates',
          'Monitor access logs'
        ]
      },
      monitoring: {
        overview: 'Basic monitoring for application health and performance',
        metrics: [
          {
            name: 'CPU Utilization',
            description: 'Server CPU usage',
            source: 'CloudWatch',
            threshold: '< 80%',
            actions: ['Scale up instances']
          }
        ],
        alerts: [
          {
            name: 'High CPU',
            condition: 'CPU > 80% for 5 minutes',
            severity: 'warning',
            response: ['Investigate load', 'Consider scaling']
          }
        ],
        dashboards: [
          {
            name: 'Application Overview',
            description: 'Key application metrics',
            metrics: ['CPU', 'Memory', 'Network', 'Database connections']
          }
        ],
        logs: [
          {
            source: 'Application logs',
            format: 'JSON',
            retention: '30 days',
            analysis: ['Error tracking', 'Performance analysis']
          }
        ]
      },
      troubleshooting: {
        commonIssues: [
          {
            issue: 'Application server cannot connect to database',
            symptoms: ['Connection timeouts', 'Database errors in logs'],
            causes: ['Security group misconfiguration', 'Network ACL issues'],
            solutions: ['Check security groups', 'Verify subnet routing', 'Test connectivity']
          }
        ],
        diagnostics: [
          {
            scenario: 'High response times',
            steps: ['Check CPU and memory usage', 'Analyze database performance', 'Review network latency'],
            tools: ['CloudWatch', 'Database monitoring', 'Network analysis'],
            expectedResults: ['Identification of bottleneck', 'Performance metrics']
          }
        ],
        support: {
          contacts: ['System administrator', 'Development team'],
          resources: ['Architecture documentation', 'Runbooks'],
          escalation: ['Cloud provider support', 'Vendor support']
        }
      },
      references: [
        {
          title: '3-Tier Architecture Best Practices',
          type: 'documentation',
          url: 'https://example.com/3tier-best-practices',
          description: 'Best practices for 3-tier architectures',
          relevance: 'high'
        }
      ]
    },
    tags: ['web-application', '3-tier', 'beginner', 'mysql', 'compute'],
    author: 'InfraGeni Team',
    license: 'MIT',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    providers: ['aws', 'azure', 'gcp', 'generic'],
    requiredFeatures: ['vpc', 'compute', 'database'],
    changelog: [
      {
        version: '1.0.0',
        date: '2024-01-01',
        changes: ['Initial release of 3-tier web application pattern'],
        breaking: false
      }
    ],
    migrations: []
  };
}

/**
 * Template for generating customizable 3-tier web applications
 */
export function createSimple3TierWebAppTemplate(): PatternTemplate {
  return {
    id: 'simple-3tier-webapp-template',
    name: 'Simple 3-Tier Web Application Template',
    description: 'Customizable template for 3-tier web applications',
    category: PatternCategory.WEB_APPLICATIONS,
    complexity: PatternComplexity.BEGINNER,
    parameters: [
      {
        id: 'project_name',
        name: 'Project Name',
        description: 'Name of your project',
        type: 'string',
        required: true,
        defaultValue: 'my-webapp',
        affects: ['web-server', 'app-server', 'database']
      },
      {
        id: 'environment',
        name: 'Environment',
        description: 'Deployment environment',
        type: 'select',
        required: true,
        defaultValue: 'development',
        options: [
          { value: 'development', label: 'Development' },
          { value: 'staging', label: 'Staging' },
          { value: 'production', label: 'Production' }
        ],
        affects: ['web-server', 'app-server', 'database']
      },
      {
        id: 'instance_size',
        name: 'Instance Size',
        description: 'Size of compute instances',
        type: 'select',
        required: false,
        defaultValue: 'medium',
        options: [
          { value: 'small', label: 'Small (t3.micro)' },
          { value: 'medium', label: 'Medium (t3.medium)' },
          { value: 'large', label: 'Large (t3.large)' }
        ],
        affects: ['web-server', 'app-server']
      },
      {
        id: 'database_engine',
        name: 'Database Engine',
        description: 'Database engine to use',
        type: 'select',
        required: false,
        defaultValue: 'mysql',
        options: [
          { value: 'mysql', label: 'MySQL' },
          { value: 'postgresql', label: 'PostgreSQL' }
        ],
        affects: ['database']
      },
      {
        id: 'enable_monitoring',
        name: 'Enable Monitoring',
        description: 'Add monitoring and logging components',
        type: 'boolean',
        required: false,
        defaultValue: true,
        affects: ['monitoring-stack']
      }
    ],
    componentTemplates: [
      {
        instanceId: '{{project_name}}-vpc',
        componentId: 'generic-vpc',
        displayName: '{{project_name}} VPC',
        position: { x: 50, y: 50 },
        configuration: {
          cidrBlock: '10.0.0.0/16',
          enableDnsHostnames: true
        },
        required: true,
        dependencies: []
      },
      {
        instanceId: '{{project_name}}-public-subnet',
        componentId: 'generic-subnet',
        displayName: '{{project_name}} Public Subnet',
        position: { x: 100, y: 150 },
        configuration: {
          cidrBlock: '10.0.1.0/24',
          isPublic: true
        },
        required: true,
        dependencies: ['{{project_name}}-vpc']
      },
      {
        instanceId: '{{project_name}}-private-subnet',
        componentId: 'generic-subnet',
        displayName: '{{project_name}} Private Subnet',
        position: { x: 300, y: 150 },
        configuration: {
          cidrBlock: '10.0.2.0/24',
          isPublic: false
        },
        required: true,
        dependencies: ['{{project_name}}-vpc']
      },
      {
        instanceId: '{{project_name}}-web-server',
        componentId: 'generic-compute',
        displayName: '{{project_name}} Web Server',
        position: { x: 150, y: 250 },
        configuration: {
          instanceType: {
            type: 'conditional',
            condition: {
              type: 'equals',
              left: { type: 'parameter', name: 'instance_size' },
              right: 'small'
            },
            trueValue: 't3.micro',
            falseValue: {
              type: 'conditional',
              condition: {
                type: 'equals',
                left: { type: 'parameter', name: 'instance_size' },
                right: 'medium'
              },
              trueValue: 't3.medium',
              falseValue: 't3.large'
            }
          },
          operatingSystem: 'linux'
        },
        required: true,
        dependencies: ['{{project_name}}-public-subnet']
      },
      {
        instanceId: '{{project_name}}-app-server',
        componentId: 'generic-compute',
        displayName: '{{project_name}} App Server',
        position: { x: 350, y: 250 },
        configuration: {
          instanceType: {
            type: 'conditional',
            condition: {
              type: 'equals',
              left: { type: 'parameter', name: 'instance_size' },
              right: 'small'
            },
            trueValue: 't3.micro',
            falseValue: {
              type: 'conditional',
              condition: {
                type: 'equals',
                left: { type: 'parameter', name: 'instance_size' },
                right: 'medium'
              },
              trueValue: 't3.medium',
              falseValue: 't3.large'
            }
          },
          operatingSystem: 'linux'
        },
        required: true,
        dependencies: ['{{project_name}}-private-subnet']
      },
      {
        instanceId: '{{project_name}}-database',
        componentId: 'generic-database',
        displayName: '{{project_name}} Database',
        position: { x: 550, y: 250 },
        configuration: {
          engine: { type: 'parameter', name: 'database_engine' },
          version: {
            type: 'conditional',
            condition: {
              type: 'equals',
              left: { type: 'parameter', name: 'database_engine' },
              right: 'mysql'
            },
            trueValue: '8.0',
            falseValue: '13.0'
          },
          instanceClass: {
            type: 'conditional',
            condition: {
              type: 'equals',
              left: { type: 'parameter', name: 'environment' },
              right: 'production'
            },
            trueValue: 'db.t3.medium',
            falseValue: 'db.t3.micro'
          },
          multiAz: {
            type: 'conditional',
            condition: {
              type: 'equals',
              left: { type: 'parameter', name: 'environment' },
              right: 'production'
            },
            trueValue: true,
            falseValue: false
          }
        },
        required: true,
        dependencies: ['{{project_name}}-private-subnet']
      }
    ],
    relationshipTemplates: [
      {
        id: '{{project_name}}-vpc-public-subnet',
        fromInstanceId: '{{project_name}}-vpc',
        toInstanceId: '{{project_name}}-public-subnet',
        relationshipType: 'containment',
        configuration: {
          bidirectional: false,
          protocols: ['tcp']
        }
      },
      {
        id: '{{project_name}}-vpc-private-subnet',
        fromInstanceId: '{{project_name}}-vpc',
        toInstanceId: '{{project_name}}-private-subnet',
        relationshipType: 'containment',
        configuration: {
          bidirectional: false,
          protocols: ['tcp']
        }
      },
      {
        id: '{{project_name}}-web-app-connection',
        fromInstanceId: '{{project_name}}-web-server',
        toInstanceId: '{{project_name}}-app-server',
        relationshipType: 'network-connection',
        configuration: {
          bidirectional: true,
          protocols: ['http', 'https'],
          ports: [80, 443, 8080]
        }
      },
      {
        id: '{{project_name}}-app-db-connection',
        fromInstanceId: '{{project_name}}-app-server',
        toInstanceId: '{{project_name}}-database',
        relationshipType: 'data-flow',
        configuration: {
          bidirectional: true,
          protocols: [{ type: 'parameter', name: 'database_engine' }],
          ports: [
            {
              type: 'conditional',
              condition: {
                type: 'equals',
                left: { type: 'parameter', name: 'database_engine' },
                right: 'mysql'
              },
              trueValue: 3306,
              falseValue: 5432
            }
          ]
        }
      }
    ],
    conditionalLogic: [
      {
        condition: {
          type: 'equals',
          left: { type: 'parameter', name: 'enable_monitoring' },
          right: true
        },
        actions: [
          {
            type: 'add_component',
            target: 'monitoring',
            data: {
              instanceId: '{{project_name}}-monitoring',
              componentId: 'generic-monitoring',
              displayName: '{{project_name}} Monitoring',
              position: { x: 750, y: 150 },
              configuration: {
                retentionPeriod: '30d',
                alerting: true
              },
              required: false,
              dependencies: []
            }
          }
        ]
      }
    ],
    metadata: {
      author: 'InfraGeni Team',
      version: '1.0.0',
      created: '2024-01-01T00:00:00Z',
      updated: '2024-01-01T00:00:00Z',
      tags: ['web-application', '3-tier', 'template', 'customizable'],
      examples: [
        {
          name: 'Development Environment',
          description: 'Minimal setup for development',
          parameters: {
            project_name: 'dev-webapp',
            environment: 'development',
            instance_size: 'small',
            database_engine: 'mysql',
            enable_monitoring: false
          },
          expectedComponents: 6
        },
        {
          name: 'Production Environment',
          description: 'High-availability production setup',
          parameters: {
            project_name: 'prod-webapp',
            environment: 'production',
            instance_size: 'large',
            database_engine: 'postgresql',
            enable_monitoring: true
          },
          expectedComponents: 7
        }
      ]
    }
  };
}