import { ComponentMetadata, ComponentCategory, ComponentSubcategory } from './component-types';

/**
 * Core/Generic infrastructure components
 * These are provider-agnostic components that map to specific services
 */

export function getCoreComponents(): ComponentMetadata[] {
  return [
    // Network Infrastructure
    {
      id: 'generic-vpc',
      name: 'Virtual Private Cloud',
      description: 'Isolated network environment for cloud resources',
      category: ComponentCategory.NETWORK,
      subcategory: ComponentSubcategory.FIREWALL,
      providerMappings: {
        aws: {
          name: 'VPC',
          description: 'Amazon Virtual Private Cloud',
          iconPath: '/assets/provider-icons/aws/network/Res_Amazon-VPC_Virtual-private-cloud-VPC_48.svg',
          iconType: 'svg',
          serviceUrl: 'https://aws.amazon.com/vpc/',
          documentationUrl: 'https://docs.aws.amazon.com/vpc/',
          tags: ['network', 'isolation', 'security'],
          metadata: { cidrBlocks: ['10.0.0.0/16'], enableDnsHostnames: true }
        },
        azure: {
          name: 'Virtual Network',
          description: 'Azure Virtual Network',
          iconPath: '/assets/provider-icons/azure/networking/10061-icon-service-Virtual-Networks.svg',
          iconType: 'svg',
          serviceUrl: 'https://azure.microsoft.com/en-us/services/virtual-network/',
          documentationUrl: 'https://docs.microsoft.com/en-us/azure/virtual-network/',
          tags: ['network', 'vnet', 'isolation'],
          metadata: { addressSpace: ['10.0.0.0/16'], enableDdosProtection: false }
        },
        gcp: {
          name: 'VPC Network',
          description: 'Google Cloud Virtual Private Cloud',
          iconPath: '/assets/provider-icons/gcp/Virtual-Private-Cloud.svg',
          iconType: 'svg',
          serviceUrl: 'https://cloud.google.com/vpc',
          documentationUrl: 'https://cloud.google.com/vpc/docs',
          tags: ['network', 'vpc', 'cloud'],
          metadata: { mode: 'custom', routingMode: 'regional' }
        },
        generic: {
          name: 'Virtual Private Cloud',
          description: 'Generic virtual private cloud',
          iconPath: '/assets/provider-icons/generic/network-vpc.svg',
          iconType: 'svg',
          tags: ['network', 'vpc', 'isolation'],
          metadata: {}
        }
      },
      config: {
        defaultSize: { width: 400, height: 300 },
        minSize: { width: 200, height: 150 },
        maxSize: { width: 800, height: 600 },
        isContainer: true,
        canContainTypes: [ComponentCategory.NETWORK, ComponentCategory.COMPUTE, ComponentCategory.DATABASE, ComponentCategory.STORAGE],
        canBeContainedBy: [ComponentCategory.GENERIC],
        connectionPoints: [
          { id: 'internet', name: 'Internet Gateway', type: 'bidirectional', position: { x: 0.5, y: 0 } },
          { id: 'vpn', name: 'VPN Gateway', type: 'bidirectional', position: { x: 0, y: 0.5 } }
        ],
        allowedConnections: [ComponentCategory.NETWORK, ComponentCategory.EXTERNAL],
        validationRules: [
          { id: 'cidr-required', name: 'CIDR Block Required', type: 'required', condition: '$.cidrBlock', message: 'CIDR block is required', severity: 'error' }
        ],
        customProperties: [
          { id: 'cidrBlock', name: 'CIDR Block', type: 'string', defaultValue: '10.0.0.0/16', required: true, description: 'Network CIDR block' },
          { id: 'enableDnsHostnames', name: 'Enable DNS Hostnames', type: 'boolean', defaultValue: true, required: false, description: 'Enable DNS hostnames for instances' }
        ]
      },
      version: '1.0.0',
      tags: ['network', 'infrastructure', 'container'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },

    {
      id: 'generic-subnet',
      name: 'Subnet',
      description: 'Network subnet within a VPC',
      category: ComponentCategory.NETWORK,
      subcategory: ComponentSubcategory.FIREWALL,
      providerMappings: {
        aws: {
          name: 'Subnet',
          description: 'Amazon VPC Subnet',
          iconPath: '/assets/provider-icons/aws/network/Res_Amazon-VPC_Virtual-private-cloud-VPC_48.svg',
          iconType: 'svg',
          serviceUrl: 'https://aws.amazon.com/vpc/',
          tags: ['network', 'subnet'],
          metadata: { availabilityZone: 'us-east-1a' }
        },
        azure: {
          name: 'Subnet',
          description: 'Azure Subnet',
          iconPath: '/assets/provider-icons/azure/networking/10061-icon-service-Virtual-Networks.svg',
          iconType: 'svg',
          serviceUrl: 'https://azure.microsoft.com/en-us/services/virtual-network/',
          tags: ['network', 'subnet'],
          metadata: { delegations: [] }
        },
        gcp: {
          name: 'Subnetwork',
          description: 'Google Cloud Subnetwork',
          iconPath: '/assets/provider-icons/gcp/Virtual-Private-Cloud.svg',
          iconType: 'svg',
          serviceUrl: 'https://cloud.google.com/vpc',
          tags: ['network', 'subnet'],
          metadata: { region: 'us-central1' }
        },
        generic: {
          name: 'Subnet',
          description: 'Generic network subnet',
          iconPath: '/assets/provider-icons/generic/network-subnet.svg',
          iconType: 'svg',
          tags: ['network', 'subnet'],
          metadata: {}
        }
      },
      config: {
        defaultSize: { width: 300, height: 200 },
        minSize: { width: 150, height: 100 },
        maxSize: { width: 600, height: 400 },
        isContainer: true,
        canContainTypes: [ComponentCategory.COMPUTE, ComponentCategory.DATABASE, ComponentCategory.STORAGE],
        canBeContainedBy: [ComponentCategory.NETWORK],
        connectionPoints: [
          { id: 'gateway', name: 'Gateway', type: 'bidirectional', position: { x: 0.5, y: 0 } }
        ],
        allowedConnections: [ComponentCategory.NETWORK, ComponentCategory.COMPUTE],
        validationRules: [
          { id: 'cidr-required', name: 'CIDR Block Required', type: 'required', condition: '$.cidrBlock', message: 'CIDR block is required', severity: 'error' }
        ],
        customProperties: [
          { id: 'cidrBlock', name: 'CIDR Block', type: 'string', defaultValue: '10.0.1.0/24', required: true, description: 'Subnet CIDR block' },
          { id: 'isPublic', name: 'Public Subnet', type: 'boolean', defaultValue: false, required: false, description: 'Whether this is a public subnet' }
        ]
      },
      version: '1.0.0',
      tags: ['network', 'infrastructure', 'container'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },

    {
      id: 'generic-availability-zone',
      name: 'Availability Zone',
      description: 'Isolated data center location',
      category: ComponentCategory.NETWORK,
      providerMappings: {
        aws: {
          name: 'Availability Zone',
          description: 'AWS Availability Zone',
          iconPath: '/assets/provider-icons/aws/general/Res_Generic-Application_48_Light.svg',
          iconType: 'svg',
          serviceUrl: 'https://aws.amazon.com/about-aws/global-infrastructure/',
          tags: ['availability', 'zone', 'isolation'],
          metadata: { region: 'us-east-1' }
        },
        azure: {
          name: 'Availability Zone',
          description: 'Azure Availability Zone',
          iconPath: '/assets/provider-icons/azure/general/10002-icon-service-Subscriptions.svg',
          iconType: 'svg',
          serviceUrl: 'https://azure.microsoft.com/en-us/global-infrastructure/',
          tags: ['availability', 'zone', 'isolation'],
          metadata: { region: 'East US' }
        },
        gcp: {
          name: 'Zone',
          description: 'Google Cloud Zone',
          iconPath: '/assets/provider-icons/gcp/Compute-Engine.svg',
          iconType: 'svg',
          serviceUrl: 'https://cloud.google.com/compute/docs/regions-zones',
          tags: ['zone', 'region', 'compute'],
          metadata: { region: 'us-central1' }
        },
        generic: {
          name: 'Availability Zone',
          description: 'Generic availability zone',
          iconPath: '/assets/provider-icons/generic/availability-zone.svg',
          iconType: 'svg',
          tags: ['availability', 'zone'],
          metadata: {}
        }
      },
      config: {
        defaultSize: { width: 350, height: 250 },
        minSize: { width: 200, height: 150 },
        maxSize: { width: 700, height: 500 },
        isContainer: true,
        canContainTypes: [ComponentCategory.COMPUTE, ComponentCategory.DATABASE, ComponentCategory.STORAGE],
        canBeContainedBy: [ComponentCategory.NETWORK],
        connectionPoints: [],
        allowedConnections: [ComponentCategory.NETWORK],
        validationRules: [],
        customProperties: [
          { id: 'zoneName', name: 'Zone Name', type: 'string', defaultValue: 'us-east-1a', required: true, description: 'Availability zone identifier' }
        ]
      },
      version: '1.0.0',
      tags: ['infrastructure', 'availability', 'container'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },

    // Compute Resources
    {
      id: 'generic-compute',
      name: 'Compute Instance',
      description: 'Virtual machine or compute instance',
      category: ComponentCategory.COMPUTE,
      subcategory: ComponentSubcategory.VIRTUAL_MACHINE,
      providerMappings: {
        aws: {
          name: 'EC2 Instance',
          description: 'Amazon Elastic Compute Cloud Instance',
          iconPath: '/assets/provider-icons/aws/compute/Res_Amazon-EC2_Instance_48.svg',
          iconType: 'svg',
          serviceUrl: 'https://aws.amazon.com/ec2/',
          documentationUrl: 'https://docs.aws.amazon.com/ec2/',
          tags: ['compute', 'ec2', 'instance'],
          metadata: { instanceFamily: 't3', defaultInstanceType: 't3.micro' }
        },
        azure: {
          name: 'Virtual Machine',
          description: 'Azure Virtual Machine',
          iconPath: '/assets/provider-icons/azure/compute/10025-icon-service-Virtual-Machines.svg',
          iconType: 'svg',
          serviceUrl: 'https://azure.microsoft.com/en-us/services/virtual-machines/',
          documentationUrl: 'https://docs.microsoft.com/en-us/azure/virtual-machines/',
          tags: ['compute', 'vm', 'virtual-machine'],
          metadata: { vmSeries: 'Standard_B', defaultVmSize: 'Standard_B1s' }
        },
        gcp: {
          name: 'Compute Engine',
          description: 'Google Compute Engine Instance',
          iconPath: '/assets/provider-icons/gcp/Compute-Engine.svg',
          iconType: 'svg',
          serviceUrl: 'https://cloud.google.com/compute',
          documentationUrl: 'https://cloud.google.com/compute/docs',
          tags: ['compute', 'gce', 'instance'],
          metadata: { machineFamily: 'e2', defaultMachineType: 'e2-micro' }
        },
        generic: {
          name: 'Compute Instance',
          description: 'Generic compute instance',
          iconPath: '/assets/provider-icons/generic/compute-instance.svg',
          iconType: 'svg',
          tags: ['compute', 'instance'],
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
          { id: 'network', name: 'Network', type: 'bidirectional', position: { x: 0.5, y: 0 } },
          { id: 'storage', name: 'Storage', type: 'output', position: { x: 0.5, y: 1 } }
        ],
        allowedConnections: [ComponentCategory.STORAGE, ComponentCategory.DATABASE, ComponentCategory.NETWORK],
        validationRules: [
          { id: 'instance-type-required', name: 'Instance Type Required', type: 'required', condition: '$.instanceType', message: 'Instance type is required', severity: 'error' }
        ],
        customProperties: [
          { id: 'instanceType', name: 'Instance Type', type: 'string', defaultValue: 't3.micro', required: true, description: 'Instance type/size' },
          { id: 'operatingSystem', name: 'Operating System', type: 'select', defaultValue: 'linux', required: true, description: 'Operating system', options: [
            { value: 'linux', label: 'Linux' },
            { value: 'windows', label: 'Windows' },
            { value: 'macos', label: 'macOS' }
          ]},
          { id: 'vCpus', name: 'vCPUs', type: 'number', defaultValue: 1, required: false, description: 'Number of virtual CPUs' },
          { id: 'memoryGb', name: 'Memory (GB)', type: 'number', defaultValue: 1, required: false, description: 'Memory in GB' }
        ]
      },
      version: '1.0.0',
      tags: ['compute', 'virtual-machine', 'instance'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },

    // Database Resources
    {
      id: 'generic-database',
      name: 'Database',
      description: 'Managed database service',
      category: ComponentCategory.DATABASE,
      subcategory: ComponentSubcategory.RELATIONAL,
      providerMappings: {
        aws: {
          name: 'RDS Database',
          description: 'Amazon Relational Database Service',
          iconPath: '/assets/provider-icons/aws/database/Res_Amazon-Aurora_Amazon-RDS-Instance_48.svg',
          iconType: 'svg',
          serviceUrl: 'https://aws.amazon.com/rds/',
          documentationUrl: 'https://docs.aws.amazon.com/rds/',
          tags: ['database', 'rds', 'relational'],
          metadata: { engines: ['mysql', 'postgresql', 'oracle', 'sqlserver', 'mariadb'] }
        },
        azure: {
          name: 'Azure SQL Database',
          description: 'Azure SQL Database',
          iconPath: '/assets/provider-icons/azure/databases/10134-icon-service-SQL-Database.svg',
          iconType: 'svg',
          serviceUrl: 'https://azure.microsoft.com/en-us/services/sql-database/',
          documentationUrl: 'https://docs.microsoft.com/en-us/azure/sql-database/',
          tags: ['database', 'sql', 'relational'],
          metadata: { engines: ['sqlserver', 'mysql', 'postgresql'] }
        },
        gcp: {
          name: 'Cloud SQL',
          description: 'Google Cloud SQL',
          iconPath: '/assets/provider-icons/gcp/Cloud-SQL.svg',
          iconType: 'svg',
          serviceUrl: 'https://cloud.google.com/sql',
          documentationUrl: 'https://cloud.google.com/sql/docs',
          tags: ['database', 'sql', 'relational'],
          metadata: { engines: ['mysql', 'postgresql', 'sqlserver'] }
        },
        generic: {
          name: 'Database',
          description: 'Generic database',
          iconPath: '/assets/provider-icons/generic/database.svg',
          iconType: 'svg',
          tags: ['database', 'data'],
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
          { id: 'app', name: 'Application', type: 'input', position: { x: 0.5, y: 0 } },
          { id: 'backup', name: 'Backup', type: 'output', position: { x: 1, y: 0.5 } }
        ],
        allowedConnections: [ComponentCategory.COMPUTE, ComponentCategory.STORAGE, ComponentCategory.CONTAINERS],
        validationRules: [
          { id: 'engine-required', name: 'Database Engine Required', type: 'required', condition: '$.engine', message: 'Database engine is required', severity: 'error' }
        ],
        customProperties: [
          { id: 'engine', name: 'Database Engine', type: 'select', defaultValue: 'mysql', required: true, description: 'Database engine type', options: [
            { value: 'mysql', label: 'MySQL' },
            { value: 'postgresql', label: 'PostgreSQL' },
            { value: 'oracle', label: 'Oracle' },
            { value: 'sqlserver', label: 'SQL Server' },
            { value: 'mariadb', label: 'MariaDB' }
          ]},
          { id: 'version', name: 'Version', type: 'string', defaultValue: '8.0', required: false, description: 'Database version' },
          { id: 'instanceClass', name: 'Instance Class', type: 'string', defaultValue: 'db.t3.micro', required: false, description: 'Database instance class' },
          { id: 'multiAz', name: 'Multi-AZ', type: 'boolean', defaultValue: false, required: false, description: 'Enable Multi-AZ deployment' }
        ]
      },
      version: '1.0.0',
      tags: ['database', 'data', 'relational'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },

    // Storage Resources
    {
      id: 'generic-storage',
      name: 'Storage',
      description: 'Object storage service',
      category: ComponentCategory.STORAGE,
      subcategory: ComponentSubcategory.OBJECT_STORAGE,
      providerMappings: {
        aws: {
          name: 'S3 Bucket',
          description: 'Amazon Simple Storage Service Bucket',
          iconPath: '/assets/provider-icons/aws/storage/Res_Amazon-Simple-Storage-Service_Bucket_48.svg',
          iconType: 'svg',
          serviceUrl: 'https://aws.amazon.com/s3/',
          documentationUrl: 'https://docs.aws.amazon.com/s3/',
          tags: ['storage', 's3', 'object'],
          metadata: { storageClasses: ['standard', 'ia', 'glacier'] }
        },
        azure: {
          name: 'Blob Storage',
          description: 'Azure Blob Storage',
          iconPath: '/assets/provider-icons/azure/storage/10086-icon-service-Storage-Accounts.svg',
          iconType: 'svg',
          serviceUrl: 'https://azure.microsoft.com/en-us/services/storage/blobs/',
          documentationUrl: 'https://docs.microsoft.com/en-us/azure/storage/blobs/',
          tags: ['storage', 'blob', 'object'],
          metadata: { tiers: ['hot', 'cool', 'archive'] }
        },
        gcp: {
          name: 'Cloud Storage',
          description: 'Google Cloud Storage',
          iconPath: '/assets/provider-icons/gcp/Cloud-Storage.svg',
          iconType: 'svg',
          serviceUrl: 'https://cloud.google.com/storage',
          documentationUrl: 'https://cloud.google.com/storage/docs',
          tags: ['storage', 'gcs', 'object'],
          metadata: { classes: ['standard', 'nearline', 'coldline', 'archive'] }
        },
        generic: {
          name: 'Storage',
          description: 'Generic object storage',
          iconPath: '/assets/provider-icons/generic/storage.svg',
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
        allowedConnections: [ComponentCategory.COMPUTE, ComponentCategory.NETWORK, ComponentCategory.CONTAINERS],
        validationRules: [
          { id: 'bucket-name-required', name: 'Bucket Name Required', type: 'required', condition: '$.bucketName', message: 'Bucket name is required', severity: 'error' }
        ],
        customProperties: [
          { id: 'bucketName', name: 'Bucket Name', type: 'string', defaultValue: 'my-bucket', required: true, description: 'Storage bucket name' },
          { id: 'storageClass', name: 'Storage Class', type: 'select', defaultValue: 'standard', required: false, description: 'Storage class/tier', options: [
            { value: 'standard', label: 'Standard' },
            { value: 'ia', label: 'Infrequent Access' },
            { value: 'glacier', label: 'Glacier' },
            { value: 'deep-archive', label: 'Deep Archive' }
          ]},
          { id: 'versioning', name: 'Versioning', type: 'boolean', defaultValue: false, required: false, description: 'Enable versioning' },
          { id: 'encryption', name: 'Encryption', type: 'boolean', defaultValue: true, required: false, description: 'Enable encryption' }
        ]
      },
      version: '1.0.0',
      tags: ['storage', 'object', 'data'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },

    // Generic External and User Components
    {
      id: 'generic-external-system',
      name: 'External System',
      description: 'External system or service',
      category: ComponentCategory.EXTERNAL,
      providerMappings: {
        aws: {
          name: 'External System',
          description: 'External system or service',
          iconPath: '/assets/provider-icons/aws/general/Res_Internet_48_Light.svg',
          iconType: 'svg',
          tags: ['external', 'system'],
          metadata: {}
        },
        azure: {
          name: 'External System',
          description: 'External system or service',
          iconPath: '/assets/provider-icons/azure/general/10789-icon-service-Controls.svg',
          iconType: 'svg',
          tags: ['external', 'system'],
          metadata: {}
        },
        gcp: {
          name: 'External System',
          description: 'External system or service',
          iconPath: '/assets/provider-icons/gcp/Cloud-Generic.svg',
          iconType: 'svg',
          tags: ['external', 'system'],
          metadata: {}
        },
        generic: {
          name: 'External System',
          description: 'Generic external system',
          iconPath: '/assets/provider-icons/generic/external-system.svg',
          iconType: 'svg',
          tags: ['external', 'system'],
          metadata: {}
        }
      },
      config: {
        defaultSize: { width: 120, height: 80 },
        minSize: { width: 80, height: 60 },
        maxSize: { width: 200, height: 120 },
        isContainer: false,
        canContainTypes: [],
        canBeContainedBy: [],
        connectionPoints: [
          { id: 'api', name: 'API', type: 'bidirectional', position: { x: 0.5, y: 0.5 } }
        ],
        allowedConnections: [ComponentCategory.NETWORK, ComponentCategory.COMPUTE, ComponentCategory.API_GATEWAY],
        validationRules: [],
        customProperties: [
          { id: 'systemName', name: 'System Name', type: 'string', defaultValue: 'External System', required: true, description: 'External system name' },
          { id: 'apiEndpoint', name: 'API Endpoint', type: 'string', defaultValue: '', required: false, description: 'API endpoint URL' },
          { id: 'protocol', name: 'Protocol', type: 'select', defaultValue: 'https', required: false, description: 'Communication protocol', options: [
            { value: 'https', label: 'HTTPS' },
            { value: 'http', label: 'HTTP' },
            { value: 'tcp', label: 'TCP' },
            { value: 'udp', label: 'UDP' }
          ]}
        ]
      },
      version: '1.0.0',
      tags: ['external', 'system', 'integration'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },

    {
      id: 'generic-user',
      name: 'User',
      description: 'End user or user group',
      category: ComponentCategory.GENERIC,
      providerMappings: {
        aws: {
          name: 'User',
          description: 'End user',
          iconPath: '/assets/provider-icons/aws/general/Res_User_48_Light.svg',
          iconType: 'svg',
          tags: ['user', 'actor'],
          metadata: {}
        },
        azure: {
          name: 'User',
          description: 'End user',
          iconPath: '/assets/provider-icons/azure/identity/10230-icon-service-Users.svg',
          iconType: 'svg',
          tags: ['user', 'actor'],
          metadata: {}
        },
        gcp: {
          name: 'User',
          description: 'End user',
          iconPath: '/assets/provider-icons/gcp/Identity-And-Access-Management.svg',
          iconType: 'svg',
          tags: ['user', 'actor'],
          metadata: {}
        },
        generic: {
          name: 'User',
          description: 'Generic user',
          iconPath: '/assets/provider-icons/generic/user.svg',
          iconType: 'svg',
          tags: ['user', 'actor'],
          metadata: {}
        }
      },
      config: {
        defaultSize: { width: 80, height: 80 },
        minSize: { width: 60, height: 60 },
        maxSize: { width: 120, height: 120 },
        isContainer: false,
        canContainTypes: [],
        canBeContainedBy: [],
        connectionPoints: [
          { id: 'app', name: 'Application', type: 'output', position: { x: 0.5, y: 1 } }
        ],
        allowedConnections: [ComponentCategory.NETWORK, ComponentCategory.COMPUTE, ComponentCategory.API_GATEWAY],
        validationRules: [],
        customProperties: [
          { id: 'userType', name: 'User Type', type: 'select', defaultValue: 'end-user', required: false, description: 'Type of user', options: [
            { value: 'end-user', label: 'End User' },
            { value: 'admin', label: 'Administrator' },
            { value: 'service-account', label: 'Service Account' },
            { value: 'group', label: 'User Group' }
          ]},
          { id: 'userCount', name: 'User Count', type: 'number', defaultValue: 1, required: false, description: 'Number of users' }
        ]
      },
      version: '1.0.0',
      tags: ['user', 'actor', 'identity'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ];
}