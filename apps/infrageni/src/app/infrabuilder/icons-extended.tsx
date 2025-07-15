import { type FC } from 'react';

// Enhanced icon props with more options
export interface EnhancedProviderIconProps {
  width?: number;
  height?: number;
  className?: string;
  variant?: 'default' | 'outline' | 'minimal' | 'detailed';
  status?: 'active' | 'inactive' | 'error' | 'warning';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

// Size mapping for different size variants
const sizeMap = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 48,
};

// Enhanced AWS Icons with new networking, security, and monitoring components
export const EnhancedAWSIcons = {
  // Existing components
  EC2: ({ width = 24, height = 24, className, size = 'md' }: EnhancedProviderIconProps) => {
    const actualSize = width === 24 && height === 24 ? sizeMap[size] : width;
    return (
      <svg width={actualSize} height={actualSize} viewBox="0 0 24 24" className={className}>
        <defs>
          <linearGradient id="awsEc2Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF9900"/>
            <stop offset="100%" stopColor="#E47911"/>
          </linearGradient>
        </defs>
        <rect x="2" y="5" width="20" height="14" rx="2" fill="url(#awsEc2Gradient)" stroke="#232F3E" strokeWidth="0.5"/>
        <rect x="4" y="7" width="16" height="10" rx="1" fill="#232F3E" opacity="0.9"/>
        <rect x="6" y="9" width="3" height="2" rx="0.5" fill="#FF9900"/>
        <rect x="11" y="9" width="3" height="2" rx="0.5" fill="#FF9900"/>
        <rect x="16" y="9" width="2" height="2" rx="0.5" fill="#FF9900"/>
        <rect x="6" y="13" width="3" height="2" rx="0.5" fill="#FF9900"/>
        <rect x="11" y="13" width="3" height="2" rx="0.5" fill="#FF9900"/>
        <rect x="16" y="13" width="2" height="2" rx="0.5" fill="#FF9900"/>
      </svg>
    );
  },

  RDS: ({ width = 24, height = 24, className, size = 'md' }: EnhancedProviderIconProps) => {
    const actualSize = width === 24 && height === 24 ? sizeMap[size] : width;
    return (
      <svg width={actualSize} height={actualSize} viewBox="0 0 24 24" className={className}>
        <defs>
          <linearGradient id="awsRdsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3498DB"/>
            <stop offset="100%" stopColor="#2980B9"/>
          </linearGradient>
        </defs>
        <ellipse cx="12" cy="6" rx="9" ry="2.5" fill="url(#awsRdsGradient)" stroke="#232F3E" strokeWidth="0.5"/>
        <rect x="3" y="6" width="18" height="11" fill="url(#awsRdsGradient)" opacity="0.8"/>
        <ellipse cx="12" cy="17" rx="9" ry="2.5" fill="url(#awsRdsGradient)" stroke="#232F3E" strokeWidth="0.5"/>
        <ellipse cx="12" cy="11.5" rx="8" ry="1.5" fill="none" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.7"/>
        <circle cx="8" cy="11.5" r="1" fill="#FFFFFF" opacity="0.9"/>
        <circle cx="12" cy="11.5" r="1" fill="#FFFFFF" opacity="0.9"/>
        <circle cx="16" cy="11.5" r="1" fill="#FFFFFF" opacity="0.9"/>
      </svg>
    );
  },

  S3: ({ width = 24, height = 24, className, size = 'md' }: EnhancedProviderIconProps) => {
    const actualSize = width === 24 && height === 24 ? sizeMap[size] : width;
    return (
      <svg width={actualSize} height={actualSize} viewBox="0 0 24 24" className={className}>
        <defs>
          <linearGradient id="awsS3Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8CC152"/>
            <stop offset="100%" stopColor="#7CB342"/>
          </linearGradient>
        </defs>
        <path d="M4 7L12 3L20 7L20 17L12 21L4 17Z" fill="url(#awsS3Gradient)" stroke="#232F3E" strokeWidth="0.5"/>
        <path d="M4 7L12 11L20 7" fill="none" stroke="#FFFFFF" strokeWidth="2" opacity="0.8"/>
        <path d="M12 11V21" fill="none" stroke="#FFFFFF" strokeWidth="2" opacity="0.8"/>
        <path d="M4 10L12 14L20 10" fill="none" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.6"/>
        <circle cx="12" cy="15" r="2" fill="#FFFFFF" opacity="0.9"/>
        <circle cx="12" cy="15" r="1" fill="#232F3E"/>
      </svg>
    );
  },

  // New networking components
  ALB: ({ width = 24, height = 24, className, size = 'md' }: EnhancedProviderIconProps) => {
    const actualSize = width === 24 && height === 24 ? sizeMap[size] : width;
    return (
      <svg width={actualSize} height={actualSize} viewBox="0 0 24 24" className={className}>
        <defs>
          <linearGradient id="awsAlbGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF9900"/>
            <stop offset="100%" stopColor="#E47911"/>
          </linearGradient>
        </defs>
        <rect x="2" y="8" width="20" height="8" rx="2" fill="url(#awsAlbGradient)" stroke="#232F3E" strokeWidth="0.5"/>
        <circle cx="6" cy="12" r="1.5" fill="#FFFFFF"/>
        <circle cx="12" cy="12" r="1.5" fill="#FFFFFF"/>
        <circle cx="18" cy="12" r="1.5" fill="#FFFFFF"/>
        <path d="M12 4L16 8H8L12 4Z" fill="#232F3E"/>
        <path d="M12 20L16 16H8L12 20Z" fill="#232F3E"/>
        <path d="M6 6L12 8L18 6" stroke="#232F3E" strokeWidth="2" fill="none"/>
        <path d="M6 18L12 16L18 18" stroke="#232F3E" strokeWidth="2" fill="none"/>
      </svg>
    );
  },

  APIGateway: ({ width = 24, height = 24, className, size = 'md' }: EnhancedProviderIconProps) => {
    const actualSize = width === 24 && height === 24 ? sizeMap[size] : width;
    return (
      <svg width={actualSize} height={actualSize} viewBox="0 0 24 24" className={className}>
        <defs>
          <linearGradient id="awsApiGatewayGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF9900"/>
            <stop offset="100%" stopColor="#E47911"/>
          </linearGradient>
        </defs>
        <rect x="3" y="3" width="18" height="18" rx="2" fill="url(#awsApiGatewayGradient)" stroke="#232F3E" strokeWidth="0.5"/>
        <rect x="5" y="5" width="14" height="14" rx="1" fill="#232F3E" opacity="0.1"/>
        <path d="M8 8L12 12L16 8" stroke="#FFFFFF" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 16L12 12L16 16" stroke="#FFFFFF" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="12" r="2" fill="#FFFFFF"/>
        <circle cx="12" cy="12" r="1" fill="#232F3E"/>
      </svg>
    );
  },

  CloudFront: ({ width = 24, height = 24, className, size = 'md' }: EnhancedProviderIconProps) => {
    const actualSize = width === 24 && height === 24 ? sizeMap[size] : width;
    return (
      <svg width={actualSize} height={actualSize} viewBox="0 0 24 24" className={className}>
        <defs>
          <linearGradient id="awsCloudFrontGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF9900"/>
            <stop offset="100%" stopColor="#E47911"/>
          </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="10" fill="url(#awsCloudFrontGradient)" stroke="#232F3E" strokeWidth="0.5"/>
        <circle cx="12" cy="12" r="7" fill="none" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.8"/>
        <circle cx="12" cy="12" r="4" fill="none" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.6"/>
        <circle cx="12" cy="12" r="1.5" fill="#FFFFFF"/>
        <path d="M12 2L12 6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
        <path d="M12 18L12 22" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
        <path d="M2 12L6 12" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
        <path d="M18 12L22 12" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    );
  },

  // Security components
  WAF: ({ width = 24, height = 24, className, size = 'md' }: EnhancedProviderIconProps) => {
    const actualSize = width === 24 && height === 24 ? sizeMap[size] : width;
    return (
      <svg width={actualSize} height={actualSize} viewBox="0 0 24 24" className={className}>
        <defs>
          <linearGradient id="awsWafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF4B4B"/>
            <stop offset="100%" stopColor="#CC0000"/>
          </linearGradient>
        </defs>
        <path d="M12 2L4 6V12C4 16.5 7.5 20.5 12 22C16.5 20.5 20 16.5 20 12V6L12 2Z" fill="url(#awsWafGradient)" stroke="#232F3E" strokeWidth="0.5"/>
        <path d="M12 4L6 7V12C6 15.5 8.5 18.5 12 20C15.5 18.5 18 15.5 18 12V7L12 4Z" fill="#FFFFFF" opacity="0.9"/>
        <path d="M9 12L11 14L15 10" stroke="#FF4B4B" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  },

  IAM: ({ width = 24, height = 24, className, size = 'md' }: EnhancedProviderIconProps) => {
    const actualSize = width === 24 && height === 24 ? sizeMap[size] : width;
    return (
      <svg width={actualSize} height={actualSize} viewBox="0 0 24 24" className={className}>
        <defs>
          <linearGradient id="awsIamGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF9900"/>
            <stop offset="100%" stopColor="#E47911"/>
          </linearGradient>
        </defs>
        <rect x="2" y="4" width="20" height="16" rx="2" fill="url(#awsIamGradient)" stroke="#232F3E" strokeWidth="0.5"/>
        <circle cx="8" cy="10" r="2.5" fill="#FFFFFF"/>
        <path d="M8 10C8 8.9 8.9 8 10 8C11.1 8 12 8.9 12 10" stroke="#232F3E" strokeWidth="1.5" fill="none"/>
        <rect x="5" y="14" width="6" height="4" rx="1" fill="#232F3E" opacity="0.8"/>
        <rect x="15" y="8" width="4" height="1" rx="0.5" fill="#FFFFFF"/>
        <rect x="15" y="10" width="4" height="1" rx="0.5" fill="#FFFFFF"/>
        <rect x="15" y="12" width="4" height="1" rx="0.5" fill="#FFFFFF"/>
        <rect x="15" y="14" width="4" height="1" rx="0.5" fill="#FFFFFF"/>
      </svg>
    );
  },

  // Monitoring components
  CloudWatch: ({ width = 24, height = 24, className, size = 'md' }: EnhancedProviderIconProps) => {
    const actualSize = width === 24 && height === 24 ? sizeMap[size] : width;
    return (
      <svg width={actualSize} height={actualSize} viewBox="0 0 24 24" className={className}>
        <defs>
          <linearGradient id="awsCloudWatchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF9900"/>
            <stop offset="100%" stopColor="#E47911"/>
          </linearGradient>
        </defs>
        <rect x="2" y="4" width="20" height="16" rx="2" fill="url(#awsCloudWatchGradient)" stroke="#232F3E" strokeWidth="0.5"/>
        <rect x="4" y="6" width="16" height="12" rx="1" fill="#232F3E" opacity="0.1"/>
        <path d="M6 16L10 12L14 14L18 10" stroke="#FFFFFF" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="6" cy="16" r="1.5" fill="#FFFFFF"/>
        <circle cx="10" cy="12" r="1.5" fill="#FFFFFF"/>
        <circle cx="14" cy="14" r="1.5" fill="#FFFFFF"/>
        <circle cx="18" cy="10" r="1.5" fill="#FFFFFF"/>
      </svg>
    );
  },
};

// Enhanced Azure Icons
export const EnhancedAzureIcons = {
  // Existing components
  VM: ({ width = 24, height = 24, className, size = 'md' }: EnhancedProviderIconProps) => {
    const actualSize = width === 24 && height === 24 ? sizeMap[size] : width;
    return (
      <svg width={actualSize} height={actualSize} viewBox="0 0 24 24" className={className}>
        <defs>
          <linearGradient id="azureVmGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0078D4"/>
            <stop offset="100%" stopColor="#005A9E"/>
          </linearGradient>
        </defs>
        <rect x="2" y="4" width="20" height="16" rx="2" fill="url(#azureVmGradient)" stroke="#001E2B" strokeWidth="0.5"/>
        <rect x="4" y="6" width="16" height="12" rx="1" fill="#001E2B" opacity="0.1"/>
        <rect x="6" y="8" width="12" height="8" rx="1" fill="none" stroke="#FFFFFF" strokeWidth="1.5"/>
        <circle cx="12" cy="12" r="2.5" fill="#FFFFFF"/>
        <path d="M10.5 12L11.5 13L13.5 11" stroke="#0078D4" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="7" y="17" width="2" height="1" fill="#FFFFFF" opacity="0.8"/>
        <rect x="10" y="17" width="4" height="1" fill="#FFFFFF" opacity="0.8"/>
        <rect x="15" y="17" width="2" height="1" fill="#FFFFFF" opacity="0.8"/>
      </svg>
    );
  },

  SQL: ({ width = 24, height = 24, className, size = 'md' }: EnhancedProviderIconProps) => {
    const actualSize = width === 24 && height === 24 ? sizeMap[size] : width;
    return (
      <svg width={actualSize} height={actualSize} viewBox="0 0 24 24" className={className}>
        <defs>
          <linearGradient id="azureSqlGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0078D4"/>
            <stop offset="100%" stopColor="#005A9E"/>
          </linearGradient>
        </defs>
        <rect x="3" y="4" width="18" height="16" rx="2" fill="url(#azureSqlGradient)" stroke="#001E2B" strokeWidth="0.5"/>
        <ellipse cx="12" cy="8" rx="7" ry="2.5" fill="#FFFFFF"/>
        <rect x="5" y="8" width="14" height="8" fill="#FFFFFF" opacity="0.9"/>
        <ellipse cx="12" cy="16" rx="7" ry="2.5" fill="#FFFFFF"/>
        <ellipse cx="12" cy="12" rx="6" ry="1.5" fill="none" stroke="#0078D4" strokeWidth="1.5"/>
        <circle cx="9" cy="12" r="0.8" fill="#0078D4"/>
        <circle cx="12" cy="12" r="0.8" fill="#0078D4"/>
        <circle cx="15" cy="12" r="0.8" fill="#0078D4"/>
      </svg>
    );
  },

  Blob: ({ width = 24, height = 24, className, size = 'md' }: EnhancedProviderIconProps) => {
    const actualSize = width === 24 && height === 24 ? sizeMap[size] : width;
    return (
      <svg width={actualSize} height={actualSize} viewBox="0 0 24 24" className={className}>
        <defs>
          <linearGradient id="azureBlobGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0078D4"/>
            <stop offset="100%" stopColor="#005A9E"/>
          </linearGradient>
        </defs>
        <circle cx="8" cy="8" r="4.5" fill="url(#azureBlobGradient)" opacity="0.8"/>
        <circle cx="16" cy="9" r="3.5" fill="url(#azureBlobGradient)" opacity="0.7"/>
        <circle cx="12" cy="16" r="5" fill="url(#azureBlobGradient)" opacity="0.9"/>
        <circle cx="8" cy="8" r="2" fill="#FFFFFF" opacity="0.9"/>
        <circle cx="16" cy="9" r="1.5" fill="#FFFFFF" opacity="0.9"/>
        <circle cx="12" cy="16" r="2.5" fill="#FFFFFF" opacity="0.9"/>
        <circle cx="8" cy="8" r="0.8" fill="#0078D4"/>
        <circle cx="16" cy="9" r="0.6" fill="#0078D4"/>
        <circle cx="12" cy="16" r="1" fill="#0078D4"/>
      </svg>
    );
  },

  // New Azure components
  LoadBalancer: ({ width = 24, height = 24, className, size = 'md' }: EnhancedProviderIconProps) => {
    const actualSize = width === 24 && height === 24 ? sizeMap[size] : width;
    return (
      <svg width={actualSize} height={actualSize} viewBox="0 0 24 24" className={className}>
        <defs>
          <linearGradient id="azureLbGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0078D4"/>
            <stop offset="100%" stopColor="#005A9E"/>
          </linearGradient>
        </defs>
        <rect x="2" y="8" width="20" height="8" rx="2" fill="url(#azureLbGradient)" stroke="#001E2B" strokeWidth="0.5"/>
        <circle cx="6" cy="12" r="1.5" fill="#FFFFFF"/>
        <circle cx="12" cy="12" r="1.5" fill="#FFFFFF"/>
        <circle cx="18" cy="12" r="1.5" fill="#FFFFFF"/>
        <path d="M12 4L16 8H8L12 4Z" fill="#001E2B"/>
        <path d="M12 20L16 16H8L12 20Z" fill="#001E2B"/>
        <path d="M6 6L12 8L18 6" stroke="#001E2B" strokeWidth="2" fill="none"/>
        <path d="M6 18L12 16L18 18" stroke="#001E2B" strokeWidth="2" fill="none"/>
      </svg>
    );
  },

  Monitor: ({ width = 24, height = 24, className, size = 'md' }: EnhancedProviderIconProps) => {
    const actualSize = width === 24 && height === 24 ? sizeMap[size] : width;
    return (
      <svg width={actualSize} height={actualSize} viewBox="0 0 24 24" className={className}>
        <defs>
          <linearGradient id="azureMonitorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0078D4"/>
            <stop offset="100%" stopColor="#005A9E"/>
          </linearGradient>
        </defs>
        <rect x="2" y="4" width="20" height="16" rx="2" fill="url(#azureMonitorGradient)" stroke="#001E2B" strokeWidth="0.5"/>
        <rect x="4" y="6" width="16" height="12" rx="1" fill="#001E2B" opacity="0.1"/>
        <path d="M6 16L10 12L14 14L18 10" stroke="#FFFFFF" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="6" cy="16" r="1.5" fill="#FFFFFF"/>
        <circle cx="10" cy="12" r="1.5" fill="#FFFFFF"/>
        <circle cx="14" cy="14" r="1.5" fill="#FFFFFF"/>
        <circle cx="18" cy="10" r="1.5" fill="#FFFFFF"/>
      </svg>
    );
  },
};

// Enhanced GCP Icons
export const EnhancedGCPIcons = {
  // Existing components
  ComputeEngine: ({ width = 24, height = 24, className, size = 'md' }: EnhancedProviderIconProps) => {
    const actualSize = width === 24 && height === 24 ? sizeMap[size] : width;
    return (
      <svg width={actualSize} height={actualSize} viewBox="0 0 24 24" className={className}>
        <defs>
          <linearGradient id="gcpComputeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4285F4"/>
            <stop offset="100%" stopColor="#3367D6"/>
          </linearGradient>
        </defs>
        <rect x="2" y="4" width="20" height="16" rx="2" fill="url(#gcpComputeGradient)" stroke="#1A73E8" strokeWidth="0.5"/>
        <rect x="4" y="6" width="16" height="12" rx="1" fill="#FFFFFF"/>
        <circle cx="12" cy="12" r="3.5" fill="url(#gcpComputeGradient)"/>
        <circle cx="12" cy="12" r="2" fill="#FFFFFF"/>
        <circle cx="12" cy="12" r="0.8" fill="#4285F4"/>
        <rect x="6" y="8" width="2" height="1" rx="0.5" fill="#4285F4"/>
        <rect x="6" y="15" width="2" height="1" rx="0.5" fill="#4285F4"/>
        <rect x="16" y="8" width="2" height="1" rx="0.5" fill="#4285F4"/>
        <rect x="16" y="15" width="2" height="1" rx="0.5" fill="#4285F4"/>
        <circle cx="7" cy="10.5" r="0.5" fill="#34A853"/>
        <circle cx="17" cy="10.5" r="0.5" fill="#34A853"/>
        <circle cx="7" cy="13.5" r="0.5" fill="#34A853"/>
        <circle cx="17" cy="13.5" r="0.5" fill="#34A853"/>
      </svg>
    );
  },

  CloudSQL: ({ width = 24, height = 24, className, size = 'md' }: EnhancedProviderIconProps) => {
    const actualSize = width === 24 && height === 24 ? sizeMap[size] : width;
    return (
      <svg width={actualSize} height={actualSize} viewBox="0 0 24 24" className={className}>
        <defs>
          <linearGradient id="gcpSqlGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4285F4"/>
            <stop offset="100%" stopColor="#3367D6"/>
          </linearGradient>
        </defs>
        <rect x="3" y="4" width="18" height="16" rx="2" fill="url(#gcpSqlGradient)" stroke="#1A73E8" strokeWidth="0.5"/>
        <circle cx="12" cy="12" r="7" fill="#FFFFFF"/>
        <ellipse cx="12" cy="9" rx="5" ry="1.5" fill="#4285F4"/>
        <rect x="7" y="9" width="10" height="6" fill="#4285F4" opacity="0.3"/>
        <ellipse cx="12" cy="15" rx="5" ry="1.5" fill="#4285F4"/>
        <ellipse cx="12" cy="12" rx="4" ry="1" fill="none" stroke="#FFFFFF" strokeWidth="1.5"/>
        <path d="M9 12 Q12 10 15 12 Q12 14 9 12" fill="#FFFFFF"/>
        <circle cx="12" cy="12" r="1.5" fill="#4285F4"/>
      </svg>
    );
  },

  CloudStorage: ({ width = 24, height = 24, className, size = 'md' }: EnhancedProviderIconProps) => {
    const actualSize = width === 24 && height === 24 ? sizeMap[size] : width;
    return (
      <svg width={actualSize} height={actualSize} viewBox="0 0 24 24" className={className}>
        <defs>
          <linearGradient id="gcpStorageGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4285F4"/>
            <stop offset="100%" stopColor="#3367D6"/>
          </linearGradient>
        </defs>
        <path d="M12 4L20 8V16L12 20L4 16V8L12 4Z" fill="url(#gcpStorageGradient)" stroke="#1A73E8" strokeWidth="0.5"/>
        <path d="M4 8L12 12L20 8" fill="none" stroke="#FFFFFF" strokeWidth="2"/>
        <path d="M12 12V20" fill="none" stroke="#FFFFFF" strokeWidth="2"/>
        <path d="M4 10L12 14L20 10" fill="none" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.7"/>
        <path d="M4 12L12 16L20 12" fill="none" stroke="#FFFFFF" strokeWidth="1" opacity="0.5"/>
        <circle cx="12" cy="14" r="2" fill="#FFFFFF"/>
        <circle cx="12" cy="14" r="1" fill="#4285F4"/>
      </svg>
    );
  },

  // New GCP components
  CloudLoadBalancing: ({ width = 24, height = 24, className, size = 'md' }: EnhancedProviderIconProps) => {
    const actualSize = width === 24 && height === 24 ? sizeMap[size] : width;
    return (
      <svg width={actualSize} height={actualSize} viewBox="0 0 24 24" className={className}>
        <defs>
          <linearGradient id="gcpLbGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4285F4"/>
            <stop offset="100%" stopColor="#3367D6"/>
          </linearGradient>
        </defs>
        <rect x="2" y="8" width="20" height="8" rx="2" fill="url(#gcpLbGradient)" stroke="#1A73E8" strokeWidth="0.5"/>
        <circle cx="6" cy="12" r="1.5" fill="#FFFFFF"/>
        <circle cx="12" cy="12" r="1.5" fill="#FFFFFF"/>
        <circle cx="18" cy="12" r="1.5" fill="#FFFFFF"/>
        <path d="M12 4L16 8H8L12 4Z" fill="#1A73E8"/>
        <path d="M12 20L16 16H8L12 20Z" fill="#1A73E8"/>
        <path d="M6 6L12 8L18 6" stroke="#1A73E8" strokeWidth="2" fill="none"/>
        <path d="M6 18L12 16L18 18" stroke="#1A73E8" strokeWidth="2" fill="none"/>
      </svg>
    );
  },

  CloudMonitoring: ({ width = 24, height = 24, className, size = 'md' }: EnhancedProviderIconProps) => {
    const actualSize = width === 24 && height === 24 ? sizeMap[size] : width;
    return (
      <svg width={actualSize} height={actualSize} viewBox="0 0 24 24" className={className}>
        <defs>
          <linearGradient id="gcpMonitoringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4285F4"/>
            <stop offset="100%" stopColor="#3367D6"/>
          </linearGradient>
        </defs>
        <rect x="2" y="4" width="20" height="16" rx="2" fill="url(#gcpMonitoringGradient)" stroke="#1A73E8" strokeWidth="0.5"/>
        <rect x="4" y="6" width="16" height="12" rx="1" fill="#1A73E8" opacity="0.1"/>
        <path d="M6 16L10 12L14 14L18 10" stroke="#FFFFFF" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="6" cy="16" r="1.5" fill="#FFFFFF"/>
        <circle cx="10" cy="12" r="1.5" fill="#FFFFFF"/>
        <circle cx="14" cy="14" r="1.5" fill="#FFFFFF"/>
        <circle cx="18" cy="10" r="1.5" fill="#FFFFFF"/>
      </svg>
    );
  },
};

// Enhanced Generic Icons
export const EnhancedGenericIcons = {
  Compute: ({ width = 24, height = 24, className, size = 'md' }: EnhancedProviderIconProps) => {
    const actualSize = width === 24 && height === 24 ? sizeMap[size] : width;
    return (
      <svg width={actualSize} height={actualSize} viewBox="0 0 24 24" className={className} fill="currentColor">
        <rect x="3" y="4" width="18" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
        <rect x="7" y="8" width="2" height="2" fill="currentColor"/>
        <rect x="11" y="8" width="2" height="2" fill="currentColor"/>
        <rect x="15" y="8" width="2" height="2" fill="currentColor"/>
        <rect x="7" y="12" width="2" height="2" fill="currentColor"/>
        <rect x="11" y="12" width="2" height="2" fill="currentColor"/>
        <rect x="15" y="12" width="2" height="2" fill="currentColor"/>
      </svg>
    );
  },

  Database: ({ width = 24, height = 24, className, size = 'md' }: EnhancedProviderIconProps) => {
    const actualSize = width === 24 && height === 24 ? sizeMap[size] : width;
    return (
      <svg width={actualSize} height={actualSize} viewBox="0 0 24 24" className={className} fill="currentColor">
        <ellipse cx="12" cy="5" rx="9" ry="3" fill="none" stroke="currentColor" strokeWidth="2"/>
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" fill="none" stroke="currentColor" strokeWidth="2"/>
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" fill="none" stroke="currentColor" strokeWidth="2"/>
      </svg>
    );
  },

  Storage: ({ width = 24, height = 24, className, size = 'md' }: EnhancedProviderIconProps) => {
    const actualSize = width === 24 && height === 24 ? sizeMap[size] : width;
    return (
      <svg width={actualSize} height={actualSize} viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="none" stroke="currentColor" strokeWidth="2"/>
        <polyline points="14,2 14,8 20,8" fill="none" stroke="currentColor" strokeWidth="2"/>
        <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2"/>
        <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2"/>
        <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2"/>
      </svg>
    );
  },

  LoadBalancer: ({ width = 24, height = 24, className, size = 'md' }: EnhancedProviderIconProps) => {
    const actualSize = width === 24 && height === 24 ? sizeMap[size] : width;
    return (
      <svg width={actualSize} height={actualSize} viewBox="0 0 24 24" className={className} fill="currentColor">
        <rect x="2" y="8" width="20" height="8" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
        <circle cx="6" cy="12" r="1.5" fill="currentColor"/>
        <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
        <circle cx="18" cy="12" r="1.5" fill="currentColor"/>
        <path d="M12 4L16 8H8L12 4Z" fill="currentColor"/>
        <path d="M12 20L16 16H8L12 20Z" fill="currentColor"/>
      </svg>
    );
  },

  Monitoring: ({ width = 24, height = 24, className, size = 'md' }: EnhancedProviderIconProps) => {
    const actualSize = width === 24 && height === 24 ? sizeMap[size] : width;
    return (
      <svg width={actualSize} height={actualSize} viewBox="0 0 24 24" className={className} fill="currentColor">
        <rect x="2" y="4" width="20" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
        <path d="M6 16L10 12L14 14L18 10" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="6" cy="16" r="1.5" fill="currentColor"/>
        <circle cx="10" cy="12" r="1.5" fill="currentColor"/>
        <circle cx="14" cy="14" r="1.5" fill="currentColor"/>
        <circle cx="18" cy="10" r="1.5" fill="currentColor"/>
      </svg>
    );
  },

  ExternalSystem: ({ width = 24, height = 24, className, size = 'md' }: EnhancedProviderIconProps) => {
    const actualSize = width === 24 && height === 24 ? sizeMap[size] : width;
    return (
      <svg width={actualSize} height={actualSize} viewBox="0 0 24 24" className={className} fill="currentColor">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
        <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="2"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" fill="none" stroke="currentColor" strokeWidth="2"/>
      </svg>
    );
  },

  User: ({ width = 24, height = 24, className, size = 'md' }: EnhancedProviderIconProps) => {
    const actualSize = width === 24 && height === 24 ? sizeMap[size] : width;
    return (
      <svg width={actualSize} height={actualSize} viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" fill="none" stroke="currentColor" strokeWidth="2"/>
        <circle cx="12" cy="7" r="4" fill="none" stroke="currentColor" strokeWidth="2"/>
      </svg>
    );
  },
};

// Icon Registry System
export class IconRegistry {
  private static icons: Map<string, Map<string, React.ComponentType<EnhancedProviderIconProps>>> = new Map();

  static {
    // Register AWS icons
    const awsIcons = new Map<string, React.ComponentType<EnhancedProviderIconProps>>();
    awsIcons.set('compute', EnhancedAWSIcons.EC2);
    awsIcons.set('database', EnhancedAWSIcons.RDS);
    awsIcons.set('storage', EnhancedAWSIcons.S3);
    awsIcons.set('load-balancer', EnhancedAWSIcons.ALB);
    awsIcons.set('api-gateway', EnhancedAWSIcons.APIGateway);
    awsIcons.set('cdn', EnhancedAWSIcons.CloudFront);
    awsIcons.set('waf', EnhancedAWSIcons.WAF);
    awsIcons.set('iam', EnhancedAWSIcons.IAM);
    awsIcons.set('monitoring', EnhancedAWSIcons.CloudWatch);
    IconRegistry.icons.set('aws', awsIcons);

    // Register Azure icons
    const azureIcons = new Map<string, React.ComponentType<EnhancedProviderIconProps>>();
    azureIcons.set('compute', EnhancedAzureIcons.VM);
    azureIcons.set('database', EnhancedAzureIcons.SQL);
    azureIcons.set('storage', EnhancedAzureIcons.Blob);
    azureIcons.set('load-balancer', EnhancedAzureIcons.LoadBalancer);
    azureIcons.set('monitoring', EnhancedAzureIcons.Monitor);
    IconRegistry.icons.set('azure', azureIcons);

    // Register GCP icons
    const gcpIcons = new Map<string, React.ComponentType<EnhancedProviderIconProps>>();
    gcpIcons.set('compute', EnhancedGCPIcons.ComputeEngine);
    gcpIcons.set('database', EnhancedGCPIcons.CloudSQL);
    gcpIcons.set('storage', EnhancedGCPIcons.CloudStorage);
    gcpIcons.set('load-balancer', EnhancedGCPIcons.CloudLoadBalancing);
    gcpIcons.set('monitoring', EnhancedGCPIcons.CloudMonitoring);
    IconRegistry.icons.set('gcp', gcpIcons);

    // Register generic icons
    const genericIcons = new Map<string, React.ComponentType<EnhancedProviderIconProps>>();
    genericIcons.set('compute', EnhancedGenericIcons.Compute);
    genericIcons.set('database', EnhancedGenericIcons.Database);
    genericIcons.set('storage', EnhancedGenericIcons.Storage);
    genericIcons.set('load-balancer', EnhancedGenericIcons.LoadBalancer);
    genericIcons.set('monitoring', EnhancedGenericIcons.Monitoring);
    genericIcons.set('external-system', EnhancedGenericIcons.ExternalSystem);
    genericIcons.set('user', EnhancedGenericIcons.User);
    IconRegistry.icons.set('generic', genericIcons);
  }

  static register(provider: string, componentId: string, icon: React.ComponentType<EnhancedProviderIconProps>) {
    if (!IconRegistry.icons.has(provider)) {
      IconRegistry.icons.set(provider, new Map());
    }
    IconRegistry.icons.get(provider)!.set(componentId, icon);
  }

  static getIcon(provider: string, componentId: string, props: EnhancedProviderIconProps = {}) {
    const providerIcons = IconRegistry.icons.get(provider);
    if (providerIcons && providerIcons.has(componentId)) {
      const IconComponent = providerIcons.get(componentId)!;
      return <IconComponent {...props} />;
    }

    // Fallback to generic icons
    const genericIcons = IconRegistry.icons.get('generic');
    if (genericIcons && genericIcons.has(componentId)) {
      const IconComponent = genericIcons.get(componentId)!;
      return <IconComponent {...props} />;
    }

    // Final fallback to external system icon
    const ExternalSystemIcon = EnhancedGenericIcons.ExternalSystem;
    return <ExternalSystemIcon {...props} />;
  }
}

// Enhanced helper function with registry support
export function getEnhancedProviderIcon(componentId: string, provider: string, props: EnhancedProviderIconProps = {}) {
  return IconRegistry.getIcon(provider, componentId, props);
}