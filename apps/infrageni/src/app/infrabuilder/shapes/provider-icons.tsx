// Provider-specific icons for different services
export interface ProviderIconProps {
    width?: number;
    height?: number;
    className?: string;
}

// AWS Icons
export const AWSIcons = {
    EC2: ({ width = 24, height = 24, className }: ProviderIconProps) => (
        <svg width={width} height={height} viewBox="0 0 24 24" className={className}>
            {/* AWS EC2 Icon - Orange compute box with AWS styling */}
            <defs>
                <linearGradient id="awsEc2Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF9900" />
                    <stop offset="100%" stopColor="#E47911" />
                </linearGradient>
            </defs>
            <rect x="2" y="5" width="20" height="14" rx="2" fill="url(#awsEc2Gradient)" stroke="#232F3E" strokeWidth="0.5" />
            <rect x="4" y="7" width="16" height="10" rx="1" fill="#232F3E" opacity="0.9" />
            <rect x="6" y="9" width="3" height="2" rx="0.5" fill="#FF9900" />
            <rect x="11" y="9" width="3" height="2" rx="0.5" fill="#FF9900" />
            <rect x="16" y="9" width="2" height="2" rx="0.5" fill="#FF9900" />
            <rect x="6" y="13" width="3" height="2" rx="0.5" fill="#FF9900" />
            <rect x="11" y="13" width="3" height="2" rx="0.5" fill="#FF9900" />
            <rect x="16" y="13" width="2" height="2" rx="0.5" fill="#FF9900" />
        </svg>
    ),

    RDS: ({ width = 24, height = 24, className }: ProviderIconProps) => (
        <svg width={width} height={height} viewBox="0 0 24 24" className={className}>
            {/* AWS RDS Icon - Database with AWS blue accent */}
            <defs>
                <linearGradient id="awsRdsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3498DB" />
                    <stop offset="100%" stopColor="#2980B9" />
                </linearGradient>
            </defs>
            <ellipse cx="12" cy="6" rx="9" ry="2.5" fill="url(#awsRdsGradient)" stroke="#232F3E" strokeWidth="0.5" />
            <rect x="3" y="6" width="18" height="11" fill="url(#awsRdsGradient)" opacity="0.8" />
            <ellipse cx="12" cy="17" rx="9" ry="2.5" fill="url(#awsRdsGradient)" stroke="#232F3E" strokeWidth="0.5" />
            <ellipse cx="12" cy="11.5" rx="8" ry="1.5" fill="none" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.7" />
            <circle cx="8" cy="11.5" r="1" fill="#FFFFFF" opacity="0.9" />
            <circle cx="12" cy="11.5" r="1" fill="#FFFFFF" opacity="0.9" />
            <circle cx="16" cy="11.5" r="1" fill="#FFFFFF" opacity="0.9" />
        </svg>
    ),

    S3: ({ width = 24, height = 24, className }: ProviderIconProps) => (
        <svg width={width} height={height} viewBox="0 0 24 24" className={className}>
            {/* AWS S3 Icon - Bucket with AWS orange */}
            <defs>
                <linearGradient id="awsS3Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF9900" />
                    <stop offset="100%" stopColor="#E47911" />
                </linearGradient>
            </defs>
            <path d="M5 8L12 5L19 8V16L12 19L5 16V8Z" fill="url(#awsS3Gradient)" stroke="#232F3E" strokeWidth="0.8" />
            <path d="M5 8L12 11L19 8" fill="none" stroke="#232F3E" strokeWidth="1" />
            <path d="M12 11V19" fill="none" stroke="#232F3E" strokeWidth="1" />
            <circle cx="9" cy="10" r="1" fill="#FFFFFF" opacity="0.8" />
            <circle cx="15" cy="10" r="1" fill="#FFFFFF" opacity="0.8" />
            <circle cx="12" cy="13" r="1" fill="#FFFFFF" opacity="0.8" />
        </svg>
    ),

    VPC: ({ width = 24, height = 24, className }: ProviderIconProps) => (
        <svg width={width} height={height} viewBox="0 0 24 24" className={className}>
            {/* AWS VPC Icon - Network cloud with AWS orange */}
            <defs>
                <linearGradient id="awsVpcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF9900" />
                    <stop offset="100%" stopColor="#E47911" />
                </linearGradient>
            </defs>
            <rect x="2" y="4" width="20" height="16" rx="3" fill="none" stroke="url(#awsVpcGradient)" strokeWidth="2" strokeDasharray="4,2" />
            <circle cx="7" cy="9" r="2" fill="url(#awsVpcGradient)" opacity="0.7" />
            <circle cx="17" cy="9" r="2" fill="url(#awsVpcGradient)" opacity="0.7" />
            <circle cx="12" cy="15" r="2" fill="url(#awsVpcGradient)" opacity="0.7" />
            <line x1="9" y1="9" x2="15" y2="9" stroke="url(#awsVpcGradient)" strokeWidth="2" />
            <line x1="7" y1="11" x2="12" y2="13" stroke="url(#awsVpcGradient)" strokeWidth="2" />
            <line x1="17" y1="11" x2="12" y2="13" stroke="url(#awsVpcGradient)" strokeWidth="2" />
        </svg>
    ),

    Subnet: ({ width = 24, height = 24, className }: ProviderIconProps) => (
        <svg width={width} height={height} viewBox="0 0 24 24" className={className}>
            {/* AWS Subnet Icon - Smaller network segment */}
            <defs>
                <linearGradient id="awsSubnetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3498DB" />
                    <stop offset="100%" stopColor="#2980B9" />
                </linearGradient>
            </defs>
            <rect x="4" y="6" width="16" height="12" rx="2" fill="none" stroke="url(#awsSubnetGradient)" strokeWidth="2" strokeDasharray="3,2" />
            <circle cx="8" cy="10" r="1.5" fill="url(#awsSubnetGradient)" />
            <circle cx="16" cy="10" r="1.5" fill="url(#awsSubnetGradient)" />
            <circle cx="12" cy="14" r="1.5" fill="url(#awsSubnetGradient)" />
            <line x1="9.5" y1="10" x2="14.5" y2="10" stroke="url(#awsSubnetGradient)" strokeWidth="1.5" />
            <line x1="8" y1="11.5" x2="12" y2="12.5" stroke="url(#awsSubnetGradient)" strokeWidth="1.5" />
            <line x1="16" y1="11.5" x2="12" y2="12.5" stroke="url(#awsSubnetGradient)" strokeWidth="1.5" />
        </svg>
    ),

    AvailabilityZone: ({ width = 24, height = 24, className }: ProviderIconProps) => (
        <svg width={width} height={height} viewBox="0 0 24 24" className={className}>
            {/* AWS AZ Icon - Zone representation */}
            <defs>
                <linearGradient id="awsAzGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
            </defs>
            <rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="url(#awsAzGradient)" strokeWidth="2" strokeDasharray="6,3" />
            <rect x="6" y="8" width="4" height="3" rx="1" fill="url(#awsAzGradient)" opacity="0.6" />
            <rect x="14" y="8" width="4" height="3" rx="1" fill="url(#awsAzGradient)" opacity="0.6" />
            <rect x="10" y="13" width="4" height="3" rx="1" fill="url(#awsAzGradient)" opacity="0.6" />
            <text x="12" y="21" textAnchor="middle" fontSize="8" fill="url(#awsAzGradient)" fontWeight="bold">AZ</text>
        </svg>
    )
};

// Azure Icons
export const AzureIcons = {
    VM: ({ width = 24, height = 24, className }: ProviderIconProps) => (
        <svg width={width} height={height} viewBox="0 0 24 24" className={className}>
            {/* Azure Virtual Machine Icon */}
            <defs>
                <linearGradient id="azureVmGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0078D4" />
                    <stop offset="100%" stopColor="#005A9E" />
                </linearGradient>
            </defs>
            <rect x="2" y="4" width="20" height="16" rx="2" fill="url(#azureVmGradient)" stroke="#001E2B" strokeWidth="0.5" />
            <rect x="4" y="6" width="16" height="12" rx="1" fill="#001E2B" opacity="0.1" />
            <rect x="6" y="8" width="12" height="8" rx="1" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="12" cy="12" r="2.5" fill="#FFFFFF" />
            <path d="M10.5 12L11.5 13L13.5 11" stroke="#0078D4" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="7" y="17" width="2" height="1" fill="#FFFFFF" opacity="0.8" />
            <rect x="10" y="17" width="4" height="1" fill="#FFFFFF" opacity="0.8" />
            <rect x="15" y="17" width="2" height="1" fill="#FFFFFF" opacity="0.8" />
        </svg>
    ),

    SQL: ({ width = 24, height = 24, className }: ProviderIconProps) => (
        <svg width={width} height={height} viewBox="0 0 24 24" className={className}>
            {/* Azure SQL Database Icon */}
            <defs>
                <linearGradient id="azureSqlGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0078D4" />
                    <stop offset="100%" stopColor="#005A9E" />
                </linearGradient>
            </defs>
            <rect x="3" y="4" width="18" height="16" rx="2" fill="url(#azureSqlGradient)" stroke="#001E2B" strokeWidth="0.5" />
            <ellipse cx="12" cy="8" rx="7" ry="2.5" fill="#FFFFFF" />
            <rect x="5" y="8" width="14" height="8" fill="#FFFFFF" opacity="0.9" />
            <ellipse cx="12" cy="16" rx="7" ry="2.5" fill="#FFFFFF" />
            <ellipse cx="12" cy="12" rx="6" ry="1.5" fill="none" stroke="#0078D4" strokeWidth="1.5" />
            <circle cx="9" cy="12" r="0.8" fill="#0078D4" />
            <circle cx="12" cy="12" r="0.8" fill="#0078D4" />
            <circle cx="15" cy="12" r="0.8" fill="#0078D4" />
        </svg>
    ),

    Blob: ({ width = 24, height = 24, className }: ProviderIconProps) => (
        <svg width={width} height={height} viewBox="0 0 24 24" className={className}>
            {/* Azure Blob Storage Icon */}
            <defs>
                <linearGradient id="azureBlobGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0078D4" />
                    <stop offset="100%" stopColor="#005A9E" />
                </linearGradient>
            </defs>
            <circle cx="8" cy="8" r="4.5" fill="url(#azureBlobGradient)" opacity="0.8" />
            <circle cx="16" cy="9" r="3.5" fill="url(#azureBlobGradient)" opacity="0.7" />
            <circle cx="12" cy="16" r="5" fill="url(#azureBlobGradient)" opacity="0.9" />
            <circle cx="8" cy="8" r="2" fill="#FFFFFF" opacity="0.9" />
            <circle cx="16" cy="9" r="1.5" fill="#FFFFFF" opacity="0.9" />
            <circle cx="12" cy="16" r="2.5" fill="#FFFFFF" opacity="0.9" />
            <circle cx="8" cy="8" r="0.8" fill="#0078D4" />
            <circle cx="16" cy="9" r="0.6" fill="#0078D4" />
            <circle cx="12" cy="16" r="1" fill="#0078D4" />
        </svg>
    ),

    VirtualNetwork: ({ width = 24, height = 24, className }: ProviderIconProps) => (
        <svg width={width} height={height} viewBox="0 0 24 24" className={className}>
            {/* Azure Virtual Network Icon */}
            <defs>
                <linearGradient id="azureVnetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0078D4" />
                    <stop offset="100%" stopColor="#005A9E" />
                </linearGradient>
            </defs>
            <rect x="2" y="4" width="20" height="16" rx="3" fill="none" stroke="url(#azureVnetGradient)" strokeWidth="2" strokeDasharray="4,2" />
            <circle cx="7" cy="9" r="2" fill="url(#azureVnetGradient)" opacity="0.7" />
            <circle cx="17" cy="9" r="2" fill="url(#azureVnetGradient)" opacity="0.7" />
            <circle cx="12" cy="15" r="2" fill="url(#azureVnetGradient)" opacity="0.7" />
            <line x1="9" y1="9" x2="15" y2="9" stroke="url(#azureVnetGradient)" strokeWidth="2" />
            <line x1="7" y1="11" x2="12" y2="13" stroke="url(#azureVnetGradient)" strokeWidth="2" />
            <line x1="17" y1="11" x2="12" y2="13" stroke="url(#azureVnetGradient)" strokeWidth="2" />
        </svg>
    ),

    Subnet: ({ width = 24, height = 24, className }: ProviderIconProps) => (
        <svg width={width} height={height} viewBox="0 0 24 24" className={className}>
            {/* Azure Subnet Icon */}
            <defs>
                <linearGradient id="azureSubnetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00BCF2" />
                    <stop offset="100%" stopColor="#0078D4" />
                </linearGradient>
            </defs>
            <rect x="4" y="6" width="16" height="12" rx="2" fill="none" stroke="url(#azureSubnetGradient)" strokeWidth="2" strokeDasharray="3,2" />
            <circle cx="8" cy="10" r="1.5" fill="url(#azureSubnetGradient)" />
            <circle cx="16" cy="10" r="1.5" fill="url(#azureSubnetGradient)" />
            <circle cx="12" cy="14" r="1.5" fill="url(#azureSubnetGradient)" />
            <line x1="9.5" y1="10" x2="14.5" y2="10" stroke="url(#azureSubnetGradient)" strokeWidth="1.5" />
            <line x1="8" y1="11.5" x2="12" y2="12.5" stroke="url(#azureSubnetGradient)" strokeWidth="1.5" />
            <line x1="16" y1="11.5" x2="12" y2="12.5" stroke="url(#azureSubnetGradient)" strokeWidth="1.5" />
        </svg>
    ),

    AvailabilityZone: ({ width = 24, height = 24, className }: ProviderIconProps) => (
        <svg width={width} height={height} viewBox="0 0 24 24" className={className}>
            {/* Azure Availability Zone Icon */}
            <defs>
                <linearGradient id="azureAzGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
            </defs>
            <rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="url(#azureAzGradient)" strokeWidth="2" strokeDasharray="6,3" />
            <rect x="6" y="8" width="4" height="3" rx="1" fill="url(#azureAzGradient)" opacity="0.6" />
            <rect x="14" y="8" width="4" height="3" rx="1" fill="url(#azureAzGradient)" opacity="0.6" />
            <rect x="10" y="13" width="4" height="3" rx="1" fill="url(#azureAzGradient)" opacity="0.6" />
            <text x="12" y="21" textAnchor="middle" fontSize="8" fill="url(#azureAzGradient)" fontWeight="bold">AZ</text>
        </svg>
    )
};

// GCP Icons
export const GCPIcons = {
    ComputeEngine: ({ width = 24, height = 24, className }: ProviderIconProps) => (
        <svg width={width} height={height} viewBox="0 0 24 24" className={className}>
            {/* GCP Compute Engine Icon */}
            <defs>
                <linearGradient id="gcpComputeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4285F4" />
                    <stop offset="100%" stopColor="#3367D6" />
                </linearGradient>
            </defs>
            <rect x="2" y="4" width="20" height="16" rx="2" fill="url(#gcpComputeGradient)" stroke="#1A73E8" strokeWidth="0.5" />
            <rect x="4" y="6" width="16" height="12" rx="1" fill="#FFFFFF" />
            <circle cx="12" cy="12" r="3.5" fill="url(#gcpComputeGradient)" />
            <circle cx="12" cy="12" r="2" fill="#FFFFFF" />
            <circle cx="12" cy="12" r="0.8" fill="#4285F4" />
            <rect x="6" y="8" width="2" height="1" rx="0.5" fill="#4285F4" />
            <rect x="6" y="15" width="2" height="1" rx="0.5" fill="#4285F4" />
            <rect x="16" y="8" width="2" height="1" rx="0.5" fill="#4285F4" />
            <rect x="16" y="15" width="2" height="1" rx="0.5" fill="#4285F4" />
            <circle cx="7" cy="10.5" r="0.5" fill="#34A853" />
            <circle cx="17" cy="10.5" r="0.5" fill="#34A853" />
            <circle cx="7" cy="13.5" r="0.5" fill="#34A853" />
            <circle cx="17" cy="13.5" r="0.5" fill="#34A853" />
        </svg>
    ),

    CloudSQL: ({ width = 24, height = 24, className }: ProviderIconProps) => (
        <svg width={width} height={height} viewBox="0 0 24 24" className={className}>
            {/* GCP Cloud SQL Icon */}
            <defs>
                <linearGradient id="gcpSqlGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4285F4" />
                    <stop offset="100%" stopColor="#3367D6" />
                </linearGradient>
            </defs>
            <rect x="3" y="4" width="18" height="16" rx="2" fill="url(#gcpSqlGradient)" stroke="#1A73E8" strokeWidth="0.5" />
            <circle cx="12" cy="12" r="7" fill="#FFFFFF" />
            <ellipse cx="12" cy="9" rx="5" ry="1.5" fill="#4285F4" />
            <rect x="7" y="9" width="10" height="6" fill="#4285F4" opacity="0.3" />
            <ellipse cx="12" cy="15" rx="5" ry="1.5" fill="#4285F4" />
            <ellipse cx="12" cy="12" rx="4" ry="1" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
            <path d="M9 12 Q12 10 15 12 Q12 14 9 12" fill="#FFFFFF" />
            <circle cx="12" cy="12" r="1.5" fill="#4285F4" />
        </svg>
    ),

    CloudStorage: ({ width = 24, height = 24, className }: ProviderIconProps) => (
        <svg width={width} height={height} viewBox="0 0 24 24" className={className}>
            {/* GCP Cloud Storage Icon */}
            <defs>
                <linearGradient id="gcpStorageGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4285F4" />
                    <stop offset="100%" stopColor="#3367D6" />
                </linearGradient>
            </defs>
            <path d="M12 4L20 8V16L12 20L4 16V8L12 4Z" fill="url(#gcpStorageGradient)" stroke="#1A73E8" strokeWidth="0.5" />
            <path d="M4 8L12 12L20 8" fill="none" stroke="#FFFFFF" strokeWidth="2" />
            <path d="M12 12V20" fill="none" stroke="#FFFFFF" strokeWidth="2" />
            <path d="M4 10L12 14L20 10" fill="none" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.7" />
            <path d="M4 12L12 16L20 12" fill="none" stroke="#FFFFFF" strokeWidth="1" opacity="0.5" />
            <circle cx="12" cy="14" r="2" fill="#FFFFFF" />
            <circle cx="12" cy="14" r="1" fill="#4285F4" />
        </svg>
    ),

    VPCNetwork: ({ width = 24, height = 24, className }: ProviderIconProps) => (
        <svg width={width} height={height} viewBox="0 0 24 24" className={className}>
            {/* GCP VPC Network Icon */}
            <defs>
                <linearGradient id="gcpVpcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4285F4" />
                    <stop offset="100%" stopColor="#1A73E8" />
                </linearGradient>
            </defs>
            <rect x="2" y="4" width="20" height="16" rx="3" fill="none" stroke="url(#gcpVpcGradient)" strokeWidth="2" strokeDasharray="4,2" />
            <circle cx="7" cy="9" r="2" fill="url(#gcpVpcGradient)" opacity="0.7" />
            <circle cx="17" cy="9" r="2" fill="url(#gcpVpcGradient)" opacity="0.7" />
            <circle cx="12" cy="15" r="2" fill="url(#gcpVpcGradient)" opacity="0.7" />
            <line x1="9" y1="9" x2="15" y2="9" stroke="url(#gcpVpcGradient)" strokeWidth="2" />
            <line x1="7" y1="11" x2="12" y2="13" stroke="url(#gcpVpcGradient)" strokeWidth="2" />
            <line x1="17" y1="11" x2="12" y2="13" stroke="url(#gcpVpcGradient)" strokeWidth="2" />
        </svg>
    ),

    Subnetwork: ({ width = 24, height = 24, className }: ProviderIconProps) => (
        <svg width={width} height={height} viewBox="0 0 24 24" className={className}>
            {/* GCP Subnetwork Icon */}
            <defs>
                <linearGradient id="gcpSubnetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#34A853" />
                    <stop offset="100%" stopColor="#137333" />
                </linearGradient>
            </defs>
            <rect x="4" y="6" width="16" height="12" rx="2" fill="none" stroke="url(#gcpSubnetGradient)" strokeWidth="2" strokeDasharray="3,2" />
            <circle cx="8" cy="10" r="1.5" fill="url(#gcpSubnetGradient)" />
            <circle cx="16" cy="10" r="1.5" fill="url(#gcpSubnetGradient)" />
            <circle cx="12" cy="14" r="1.5" fill="url(#gcpSubnetGradient)" />
            <line x1="9.5" y1="10" x2="14.5" y2="10" stroke="url(#gcpSubnetGradient)" strokeWidth="1.5" />
            <line x1="8" y1="11.5" x2="12" y2="12.5" stroke="url(#gcpSubnetGradient)" strokeWidth="1.5" />
            <line x1="16" y1="11.5" x2="12" y2="12.5" stroke="url(#gcpSubnetGradient)" strokeWidth="1.5" />
        </svg>
    ),

    Zone: ({ width = 24, height = 24, className }: ProviderIconProps) => (
        <svg width={width} height={height} viewBox="0 0 24 24" className={className}>
            {/* GCP Zone Icon */}
            <defs>
                <linearGradient id="gcpZoneGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
            </defs>
            <rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="url(#gcpZoneGradient)" strokeWidth="2" strokeDasharray="6,3" />
            <rect x="6" y="8" width="4" height="3" rx="1" fill="currentColor" opacity="0.3" />
            <rect x="14" y="8" width="4" height="3" rx="1" fill="currentColor" opacity="0.3" />
            <rect x="10" y="13" width="4" height="3" rx="1" fill="currentColor" opacity="0.3" />
            <text x="12" y="21" textAnchor="middle" fontSize="8" fill="currentColor" fontWeight="bold">Z</text>
        </svg>
    )
};

// Generic Icons (fallback)
export const GenericIcons = {
    Compute: ({ width = 24, height = 24, className }: ProviderIconProps) => (
        <svg width={width} height={height} viewBox="0 0 24 24" className={className} fill="currentColor">
            <rect x="3" y="4" width="18" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
            <rect x="7" y="8" width="2" height="2" fill="currentColor" />
            <rect x="11" y="8" width="2" height="2" fill="currentColor" />
            <rect x="15" y="8" width="2" height="2" fill="currentColor" />
            <rect x="7" y="12" width="2" height="2" fill="currentColor" />
            <rect x="11" y="12" width="2" height="2" fill="currentColor" />
            <rect x="15" y="12" width="2" height="2" fill="currentColor" />
        </svg>
    ),

    Database: ({ width = 24, height = 24, className }: ProviderIconProps) => (
        <svg width={width} height={height} viewBox="0 0 24 24" className={className} fill="currentColor">
            <ellipse cx="12" cy="5" rx="9" ry="3" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
    ),

    Storage: ({ width = 24, height = 24, className }: ProviderIconProps) => (
        <svg width={width} height={height} viewBox="0 0 24 24" className={className} fill="currentColor">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="none" stroke="currentColor" strokeWidth="2" />
            <polyline points="14,2 14,8 20,8" fill="none" stroke="currentColor" strokeWidth="2" />
            <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" />
            <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" />
            <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" />
        </svg>
    ),

    ExternalSystem: ({ width = 24, height = 24, className }: ProviderIconProps) => (
        <svg width={width} height={height} viewBox="0 0 24 24" className={className} fill="currentColor">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
            <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="2" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
    ), VPC: ({ width = 24, height = 24, className }: ProviderIconProps) => (
        <svg width={width} height={height} viewBox="0 0 24 24" className={className} fill="currentColor">
            <rect x="2" y="4" width="20" height="16" rx="3" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4,2" />
            <circle cx="7" cy="9" r="2" fill="currentColor" opacity="0.3" />
            <circle cx="17" cy="9" r="2" fill="currentColor" opacity="0.3" />
            <circle cx="12" cy="15" r="2" fill="currentColor" opacity="0.3" />
            <line x1="9" y1="9" x2="15" y2="9" stroke="currentColor" strokeWidth="2" />
            <line x1="7" y1="11" x2="12" y2="13" stroke="currentColor" strokeWidth="2" />
            <line x1="17" y1="11" x2="12" y2="13" stroke="currentColor" strokeWidth="2" />
        </svg>
    ),

    Subnet: ({ width = 24, height = 24, className }: ProviderIconProps) => (
        <svg width={width} height={height} viewBox="0 0 24 24" className={className} fill="currentColor">
            <rect x="4" y="6" width="16" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3,2" />
            <circle cx="8" cy="10" r="1.5" fill="currentColor" opacity="0.5" />
            <circle cx="16" cy="10" r="1.5" fill="currentColor" opacity="0.5" />
            <circle cx="12" cy="14" r="1.5" fill="currentColor" opacity="0.5" />
            <line x1="9.5" y1="10" x2="14.5" y2="10" stroke="currentColor" strokeWidth="1.5" />
            <line x1="8" y1="11.5" x2="12" y2="12.5" stroke="currentColor" strokeWidth="1.5" />
            <line x1="16" y1="11.5" x2="12" y2="12.5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
    ),

    AvailabilityZone: ({ width = 24, height = 24, className }: ProviderIconProps) => (
        <svg width={width} height={height} viewBox="0 0 24 24" className={className} fill="currentColor">
            <rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6,3" />
            <rect x="6" y="8" width="4" height="3" rx="1" fill="currentColor" opacity="0.3" />
            <rect x="14" y="8" width="4" height="3" rx="1" fill="currentColor" opacity="0.3" />
            <rect x="10" y="13" width="4" height="3" rx="1" fill="currentColor" opacity="0.3" />
            <text x="12" y="21" textAnchor="middle" fontSize="8" fill="currentColor" fontWeight="bold">AZ</text>
        </svg>
    ),

    User: ({ width = 24, height = 24, className }: ProviderIconProps) => (
        <svg width={width} height={height} viewBox="0 0 24 24" className={className} fill="currentColor">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="7" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
    )
};

// Helper function to get the appropriate icon based on provider and component type
export function getProviderIcon(componentId: string, provider: string, props: ProviderIconProps = {}) {
    switch (provider) {
        case 'aws':
            switch (componentId) {
                case 'compute': return <AWSIcons.EC2 {...props} />;
                case 'database': return <AWSIcons.RDS {...props} />;
                case 'storage': return <AWSIcons.S3 {...props} />;
                case 'vpc': return <AWSIcons.VPC {...props} />;
                case 'subnet': return <AWSIcons.Subnet {...props} />;
                case 'availability-zone': return <AWSIcons.AvailabilityZone {...props} />;
                default: return <GenericIcons.ExternalSystem {...props} />;
            }        case 'azure':
            switch (componentId) {
                case 'compute': return <AzureIcons.VM {...props} />;
                case 'database': return <AzureIcons.SQL {...props} />;
                case 'storage': return <AzureIcons.Blob {...props} />;
                case 'vpc': return <AzureIcons.VirtualNetwork {...props} />;
                case 'subnet': return <AzureIcons.Subnet {...props} />;
                case 'availability-zone': return <AzureIcons.AvailabilityZone {...props} />;
                default: return <GenericIcons.ExternalSystem {...props} />;
            }
        case 'gcp':
            switch (componentId) {
                case 'compute': return <GCPIcons.ComputeEngine {...props} />;
                case 'database': return <GCPIcons.CloudSQL {...props} />;
                case 'storage': return <GCPIcons.CloudStorage {...props} />;
                case 'vpc': return <GCPIcons.VPCNetwork {...props} />;
                case 'subnet': return <GCPIcons.Subnetwork {...props} />;
                case 'availability-zone': return <GCPIcons.Zone {...props} />;
                default: return <GenericIcons.ExternalSystem {...props} />;
            }
        default: // generic
            switch (componentId) {
                case 'compute': return <GenericIcons.Compute {...props} />;
                case 'database': return <GenericIcons.Database {...props} />;
                case 'storage': return <GenericIcons.Storage {...props} />;
                case 'vpc': return <GenericIcons.VPC {...props} />;
                case 'subnet': return <GenericIcons.Subnet {...props} />;
                case 'availability-zone': return <GenericIcons.AvailabilityZone {...props} />;
                case 'external-system': return <GenericIcons.ExternalSystem {...props} />;
                case 'user': return <GenericIcons.User {...props} />;
                default: return <GenericIcons.ExternalSystem {...props} />;
            }
    }
}
