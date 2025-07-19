/**
 * Security and Compliance Pattern Library
 * Enterprise security, compliance, and governance architectures
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
 * Zero Trust Network Architecture Pattern
 * Modern security architecture with zero trust principles
 */
export function createZeroTrustPattern(): InfrastructurePattern {
  const components: ComponentReference[] = [
    {
      componentId: 'generic-vpc',
      instanceId: 'zero-trust-vpc',
      displayName: 'Zero Trust VPC',
      position: { x: 50, y: 50 },
      configuration: {
        cidrBlock: '10.4.0.0/16',
        enableDnsHostnames: true,
        flowLogs: true,
        dhcpOptions: true
      },
      required: true,
      dependencies: [],
      metadata: {
        description: 'Virtual private cloud with comprehensive logging'
      }
    },
    {
      componentId: 'generic-security',
      instanceId: 'identity-provider',
      displayName: 'Identity Provider',
      position: { x: 200, y: 150 },
      configuration: {
        type: 'enterprise-sso',
        mfa: true,
        riskBasedAuth: true,
        federation: true,
        provisioning: 'scim'
      },
      required: true,
      dependencies: ['zero-trust-vpc'],
      metadata: {
        description: 'Centralized identity and access management'
      }
    },
    {
      componentId: 'generic-security',
      instanceId: 'pam-solution',
      displayName: 'Privileged Access Management',
      position: { x: 400, y: 150 },
      configuration: {
        type: 'pam',
        sessionRecording: true,
        justInTimeAccess: true,
        credentialVaulting: true,
        passwordRotation: true
      },
      required: true,
      dependencies: ['zero-trust-vpc'],
      metadata: {
        description: 'Privileged access management and session control'
      }
    },
    {
      componentId: 'generic-security',
      instanceId: 'policy-engine',
      displayName: 'Policy Engine',
      position: { x: 300, y: 250 },
      configuration: {
        type: 'opa',
        realTimeDecisions: true,
        policyAsCode: true,
        auditLogging: true,
        apiGatewayIntegration: true
      },
      required: true,
      dependencies: ['zero-trust-vpc'],
      metadata: {
        description: 'Centralized policy decision point'
      }
    },
    {
      componentId: 'generic-security',
      instanceId: 'network-segmentation',
      displayName: 'Micro-segmentation',
      position: { x: 150, y: 300 },
      configuration: {
        type: 'microsegmentation',
        dynamicPolicies: true,
        applicationAware: true,
        encryption: true,
        inspection: true
      },
      required: true,
      dependencies: ['zero-trust-vpc'],
      metadata: {
        description: 'Application-aware network micro-segmentation'
      }
    },
    {
      componentId: 'generic-security',
      instanceId: 'endpoint-protection',
      displayName: 'Endpoint Protection',
      position: { x: 500, y: 250 },
      configuration: {
        type: 'edr',
        behavioralAnalysis: true,
        threatIntelligence: true,
        automaticResponse: true,
        deviceCompliance: true
      },
      required: true,
      dependencies: ['zero-trust-vpc'],
      metadata: {
        description: 'Advanced endpoint detection and response'
      }
    },
    {
      componentId: 'generic-security',
      instanceId: 'api-security',
      displayName: 'API Security Gateway',
      position: { x: 250, y: 350 },
      configuration: {
        type: 'api-gateway',
        rateLimiting: true,
        authentication: true,
        authorization: true,
        threatProtection: true,
        encryption: true
      },
      required: true,
      dependencies: ['zero-trust-vpc'],
      metadata: {
        description: 'API security and threat protection'
      }
    },
    {
      componentId: 'generic-monitoring',
      instanceId: 'siem-platform',
      displayName: 'SIEM Platform',
      position: { x: 450, y: 350 },
      configuration: {
        type: 'siem',
        realTimeAnalysis: true,
        threatIntelligence: true,
        incidentResponse: true,
        compliance: true,
        machineeLearning: true
      },
      required: true,
      dependencies: ['zero-trust-vpc'],
      metadata: {
        description: 'Security information and event management'
      }
    },
    {
      componentId: 'generic-storage',
      instanceId: 'security-data-lake',
      displayName: 'Security Data Lake',
      position: { x: 600, y: 300 },
      configuration: {
        type: 's3',
        encryption: true,
        immutable: true,
        lifecycle: true,
        compliance: true,
        retention: '7-years'
      },
      required: true,
      dependencies: ['zero-trust-vpc'],
      metadata: {
        description: 'Long-term security event storage and analytics'
      }
    },
    {
      componentId: 'generic-security',
      instanceId: 'certificate-authority',
      displayName: 'Certificate Authority',
      position: { x: 100, y: 200 },
      configuration: {
        type: 'private-ca',
        automation: true,
        shortLivedCerts: true,
        revocation: true,
        hsm: true
      },
      required: true,
      dependencies: ['zero-trust-vpc'],
      metadata: {
        description: 'Private certificate authority for mutual TLS'
      }
    }
  ];

  const relationships: ComponentRelationship[] = [
    {
      id: 'identity-policy-integration',
      fromInstanceId: 'identity-provider',
      toInstanceId: 'policy-engine',
      relationshipType: RelationshipType.SECURITY_FLOW,
      configuration: {
        bidirectional: true,
        protocols: ['saml', 'oidc'],
        security: {
          encryption: true,
          authentication: ['mutual-tls'],
          authorization: ['oauth2'],
          compliance: ['soc2', 'iso27001']
        }
      },
      metadata: {
        description: 'Identity provider integrates with policy engine'
      }
    },
    {
      id: 'pam-identity-integration',
      fromInstanceId: 'pam-solution',
      toInstanceId: 'identity-provider',
      relationshipType: RelationshipType.SECURITY_FLOW,
      configuration: {
        bidirectional: true,
        protocols: ['scim', 'ldap'],
        security: {
          encryption: true,
          authentication: ['mutual-tls'],
          authorization: ['oauth2'],
          compliance: ['soc2']
        }
      },
      metadata: {
        description: 'PAM integrates with identity provider'
      }
    },
    {
      id: 'network-policy-enforcement',
      fromInstanceId: 'network-segmentation',
      toInstanceId: 'policy-engine',
      relationshipType: RelationshipType.SECURITY_FLOW,
      configuration: {
        bidirectional: true,
        protocols: ['grpc', 'json-rpc'],
        security: {
          encryption: true,
          authentication: ['mutual-tls'],
          authorization: ['rbac'],
          compliance: []
        }
      },
      metadata: {
        description: 'Network segmentation enforces policies'
      }
    },
    {
      id: 'endpoint-siem-telemetry',
      fromInstanceId: 'endpoint-protection',
      toInstanceId: 'siem-platform',
      relationshipType: RelationshipType.MONITORING,
      configuration: {
        bidirectional: false,
        protocols: ['syslog', 'json'],
        security: {
          encryption: true,
          authentication: ['api-key'],
          authorization: ['rbac'],
          compliance: []
        }
      },
      metadata: {
        description: 'Endpoint protection sends telemetry to SIEM'
      }
    },
    {
      id: 'api-gateway-policy',
      fromInstanceId: 'api-security',
      toInstanceId: 'policy-engine',
      relationshipType: RelationshipType.SECURITY_FLOW,
      configuration: {
        bidirectional: true,
        protocols: ['grpc'],
        security: {
          encryption: true,
          authentication: ['mutual-tls'],
          authorization: ['rbac'],
          compliance: []
        }
      },
      metadata: {
        description: 'API gateway enforces dynamic policies'
      }
    },
    {
      id: 'siem-data-lake',
      fromInstanceId: 'siem-platform',
      toInstanceId: 'security-data-lake',
      relationshipType: RelationshipType.DATA_FLOW,
      configuration: {
        bidirectional: false,
        protocols: ['s3-api'],
        security: {
          encryption: true,
          authentication: ['iam'],
          authorization: ['bucket-policy'],
          compliance: ['soc2', 'iso27001']
        }
      },
      metadata: {
        description: 'SIEM archives data to security data lake'
      }
    },
    {
      id: 'ca-certificate-distribution',
      fromInstanceId: 'certificate-authority',
      toInstanceId: 'api-security',
      relationshipType: RelationshipType.SECURITY_FLOW,
      configuration: {
        bidirectional: false,
        protocols: ['acme', 'est'],
        security: {
          encryption: true,
          authentication: ['mutual-tls'],
          authorization: ['certificate-based'],
          compliance: []
        }
      },
      metadata: {
        description: 'CA provides certificates for mutual TLS'
      }
    }
  ];

  return {
    id: 'zero-trust-architecture',
    name: 'Zero Trust Network Architecture',
    description: 'Comprehensive zero trust security architecture with identity-centric controls and continuous verification',
    version: '1.0.0',
    category: PatternCategory.SECURITY,
    complexity: PatternComplexity.ADVANCED,
    status: PatternStatus.PUBLISHED,
    components,
    relationships,
    parameters: [
      {
        id: 'identity_provider_type',
        name: 'Identity Provider',
        description: 'Type of identity provider',
        type: 'select',
        required: false,
        defaultValue: 'enterprise-sso',
        options: [
          { value: 'active-directory', label: 'Active Directory' },
          { value: 'azure-ad', label: 'Azure Active Directory' },
          { value: 'okta', label: 'Okta' },
          { value: 'enterprise-sso', label: 'Enterprise SSO' }
        ],
        affects: ['identity-provider']
      },
      {
        id: 'compliance_framework',
        name: 'Compliance Framework',
        description: 'Primary compliance requirements',
        type: 'multiselect',
        required: false,
        defaultValue: ['soc2'],
        options: [
          { value: 'soc2', label: 'SOC 2' },
          { value: 'iso27001', label: 'ISO 27001' },
          { value: 'pci-dss', label: 'PCI DSS' },
          { value: 'hipaa', label: 'HIPAA' },
          { value: 'gdpr', label: 'GDPR' }
        ],
        affects: ['siem-platform', 'security-data-lake']
      },
      {
        id: 'threat_detection_level',
        name: 'Threat Detection Level',
        description: 'Level of advanced threat detection',
        type: 'select',
        required: false,
        defaultValue: 'advanced',
        options: [
          { value: 'basic', label: 'Basic' },
          { value: 'standard', label: 'Standard' },
          { value: 'advanced', label: 'Advanced with ML' }
        ],
        affects: ['siem-platform', 'endpoint-protection']
      }
    ],
    preview: {
      thumbnail: '',
      description: 'Enterprise-grade zero trust security architecture',
      features: [
        'Identity-centric security model',
        'Continuous verification and monitoring',
        'Micro-segmentation and least privilege',
        'Advanced threat detection and response',
        'Comprehensive audit and compliance',
        'Policy-as-code implementation'
      ],
      benefits: [
        'Reduced attack surface',
        'Enhanced threat detection',
        'Improved compliance posture',
        'Granular access control',
        'Real-time threat response'
      ],
      useCases: [
        'Enterprise security transformation',
        'Regulatory compliance requirements',
        'Remote workforce security',
        'Cloud migration security',
        'Third-party access management'
      ]
    },
    documentation: {
      overview: 'This pattern implements a comprehensive zero trust security architecture based on the principle of "never trust, always verify" with identity-centric controls.',
      architecture: {
        description: 'Zero trust architecture with identity, network, and data protection layers',
        components: [
          {
            instanceId: 'identity-provider',
            purpose: 'Centralized identity and access management with strong authentication',
            configuration: 'Enterprise SSO with MFA and risk-based authentication',
            alternatives: ['Azure AD', 'Okta', 'Ping Identity', 'AWS IAM Identity Center']
          },
          {
            instanceId: 'policy-engine',
            purpose: 'Dynamic policy evaluation and enforcement',
            configuration: 'Open Policy Agent with real-time decision making',
            alternatives: ['AWS Verified Access', 'Google BeyondCorp', 'Palo Alto Prisma']
          },
          {
            instanceId: 'siem-platform',
            purpose: 'Security monitoring and incident response',
            configuration: 'ML-powered SIEM with threat intelligence integration',
            alternatives: ['Splunk', 'QRadar', 'Sentinel', 'Chronicle']
          }
        ],
        dataFlow: 'User → Identity Provider → Policy Engine → Resource Access',
        keyDecisions: [
          {
            decision: 'Identity-centric architecture',
            rationale: 'Enables fine-grained access control and continuous verification',
            alternatives: ['Network-centric', 'Perimeter-based security'],
            tradeoffs: ['Implementation complexity', 'Enhanced security and flexibility']
          },
          {
            decision: 'Policy-as-code approach',
            rationale: 'Enables version control, testing, and automation of security policies',
            alternatives: ['GUI-based policy management', 'Manual policy configuration'],
            tradeoffs: ['Learning curve', 'Scalability and consistency']
          }
        ]
      },
      deployment: {
        prerequisites: [
          'Enterprise identity provider',
          'Network segmentation capability',
          'Certificate management infrastructure',
          'Security monitoring tools'
        ],
        steps: [
          {
            title: 'Deploy identity infrastructure',
            description: 'Set up identity provider and certificate authority',
            commands: ['helm install identity-provider identity/sso'],
            expectedOutput: 'Identity provider accessible and configured'
          },
          {
            title: 'Configure policy engine',
            description: 'Deploy and configure Open Policy Agent',
            commands: ['kubectl apply -f opa-deployment.yaml'],
            expectedOutput: 'Policy engine running and accessible'
          },
          {
            title: 'Implement network segmentation',
            description: 'Configure micro-segmentation and network policies',
            commands: ['kubectl apply -f network-policies/'],
            expectedOutput: 'Network segmentation active'
          },
          {
            title: 'Deploy security monitoring',
            description: 'Set up SIEM and security data lake',
            commands: ['helm install siem security/siem-platform'],
            expectedOutput: 'Security monitoring operational'
          }
        ],
        verification: [
          'Test user authentication flow',
          'Verify policy enforcement',
          'Confirm network segmentation',
          'Validate security monitoring'
        ],
        rollback: [
          'Disable policy enforcement',
          'Restore network connectivity',
          'Backup security configurations'
        ]
      },
      configuration: {
        parameters: [],
        environments: [
          {
            name: 'development',
            description: 'Development environment with basic security',
            parameters: {
              identity_provider_type: 'enterprise-sso',
              compliance_framework: ['soc2'],
              threat_detection_level: 'basic'
            },
            notes: ['Relaxed policies for development', 'Basic monitoring']
          },
          {
            name: 'production',
            description: 'Production environment with full zero trust',
            parameters: {
              identity_provider_type: 'enterprise-sso',
              compliance_framework: ['soc2', 'iso27001'],
              threat_detection_level: 'advanced'
            },
            notes: ['Strict policy enforcement', 'Advanced threat detection']
          }
        ],
        secrets: [
          {
            name: 'identity_provider_keys',
            description: 'Identity provider signing and encryption keys',
            required: true
          },
          {
            name: 'certificate_authority_keys',
            description: 'Private CA root and intermediate keys',
            required: true
          },
          {
            name: 'siem_api_keys',
            description: 'SIEM platform API and integration keys',
            required: true
          }
        ],
        customization: []
      },
      security: {
        overview: 'Multi-layered security with defense in depth and zero trust principles',
        threats: [
          {
            threat: 'Insider threats',
            impact: 'high',
            likelihood: 'medium',
            mitigation: ['Privileged access management', 'Continuous monitoring', 'Least privilege access']
          },
          {
            threat: 'Advanced persistent threats',
            impact: 'high',
            likelihood: 'medium',
            mitigation: ['Behavioral analysis', 'Threat intelligence', 'Incident response automation']
          },
          {
            threat: 'Credential theft',
            impact: 'high',
            likelihood: 'high',
            mitigation: ['Multi-factor authentication', 'Certificate-based authentication', 'Just-in-time access']
          }
        ],
        controls: [
          {
            control: 'Multi-factor authentication',
            description: 'Strong authentication for all access',
            implementation: 'Hardware tokens, biometrics, and risk-based authentication',
            components: ['identity-provider', 'pam-solution']
          },
          {
            control: 'Continuous monitoring',
            description: 'Real-time security monitoring and threat detection',
            implementation: 'SIEM with ML-based anomaly detection',
            components: ['siem-platform', 'endpoint-protection']
          },
          {
            control: 'Encryption everywhere',
            description: 'End-to-end encryption for all communications',
            implementation: 'Mutual TLS with short-lived certificates',
            components: ['certificate-authority', 'api-security']
          }
        ],
        compliance: ['SOC2', 'ISO27001', 'PCI-DSS', 'HIPAA', 'GDPR'],
        bestPractices: [
          'Implement least privilege access',
          'Use short-lived credentials',
          'Enable comprehensive logging',
          'Regular security assessments',
          'Automated incident response',
          'Continuous security training'
        ]
      },
      monitoring: {
        overview: 'Comprehensive security monitoring with real-time threat detection and response',
        metrics: [
          {
            name: 'Authentication Success Rate',
            description: 'Percentage of successful authentications',
            source: 'Identity Provider',
            threshold: '> 95%',
            actions: ['Investigate failed authentications', 'Check system health']
          },
          {
            name: 'Policy Violations',
            description: 'Number of policy violations detected',
            source: 'Policy Engine',
            threshold: '< 10 per hour',
            actions: ['Review policies', 'Investigate violations']
          },
          {
            name: 'Threat Detection Rate',
            description: 'Number of threats detected per day',
            source: 'SIEM Platform',
            threshold: 'Baseline trend',
            actions: ['Investigate threats', 'Update detection rules']
          }
        ],
        alerts: [
          {
            name: 'High-Risk Authentication',
            condition: 'Authentication from new location or device',
            severity: 'warning',
            response: ['Require additional verification', 'Log security event']
          },
          {
            name: 'Policy Violation',
            condition: 'Unauthorized access attempt',
            severity: 'critical',
            response: ['Block access', 'Initiate incident response']
          },
          {
            name: 'Threat Detected',
            condition: 'Advanced threat indicators found',
            severity: 'critical',
            response: ['Isolate affected systems', 'Begin incident response']
          }
        ],
        dashboards: [
          {
            name: 'Security Overview',
            description: 'High-level security posture and metrics',
            metrics: ['Authentication rate', 'Policy compliance', 'Threat detection', 'Incident response time']
          },
          {
            name: 'Threat Intelligence',
            description: 'Current threat landscape and indicators',
            metrics: ['Active threats', 'IOCs', 'Attack vectors', 'Threat trends']
          }
        ],
        logs: [
          {
            source: 'Security audit logs',
            format: 'CEF (Common Event Format)',
            retention: '7 years',
            analysis: ['Compliance reporting', 'Incident investigation', 'Behavioral analysis']
          },
          {
            source: 'Authentication logs',
            format: 'JSON with contextual information',
            retention: '1 year',
            analysis: ['Risk assessment', 'Usage patterns', 'Anomaly detection']
          }
        ]
      },
      troubleshooting: {
        commonIssues: [
          {
            issue: 'Authentication failures',
            symptoms: ['Users cannot log in', 'High authentication failure rate'],
            causes: ['Identity provider issues', 'Network connectivity', 'Certificate problems'],
            solutions: ['Check identity provider health', 'Verify network connectivity', 'Validate certificates']
          },
          {
            issue: 'Policy enforcement blocking legitimate access',
            symptoms: ['Users blocked from resources', 'Unexpected access denials'],
            causes: ['Overly restrictive policies', 'Policy evaluation errors', 'Context issues'],
            solutions: ['Review policy rules', 'Check policy evaluation logs', 'Adjust context parameters']
          }
        ],
        diagnostics: [
          {
            scenario: 'Security policy issues',
            steps: ['Check policy evaluation logs', 'Validate policy syntax', 'Test policy rules'],
            tools: ['Policy engine logs', 'OPA playground', 'Security dashboard'],
            expectedResults: ['Policy evaluation traced', 'Root cause identified']
          }
        ],
        support: {
          contacts: ['Security team', 'Identity management team'],
          resources: ['Zero trust implementation guide', 'Security playbooks'],
          escalation: ['Security vendor support', 'Emergency response team']
        }
      },
      references: [
        {
          title: 'NIST Zero Trust Architecture',
          type: 'specification',
          url: 'https://csrc.nist.gov/publications/detail/sp/800-207/final',
          description: 'NIST Special Publication 800-207 on Zero Trust Architecture',
          relevance: 'high'
        },
        {
          title: 'Zero Trust Security Model',
          type: 'whitepaper',
          url: 'https://www.nist.gov/blogs/cybersecurity-insights/zero-trust-cybersecurity-never-trust-always-verify',
          description: 'Comprehensive guide to zero trust security implementation',
          relevance: 'high'
        }
      ]
    },
    tags: ['zero-trust', 'security', 'identity', 'compliance', 'enterprise', 'advanced'],
    author: 'InfraGeni Team',
    license: 'MIT',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    providers: ['aws', 'azure', 'gcp', 'generic'],
    requiredFeatures: ['identity', 'security', 'monitoring'],
    changelog: [
      {
        version: '1.0.0',
        date: '2024-01-01',
        changes: ['Initial release of zero trust architecture pattern'],
        breaking: false
      }
    ],
    migrations: []
  };
}

/**
 * Compliance and Governance Pattern
 * Comprehensive compliance framework for regulated industries
 */
export function createComplianceGovernancePattern(): InfrastructurePattern {
  const components: ComponentReference[] = [
    {
      componentId: 'generic-vpc',
      instanceId: 'compliance-vpc',
      displayName: 'Compliance VPC',
      position: { x: 50, y: 50 },
      configuration: {
        cidrBlock: '10.5.0.0/16',
        enableDnsHostnames: true,
        flowLogs: true,
        vpcEndpoints: true
      },
      required: true,
      dependencies: [],
      metadata: {
        description: 'Compliance-focused virtual private cloud'
      }
    },
    {
      componentId: 'generic-security',
      instanceId: 'governance-framework',
      displayName: 'Governance Framework',
      position: { x: 200, y: 150 },
      configuration: {
        type: 'governance-platform',
        policyManagement: true,
        riskAssessment: true,
        complianceReporting: true,
        auditTrail: true
      },
      required: true,
      dependencies: ['compliance-vpc'],
      metadata: {
        description: 'Centralized governance and compliance management'
      }
    },
    {
      componentId: 'generic-security',
      instanceId: 'data-classification',
      displayName: 'Data Classification Engine',
      position: { x: 400, y: 150 },
      configuration: {
        type: 'data-classification',
        autoDiscovery: true,
        machineeLearning: true,
        labelingAutomation: true,
        piiDetection: true
      },
      required: true,
      dependencies: ['compliance-vpc'],
      metadata: {
        description: 'Automated data discovery and classification'
      }
    },
    {
      componentId: 'generic-security',
      instanceId: 'dlp-solution',
      displayName: 'Data Loss Prevention',
      position: { x: 300, y: 250 },
      configuration: {
        type: 'dlp',
        contentInspection: true,
        encryption: true,
        quarantine: true,
        reporting: true,
        integration: true
      },
      required: true,
      dependencies: ['compliance-vpc'],
      metadata: {
        description: 'Data loss prevention and protection'
      }
    },
    {
      componentId: 'generic-storage',
      instanceId: 'compliance-archive',
      displayName: 'Compliance Archive',
      position: { x: 500, y: 200 },
      configuration: {
        type: 'glacier',
        encryption: true,
        immutable: true,
        lifecycle: true,
        retention: 'regulatory',
        crossRegion: true
      },
      required: true,
      dependencies: ['compliance-vpc'],
      metadata: {
        description: 'Long-term compliance data archival'
      }
    },
    {
      componentId: 'generic-monitoring',
      instanceId: 'audit-logging',
      displayName: 'Audit Logging Platform',
      position: { x: 150, y: 300 },
      configuration: {
        type: 'audit-platform',
        realTime: true,
        tamperProof: true,
        searchable: true,
        alerting: true,
        retention: 'regulatory'
      },
      required: true,
      dependencies: ['compliance-vpc'],
      metadata: {
        description: 'Comprehensive audit logging and monitoring'
      }
    },
    {
      componentId: 'generic-security',
      instanceId: 'vulnerability-management',
      displayName: 'Vulnerability Management',
      position: { x: 450, y: 300 },
      configuration: {
        type: 'vulnerability-scanner',
        continuousScanning: true,
        riskScoring: true,
        remediation: true,
        reporting: true
      },
      required: true,
      dependencies: ['compliance-vpc'],
      metadata: {
        description: 'Continuous vulnerability assessment and management'
      }
    },
    {
      componentId: 'generic-security',
      instanceId: 'privacy-management',
      displayName: 'Privacy Management',
      position: { x: 600, y: 250 },
      configuration: {
        type: 'privacy-platform',
        consentManagement: true,
        dataMapping: true,
        rightsManagement: true,
        impactAssessment: true
      },
      required: false,
      dependencies: ['compliance-vpc'],
      metadata: {
        description: 'Privacy compliance and data subject rights'
      }
    },
    {
      componentId: 'generic-security',
      instanceId: 'incident-response',
      displayName: 'Incident Response Platform',
      position: { x: 350, y: 350 },
      configuration: {
        type: 'soar',
        automation: true,
        playbooks: true,
        caseManagement: true,
        notification: true,
        integration: true
      },
      required: true,
      dependencies: ['compliance-vpc'],
      metadata: {
        description: 'Security orchestration and incident response'
      }
    },
    {
      componentId: 'generic-compute',
      instanceId: 'compliance-reporting',
      displayName: 'Compliance Reporting Engine',
      position: { x: 100, y: 200 },
      configuration: {
        type: 'reporting-engine',
        scheduledReports: true,
        dashboards: true,
        metrics: true,
        automation: true
      },
      required: true,
      dependencies: ['compliance-vpc'],
      metadata: {
        description: 'Automated compliance reporting and dashboards'
      }
    }
  ];

  const relationships: ComponentRelationship[] = [
    {
      id: 'governance-classification',
      fromInstanceId: 'governance-framework',
      toInstanceId: 'data-classification',
      relationshipType: RelationshipType.MANAGEMENT,
      configuration: {
        bidirectional: true,
        protocols: ['api'],
        security: {
          encryption: true,
          authentication: ['mutual-tls'],
          authorization: ['rbac'],
          compliance: ['soc2', 'iso27001']
        }
      },
      metadata: {
        description: 'Governance framework manages data classification policies'
      }
    },
    {
      id: 'classification-dlp',
      fromInstanceId: 'data-classification',
      toInstanceId: 'dlp-solution',
      relationshipType: RelationshipType.DATA_FLOW,
      configuration: {
        bidirectional: true,
        protocols: ['api'],
        security: {
          encryption: true,
          authentication: ['api-key'],
          authorization: ['rbac'],
          compliance: []
        }
      },
      metadata: {
        description: 'Data classification informs DLP policies'
      }
    },
    {
      id: 'audit-archive',
      fromInstanceId: 'audit-logging',
      toInstanceId: 'compliance-archive',
      relationshipType: RelationshipType.DATA_FLOW,
      configuration: {
        bidirectional: false,
        protocols: ['s3-api'],
        security: {
          encryption: true,
          authentication: ['iam'],
          authorization: ['bucket-policy'],
          compliance: ['sox', 'gdpr']
        }
      },
      metadata: {
        description: 'Audit logs archived for compliance retention'
      }
    },
    {
      id: 'vulnerability-governance',
      fromInstanceId: 'vulnerability-management',
      toInstanceId: 'governance-framework',
      relationshipType: RelationshipType.DATA_FLOW,
      configuration: {
        bidirectional: true,
        protocols: ['api'],
        security: {
          encryption: true,
          authentication: ['api-key'],
          authorization: ['rbac'],
          compliance: []
        }
      },
      metadata: {
        description: 'Vulnerability data feeds into governance framework'
      }
    },
    {
      id: 'privacy-classification',
      fromInstanceId: 'privacy-management',
      toInstanceId: 'data-classification',
      relationshipType: RelationshipType.DATA_FLOW,
      configuration: {
        bidirectional: true,
        protocols: ['api'],
        security: {
          encryption: true,
          authentication: ['oauth2'],
          authorization: ['rbac'],
          compliance: ['gdpr']
        }
      },
      metadata: {
        description: 'Privacy management uses data classification'
      }
    },
    {
      id: 'incident-audit',
      fromInstanceId: 'incident-response',
      toInstanceId: 'audit-logging',
      relationshipType: RelationshipType.DATA_FLOW,
      configuration: {
        bidirectional: true,
        protocols: ['syslog', 'api'],
        security: {
          encryption: true,
          authentication: ['mutual-tls'],
          authorization: ['rbac'],
          compliance: []
        }
      },
      metadata: {
        description: 'Incident response platform logs to audit system'
      }
    },
    {
      id: 'reporting-governance',
      fromInstanceId: 'compliance-reporting',
      toInstanceId: 'governance-framework',
      relationshipType: RelationshipType.DATA_FLOW,
      configuration: {
        bidirectional: false,
        protocols: ['api'],
        security: {
          encryption: true,
          authentication: ['api-key'],
          authorization: ['rbac'],
          compliance: []
        }
      },
      metadata: {
        description: 'Reporting engine pulls compliance data'
      }
    }
  ];

  return {
    id: 'compliance-governance-framework',
    name: 'Compliance and Governance Framework',
    description: 'Comprehensive compliance management framework for regulated industries with automated governance and reporting',
    version: '1.0.0',
    category: PatternCategory.COMPLIANCE,
    complexity: PatternComplexity.ADVANCED,
    status: PatternStatus.PUBLISHED,
    components,
    relationships,
    parameters: [
      {
        id: 'regulatory_frameworks',
        name: 'Regulatory Frameworks',
        description: 'Applicable regulatory compliance frameworks',
        type: 'multiselect',
        required: true,
        defaultValue: ['soc2'],
        options: [
          { value: 'soc2', label: 'SOC 2' },
          { value: 'iso27001', label: 'ISO 27001' },
          { value: 'pci-dss', label: 'PCI DSS' },
          { value: 'hipaa', label: 'HIPAA' },
          { value: 'gdpr', label: 'GDPR' },
          { value: 'sox', label: 'SOX' },
          { value: 'fisma', label: 'FISMA' },
          { value: 'fedramp', label: 'FedRAMP' }
        ],
        affects: ['governance-framework', 'audit-logging', 'compliance-reporting']
      },
      {
        id: 'data_residency',
        name: 'Data Residency Requirements',
        description: 'Geographic data residency constraints',
        type: 'select',
        required: false,
        defaultValue: 'single-region',
        options: [
          { value: 'single-region', label: 'Single Region' },
          { value: 'multi-region', label: 'Multi-Region (same country)' },
          { value: 'global', label: 'Global with controls' },
          { value: 'restricted', label: 'Restricted (sovereign)' }
        ],
        affects: ['compliance-archive', 'data-classification']
      },
      {
        id: 'automation_level',
        name: 'Automation Level',
        description: 'Level of compliance automation',
        type: 'select',
        required: false,
        defaultValue: 'high',
        options: [
          { value: 'basic', label: 'Basic (manual processes)' },
          { value: 'standard', label: 'Standard (semi-automated)' },
          { value: 'high', label: 'High (fully automated)' }
        ],
        affects: ['governance-framework', 'incident-response', 'compliance-reporting']
      }
    ],
    preview: {
      thumbnail: '',
      description: 'Enterprise compliance and governance platform',
      features: [
        'Multi-framework compliance support',
        'Automated data classification and DLP',
        'Comprehensive audit logging',
        'Privacy management and data rights',
        'Vulnerability management integration',
        'Automated compliance reporting'
      ],
      benefits: [
        'Reduced compliance costs',
        'Automated evidence collection',
        'Risk reduction and visibility',
        'Streamlined audit processes',
        'Proactive compliance monitoring'
      ],
      useCases: [
        'Financial services compliance',
        'Healthcare data protection',
        'Government contracting',
        'International data transfers',
        'Multi-framework environments'
      ]
    },
    documentation: {
      overview: 'This pattern implements a comprehensive compliance and governance framework designed for organizations operating under multiple regulatory requirements.',
      architecture: {
        description: 'Multi-layered compliance architecture with governance, data protection, and reporting',
        components: [
          {
            instanceId: 'governance-framework',
            purpose: 'Centralized policy management and compliance orchestration',
            configuration: 'Multi-framework governance with automated policy enforcement',
            alternatives: ['ServiceNow GRC', 'MetricStream', 'LogicGate', 'Archer']
          },
          {
            instanceId: 'data-classification',
            purpose: 'Automated data discovery, classification, and labeling',
            configuration: 'ML-powered classification with regulatory mapping',
            alternatives: ['Microsoft Purview', 'Varonis', 'Spirion', 'BigID']
          },
          {
            instanceId: 'privacy-management',
            purpose: 'Privacy compliance and data subject rights management',
            configuration: 'GDPR-compliant privacy platform with automation',
            alternatives: ['OneTrust', 'TrustArc', 'Privacera', 'DataGrail']
          }
        ],
        dataFlow: 'Data → Classification → DLP → Governance → Audit → Archive',
        keyDecisions: [
          {
            decision: 'Centralized governance framework',
            rationale: 'Provides unified compliance management across multiple frameworks',
            alternatives: ['Decentralized compliance', 'Framework-specific tools'],
            tradeoffs: ['Implementation complexity', 'Consistency and efficiency']
          },
          {
            decision: 'Automated data classification',
            rationale: 'Scales compliance controls and reduces manual effort',
            alternatives: ['Manual classification', 'Application-level tagging'],
            tradeoffs: ['Initial setup complexity', 'Accuracy and scalability']
          }
        ]
      },
      deployment: {
        prerequisites: [
          'Compliance requirements analysis',
          'Data inventory and mapping',
          'Regulatory framework selection',
          'Stakeholder alignment'
        ],
        steps: [
          {
            title: 'Deploy governance framework',
            description: 'Set up centralized governance and policy management',
            commands: ['helm install governance compliance/governance-platform'],
            expectedOutput: 'Governance framework operational'
          },
          {
            title: 'Configure data classification',
            description: 'Deploy and configure automated data classification',
            commands: ['kubectl apply -f data-classification-config.yaml'],
            expectedOutput: 'Data classification engine running'
          },
          {
            title: 'Set up audit logging',
            description: 'Configure comprehensive audit logging',
            commands: ['helm install audit-platform logging/audit-platform'],
            expectedOutput: 'Audit logging collecting events'
          },
          {
            title: 'Deploy compliance reporting',
            description: 'Set up automated compliance reporting',
            commands: ['kubectl apply -f reporting-engine.yaml'],
            expectedOutput: 'Compliance reports being generated'
          }
        ],
        verification: [
          'Test data classification accuracy',
          'Verify audit log collection',
          'Confirm compliance report generation',
          'Validate policy enforcement'
        ],
        rollback: [
          'Backup compliance data',
          'Restore previous configurations',
          'Maintain audit trail continuity'
        ]
      },
      configuration: {
        parameters: [],
        environments: [
          {
            name: 'development',
            description: 'Development environment with basic compliance',
            parameters: {
              regulatory_frameworks: ['soc2'],
              data_residency: 'single-region',
              automation_level: 'basic'
            },
            notes: ['Minimal compliance controls', 'Development-friendly policies']
          },
          {
            name: 'production',
            description: 'Production environment with full compliance',
            parameters: {
              regulatory_frameworks: ['soc2', 'iso27001', 'gdpr'],
              data_residency: 'restricted',
              automation_level: 'high'
            },
            notes: ['Full compliance controls', 'Automated enforcement']
          }
        ],
        secrets: [
          {
            name: 'governance_platform_keys',
            description: 'Governance platform API and encryption keys',
            required: true
          },
          {
            name: 'audit_signing_keys',
            description: 'Audit log integrity and signing keys',
            required: true
          },
          {
            name: 'compliance_api_keys',
            description: 'External compliance service API keys',
            required: false
          }
        ],
        customization: []
      },
      security: {
        overview: 'Security through encrypted audit trails, access controls, and data protection',
        threats: [
          {
            threat: 'Audit log tampering',
            impact: 'high',
            likelihood: 'low',
            mitigation: ['Immutable logging', 'Cryptographic signing', 'Segregation of duties']
          },
          {
            threat: 'Compliance data exposure',
            impact: 'high',
            likelihood: 'medium',
            mitigation: ['Encryption at rest and transit', 'Access controls', 'Data masking']
          },
          {
            threat: 'Regulatory violation',
            impact: 'high',
            likelihood: 'medium',
            mitigation: ['Automated policy enforcement', 'Continuous monitoring', 'Regular assessments']
          }
        ],
        controls: [
          {
            control: 'Immutable audit trails',
            description: 'Tamper-proof audit logging with cryptographic integrity',
            implementation: 'Blockchain-based or cryptographically signed audit logs',
            components: ['audit-logging', 'compliance-archive']
          },
          {
            control: 'Data encryption',
            description: 'End-to-end encryption for sensitive compliance data',
            implementation: 'AES-256 encryption with customer-managed keys',
            components: ['compliance-archive', 'data-classification']
          },
          {
            control: 'Access segregation',
            description: 'Role-based access with segregation of duties',
            implementation: 'Multi-person authorization for sensitive operations',
            components: ['governance-framework', 'privacy-management']
          }
        ],
        compliance: ['SOC2', 'ISO27001', 'PCI-DSS', 'HIPAA', 'GDPR', 'SOX'],
        bestPractices: [
          'Implement continuous compliance monitoring',
          'Regular compliance assessments and audits',
          'Automated evidence collection and reporting',
          'Segregation of duties for sensitive operations',
          'Regular compliance training and awareness',
          'Incident response for compliance violations'
        ]
      },
      monitoring: {
        overview: 'Continuous compliance monitoring with real-time alerting and reporting',
        metrics: [
          {
            name: 'Compliance Score',
            description: 'Overall compliance posture score',
            source: 'Governance Framework',
            threshold: '> 95%',
            actions: ['Review failing controls', 'Implement corrective actions']
          },
          {
            name: 'Data Classification Coverage',
            description: 'Percentage of data assets classified',
            source: 'Data Classification Engine',
            threshold: '> 98%',
            actions: ['Classify untagged data', 'Review classification rules']
          },
          {
            name: 'Policy Violation Rate',
            description: 'Number of policy violations per day',
            source: 'DLP Solution',
            threshold: '< 5 per day',
            actions: ['Investigate violations', 'Update policies']
          }
        ],
        alerts: [
          {
            name: 'Compliance Violation',
            condition: 'Critical compliance control failure',
            severity: 'critical',
            response: ['Immediate investigation', 'Incident response activation']
          },
          {
            name: 'Data Breach Risk',
            condition: 'Unauthorized data access detected',
            severity: 'critical',
            response: ['Contain breach', 'Notify stakeholders', 'Begin incident response']
          },
          {
            name: 'Audit Log Failure',
            condition: 'Audit logging system failure',
            severity: 'critical',
            response: ['Restore logging', 'Investigate gap', 'Document incident']
          }
        ],
        dashboards: [
          {
            name: 'Compliance Overview',
            description: 'Executive-level compliance posture',
            metrics: ['Compliance score', 'Risk trends', 'Violation counts', 'Remediation status']
          },
          {
            name: 'Data Governance',
            description: 'Data classification and protection status',
            metrics: ['Classification coverage', 'DLP effectiveness', 'Data lineage', 'Access patterns']
          },
          {
            name: 'Audit and Risk',
            description: 'Audit findings and risk management',
            metrics: ['Audit findings', 'Risk scores', 'Control effectiveness', 'Remediation timelines']
          }
        ],
        logs: [
          {
            source: 'Compliance audit logs',
            format: 'CEF with regulatory mappings',
            retention: '7-10 years (regulatory dependent)',
            analysis: ['Compliance reporting', 'Audit evidence', 'Regulatory examination']
          },
          {
            source: 'Data access logs',
            format: 'Structured JSON with data classifications',
            retention: '3-7 years (regulatory dependent)',
            analysis: ['Data usage patterns', 'Privacy impact assessment', 'Access review']
          }
        ]
      },
      troubleshooting: {
        commonIssues: [
          {
            issue: 'False positive data classification',
            symptoms: ['Incorrect data labels', 'Over-classification'],
            causes: ['Training data issues', 'Classification rule conflicts', 'Context limitations'],
            solutions: ['Retrain classification models', 'Refine classification rules', 'Add context enrichment']
          },
          {
            issue: 'Compliance report inconsistencies',
            symptoms: ['Report data mismatches', 'Missing evidence'],
            causes: ['Data source issues', 'Timing synchronization', 'Integration problems'],
            solutions: ['Verify data sources', 'Synchronize collection timing', 'Fix integration issues']
          }
        ],
        diagnostics: [
          {
            scenario: 'Compliance monitoring failures',
            steps: ['Check governance framework health', 'Verify data collection', 'Validate report generation'],
            tools: ['Governance dashboard', 'System health monitors', 'Log analysis'],
            expectedResults: ['Monitoring restored', 'Root cause identified']
          }
        ],
        support: {
          contacts: ['Compliance team', 'Legal team', 'IT governance'],
          resources: ['Compliance runbooks', 'Regulatory guidance', 'Framework documentation'],
          escalation: ['External compliance consultants', 'Legal counsel', 'Regulatory liaisons']
        }
      },
      references: [
        {
          title: 'SOC 2 Implementation Guide',
          type: 'documentation',
          url: 'https://www.aicpa.org/interestareas/frc/assuranceadvisoryservices/aicpasoc2report.html',
          description: 'AICPA guidance for SOC 2 compliance implementation',
          relevance: 'high'
        },
        {
          title: 'GDPR Compliance Framework',
          type: 'regulation',
          url: 'https://gdpr.eu/',
          description: 'Complete guide to GDPR compliance requirements',
          relevance: 'high'
        }
      ]
    },
    tags: ['compliance', 'governance', 'audit', 'privacy', 'regulatory', 'advanced'],
    author: 'InfraGeni Team',
    license: 'MIT',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    providers: ['aws', 'azure', 'gcp', 'generic'],
    requiredFeatures: ['security', 'governance', 'audit', 'compliance'],
    changelog: [
      {
        version: '1.0.0',
        date: '2024-01-01',
        changes: ['Initial release of compliance and governance framework pattern'],
        breaking: false
      }
    ],
    migrations: []
  };
}

/**
 * Template for generating customizable security architectures
 */
export function createSecurityTemplate(): PatternTemplate {
  return {
    id: 'security-template',
    name: 'Security Architecture Template',
    description: 'Customizable template for security and compliance architectures',
    category: PatternCategory.SECURITY,
    complexity: PatternComplexity.ADVANCED,
    parameters: [
      {
        id: 'project_name',
        name: 'Project Name',
        description: 'Name of your security project',
        type: 'string',
        required: true,
        defaultValue: 'security-platform',
        affects: ['all-components']
      },
      {
        id: 'security_model',
        name: 'Security Model',
        description: 'Primary security architecture model',
        type: 'select',
        required: true,
        defaultValue: 'zero-trust',
        options: [
          { value: 'zero-trust', label: 'Zero Trust Architecture' },
          { value: 'defense-in-depth', label: 'Defense in Depth' },
          { value: 'compliance-focused', label: 'Compliance-Focused' },
          { value: 'cloud-native', label: 'Cloud-Native Security' }
        ],
        affects: ['all-components']
      },
      {
        id: 'threat_level',
        name: 'Threat Level',
        description: 'Expected threat sophistication',
        type: 'select',
        required: false,
        defaultValue: 'advanced',
        options: [
          { value: 'basic', label: 'Basic (commodity threats)' },
          { value: 'intermediate', label: 'Intermediate (targeted attacks)' },
          { value: 'advanced', label: 'Advanced (APT and nation-state)' }
        ],
        affects: ['threat-detection', 'response-capability']
      },
      {
        id: 'compliance_requirements',
        name: 'Compliance Requirements',
        description: 'Required compliance frameworks',
        type: 'multiselect',
        required: false,
        defaultValue: ['soc2'],
        options: [
          { value: 'soc2', label: 'SOC 2' },
          { value: 'iso27001', label: 'ISO 27001' },
          { value: 'pci-dss', label: 'PCI DSS' },
          { value: 'hipaa', label: 'HIPAA' },
          { value: 'gdpr', label: 'GDPR' }
        ],
        affects: ['compliance-components']
      },
      {
        id: 'automation_level',
        name: 'Security Automation Level',
        description: 'Level of security automation and orchestration',
        type: 'select',
        required: false,
        defaultValue: 'high',
        options: [
          { value: 'manual', label: 'Manual processes' },
          { value: 'semi-automated', label: 'Semi-automated' },
          { value: 'high', label: 'Highly automated' },
          { value: 'autonomous', label: 'Autonomous response' }
        ],
        affects: ['incident-response', 'threat-response']
      }
    ],
    componentTemplates: [
      {
        instanceId: '{{project_name}}-vpc',
        componentId: 'generic-vpc',
        displayName: '{{project_name}} Security VPC',
        position: { x: 50, y: 50 },
        configuration: {
          cidrBlock: '10.0.0.0/16',
          enableDnsHostnames: true,
          flowLogs: true
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
          left: { type: 'parameter', name: 'security_model' },
          right: 'zero-trust'
        },
        actions: [
          {
            type: 'add_component',
            target: 'identity-provider',
            data: {
              instanceId: '{{project_name}}-identity-provider',
              componentId: 'generic-security',
              displayName: '{{project_name}} Identity Provider',
              position: { x: 200, y: 150 },
              configuration: {
                type: 'enterprise-sso',
                mfa: true,
                riskBasedAuth: true
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
      tags: ['security', 'template', 'zero-trust', 'compliance', 'customizable'],
      examples: [
        {
          name: 'Enterprise Zero Trust',
          description: 'Comprehensive zero trust security architecture',
          parameters: {
            project_name: 'enterprise-security',
            security_model: 'zero-trust',
            threat_level: 'advanced',
            compliance_requirements: ['soc2', 'iso27001'],
            automation_level: 'high'
          },
          expectedComponents: 12
        },
        {
          name: 'Compliance-First Security',
          description: 'Security architecture optimized for compliance',
          parameters: {
            project_name: 'compliance-security',
            security_model: 'compliance-focused',
            threat_level: 'intermediate',
            compliance_requirements: ['hipaa', 'gdpr'],
            automation_level: 'semi-automated'
          },
          expectedComponents: 15
        }
      ]
    }
  };
}