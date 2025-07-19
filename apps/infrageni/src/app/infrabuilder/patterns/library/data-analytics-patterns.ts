/**
 * Data Analytics and ML/AI Pattern Library
 * Modern data processing, analytics, and machine learning architectures
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
 * Modern Data Lake Pattern
 * Scalable data lake with real-time and batch processing
 */
export function createModernDataLakePattern(): InfrastructurePattern {
  const components: ComponentReference[] = [
    {
      componentId: 'generic-vpc',
      instanceId: 'data-lake-vpc',
      displayName: 'Data Lake VPC',
      position: { x: 50, y: 50 },
      configuration: {
        cidrBlock: '10.2.0.0/16',
        enableDnsHostnames: true
      },
      required: true,
      dependencies: [],
      metadata: {
        description: 'Virtual private cloud for data lake architecture'
      }
    },
    {
      componentId: 'generic-storage',
      instanceId: 'raw-data-storage',
      displayName: 'Raw Data Storage',
      position: { x: 150, y: 150 },
      configuration: {
        type: 's3',
        encryption: true,
        lifecycle: true,
        storageClass: 'intelligent-tiering',
        versioning: true
      },
      required: true,
      dependencies: ['data-lake-vpc'],
      metadata: {
        description: 'Raw data ingestion storage tier'
      }
    },
    {
      componentId: 'generic-storage',
      instanceId: 'processed-data-storage',
      displayName: 'Processed Data Storage',
      position: { x: 350, y: 150 },
      configuration: {
        type: 's3',
        encryption: true,
        lifecycle: true,
        storageClass: 'standard',
        partitioning: true
      },
      required: true,
      dependencies: ['data-lake-vpc'],
      metadata: {
        description: 'Processed and curated data storage'
      }
    },
    {
      componentId: 'generic-storage',
      instanceId: 'analytics-storage',
      displayName: 'Analytics Storage',
      position: { x: 550, y: 150 },
      configuration: {
        type: 's3',
        encryption: true,
        lifecycle: true,
        storageClass: 'standard',
        optimization: 'query-performance'
      },
      required: true,
      dependencies: ['data-lake-vpc'],
      metadata: {
        description: 'Optimized storage for analytics queries'
      }
    },
    {
      componentId: 'generic-compute',
      instanceId: 'data-ingestion',
      displayName: 'Data Ingestion',
      position: { x: 100, y: 250 },
      configuration: {
        type: 'serverless',
        runtime: 'python',
        autoScaling: true,
        eventDriven: true
      },
      required: true,
      dependencies: ['data-lake-vpc'],
      metadata: {
        description: 'Real-time and batch data ingestion services'
      }
    },
    {
      componentId: 'generic-compute',
      instanceId: 'data-processing',
      displayName: 'Data Processing',
      position: { x: 300, y: 250 },
      configuration: {
        type: 'spark-cluster',
        instanceType: 'm5.xlarge',
        autoScaling: true,
        minNodes: 2,
        maxNodes: 20
      },
      required: true,
      dependencies: ['data-lake-vpc'],
      metadata: {
        description: 'Distributed data processing with Apache Spark'
      }
    },
    {
      componentId: 'generic-analytics',
      instanceId: 'query-engine',
      displayName: 'Query Engine',
      position: { x: 500, y: 250 },
      configuration: {
        type: 'presto',
        catalog: 'hive-metastore',
        caching: true,
        compression: true
      },
      required: true,
      dependencies: ['data-lake-vpc'],
      metadata: {
        description: 'Distributed SQL query engine for analytics'
      }
    },
    {
      componentId: 'generic-database',
      instanceId: 'metadata-catalog',
      displayName: 'Data Catalog',
      position: { x: 400, y: 350 },
      configuration: {
        type: 'glue-catalog',
        autoDiscovery: true,
        lineage: true,
        classification: true
      },
      required: true,
      dependencies: ['data-lake-vpc'],
      metadata: {
        description: 'Centralized metadata and data catalog'
      }
    },
    {
      componentId: 'generic-streaming',
      instanceId: 'stream-processor',
      displayName: 'Stream Processing',
      position: { x: 200, y: 350 },
      configuration: {
        type: 'kinesis-analytics',
        runtime: 'flink',
        autoScaling: true,
        checkpointing: true
      },
      required: false,
      dependencies: ['data-lake-vpc'],
      metadata: {
        description: 'Real-time stream processing for continuous analytics'
      }
    },
    {
      componentId: 'generic-monitoring',
      instanceId: 'data-ops-monitoring',
      displayName: 'DataOps Monitoring',
      position: { x: 600, y: 300 },
      configuration: {
        dataQuality: true,
        lineage: true,
        alerting: true,
        compliance: true
      },
      required: false,
      dependencies: ['data-lake-vpc'],
      metadata: {
        description: 'Data quality monitoring and DataOps observability'
      }
    }
  ];

  const relationships: ComponentRelationship[] = [
    {
      id: 'ingestion-raw-storage',
      fromInstanceId: 'data-ingestion',
      toInstanceId: 'raw-data-storage',
      relationshipType: RelationshipType.DATA_FLOW,
      configuration: {
        bidirectional: false,
        protocols: ['s3-api'],
        security: {
          encryption: true,
          authentication: ['iam'],
          authorization: ['bucket-policy'],
          compliance: []
        }
      },
      metadata: {
        description: 'Ingestion writes raw data to storage'
      }
    },
    {
      id: 'processing-raw-to-processed',
      fromInstanceId: 'data-processing',
      toInstanceId: 'raw-data-storage',
      relationshipType: RelationshipType.DATA_FLOW,
      configuration: {
        bidirectional: false,
        protocols: ['s3-api'],
        security: {
          encryption: true,
          authentication: ['iam'],
          authorization: ['bucket-policy'],
          compliance: []
        }
      },
      metadata: {
        description: 'Processing reads raw data'
      }
    },
    {
      id: 'processing-to-processed',
      fromInstanceId: 'data-processing',
      toInstanceId: 'processed-data-storage',
      relationshipType: RelationshipType.DATA_FLOW,
      configuration: {
        bidirectional: false,
        protocols: ['s3-api'],
        security: {
          encryption: true,
          authentication: ['iam'],
          authorization: ['bucket-policy'],
          compliance: []
        }
      },
      metadata: {
        description: 'Processing writes processed data'
      }
    },
    {
      id: 'processing-to-analytics',
      fromInstanceId: 'data-processing',
      toInstanceId: 'analytics-storage',
      relationshipType: RelationshipType.DATA_FLOW,
      configuration: {
        bidirectional: false,
        protocols: ['s3-api'],
        security: {
          encryption: true,
          authentication: ['iam'],
          authorization: ['bucket-policy'],
          compliance: []
        }
      },
      metadata: {
        description: 'Processing writes analytics-ready data'
      }
    },
    {
      id: 'query-engine-storage',
      fromInstanceId: 'query-engine',
      toInstanceId: 'analytics-storage',
      relationshipType: RelationshipType.DATA_FLOW,
      configuration: {
        bidirectional: false,
        protocols: ['s3-api'],
        security: {
          encryption: true,
          authentication: ['iam'],
          authorization: ['bucket-policy'],
          compliance: []
        }
      },
      metadata: {
        description: 'Query engine reads analytics data'
      }
    },
    {
      id: 'catalog-metadata',
      fromInstanceId: 'metadata-catalog',
      toInstanceId: 'processed-data-storage',
      relationshipType: RelationshipType.METADATA,
      configuration: {
        bidirectional: true,
        protocols: ['glue-api'],
        security: {
          encryption: true,
          authentication: ['iam'],
          authorization: ['resource-policy'],
          compliance: []
        }
      },
      metadata: {
        description: 'Catalog manages metadata for all storage tiers'
      }
    },
    {
      id: 'stream-real-time',
      fromInstanceId: 'stream-processor',
      toInstanceId: 'analytics-storage',
      relationshipType: RelationshipType.DATA_FLOW,
      configuration: {
        bidirectional: false,
        protocols: ['s3-api'],
        security: {
          encryption: true,
          authentication: ['iam'],
          authorization: ['bucket-policy'],
          compliance: []
        }
      },
      metadata: {
        description: 'Stream processor writes real-time analytics'
      }
    }
  ];

  return {
    id: 'modern-data-lake',
    name: 'Modern Data Lake Architecture',
    description: 'Scalable data lake with multi-tier storage, distributed processing, and real-time analytics capabilities',
    version: '1.0.0',
    category: PatternCategory.DATA_ANALYTICS,
    complexity: PatternComplexity.ADVANCED,
    status: PatternStatus.PUBLISHED,
    components,
    relationships,
    parameters: [
      {
        id: 'data_volume',
        name: 'Expected Data Volume',
        description: 'Expected daily data volume',
        type: 'select',
        required: false,
        defaultValue: 'medium',
        options: [
          { value: 'small', label: 'Small (< 1TB/day)' },
          { value: 'medium', label: 'Medium (1-10TB/day)' },
          { value: 'large', label: 'Large (10-100TB/day)' },
          { value: 'enterprise', label: 'Enterprise (> 100TB/day)' }
        ],
        affects: ['data-processing', 'query-engine']
      },
      {
        id: 'real_time_requirements',
        name: 'Real-time Processing',
        description: 'Enable real-time stream processing',
        type: 'boolean',
        required: false,
        defaultValue: true,
        affects: ['stream-processor']
      },
      {
        id: 'compliance_level',
        name: 'Compliance Requirements',
        description: 'Data compliance and governance level',
        type: 'select',
        required: false,
        defaultValue: 'standard',
        options: [
          { value: 'basic', label: 'Basic' },
          { value: 'standard', label: 'Standard' },
          { value: 'enterprise', label: 'Enterprise (GDPR, HIPAA)' }
        ],
        affects: ['metadata-catalog', 'data-ops-monitoring']
      }
    ],
    preview: {
      thumbnail: '',
      description: 'Enterprise-grade data lake for analytics and machine learning',
      features: [
        'Multi-tier storage architecture',
        'Distributed data processing',
        'Real-time stream processing',
        'Centralized data catalog',
        'Query engine for analytics',
        'DataOps monitoring and quality'
      ],
      benefits: [
        'Scalable to petabyte scale',
        'Cost-effective storage tiers',
        'Unified batch and stream processing',
        'Self-service analytics',
        'Data governance and lineage'
      ],
      useCases: [
        'Business intelligence and reporting',
        'Real-time analytics dashboards',
        'Machine learning data preparation',
        'Regulatory compliance reporting',
        'Data science and exploration'
      ]
    },
    documentation: {
      overview: 'This pattern implements a modern data lake architecture with multi-tier storage, distributed processing capabilities, and comprehensive data governance.',
      architecture: {
        description: 'Three-tier data lake with raw, processed, and analytics-optimized storage',
        components: [
          {
            instanceId: 'data-processing',
            purpose: 'Distributed data processing and transformation',
            configuration: 'Apache Spark cluster with auto-scaling',
            alternatives: ['Databricks', 'EMR', 'Dataflow', 'Azure Synapse']
          },
          {
            instanceId: 'query-engine',
            purpose: 'Interactive SQL queries on data lake',
            configuration: 'Presto/Trino for federated queries',
            alternatives: ['Athena', 'BigQuery', 'Synapse SQL', 'Snowflake']
          },
          {
            instanceId: 'metadata-catalog',
            purpose: 'Centralized metadata and schema management',
            configuration: 'AWS Glue Catalog or Apache Hive Metastore',
            alternatives: ['Confluent Schema Registry', 'DataHub', 'Apache Atlas']
          }
        ],
        dataFlow: 'Ingestion → Raw Storage → Processing → Processed/Analytics Storage → Query Engine',
        keyDecisions: [
          {
            decision: 'Multi-tier storage architecture',
            rationale: 'Balances cost, performance, and data lifecycle management',
            alternatives: ['Single-tier storage', 'Database-centric architecture'],
            tradeoffs: ['Storage complexity', 'Cost optimization and performance']
          },
          {
            decision: 'Unified batch and stream processing',
            rationale: 'Supports both historical analysis and real-time insights',
            alternatives: ['Batch-only', 'Stream-only', 'Lambda architecture'],
            tradeoffs: ['Architectural complexity', 'Comprehensive analytics capabilities']
          }
        ]
      },
      deployment: {
        prerequisites: [
          'Cloud provider account with data services',
          'IAM roles and permissions',
          'Network configuration',
          'Data sources identified'
        ],
        steps: [
          {
            title: 'Set up storage tiers',
            description: 'Create S3 buckets or equivalent with lifecycle policies',
            commands: ['aws s3 mb s3://data-lake-raw', 'aws s3 mb s3://data-lake-processed'],
            expectedOutput: 'Storage tiers created with proper configurations'
          },
          {
            title: 'Deploy processing cluster',
            description: 'Set up Spark cluster or managed service',
            commands: ['aws emr create-cluster --name data-processing'],
            expectedOutput: 'Processing cluster running and accessible'
          },
          {
            title: 'Configure data catalog',
            description: 'Set up metadata catalog and schema registry',
            commands: ['aws glue create-database --database-input Name=datalake'],
            expectedOutput: 'Data catalog configured and accessible'
          },
          {
            title: 'Deploy query engine',
            description: 'Set up Presto/Athena for interactive queries',
            commands: ['helm install presto presto/presto'],
            expectedOutput: 'Query engine available for analytics'
          }
        ],
        verification: [
          'Test data ingestion pipeline',
          'Verify data processing jobs',
          'Confirm query engine functionality',
          'Validate metadata catalog integration'
        ],
        rollback: [
          'Stop processing jobs',
          'Backup processed data',
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
              data_volume: 'small',
              real_time_requirements: false,
              compliance_level: 'basic'
            },
            notes: ['Single-node processing', 'Basic monitoring']
          },
          {
            name: 'production',
            description: 'Production environment with full capabilities',
            parameters: {
              data_volume: 'large',
              real_time_requirements: true,
              compliance_level: 'enterprise'
            },
            notes: ['Auto-scaling clusters', 'Full compliance monitoring']
          }
        ],
        secrets: [
          {
            name: 'data_source_credentials',
            description: 'Credentials for external data sources',
            required: true
          },
          {
            name: 'encryption_keys',
            description: 'Encryption keys for sensitive data',
            required: true
          }
        ],
        customization: []
      },
      security: {
        overview: 'Security through encryption, access controls, and data governance',
        threats: [
          {
            threat: 'Unauthorized data access',
            impact: 'high',
            likelihood: 'medium',
            mitigation: ['IAM policies', 'Bucket policies', 'VPC isolation']
          },
          {
            threat: 'Data exfiltration',
            impact: 'high',
            likelihood: 'low',
            mitigation: ['Access logging', 'Network monitoring', 'DLP controls']
          }
        ],
        controls: [
          {
            control: 'Data encryption',
            description: 'Encryption at rest and in transit',
            implementation: 'Server-side encryption with customer-managed keys',
            components: ['raw-data-storage', 'processed-data-storage', 'analytics-storage']
          },
          {
            control: 'Access control',
            description: 'Fine-grained access control',
            implementation: 'IAM roles and resource-based policies',
            components: ['metadata-catalog', 'query-engine']
          }
        ],
        compliance: ['GDPR', 'HIPAA', 'SOC2'],
        bestPractices: [
          'Implement data classification',
          'Use least privilege access',
          'Enable comprehensive audit logging',
          'Regular access reviews',
          'Data masking for sensitive information'
        ]
      },
      monitoring: {
        overview: 'Comprehensive monitoring of data pipelines, quality, and performance',
        metrics: [
          {
            name: 'Data Processing Latency',
            description: 'Time from ingestion to processed data availability',
            source: 'Processing Engine',
            threshold: '< 15 minutes for batch, < 1 minute for stream',
            actions: ['Scale processing cluster', 'Optimize pipeline']
          },
          {
            name: 'Query Performance',
            description: 'Analytics query response times',
            source: 'Query Engine',
            threshold: '< 30 seconds for interactive queries',
            actions: ['Optimize data partitioning', 'Scale query engine']
          },
          {
            name: 'Data Quality Score',
            description: 'Overall data quality metrics',
            source: 'Data Quality Engine',
            threshold: '> 95%',
            actions: ['Investigate data sources', 'Fix data pipeline issues']
          }
        ],
        alerts: [
          {
            name: 'Pipeline Failure',
            condition: 'Data processing job fails',
            severity: 'critical',
            response: ['Check job logs', 'Validate data sources', 'Restart pipeline']
          },
          {
            name: 'Data Quality Degradation',
            condition: 'Data quality score < 90% for 2 hours',
            severity: 'warning',
            response: ['Review data quality rules', 'Check upstream data sources']
          }
        ],
        dashboards: [
          {
            name: 'Data Pipeline Overview',
            description: 'End-to-end pipeline health and performance',
            metrics: ['Ingestion rate', 'Processing latency', 'Error rate', 'Data volume']
          },
          {
            name: 'Data Quality Dashboard',
            description: 'Data quality metrics and trends',
            metrics: ['Quality score', 'Schema violations', 'Completeness', 'Freshness']
          }
        ],
        logs: [
          {
            source: 'Data processing logs',
            format: 'Structured JSON with data lineage',
            retention: '90 days',
            analysis: ['Performance optimization', 'Error root cause analysis', 'Data lineage tracking']
          }
        ]
      },
      troubleshooting: {
        commonIssues: [
          {
            issue: 'Slow query performance',
            symptoms: ['Long query execution times', 'Query timeouts'],
            causes: ['Poor data partitioning', 'Insufficient compute resources', 'Suboptimal query patterns'],
            solutions: ['Optimize partitioning strategy', 'Scale query engine', 'Query optimization']
          },
          {
            issue: 'Data pipeline failures',
            symptoms: ['Processing job failures', 'Missing data'],
            causes: ['Schema changes', 'Resource limitations', 'Data format issues'],
            solutions: ['Implement schema validation', 'Scale processing resources', 'Add data validation']
          }
        ],
        diagnostics: [
          {
            scenario: 'Data processing bottlenecks',
            steps: ['Check cluster resource utilization', 'Analyze job execution plans', 'Review data skew'],
            tools: ['Spark UI', 'CloudWatch/monitoring', 'Query profiler'],
            expectedResults: ['Bottleneck identification', 'Performance optimization recommendations']
          }
        ],
        support: {
          contacts: ['Data engineering team', 'Platform team'],
          resources: ['Data lake best practices', 'Query optimization guides'],
          escalation: ['Cloud provider support', 'Vendor-specific support']
        }
      },
      references: [
        {
          title: 'Data Lake Architecture Guide',
          type: 'documentation',
          url: 'https://docs.aws.amazon.com/whitepapers/latest/building-data-lakes/building-data-lake-aws.html',
          description: 'Comprehensive guide to building data lakes on AWS',
          relevance: 'high'
        },
        {
          title: 'Modern Data Stack Patterns',
          type: 'blog',
          url: 'https://blog.getdbt.com/what-is-the-modern-data-stack/',
          description: 'Modern data stack architecture patterns and best practices',
          relevance: 'high'
        }
      ]
    },
    tags: ['data-lake', 'analytics', 'big-data', 'spark', 'streaming', 'advanced'],
    author: 'InfraGeni Team',
    license: 'MIT',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    providers: ['aws', 'azure', 'gcp', 'generic'],
    requiredFeatures: ['storage', 'compute', 'analytics'],
    changelog: [
      {
        version: '1.0.0',
        date: '2024-01-01',
        changes: ['Initial release of modern data lake pattern'],
        breaking: false
      }
    ],
    migrations: []
  };
}

/**
 * ML/AI Training and Inference Pipeline Pattern
 * End-to-end machine learning operations
 */
export function createMLPipelinePattern(): InfrastructurePattern {
  const components: ComponentReference[] = [
    {
      componentId: 'generic-vpc',
      instanceId: 'ml-vpc',
      displayName: 'ML Pipeline VPC',
      position: { x: 50, y: 50 },
      configuration: {
        cidrBlock: '10.3.0.0/16',
        enableDnsHostnames: true
      },
      required: true,
      dependencies: [],
      metadata: {
        description: 'Virtual private cloud for ML operations'
      }
    },
    {
      componentId: 'generic-storage',
      instanceId: 'ml-data-storage',
      displayName: 'ML Data Storage',
      position: { x: 150, y: 150 },
      configuration: {
        type: 's3',
        encryption: true,
        versioning: true,
        lifecycle: true,
        acceleratedTransfer: true
      },
      required: true,
      dependencies: ['ml-vpc'],
      metadata: {
        description: 'Centralized storage for training data and models'
      }
    },
    {
      componentId: 'generic-compute',
      instanceId: 'data-preparation',
      displayName: 'Data Preparation',
      position: { x: 100, y: 250 },
      configuration: {
        type: 'jupyter-notebook',
        instanceType: 'm5.xlarge',
        gpu: false,
        persistentStorage: true
      },
      required: true,
      dependencies: ['ml-vpc'],
      metadata: {
        description: 'Interactive environment for data exploration and preparation'
      }
    },
    {
      componentId: 'generic-compute',
      instanceId: 'training-cluster',
      displayName: 'Training Cluster',
      position: { x: 300, y: 250 },
      configuration: {
        type: 'gpu-cluster',
        instanceType: 'p3.2xlarge',
        autoScaling: true,
        minNodes: 0,
        maxNodes: 10,
        spotInstances: true
      },
      required: true,
      dependencies: ['ml-vpc'],
      metadata: {
        description: 'GPU-enabled cluster for model training'
      }
    },
    {
      componentId: 'generic-compute',
      instanceId: 'model-registry',
      displayName: 'Model Registry',
      position: { x: 500, y: 200 },
      configuration: {
        type: 'mlflow',
        versioning: true,
        lineage: true,
        staging: true,
        approval: true
      },
      required: true,
      dependencies: ['ml-vpc'],
      metadata: {
        description: 'Centralized model versioning and lifecycle management'
      }
    },
    {
      componentId: 'generic-compute',
      instanceId: 'inference-endpoint',
      displayName: 'Inference Endpoint',
      position: { x: 400, y: 350 },
      configuration: {
        type: 'serverless',
        autoScaling: true,
        loadBalancer: true,
        gpu: false,
        caching: true
      },
      required: true,
      dependencies: ['ml-vpc'],
      metadata: {
        description: 'Scalable model inference endpoint'
      }
    },
    {
      componentId: 'generic-compute',
      instanceId: 'batch-inference',
      displayName: 'Batch Inference',
      position: { x: 600, y: 300 },
      configuration: {
        type: 'batch-job',
        instanceType: 'c5.xlarge',
        scheduling: 'cron',
        autoScaling: true
      },
      required: false,
      dependencies: ['ml-vpc'],
      metadata: {
        description: 'Batch processing for large-scale inference'
      }
    },
    {
      componentId: 'generic-monitoring',
      instanceId: 'ml-monitoring',
      displayName: 'ML Monitoring',
      position: { x: 550, y: 150 },
      configuration: {
        modelDrift: true,
        dataDrift: true,
        performance: true,
        explainability: true,
        fairness: true
      },
      required: true,
      dependencies: ['ml-vpc'],
      metadata: {
        description: 'Model performance and drift monitoring'
      }
    },
    {
      componentId: 'generic-database',
      instanceId: 'feature-store',
      displayName: 'Feature Store',
      position: { x: 250, y: 150 },
      configuration: {
        type: 'feature-store',
        realTime: true,
        batch: true,
        versioning: true,
        lineage: true
      },
      required: false,
      dependencies: ['ml-vpc'],
      metadata: {
        description: 'Centralized feature management and serving'
      }
    },
    {
      componentId: 'generic-pipeline',
      instanceId: 'ml-pipeline',
      displayName: 'ML Pipeline Orchestration',
      position: { x: 350, y: 100 },
      configuration: {
        type: 'kubeflow',
        workflow: 'argo',
        scheduling: true,
        dependencies: true
      },
      required: true,
      dependencies: ['ml-vpc'],
      metadata: {
        description: 'End-to-end ML pipeline orchestration'
      }
    }
  ];

  const relationships: ComponentRelationship[] = [
    {
      id: 'data-prep-storage',
      fromInstanceId: 'data-preparation',
      toInstanceId: 'ml-data-storage',
      relationshipType: RelationshipType.DATA_FLOW,
      configuration: {
        bidirectional: true,
        protocols: ['s3-api'],
        security: {
          encryption: true,
          authentication: ['iam'],
          authorization: ['bucket-policy'],
          compliance: []
        }
      },
      metadata: {
        description: 'Data preparation accesses storage'
      }
    },
    {
      id: 'training-storage',
      fromInstanceId: 'training-cluster',
      toInstanceId: 'ml-data-storage',
      relationshipType: RelationshipType.DATA_FLOW,
      configuration: {
        bidirectional: false,
        protocols: ['s3-api'],
        security: {
          encryption: true,
          authentication: ['iam'],
          authorization: ['bucket-policy'],
          compliance: []
        }
      },
      metadata: {
        description: 'Training cluster reads training data'
      }
    },
    {
      id: 'training-registry',
      fromInstanceId: 'training-cluster',
      toInstanceId: 'model-registry',
      relationshipType: RelationshipType.DATA_FLOW,
      configuration: {
        bidirectional: false,
        protocols: ['mlflow-api'],
        security: {
          encryption: true,
          authentication: ['api-key'],
          authorization: ['rbac'],
          compliance: []
        }
      },
      metadata: {
        description: 'Training registers models'
      }
    },
    {
      id: 'inference-registry',
      fromInstanceId: 'inference-endpoint',
      toInstanceId: 'model-registry',
      relationshipType: RelationshipType.DATA_FLOW,
      configuration: {
        bidirectional: false,
        protocols: ['mlflow-api'],
        security: {
          encryption: true,
          authentication: ['api-key'],
          authorization: ['rbac'],
          compliance: []
        }
      },
      metadata: {
        description: 'Inference loads models from registry'
      }
    },
    {
      id: 'feature-store-training',
      fromInstanceId: 'feature-store',
      toInstanceId: 'training-cluster',
      relationshipType: RelationshipType.DATA_FLOW,
      configuration: {
        bidirectional: false,
        protocols: ['feature-api'],
        security: {
          encryption: true,
          authentication: ['api-key'],
          authorization: ['rbac'],
          compliance: []
        }
      },
      metadata: {
        description: 'Feature store provides training features'
      }
    },
    {
      id: 'feature-store-inference',
      fromInstanceId: 'feature-store',
      toInstanceId: 'inference-endpoint',
      relationshipType: RelationshipType.DATA_FLOW,
      configuration: {
        bidirectional: false,
        protocols: ['feature-api'],
        security: {
          encryption: true,
          authentication: ['api-key'],
          authorization: ['rbac'],
          compliance: []
        }
      },
      metadata: {
        description: 'Feature store provides inference features'
      }
    },
    {
      id: 'monitoring-inference',
      fromInstanceId: 'ml-monitoring',
      toInstanceId: 'inference-endpoint',
      relationshipType: RelationshipType.MONITORING,
      configuration: {
        bidirectional: false,
        protocols: ['http'],
        security: {
          encryption: true,
          authentication: ['api-key'],
          authorization: ['rbac'],
          compliance: []
        }
      },
      metadata: {
        description: 'Monitoring observes inference performance'
      }
    },
    {
      id: 'pipeline-orchestration',
      fromInstanceId: 'ml-pipeline',
      toInstanceId: 'training-cluster',
      relationshipType: RelationshipType.MANAGEMENT,
      configuration: {
        bidirectional: true,
        protocols: ['kubernetes-api'],
        security: {
          encryption: true,
          authentication: ['service-account'],
          authorization: ['rbac'],
          compliance: []
        }
      },
      metadata: {
        description: 'Pipeline orchestrates training jobs'
      }
    }
  ];

  return {
    id: 'ml-training-inference-pipeline',
    name: 'ML Training and Inference Pipeline',
    description: 'End-to-end machine learning operations with training, model management, and inference capabilities',
    version: '1.0.0',
    category: PatternCategory.MACHINE_LEARNING,
    complexity: PatternComplexity.ADVANCED,
    status: PatternStatus.PUBLISHED,
    components,
    relationships,
    parameters: [
      {
        id: 'ml_framework',
        name: 'ML Framework',
        description: 'Primary machine learning framework',
        type: 'select',
        required: false,
        defaultValue: 'tensorflow',
        options: [
          { value: 'tensorflow', label: 'TensorFlow' },
          { value: 'pytorch', label: 'PyTorch' },
          { value: 'scikit-learn', label: 'Scikit-learn' },
          { value: 'xgboost', label: 'XGBoost' }
        ],
        affects: ['training-cluster', 'inference-endpoint']
      },
      {
        id: 'compute_type',
        name: 'Compute Type',
        description: 'Type of compute for training',
        type: 'select',
        required: false,
        defaultValue: 'gpu',
        options: [
          { value: 'cpu', label: 'CPU-only' },
          { value: 'gpu', label: 'GPU-accelerated' },
          { value: 'tpu', label: 'TPU-optimized' }
        ],
        affects: ['training-cluster']
      },
      {
        id: 'deployment_type',
        name: 'Deployment Type',
        description: 'Model deployment pattern',
        type: 'select',
        required: false,
        defaultValue: 'realtime',
        options: [
          { value: 'realtime', label: 'Real-time inference' },
          { value: 'batch', label: 'Batch inference' },
          { value: 'both', label: 'Both real-time and batch' }
        ],
        affects: ['inference-endpoint', 'batch-inference']
      }
    ],
    preview: {
      thumbnail: '',
      description: 'Complete MLOps pipeline for model development and deployment',
      features: [
        'End-to-end ML pipeline orchestration',
        'GPU-accelerated training clusters',
        'Model versioning and registry',
        'Real-time and batch inference',
        'Feature store for feature management',
        'Model monitoring and drift detection'
      ],
      benefits: [
        'Accelerated model development',
        'Automated ML workflows',
        'Scalable inference endpoints',
        'Model governance and compliance',
        'Continuous monitoring and improvement'
      ],
      useCases: [
        'Computer vision applications',
        'Natural language processing',
        'Recommendation systems',
        'Fraud detection',
        'Predictive maintenance',
        'Personalization engines'
      ]
    },
    documentation: {
      overview: 'This pattern implements a comprehensive MLOps platform with end-to-end capabilities for machine learning model development, training, deployment, and monitoring.',
      architecture: {
        description: 'MLOps architecture with training, inference, and monitoring components',
        components: [
          {
            instanceId: 'training-cluster',
            purpose: 'Distributed model training with GPU acceleration',
            configuration: 'Auto-scaling cluster with spot instances for cost optimization',
            alternatives: ['SageMaker Training', 'Azure ML Compute', 'Google AI Platform']
          },
          {
            instanceId: 'model-registry',
            purpose: 'Model versioning, metadata, and lifecycle management',
            configuration: 'MLflow with model staging and approval workflows',
            alternatives: ['Neptune', 'Weights & Biases', 'Kubeflow Model Registry']
          },
          {
            instanceId: 'feature-store',
            purpose: 'Centralized feature engineering and serving',
            configuration: 'Real-time and batch feature serving with lineage',
            alternatives: ['Feast', 'Tecton', 'SageMaker Feature Store']
          }
        ],
        dataFlow: 'Data Prep → Feature Store → Training → Model Registry → Inference Endpoint',
        keyDecisions: [
          {
            decision: 'Separate training and inference infrastructure',
            rationale: 'Optimizes cost and performance for different workload patterns',
            alternatives: ['Unified infrastructure', 'Serverless-only approach'],
            tradeoffs: ['Infrastructure complexity', 'Cost optimization and performance']
          },
          {
            decision: 'Feature store implementation',
            rationale: 'Ensures consistency between training and inference features',
            alternatives: ['Direct feature computation', 'Application-level caching'],
            tradeoffs: ['Additional infrastructure', 'Feature consistency and reusability']
          }
        ]
      },
      deployment: {
        prerequisites: [
          'Kubernetes cluster or managed ML platform',
          'GPU-enabled compute instances',
          'Object storage for models and data',
          'Container registry access'
        ],
        steps: [
          {
            title: 'Set up ML platform',
            description: 'Deploy Kubeflow or managed ML service',
            commands: ['kfctl apply -V -f kfctl_k8s_istio.yaml'],
            expectedOutput: 'ML platform components running'
          },
          {
            title: 'Configure training cluster',
            description: 'Set up GPU-enabled training infrastructure',
            commands: ['kubectl apply -f training-cluster.yaml'],
            expectedOutput: 'Training cluster available for jobs'
          },
          {
            title: 'Deploy model registry',
            description: 'Set up MLflow tracking server',
            commands: ['helm install mlflow mlflow/mlflow'],
            expectedOutput: 'Model registry accessible'
          },
          {
            title: 'Configure inference endpoints',
            description: 'Set up model serving infrastructure',
            commands: ['kubectl apply -f inference-config.yaml'],
            expectedOutput: 'Inference endpoints ready for deployment'
          }
        ],
        verification: [
          'Test training job submission',
          'Verify model registration',
          'Confirm inference endpoint deployment',
          'Validate monitoring setup'
        ],
        rollback: [
          'Stop running training jobs',
          'Backup model registry',
          'Restore previous inference models'
        ]
      },
      configuration: {
        parameters: [],
        environments: [
          {
            name: 'development',
            description: 'Development environment for experimentation',
            parameters: {
              ml_framework: 'scikit-learn',
              compute_type: 'cpu',
              deployment_type: 'realtime'
            },
            notes: ['CPU-only training', 'Single inference endpoint']
          },
          {
            name: 'production',
            description: 'Production environment with full capabilities',
            parameters: {
              ml_framework: 'tensorflow',
              compute_type: 'gpu',
              deployment_type: 'both'
            },
            notes: ['GPU training clusters', 'Multi-region inference']
          }
        ],
        secrets: [
          {
            name: 'ml_platform_credentials',
            description: 'ML platform access credentials',
            required: true
          },
          {
            name: 'model_signing_keys',
            description: 'Keys for model artifact signing',
            required: true
          }
        ],
        customization: []
      },
      security: {
        overview: 'Security through model signing, access controls, and audit logging',
        threats: [
          {
            threat: 'Model poisoning',
            impact: 'high',
            likelihood: 'low',
            mitigation: ['Input validation', 'Model signing', 'Training data validation']
          },
          {
            threat: 'Data extraction from models',
            impact: 'medium',
            likelihood: 'medium',
            mitigation: ['Differential privacy', 'Model encryption', 'Access controls']
          }
        ],
        controls: [
          {
            control: 'Model signing',
            description: 'Cryptographic signing of model artifacts',
            implementation: 'Digital signatures with certificate validation',
            components: ['model-registry', 'inference-endpoint']
          },
          {
            control: 'Data protection',
            description: 'Protection of training and inference data',
            implementation: 'Encryption, access controls, and data anonymization',
            components: ['ml-data-storage', 'feature-store']
          }
        ],
        compliance: ['SOC2', 'ISO27001'],
        bestPractices: [
          'Implement model versioning and approval',
          'Use secure model serving endpoints',
          'Enable comprehensive audit logging',
          'Regular security scanning of dependencies',
          'Implement data privacy controls'
        ]
      },
      monitoring: {
        overview: 'Comprehensive ML monitoring including model performance, drift, and business metrics',
        metrics: [
          {
            name: 'Model Accuracy',
            description: 'Model prediction accuracy over time',
            source: 'ML Monitoring',
            threshold: '> 90% (baseline)',
            actions: ['Retrain model', 'Investigate data quality']
          },
          {
            name: 'Data Drift',
            description: 'Statistical drift in input features',
            source: 'Feature Store',
            threshold: 'Drift score < 0.3',
            actions: ['Update training data', 'Retrain model']
          },
          {
            name: 'Inference Latency',
            description: 'Model prediction response time',
            source: 'Inference Endpoint',
            threshold: '< 100ms P95',
            actions: ['Scale inference', 'Optimize model']
          }
        ],
        alerts: [
          {
            name: 'Model Performance Degradation',
            condition: 'Accuracy drops below 85% for 1 hour',
            severity: 'critical',
            response: ['Immediate investigation', 'Consider model rollback']
          },
          {
            name: 'High Inference Latency',
            condition: 'P95 latency > 500ms for 10 minutes',
            severity: 'warning',
            response: ['Scale inference endpoints', 'Check model complexity']
          }
        ],
        dashboards: [
          {
            name: 'Model Performance Overview',
            description: 'Key model performance metrics',
            metrics: ['Accuracy', 'Precision', 'Recall', 'F1 Score', 'AUC']
          },
          {
            name: 'ML Operations Dashboard',
            description: 'Training and inference operational metrics',
            metrics: ['Training job success rate', 'Inference throughput', 'Resource utilization']
          }
        ],
        logs: [
          {
            source: 'Model training logs',
            format: 'Structured JSON with experiment metadata',
            retention: '180 days',
            analysis: ['Training performance', 'Hyperparameter optimization', 'Resource utilization']
          },
          {
            source: 'Inference logs',
            format: 'JSON with prediction metadata and features',
            retention: '90 days',
            analysis: ['Prediction analysis', 'Feature importance', 'Model behavior']
          }
        ]
      },
      troubleshooting: {
        commonIssues: [
          {
            issue: 'Training job failures',
            symptoms: ['Job crashes', 'Out of memory errors', 'GPU unavailable'],
            causes: ['Resource constraints', 'Data format issues', 'Code bugs'],
            solutions: ['Scale training resources', 'Fix data pipeline', 'Debug training code']
          },
          {
            issue: 'Model performance degradation',
            symptoms: ['Decreasing accuracy', 'Increased prediction errors'],
            causes: ['Data drift', 'Concept drift', 'System changes'],
            solutions: ['Retrain with recent data', 'Update model architecture', 'Fix data issues']
          }
        ],
        diagnostics: [
          {
            scenario: 'Inference performance issues',
            steps: ['Check endpoint metrics', 'Analyze model complexity', 'Review resource allocation'],
            tools: ['Model profiler', 'Performance monitoring', 'Resource monitors'],
            expectedResults: ['Performance bottleneck identified', 'Optimization recommendations']
          }
        ],
        support: {
          contacts: ['ML engineering team', 'Data science team'],
          resources: ['MLOps best practices', 'Model optimization guides'],
          escalation: ['Cloud ML platform support', 'ML framework communities']
        }
      },
      references: [
        {
          title: 'MLOps Best Practices',
          type: 'documentation',
          url: 'https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning',
          description: 'Comprehensive guide to MLOps practices and architectures',
          relevance: 'high'
        },
        {
          title: 'Machine Learning Engineering',
          type: 'book',
          url: 'http://www.mlebook.com/',
          description: 'Practical guide to production machine learning systems',
          relevance: 'high'
        }
      ]
    },
    tags: ['machine-learning', 'mlops', 'training', 'inference', 'gpu', 'advanced'],
    author: 'InfraGeni Team',
    license: 'MIT',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    providers: ['aws', 'azure', 'gcp', 'generic'],
    requiredFeatures: ['compute', 'storage', 'ml-platform'],
    changelog: [
      {
        version: '1.0.0',
        date: '2024-01-01',
        changes: ['Initial release of ML training and inference pipeline pattern'],
        breaking: false
      }
    ],
    migrations: []
  };
}

/**
 * Template for generating customizable data analytics architectures
 */
export function createDataAnalyticsTemplate(): PatternTemplate {
  return {
    id: 'data-analytics-template',
    name: 'Data Analytics Architecture Template',
    description: 'Customizable template for data analytics and ML architectures',
    category: PatternCategory.DATA_ANALYTICS,
    complexity: PatternComplexity.ADVANCED,
    parameters: [
      {
        id: 'project_name',
        name: 'Project Name',
        description: 'Name of your analytics project',
        type: 'string',
        required: true,
        defaultValue: 'analytics-platform',
        affects: ['all-components']
      },
      {
        id: 'analytics_type',
        name: 'Analytics Type',
        description: 'Primary analytics use case',
        type: 'select',
        required: true,
        defaultValue: 'data-lake',
        options: [
          { value: 'data-lake', label: 'Data Lake Analytics' },
          { value: 'ml-pipeline', label: 'Machine Learning Pipeline' },
          { value: 'real-time', label: 'Real-time Analytics' },
          { value: 'business-intelligence', label: 'Business Intelligence' }
        ],
        affects: ['all-components']
      },
      {
        id: 'data_volume',
        name: 'Expected Data Volume',
        description: 'Expected daily data processing volume',
        type: 'select',
        required: false,
        defaultValue: 'medium',
        options: [
          { value: 'small', label: 'Small (< 1TB/day)' },
          { value: 'medium', label: 'Medium (1-10TB/day)' },
          { value: 'large', label: 'Large (10-100TB/day)' },
          { value: 'enterprise', label: 'Enterprise (> 100TB/day)' }
        ],
        affects: ['compute-resources', 'storage-tier']
      },
      {
        id: 'processing_engines',
        name: 'Processing Engines',
        description: 'Data processing frameworks to include',
        type: 'multiselect',
        required: false,
        defaultValue: ['spark'],
        options: [
          { value: 'spark', label: 'Apache Spark' },
          { value: 'flink', label: 'Apache Flink' },
          { value: 'beam', label: 'Apache Beam' },
          { value: 'dask', label: 'Dask' }
        ],
        affects: ['processing-cluster']
      },
      {
        id: 'ml_capabilities',
        name: 'ML Capabilities',
        description: 'Include machine learning capabilities',
        type: 'boolean',
        required: false,
        defaultValue: false,
        affects: ['ml-components']
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
      }
    ],
    relationshipTemplates: [],
    conditionalLogic: [
      {
        condition: {
          type: 'equals',
          left: { type: 'parameter', name: 'ml_capabilities' },
          right: true
        },
        actions: [
          {
            type: 'add_component',
            target: 'ml-training',
            data: {
              instanceId: '{{project_name}}-training-cluster',
              componentId: 'generic-compute',
              displayName: '{{project_name}} Training Cluster',
              position: { x: 400, y: 300 },
              configuration: {
                type: 'gpu-cluster',
                autoScaling: true,
                spotInstances: true
              },
              required: false,
              dependencies: ['{{project_name}}-vpc']
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
      tags: ['data-analytics', 'template', 'machine-learning', 'customizable'],
      examples: [
        {
          name: 'Modern Data Lake',
          description: 'Comprehensive data lake for analytics',
          parameters: {
            project_name: 'enterprise-datalake',
            analytics_type: 'data-lake',
            data_volume: 'large',
            processing_engines: ['spark', 'flink'],
            ml_capabilities: true
          },
          expectedComponents: 15
        },
        {
          name: 'ML Platform',
          description: 'End-to-end machine learning platform',
          parameters: {
            project_name: 'ml-platform',
            analytics_type: 'ml-pipeline',
            data_volume: 'medium',
            processing_engines: ['spark'],
            ml_capabilities: true
          },
          expectedComponents: 12
        }
      ]
    }
  };
}