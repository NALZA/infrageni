import { useAtom } from 'jotai';
import { providerAtom } from '../lib/provider-atom';

export type GenericComponent = {
  id: string;
  label: string;
  providerNames: Record<string, string>;
  isBoundingBox?: boolean; // New property to indicate if this is a container component
};

export const GENERIC_COMPONENTS: GenericComponent[] = [
  {
    id: 'vpc',
    label: 'Virtual Private Cloud',
    isBoundingBox: true,
    providerNames: {
      aws: 'VPC',
      azure: 'Virtual Network',
      gcp: 'VPC Network',
      generic: 'Virtual Private Cloud',
    },
  },
  {
    id: 'subnet',
    label: 'Subnet',
    isBoundingBox: true,
    providerNames: {
      aws: 'Subnet',
      azure: 'Subnet',
      gcp: 'Subnetwork',
      generic: 'Subnet',
    },
  },
  {
    id: 'availability-zone',
    label: 'Availability Zone',
    isBoundingBox: true,
    providerNames: {
      aws: 'Availability Zone',
      azure: 'Availability Zone',
      gcp: 'Zone',
      generic: 'Availability Zone',
    },
  },
  {
    id: 'compute',
    label: 'Compute Instance',
    providerNames: {
      aws: 'EC2 Instance',
      azure: 'Virtual Machine',
      gcp: 'Compute Engine',
      generic: 'Compute Instance',
    },
  },
  {
    id: 'database',
    label: 'Database',
    providerNames: {
      aws: 'RDS Database',
      azure: 'Azure SQL',
      gcp: 'Cloud SQL',
      generic: 'Database',
    },
  },
  {
    id: 'storage',
    label: 'Storage Bucket',
    providerNames: {
      aws: 'S3 Bucket',
      azure: 'Blob Storage',
      gcp: 'Cloud Storage',
      generic: 'Storage Bucket',
    },
  },
  {
    id: 'external-system',
    label: 'External System',
    providerNames: {
      aws: 'External System',
      azure: 'External System',
      gcp: 'External System',
      generic: 'External System',
    },
  },
  {
    id: 'user',
    label: 'User',
    providerNames: {
      aws: 'User',
      azure: 'User',
      gcp: 'User',
      generic: 'User',
    },
  },
];

export function useProvider() {
  const [provider] = useAtom(providerAtom);
  return provider;
}
