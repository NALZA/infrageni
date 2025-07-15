import { useAtom } from 'jotai';
import { providerAtom } from '../lib/provider-atom';

// Enhanced component interface with additional metadata
export interface ExtendedGenericComponent {
  id: string;
  label: string;
  providerNames: Record<string, string>;
  isBoundingBox?: boolean;
  category: 'networking' | 'compute' | 'storage' | 'database' | 'security' | 'analytics' | 'ml' | 'iot' | 'serverless' | 'monitoring' | 'container' | 'queue';
  subcategory?: string;
  description: string;
  documentation?: {
    aws?: string;
    azure?: string;
    gcp?: string;
  };
  complexity: 'basic' | 'intermediate' | 'advanced';
  dependencies?: string[];
  compatibleWith?: string[];
  pricing?: {
    aws?: 'free' | 'low' | 'medium' | 'high' | 'enterprise';
    azure?: 'free' | 'low' | 'medium' | 'high' | 'enterprise';
    gcp?: 'free' | 'low' | 'medium' | 'high' | 'enterprise';
  };
}

// Phase 1: Core Infrastructure Components (22 components)
export const EXTENDED_COMPONENTS: ExtendedGenericComponent[] = [
  // Existing basic components
  {
    id: 'vpc',
    label: 'Virtual Private Cloud',
    isBoundingBox: true,
    category: 'networking',
    description: 'Isolated network environment for cloud resources',
    complexity: 'basic',
    providerNames: {
      aws: 'VPC',
      azure: 'Virtual Network',
      gcp: 'VPC Network',
      generic: 'Virtual Private Cloud',
    },
    pricing: {
      aws: 'free',
      azure: 'free',
      gcp: 'free',
    },
  },
  {
    id: 'subnet',
    label: 'Subnet',
    isBoundingBox: true,
    category: 'networking',
    description: 'Network segment within a VPC',
    complexity: 'basic',
    providerNames: {
      aws: 'Subnet',
      azure: 'Subnet',
      gcp: 'Subnetwork',
      generic: 'Subnet',
    },
    pricing: {
      aws: 'free',
      azure: 'free',
      gcp: 'free',
    },
  },
  {
    id: 'availability-zone',
    label: 'Availability Zone',
    isBoundingBox: true,
    category: 'networking',
    description: 'Isolated location within a region',
    complexity: 'basic',
    providerNames: {
      aws: 'Availability Zone',
      azure: 'Availability Zone',
      gcp: 'Zone',
      generic: 'Availability Zone',
    },
    pricing: {
      aws: 'free',
      azure: 'free',
      gcp: 'free',
    },
  },
  {
    id: 'compute',
    label: 'Compute Instance',
    category: 'compute',
    description: 'Virtual machine for running applications',
    complexity: 'basic',
    providerNames: {
      aws: 'EC2 Instance',
      azure: 'Virtual Machine',
      gcp: 'Compute Engine',
      generic: 'Compute Instance',
    },
    pricing: {
      aws: 'low',
      azure: 'low',
      gcp: 'low',
    },
  },
  {
    id: 'database',
    label: 'Database',
    category: 'database',
    description: 'Managed database service',
    complexity: 'basic',
    providerNames: {
      aws: 'RDS Database',
      azure: 'Azure SQL',
      gcp: 'Cloud SQL',
      generic: 'Database',
    },
    pricing: {
      aws: 'medium',
      azure: 'medium',
      gcp: 'medium',
    },
  },
  {
    id: 'storage',
    label: 'Storage Bucket',
    category: 'storage',
    description: 'Object storage for files and data',
    complexity: 'basic',
    providerNames: {
      aws: 'S3 Bucket',
      azure: 'Blob Storage',
      gcp: 'Cloud Storage',
      generic: 'Storage Bucket',
    },
    pricing: {
      aws: 'low',
      azure: 'low',
      gcp: 'low',
    },
  },
  {
    id: 'external-system',
    label: 'External System',
    category: 'networking',
    description: 'External service or system',
    complexity: 'basic',
    providerNames: {
      aws: 'External System',
      azure: 'External System',
      gcp: 'External System',
      generic: 'External System',
    },
    pricing: {
      aws: 'free',
      azure: 'free',
      gcp: 'free',
    },
  },
  {
    id: 'user',
    label: 'User',
    category: 'security',
    description: 'User or client accessing the system',
    complexity: 'basic',
    providerNames: {
      aws: 'User',
      azure: 'User',
      gcp: 'User',
      generic: 'User',
    },
    pricing: {
      aws: 'free',
      azure: 'free',
      gcp: 'free',
    },
  },

  // New Networking Components
  {
    id: 'load-balancer',
    label: 'Load Balancer',
    category: 'networking',
    description: 'Distributes incoming traffic across multiple targets',
    complexity: 'intermediate',
    providerNames: {
      aws: 'Application Load Balancer',
      azure: 'Azure Load Balancer',
      gcp: 'Cloud Load Balancing',
      generic: 'Load Balancer',
    },
    pricing: {
      aws: 'medium',
      azure: 'medium',
      gcp: 'medium',
    },
  },
  {
    id: 'api-gateway',
    label: 'API Gateway',
    category: 'networking',
    description: 'Managed API gateway for REST and WebSocket APIs',
    complexity: 'intermediate',
    providerNames: {
      aws: 'API Gateway',
      azure: 'API Management',
      gcp: 'API Gateway',
      generic: 'API Gateway',
    },
    pricing: {
      aws: 'medium',
      azure: 'medium',
      gcp: 'medium',
    },
  },
  {
    id: 'cdn',
    label: 'Content Delivery Network',
    category: 'networking',
    description: 'Global content delivery network',
    complexity: 'intermediate',
    providerNames: {
      aws: 'CloudFront',
      azure: 'Azure CDN',
      gcp: 'Cloud CDN',
      generic: 'CDN',
    },
    pricing: {
      aws: 'medium',
      azure: 'medium',
      gcp: 'medium',
    },
  },
  {
    id: 'vpn-gateway',
    label: 'VPN Gateway',
    category: 'networking',
    description: 'Secure connection between networks',
    complexity: 'intermediate',
    providerNames: {
      aws: 'VPN Gateway',
      azure: 'VPN Gateway',
      gcp: 'Cloud VPN',
      generic: 'VPN Gateway',
    },
    pricing: {
      aws: 'medium',
      azure: 'medium',
      gcp: 'medium',
    },
  },
  {
    id: 'nat-gateway',
    label: 'NAT Gateway',
    category: 'networking',
    description: 'Network address translation for outbound traffic',
    complexity: 'intermediate',
    providerNames: {
      aws: 'NAT Gateway',
      azure: 'NAT Gateway',
      gcp: 'Cloud NAT',
      generic: 'NAT Gateway',
    },
    pricing: {
      aws: 'medium',
      azure: 'medium',
      gcp: 'medium',
    },
  },

  // Security Components
  {
    id: 'waf',
    label: 'Web Application Firewall',
    category: 'security',
    description: 'Application-layer firewall protection',
    complexity: 'intermediate',
    providerNames: {
      aws: 'AWS WAF',
      azure: 'Azure WAF',
      gcp: 'Cloud Armor',
      generic: 'WAF',
    },
    pricing: {
      aws: 'medium',
      azure: 'medium',
      gcp: 'medium',
    },
  },
  {
    id: 'iam',
    label: 'Identity & Access Management',
    category: 'security',
    description: 'User identity and access control',
    complexity: 'intermediate',
    providerNames: {
      aws: 'IAM',
      azure: 'Azure Active Directory',
      gcp: 'Cloud IAM',
      generic: 'IAM',
    },
    pricing: {
      aws: 'free',
      azure: 'low',
      gcp: 'free',
    },
  },
  {
    id: 'key-management',
    label: 'Key Management Service',
    category: 'security',
    description: 'Encryption key management',
    complexity: 'intermediate',
    providerNames: {
      aws: 'KMS',
      azure: 'Key Vault',
      gcp: 'Cloud KMS',
      generic: 'Key Management',
    },
    pricing: {
      aws: 'low',
      azure: 'low',
      gcp: 'low',
    },
  },
  {
    id: 'certificate-manager',
    label: 'Certificate Manager',
    category: 'security',
    description: 'SSL/TLS certificate management',
    complexity: 'intermediate',
    providerNames: {
      aws: 'Certificate Manager',
      azure: 'Key Vault Certificates',
      gcp: 'Certificate Manager',
      generic: 'Certificate Manager',
    },
    pricing: {
      aws: 'free',
      azure: 'low',
      gcp: 'free',
    },
  },

  // Monitoring & Logging Components
  {
    id: 'monitoring',
    label: 'Monitoring Service',
    category: 'monitoring',
    description: 'Application and infrastructure monitoring',
    complexity: 'intermediate',
    providerNames: {
      aws: 'CloudWatch',
      azure: 'Azure Monitor',
      gcp: 'Cloud Monitoring',
      generic: 'Monitoring',
    },
    pricing: {
      aws: 'medium',
      azure: 'medium',
      gcp: 'medium',
    },
  },
  {
    id: 'logging',
    label: 'Logging Service',
    category: 'monitoring',
    description: 'Centralized log management',
    complexity: 'intermediate',
    providerNames: {
      aws: 'CloudWatch Logs',
      azure: 'Log Analytics',
      gcp: 'Cloud Logging',
      generic: 'Logging',
    },
    pricing: {
      aws: 'medium',
      azure: 'medium',
      gcp: 'medium',
    },
  },
  {
    id: 'application-insights',
    label: 'Application Performance Monitoring',
    category: 'monitoring',
    description: 'Application performance and tracing',
    complexity: 'intermediate',
    providerNames: {
      aws: 'X-Ray',
      azure: 'Application Insights',
      gcp: 'Cloud Trace',
      generic: 'APM',
    },
    pricing: {
      aws: 'medium',
      azure: 'medium',
      gcp: 'medium',
    },
  },

  // Container Services
  {
    id: 'container-registry',
    label: 'Container Registry',
    category: 'container',
    description: 'Container image registry',
    complexity: 'intermediate',
    providerNames: {
      aws: 'ECR',
      azure: 'Container Registry',
      gcp: 'Artifact Registry',
      generic: 'Container Registry',
    },
    pricing: {
      aws: 'low',
      azure: 'low',
      gcp: 'low',
    },
  },
  {
    id: 'kubernetes',
    label: 'Kubernetes Service',
    category: 'container',
    description: 'Managed Kubernetes cluster',
    complexity: 'advanced',
    providerNames: {
      aws: 'EKS',
      azure: 'AKS',
      gcp: 'GKE',
      generic: 'Kubernetes',
    },
    pricing: {
      aws: 'high',
      azure: 'high',
      gcp: 'high',
    },
  },
  {
    id: 'container-instances',
    label: 'Container Instances',
    category: 'container',
    description: 'Serverless container execution',
    complexity: 'intermediate',
    providerNames: {
      aws: 'ECS Fargate',
      azure: 'Container Instances',
      gcp: 'Cloud Run',
      generic: 'Container Instances',
    },
    pricing: {
      aws: 'medium',
      azure: 'medium',
      gcp: 'medium',
    },
  },

  // Message Queues
  {
    id: 'message-queue',
    label: 'Message Queue',
    category: 'queue',
    description: 'Asynchronous message queuing service',
    complexity: 'intermediate',
    providerNames: {
      aws: 'SQS',
      azure: 'Service Bus',
      gcp: 'Pub/Sub',
      generic: 'Message Queue',
    },
    pricing: {
      aws: 'low',
      azure: 'low',
      gcp: 'low',
    },
  },
  {
    id: 'event-hub',
    label: 'Event Hub',
    category: 'queue',
    description: 'Event streaming and processing',
    complexity: 'intermediate',
    providerNames: {
      aws: 'EventBridge',
      azure: 'Event Hubs',
      gcp: 'Eventarc',
      generic: 'Event Hub',
    },
    pricing: {
      aws: 'medium',
      azure: 'medium',
      gcp: 'medium',
    },
  },

  // Developer Tools
  {
    id: 'cicd-pipeline',
    label: 'CI/CD Pipeline',
    category: 'monitoring',
    subcategory: 'devops',
    description: 'Continuous integration and deployment',
    complexity: 'intermediate',
    providerNames: {
      aws: 'CodePipeline',
      azure: 'Azure DevOps',
      gcp: 'Cloud Build',
      generic: 'CI/CD Pipeline',
    },
    pricing: {
      aws: 'medium',
      azure: 'medium',
      gcp: 'medium',
    },
  },
  {
    id: 'source-control',
    label: 'Source Control',
    category: 'monitoring',
    subcategory: 'devops',
    description: 'Git-based source code management',
    complexity: 'basic',
    providerNames: {
      aws: 'CodeCommit',
      azure: 'Azure Repos',
      gcp: 'Cloud Source Repositories',
      generic: 'Source Control',
    },
    pricing: {
      aws: 'free',
      azure: 'free',
      gcp: 'free',
    },
  },
];

export function useProvider() {
  const [provider] = useAtom(providerAtom);
  return provider;
}

export function getComponentsByCategory(category: string): ExtendedGenericComponent[] {
  return EXTENDED_COMPONENTS.filter(component => component.category === category);
}

export function getComponentsByComplexity(complexity: string): ExtendedGenericComponent[] {
  return EXTENDED_COMPONENTS.filter(component => component.complexity === complexity);
}

export function searchComponents(query: string): ExtendedGenericComponent[] {
  const lowercaseQuery = query.toLowerCase();
  return EXTENDED_COMPONENTS.filter(component => 
    component.label.toLowerCase().includes(lowercaseQuery) ||
    component.description.toLowerCase().includes(lowercaseQuery) ||
    Object.values(component.providerNames).some(name => 
      name.toLowerCase().includes(lowercaseQuery)
    )
  );
}