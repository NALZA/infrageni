/**
 * Microservices Architecture Pattern Library
 * Common microservices patterns and service mesh architectures
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
 * Kubernetes-based Microservices Pattern
 * Container orchestration with service mesh
 */
export function createKubernetesMicroservicesPattern(): InfrastructurePattern {
  const components: ComponentReference[] = [
    {
      componentId: 'generic-vpc',
      instanceId: 'k8s-vpc',
      displayName: 'Kubernetes VPC',
      position: { x: 50, y: 50 },
      configuration: {
        cidrBlock: '10.0.0.0/16',
        enableDnsHostnames: true
      },
      required: true,
      dependencies: [],
      metadata: {
        description: 'Virtual private cloud for Kubernetes cluster'
      }
    },
    {
      componentId: 'generic-compute',
      instanceId: 'k8s-control-plane',
      displayName: 'Control Plane',
      position: { x: 200, y: 150 },
      configuration: {
        instanceType: 't3.medium',
        operatingSystem: 'linux',
        autoScaling: true,
        minInstances: 3,
        maxInstances: 5
      },
      required: true,
      dependencies: ['k8s-vpc'],
      metadata: {
        description: 'Kubernetes control plane nodes'
      }
    },
    {
      componentId: 'generic-compute',
      instanceId: 'k8s-worker-nodes',
      displayName: 'Worker Nodes',
      position: { x: 400, y: 150 },
      configuration: {
        instanceType: 't3.large',
        operatingSystem: 'linux',
        autoScaling: true,
        minInstances: 3,
        maxInstances: 10
      },
      required: true,
      dependencies: ['k8s-vpc'],
      metadata: {
        description: 'Kubernetes worker nodes for application workloads'
      }
    },
    {
      componentId: 'generic-load-balancer',
      instanceId: 'ingress-controller',
      displayName: 'Ingress Controller',
      position: { x: 100, y: 300 },
      configuration: {
        type: 'application',
        scheme: 'internet-facing',
        sslTermination: true
      },
      required: true,
      dependencies: ['k8s-vpc'],
      metadata: {
        description: 'Load balancer for external traffic routing'
      }
    },
    {
      componentId: 'generic-database',
      instanceId: 'service-registry-db',
      displayName: 'Service Registry',
      position: { x: 600, y: 200 },
      configuration: {
        engine: 'etcd',
        version: '3.5',
        instanceClass: 'db.t3.medium',
        multiAz: true,
        encrypted: true
      },
      required: true,
      dependencies: ['k8s-vpc'],
      metadata: {
        description: 'Service discovery and configuration store'
      }
    },
    {
      componentId: 'generic-monitoring',
      instanceId: 'observability-stack',
      displayName: 'Observability Stack',
      position: { x: 350, y: 350 },
      configuration: {
        prometheus: true,
        grafana: true,
        jaeger: true,
        alertmanager: true
      },
      required: false,
      dependencies: ['k8s-vpc'],
      metadata: {
        description: 'Monitoring, logging, and distributed tracing'
      }
    },
    {
      componentId: 'generic-api-gateway',
      instanceId: 'api-gateway',
      displayName: 'API Gateway',
      position: { x: 250, y: 450 },
      configuration: {
        rateLimiting: true,
        authentication: true,
        cors: true,
        caching: true
      },
      required: true,
      dependencies: ['k8s-vpc'],
      metadata: {
        description: 'Centralized API management and routing'
      }
    }
  ];

  const relationships: ComponentRelationship[] = [
    {
      id: 'control-plane-workers',
      fromInstanceId: 'k8s-control-plane',
      toInstanceId: 'k8s-worker-nodes',
      relationshipType: RelationshipType.MANAGEMENT,
      configuration: {
        bidirectional: true,
        protocols: ['https'],
        ports: [6443, 2379, 2380],
        security: {
          encryption: true,
          authentication: ['certificate'],
          authorization: ['rbac'],
          compliance: []
        }
      },
      metadata: {
        description: 'Control plane manages worker nodes'
      }
    },
    {
      id: 'ingress-workers',
      fromInstanceId: 'ingress-controller',
      toInstanceId: 'k8s-worker-nodes',
      relationshipType: RelationshipType.NETWORK_CONNECTION,
      configuration: {
        bidirectional: true,
        protocols: ['http', 'https'],
        ports: [80, 443],
        security: {
          encryption: true,
          authentication: ['tls'],
          authorization: ['service-mesh'],
          compliance: []
        }
      },
      metadata: {
        description: 'Ingress routes traffic to services'
      }
    },
    {
      id: 'control-plane-registry',
      fromInstanceId: 'k8s-control-plane',
      toInstanceId: 'service-registry-db',
      relationshipType: RelationshipType.DATA_FLOW,
      configuration: {
        bidirectional: true,
        protocols: ['etcd-client'],
        ports: [2379],
        security: {
          encryption: true,
          authentication: ['certificate'],
          authorization: ['rbac'],
          compliance: []
        }
      },
      metadata: {
        description: 'Control plane stores cluster state in etcd'
      }
    },
    {
      id: 'observability-cluster',
      fromInstanceId: 'observability-stack',
      toInstanceId: 'k8s-worker-nodes',
      relationshipType: RelationshipType.MONITORING,
      configuration: {
        bidirectional: false,
        protocols: ['http', 'grpc'],
        ports: [9090, 9100, 14268],
        security: {
          encryption: true,
          authentication: ['bearer-token'],
          authorization: ['rbac'],
          compliance: []
        }
      },
      metadata: {
        description: 'Observability stack monitors cluster'
      }
    },
    {
      id: 'api-gateway-services',
      fromInstanceId: 'api-gateway',
      toInstanceId: 'k8s-worker-nodes',
      relationshipType: RelationshipType.NETWORK_CONNECTION,
      configuration: {
        bidirectional: true,
        protocols: ['http', 'https', 'grpc'],
        ports: [80, 443, 8080],
        security: {
          encryption: true,
          authentication: ['jwt', 'oauth2'],
          authorization: ['rbac', 'opa'],
          compliance: []
        }
      },
      metadata: {
        description: 'API Gateway routes requests to microservices'
      }
    }
  ];

  return {
    id: 'kubernetes-microservices',
    name: 'Kubernetes Microservices Architecture',
    description: 'Production-ready microservices architecture on Kubernetes with service mesh, observability, and API management',
    version: '1.0.0',
    category: PatternCategory.MICROSERVICES,
    complexity: PatternComplexity.ADVANCED,
    status: PatternStatus.PUBLISHED,
    components,
    relationships,
    parameters: [
      {
        id: 'cluster_size',
        name: 'Cluster Size',
        description: 'Size of the Kubernetes cluster',
        type: 'select',
        required: false,
        defaultValue: 'medium',
        options: [
          { value: 'small', label: 'Small (3-5 nodes)' },
          { value: 'medium', label: 'Medium (5-10 nodes)' },
          { value: 'large', label: 'Large (10-20 nodes)' },
          { value: 'enterprise', label: 'Enterprise (20+ nodes)' }
        ],
        affects: ['k8s-control-plane', 'k8s-worker-nodes']
      },
      {
        id: 'service_mesh',
        name: 'Service Mesh',
        description: 'Enable service mesh for advanced traffic management',
        type: 'select',
        required: false,
        defaultValue: 'istio',
        options: [
          { value: 'none', label: 'None' },
          { value: 'istio', label: 'Istio' },
          { value: 'linkerd', label: 'Linkerd' },
          { value: 'consul-connect', label: 'Consul Connect' }
        ],
        affects: ['k8s-worker-nodes']
      },
      {
        id: 'observability_level',
        name: 'Observability Level',
        description: 'Level of observability and monitoring',
        type: 'select',
        required: false,
        defaultValue: 'standard',
        options: [
          { value: 'basic', label: 'Basic (Metrics only)' },
          { value: 'standard', label: 'Standard (Metrics + Logs)' },
          { value: 'advanced', label: 'Advanced (Full observability stack)' }
        ],
        affects: ['observability-stack']
      }
    ],
    preview: {
      thumbnail: '',
      description: 'Scalable microservices architecture on Kubernetes',
      features: [
        'Container orchestration with Kubernetes',
        'Service mesh for traffic management',
        'Comprehensive observability stack',
        'API gateway for centralized management',
        'Auto-scaling and self-healing',
        'Zero-downtime deployments'
      ],
      benefits: [
        'High scalability and availability',
        'Technology diversity support',
        'Independent service deployment',
        'Fault isolation and resilience',
        'Comprehensive monitoring and tracing'
      ],
      useCases: [
        'Large-scale web applications',
        'E-commerce platforms',
        'Financial services',
        'Media streaming platforms',
        'IoT and real-time applications'
      ]
    },
    documentation: {
      overview: 'This pattern implements a production-ready microservices architecture using Kubernetes as the orchestration platform, with comprehensive observability, service mesh, and API management capabilities.',
      architecture: {
        description: 'Multi-tier microservices architecture with container orchestration',
        components: [
          {
            instanceId: 'k8s-control-plane',
            purpose: 'Manages cluster state and scheduling decisions',
            configuration: 'High-availability control plane with etcd cluster',
            alternatives: ['Managed Kubernetes services', 'OpenShift', 'Rancher']
          },
          {
            instanceId: 'k8s-worker-nodes',
            purpose: 'Runs application workloads and system components',
            configuration: 'Auto-scaling node groups with mixed instance types',
            alternatives: ['Serverless containers', 'Virtual kubelet', 'Spot instances']
          },
          {
            instanceId: 'api-gateway',
            purpose: 'Centralized API management and traffic routing',
            configuration: 'Rate limiting, authentication, and request/response transformation',
            alternatives: ['Service mesh gateway', 'Cloud API Gateway', 'Kong', 'Ambassador']
          }
        ],
        dataFlow: 'External traffic → Ingress → API Gateway → Service Mesh → Microservices',
        keyDecisions: [
          {
            decision: 'Use Kubernetes for orchestration',
            rationale: 'Industry standard with rich ecosystem and vendor support',
            alternatives: ['Docker Swarm', 'Nomad', 'Cloud-specific services'],
            tradeoffs: ['Increased complexity', 'Better scalability and portability']
          },
          {
            decision: 'Implement service mesh',
            rationale: 'Provides advanced traffic management, security, and observability',
            alternatives: ['Application-level implementation', 'Library-based approach'],
            tradeoffs: ['Additional infrastructure complexity', 'Consistent cross-cutting concerns']
          }
        ]
      },
      deployment: {
        prerequisites: [
          'Kubernetes cluster (v1.20+)',
          'Container registry access',
          'Helm package manager',
          'kubectl CLI tool'
        ],
        steps: [
          {
            title: 'Provision Kubernetes cluster',
            description: 'Create managed or self-hosted Kubernetes cluster',
            commands: ['eksctl create cluster --name microservices-cluster'],
            expectedOutput: 'Cluster created and accessible via kubectl'
          },
          {
            title: 'Install service mesh',
            description: 'Deploy Istio or chosen service mesh',
            commands: ['istioctl install --set values.defaultRevision=default'],
            expectedOutput: 'Service mesh control plane installed'
          },
          {
            title: 'Deploy observability stack',
            description: 'Install monitoring and logging components',
            commands: ['helm install prometheus prometheus-community/kube-prometheus-stack'],
            expectedOutput: 'Prometheus, Grafana, and Alertmanager deployed'
          },
          {
            title: 'Configure API Gateway',
            description: 'Deploy and configure API gateway',
            commands: ['kubectl apply -f api-gateway-config.yaml'],
            expectedOutput: 'API Gateway accessible and routing traffic'
          }
        ],
        verification: [
          'Verify all pods are running',
          'Test service-to-service communication',
          'Confirm observability data collection',
          'Validate API Gateway routing'
        ],
        rollback: [
          'Scale down applications',
          'Remove custom resources',
          'Restore previous cluster state'
        ]
      },
      configuration: {
        parameters: [],
        environments: [
          {
            name: 'development',
            description: 'Development environment with minimal resources',
            parameters: {
              cluster_size: 'small',
              service_mesh: 'none',
              observability_level: 'basic'
            },
            notes: ['Single-zone deployment', 'Reduced monitoring']
          },
          {
            name: 'production',
            description: 'Production environment with full features',
            parameters: {
              cluster_size: 'large',
              service_mesh: 'istio',
              observability_level: 'advanced'
            },
            notes: ['Multi-zone deployment', 'Full observability stack', 'Enhanced security']
          }
        ],
        secrets: [
          {
            name: 'registry_credentials',
            description: 'Container registry access credentials',
            required: true
          },
          {
            name: 'tls_certificates',
            description: 'TLS certificates for secure communication',
            required: true
          },
          {
            name: 'api_keys',
            description: 'External service API keys',
            required: false
          }
        ],
        customization: []
      },
      security: {
        overview: 'Security implemented through RBAC, network policies, service mesh security, and encryption',
        threats: [
          {
            threat: 'Container escape',
            impact: 'high',
            likelihood: 'low',
            mitigation: ['Pod security policies', 'Runtime security monitoring', 'Image scanning']
          },
          {
            threat: 'Service-to-service attacks',
            impact: 'medium',
            likelihood: 'medium',
            mitigation: ['Service mesh mTLS', 'Network policies', 'Zero-trust architecture']
          }
        ],
        controls: [
          {
            control: 'Mutual TLS',
            description: 'Automatic mTLS between services',
            implementation: 'Service mesh automatic certificate management',
            components: ['api-gateway', 'k8s-worker-nodes']
          },
          {
            control: 'RBAC',
            description: 'Role-based access control',
            implementation: 'Kubernetes RBAC with service accounts',
            components: ['k8s-control-plane', 'k8s-worker-nodes']
          }
        ],
        compliance: ['SOC2', 'ISO27001'],
        bestPractices: [
          'Implement pod security standards',
          'Use network policies for micro-segmentation',
          'Regular security scanning of container images',
          'Enable audit logging',
          'Implement admission controllers'
        ]
      },
      monitoring: {
        overview: 'Comprehensive observability with metrics, logs, and distributed tracing',
        metrics: [
          {
            name: 'Service Response Time',
            description: 'API response latency by service',
            source: 'Istio/Service Mesh',
            threshold: '< 200ms P95',
            actions: ['Scale service', 'Investigate bottlenecks']
          },
          {
            name: 'Error Rate',
            description: 'HTTP error rate by service',
            source: 'Application/Ingress',
            threshold: '< 1%',
            actions: ['Check service health', 'Review recent deployments']
          },
          {
            name: 'Resource Utilization',
            description: 'CPU and memory usage by pod',
            source: 'Kubernetes Metrics',
            threshold: 'CPU < 80%, Memory < 85%',
            actions: ['Horizontal/Vertical scaling', 'Resource optimization']
          }
        ],
        alerts: [
          {
            name: 'High Error Rate',
            condition: 'Error rate > 5% for 2 minutes',
            severity: 'critical',
            response: ['Immediate investigation', 'Consider rollback']
          },
          {
            name: 'Service Down',
            condition: 'Service availability < 100% for 1 minute',
            severity: 'critical',
            response: ['Check pod status', 'Verify service configuration']
          },
          {
            name: 'Resource Pressure',
            condition: 'Node resource utilization > 90% for 5 minutes',
            severity: 'warning',
            response: ['Scale cluster', 'Optimize resource requests']
          }
        ],
        dashboards: [
          {
            name: 'Service Overview',
            description: 'High-level service health and performance',
            metrics: ['Request rate', 'Error rate', 'Response time', 'Throughput']
          },
          {
            name: 'Infrastructure Overview',
            description: 'Cluster and node-level metrics',
            metrics: ['CPU', 'Memory', 'Network', 'Storage', 'Pod count']
          },
          {
            name: 'Service Mesh Overview',
            description: 'Service mesh specific metrics and topology',
            metrics: ['mTLS success rate', 'Service dependencies', 'Traffic flow']
          }
        ],
        logs: [
          {
            source: 'Application logs',
            format: 'JSON structured logging',
            retention: '30 days',
            analysis: ['Error tracking', 'Performance analysis', 'Security events']
          },
          {
            source: 'Audit logs',
            format: 'Kubernetes audit',
            retention: '90 days',
            analysis: ['Security compliance', 'Access patterns', 'Configuration changes']
          }
        ]
      },
      troubleshooting: {
        commonIssues: [
          {
            issue: 'Service discovery failures',
            symptoms: ['Connection timeouts', 'DNS resolution errors'],
            causes: ['Network policy blocking', 'Service mesh configuration', 'CoreDNS issues'],
            solutions: ['Check network policies', 'Verify service mesh config', 'Restart CoreDNS']
          },
          {
            issue: 'High latency between services',
            symptoms: ['Slow API responses', 'Timeout errors'],
            causes: ['Network congestion', 'Resource constraints', 'Service mesh overhead'],
            solutions: ['Scale resources', 'Optimize service mesh', 'Check network configuration']
          }
        ],
        diagnostics: [
          {
            scenario: 'Service communication issues',
            steps: ['Check service endpoints', 'Verify network policies', 'Test service mesh connectivity'],
            tools: ['kubectl', 'istioctl', 'Service mesh proxy logs'],
            expectedResults: ['Service reachability confirmed', 'Traffic flowing correctly']
          }
        ],
        support: {
          contacts: ['Platform team', 'SRE team'],
          resources: ['Kubernetes documentation', 'Service mesh guides', 'Runbooks'],
          escalation: ['Cloud provider support', 'CNCF community']
        }
      },
      references: [
        {
          title: 'Kubernetes Best Practices',
          type: 'documentation',
          url: 'https://kubernetes.io/docs/concepts/',
          description: 'Official Kubernetes documentation and best practices',
          relevance: 'high'
        },
        {
          title: 'Microservices Patterns',
          type: 'book',
          url: 'https://microservices.io/patterns/',
          description: 'Comprehensive guide to microservices architecture patterns',
          relevance: 'high'
        }
      ]
    },
    tags: ['kubernetes', 'microservices', 'containers', 'service-mesh', 'observability', 'advanced'],
    author: 'InfraGeni Team',
    license: 'MIT',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    providers: ['aws', 'azure', 'gcp', 'generic'],
    requiredFeatures: ['kubernetes', 'load-balancer', 'monitoring'],
    changelog: [
      {
        version: '1.0.0',
        date: '2024-01-01',
        changes: ['Initial release of Kubernetes microservices pattern'],
        breaking: false
      }
    ],
    migrations: []
  };
}

/**
 * Event-Driven Microservices Pattern
 * Asynchronous communication with message brokers
 */
export function createEventDrivenMicroservicesPattern(): InfrastructurePattern {
  const components: ComponentReference[] = [
    {
      componentId: 'generic-vpc',
      instanceId: 'event-vpc',
      displayName: 'Event-Driven VPC',
      position: { x: 50, y: 50 },
      configuration: {
        cidrBlock: '10.1.0.0/16',
        enableDnsHostnames: true
      },
      required: true,
      dependencies: [],
      metadata: {
        description: 'Virtual private cloud for event-driven architecture'
      }
    },
    {
      componentId: 'generic-message-queue',
      instanceId: 'event-bus',
      displayName: 'Event Bus',
      position: { x: 300, y: 150 },
      configuration: {
        type: 'kafka',
        version: '3.0',
        partitions: 12,
        replicationFactor: 3,
        retentionMs: 604800000
      },
      required: true,
      dependencies: ['event-vpc'],
      metadata: {
        description: 'Central event bus for asynchronous communication'
      }
    },
    {
      componentId: 'generic-compute',
      instanceId: 'user-service',
      displayName: 'User Service',
      position: { x: 100, y: 250 },
      configuration: {
        instanceType: 't3.medium',
        operatingSystem: 'linux',
        containerized: true
      },
      required: true,
      dependencies: ['event-vpc'],
      metadata: {
        description: 'User management microservice'
      }
    },
    {
      componentId: 'generic-compute',
      instanceId: 'order-service',
      displayName: 'Order Service',
      position: { x: 300, y: 250 },
      configuration: {
        instanceType: 't3.medium',
        operatingSystem: 'linux',
        containerized: true
      },
      required: true,
      dependencies: ['event-vpc'],
      metadata: {
        description: 'Order processing microservice'
      }
    },
    {
      componentId: 'generic-compute',
      instanceId: 'payment-service',
      displayName: 'Payment Service',
      position: { x: 500, y: 250 },
      configuration: {
        instanceType: 't3.medium',
        operatingSystem: 'linux',
        containerized: true
      },
      required: true,
      dependencies: ['event-vpc'],
      metadata: {
        description: 'Payment processing microservice'
      }
    },
    {
      componentId: 'generic-compute',
      instanceId: 'notification-service',
      displayName: 'Notification Service',
      position: { x: 200, y: 350 },
      configuration: {
        instanceType: 't3.small',
        operatingSystem: 'linux',
        containerized: true
      },
      required: true,
      dependencies: ['event-vpc'],
      metadata: {
        description: 'Notification and communication service'
      }
    },
    {
      componentId: 'generic-database',
      instanceId: 'event-store',
      displayName: 'Event Store',
      position: { x: 450, y: 150 },
      configuration: {
        engine: 'postgresql',
        version: '14',
        instanceClass: 'db.t3.medium',
        multiAz: true,
        encrypted: true
      },
      required: true,
      dependencies: ['event-vpc'],
      metadata: {
        description: 'Persistent event storage for event sourcing'
      }
    }
  ];

  const relationships: ComponentRelationship[] = [
    {
      id: 'services-event-bus',
      fromInstanceId: 'user-service',
      toInstanceId: 'event-bus',
      relationshipType: RelationshipType.MESSAGE_FLOW,
      configuration: {
        bidirectional: true,
        protocols: ['kafka'],
        ports: [9092],
        security: {
          encryption: true,
          authentication: ['sasl'],
          authorization: ['acl'],
          compliance: []
        }
      },
      metadata: {
        description: 'Services communicate via event bus'
      }
    },
    {
      id: 'order-event-bus',
      fromInstanceId: 'order-service',
      toInstanceId: 'event-bus',
      relationshipType: RelationshipType.MESSAGE_FLOW,
      configuration: {
        bidirectional: true,
        protocols: ['kafka'],
        ports: [9092],
        security: {
          encryption: true,
          authentication: ['sasl'],
          authorization: ['acl'],
          compliance: []
        }
      },
      metadata: {
        description: 'Order service publishes and consumes events'
      }
    },
    {
      id: 'payment-event-bus',
      fromInstanceId: 'payment-service',
      toInstanceId: 'event-bus',
      relationshipType: RelationshipType.MESSAGE_FLOW,
      configuration: {
        bidirectional: true,
        protocols: ['kafka'],
        ports: [9092],
        security: {
          encryption: true,
          authentication: ['sasl'],
          authorization: ['acl'],
          compliance: []
        }
      },
      metadata: {
        description: 'Payment service processes payment events'
      }
    },
    {
      id: 'notification-event-bus',
      fromInstanceId: 'notification-service',
      toInstanceId: 'event-bus',
      relationshipType: RelationshipType.MESSAGE_FLOW,
      configuration: {
        bidirectional: false,
        protocols: ['kafka'],
        ports: [9092],
        security: {
          encryption: true,
          authentication: ['sasl'],
          authorization: ['acl'],
          compliance: []
        }
      },
      metadata: {
        description: 'Notification service consumes events'
      }
    },
    {
      id: 'event-bus-store',
      fromInstanceId: 'event-bus',
      toInstanceId: 'event-store',
      relationshipType: RelationshipType.DATA_FLOW,
      configuration: {
        bidirectional: false,
        protocols: ['postgresql'],
        ports: [5432],
        security: {
          encryption: true,
          authentication: ['username-password'],
          authorization: ['database-roles'],
          compliance: []
        }
      },
      metadata: {
        description: 'Event bus persists events to event store'
      }
    }
  ];

  return {
    id: 'event-driven-microservices',
    name: 'Event-Driven Microservices Architecture',
    description: 'Asynchronous microservices architecture with event sourcing and CQRS patterns',
    version: '1.0.0',
    category: PatternCategory.MICROSERVICES,
    complexity: PatternComplexity.ADVANCED,
    status: PatternStatus.PUBLISHED,
    components,
    relationships,
    parameters: [
      {
        id: 'message_broker',
        name: 'Message Broker',
        description: 'Type of message broker to use',
        type: 'select',
        required: false,
        defaultValue: 'kafka',
        options: [
          { value: 'kafka', label: 'Apache Kafka' },
          { value: 'rabbitmq', label: 'RabbitMQ' },
          { value: 'aws-eventbridge', label: 'AWS EventBridge' },
          { value: 'azure-servicebus', label: 'Azure Service Bus' }
        ],
        affects: ['event-bus']
      },
      {
        id: 'event_sourcing',
        name: 'Event Sourcing',
        description: 'Enable event sourcing pattern',
        type: 'boolean',
        required: false,
        defaultValue: true,
        affects: ['event-store']
      }
    ],
    preview: {
      thumbnail: '',
      description: 'Scalable event-driven microservices with asynchronous communication',
      features: [
        'Asynchronous service communication',
        'Event sourcing and CQRS',
        'Resilient message processing',
        'Loose coupling between services',
        'Eventual consistency',
        'Audit trail and replay capability'
      ],
      benefits: [
        'High resilience and fault tolerance',
        'Independent service scaling',
        'Technology diversity',
        'Temporal decoupling',
        'Natural audit trail'
      ],
      useCases: [
        'E-commerce platforms',
        'Financial trading systems',
        'Real-time analytics',
        'IoT data processing',
        'Workflow orchestration'
      ]
    },
    documentation: {
      overview: 'This pattern implements an event-driven microservices architecture using asynchronous messaging for service communication, with optional event sourcing for data persistence.',
      architecture: {
        description: 'Event-driven architecture with central message bus and independent services',
        components: [
          {
            instanceId: 'event-bus',
            purpose: 'Central message broker for event distribution',
            configuration: 'High-throughput message streaming with persistence',
            alternatives: ['Cloud messaging services', 'NATS', 'Apache Pulsar']
          },
          {
            instanceId: 'event-store',
            purpose: 'Persistent storage for events in event sourcing pattern',
            configuration: 'Append-only event storage with replay capabilities',
            alternatives: ['Event Store DB', 'Time-series databases', 'Cloud event stores']
          }
        ],
        dataFlow: 'Services publish events → Event Bus → Subscribers consume events → Event Store',
        keyDecisions: [
          {
            decision: 'Use event-driven communication',
            rationale: 'Enables loose coupling and high resilience',
            alternatives: ['Synchronous API calls', 'Database sharing'],
            tradeoffs: ['Eventual consistency', 'Better fault tolerance']
          }
        ]
      },
      deployment: {
        prerequisites: [
          'Container orchestration platform',
          'Message broker cluster',
          'Event store database',
          'Service mesh (optional)'
        ],
        steps: [
          {
            title: 'Deploy message broker',
            description: 'Set up Kafka or chosen message broker',
            commands: ['helm install kafka bitnami/kafka'],
            expectedOutput: 'Message broker cluster running'
          },
          {
            title: 'Deploy event store',
            description: 'Set up event sourcing database',
            commands: ['helm install postgresql bitnami/postgresql'],
            expectedOutput: 'Event store database accessible'
          },
          {
            title: 'Deploy microservices',
            description: 'Deploy individual microservices',
            commands: ['kubectl apply -f microservices/'],
            expectedOutput: 'All services running and connected'
          }
        ],
        verification: [
          'Test event publishing and consumption',
          'Verify service independence',
          'Confirm event persistence'
        ],
        rollback: [
          'Stop event consumers',
          'Drain message queues',
          'Restore previous service versions'
        ]
      },
      configuration: {
        parameters: [],
        environments: [
          {
            name: 'development',
            description: 'Development environment with simplified setup',
            parameters: {
              message_broker: 'rabbitmq',
              event_sourcing: false
            },
            notes: ['Single broker instance', 'In-memory event storage']
          },
          {
            name: 'production',
            description: 'Production environment with full resilience',
            parameters: {
              message_broker: 'kafka',
              event_sourcing: true
            },
            notes: ['Multi-broker cluster', 'Persistent event storage']
          }
        ],
        secrets: [
          {
            name: 'broker_credentials',
            description: 'Message broker authentication credentials',
            required: true
          },
          {
            name: 'database_credentials',
            description: 'Event store database credentials',
            required: true
          }
        ],
        customization: []
      },
      security: {
        overview: 'Security through message-level encryption, authentication, and authorization',
        threats: [
          {
            threat: 'Message interception',
            impact: 'high',
            likelihood: 'medium',
            mitigation: ['Message encryption', 'Secure channels', 'Access controls']
          }
        ],
        controls: [
          {
            control: 'Message encryption',
            description: 'End-to-end encryption of event messages',
            implementation: 'TLS encryption with message-level encryption',
            components: ['event-bus']
          }
        ],
        compliance: ['SOC2'],
        bestPractices: [
          'Encrypt sensitive event data',
          'Implement message authentication',
          'Use secure communication channels',
          'Regular access review'
        ]
      },
      monitoring: {
        overview: 'Event-centric monitoring with message flow tracking and lag monitoring',
        metrics: [
          {
            name: 'Message Throughput',
            description: 'Messages per second by topic',
            source: 'Message Broker',
            threshold: 'Baseline ±20%',
            actions: ['Scale consumers', 'Investigate bottlenecks']
          },
          {
            name: 'Consumer Lag',
            description: 'Message processing delay',
            source: 'Message Broker',
            threshold: '< 1000 messages',
            actions: ['Scale consumers', 'Optimize processing']
          }
        ],
        alerts: [
          {
            name: 'High Consumer Lag',
            condition: 'Consumer lag > 5000 messages for 5 minutes',
            severity: 'warning',
            response: ['Scale consumers', 'Check processing efficiency']
          }
        ],
        dashboards: [
          {
            name: 'Event Flow Overview',
            description: 'Message broker and event flow metrics',
            metrics: ['Throughput', 'Lag', 'Error rate', 'Processing time']
          }
        ],
        logs: [
          {
            source: 'Event processing logs',
            format: 'Structured JSON with correlation IDs',
            retention: '30 days',
            analysis: ['Event flow tracing', 'Error analysis', 'Performance insights']
          }
        ]
      },
      troubleshooting: {
        commonIssues: [
          {
            issue: 'Message processing delays',
            symptoms: ['High consumer lag', 'Slow event processing'],
            causes: ['Insufficient consumers', 'Processing bottlenecks', 'Resource constraints'],
            solutions: ['Scale consumers', 'Optimize message processing', 'Increase resources']
          }
        ],
        diagnostics: [
          {
            scenario: 'Event flow issues',
            steps: ['Check message broker health', 'Verify consumer connectivity', 'Analyze processing logs'],
            tools: ['Kafka tools', 'Consumer monitoring', 'Distributed tracing'],
            expectedResults: ['Event flow confirmed', 'Processing lag identified']
          }
        ],
        support: {
          contacts: ['Platform team', 'Event streaming team'],
          resources: ['Event-driven architecture guides', 'Message broker documentation'],
          escalation: ['Message broker vendor support']
        }
      },
      references: [
        {
          title: 'Event-Driven Architecture Patterns',
          type: 'documentation',
          url: 'https://microservices.io/patterns/data/event-driven-architecture.html',
          description: 'Comprehensive guide to event-driven architecture patterns',
          relevance: 'high'
        }
      ]
    },
    tags: ['event-driven', 'microservices', 'kafka', 'event-sourcing', 'async', 'advanced'],
    author: 'InfraGeni Team',
    license: 'MIT',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    providers: ['aws', 'azure', 'gcp', 'generic'],
    requiredFeatures: ['message-queue', 'database', 'compute'],
    changelog: [
      {
        version: '1.0.0',
        date: '2024-01-01',
        changes: ['Initial release of event-driven microservices pattern'],
        breaking: false
      }
    ],
    migrations: []
  };
}

/**
 * Template for generating customizable microservices architectures
 */
export function createMicroservicesTemplate(): PatternTemplate {
  return {
    id: 'microservices-template',
    name: 'Microservices Architecture Template',
    description: 'Customizable template for microservices architectures',
    category: PatternCategory.MICROSERVICES,
    complexity: PatternComplexity.ADVANCED,
    parameters: [
      {
        id: 'project_name',
        name: 'Project Name',
        description: 'Name of your project',
        type: 'string',
        required: true,
        defaultValue: 'microservices-app',
        affects: ['vpc', 'services']
      },
      {
        id: 'architecture_style',
        name: 'Architecture Style',
        description: 'Microservices architecture pattern',
        type: 'select',
        required: true,
        defaultValue: 'kubernetes',
        options: [
          { value: 'kubernetes', label: 'Kubernetes-based' },
          { value: 'event-driven', label: 'Event-driven' },
          { value: 'serverless', label: 'Serverless' }
        ],
        affects: ['all-components']
      },
      {
        id: 'service_count',
        name: 'Number of Services',
        description: 'Number of microservices to create',
        type: 'number',
        required: false,
        defaultValue: 3,
        validation: {
          min: 2,
          max: 20
        },
        affects: ['services']
      },
      {
        id: 'communication_pattern',
        name: 'Communication Pattern',
        description: 'How services communicate',
        type: 'select',
        required: false,
        defaultValue: 'synchronous',
        options: [
          { value: 'synchronous', label: 'Synchronous (REST/gRPC)' },
          { value: 'asynchronous', label: 'Asynchronous (Events)' },
          { value: 'hybrid', label: 'Hybrid (Both)' }
        ],
        affects: ['api-gateway', 'message-broker']
      },
      {
        id: 'observability_stack',
        name: 'Observability Stack',
        description: 'Monitoring and observability tools',
        type: 'multiselect',
        required: false,
        defaultValue: ['prometheus', 'grafana'],
        options: [
          { value: 'prometheus', label: 'Prometheus' },
          { value: 'grafana', label: 'Grafana' },
          { value: 'jaeger', label: 'Jaeger' },
          { value: 'elasticsearch', label: 'Elasticsearch' },
          { value: 'kibana', label: 'Kibana' }
        ],
        affects: ['observability-stack']
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
          left: { type: 'parameter', name: 'communication_pattern' },
          right: 'asynchronous'
        },
        actions: [
          {
            type: 'add_component',
            target: 'message-broker',
            data: {
              instanceId: '{{project_name}}-message-broker',
              componentId: 'generic-message-queue',
              displayName: '{{project_name}} Message Broker',
              position: { x: 300, y: 200 },
              configuration: {
                type: 'kafka',
                partitions: 12,
                replicationFactor: 3
              },
              required: true,
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
      tags: ['microservices', 'template', 'scalable', 'customizable'],
      examples: [
        {
          name: 'E-commerce Microservices',
          description: 'Microservices for e-commerce platform',
          parameters: {
            project_name: 'ecommerce-platform',
            architecture_style: 'kubernetes',
            service_count: 5,
            communication_pattern: 'hybrid',
            observability_stack: ['prometheus', 'grafana', 'jaeger']
          },
          expectedComponents: 12
        },
        {
          name: 'Event-Driven System',
          description: 'Event-driven microservices architecture',
          parameters: {
            project_name: 'event-system',
            architecture_style: 'event-driven',
            service_count: 4,
            communication_pattern: 'asynchronous',
            observability_stack: ['prometheus', 'grafana']
          },
          expectedComponents: 8
        }
      ]
    }
  };
}