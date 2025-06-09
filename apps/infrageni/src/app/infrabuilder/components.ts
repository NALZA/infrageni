import { useAtom } from 'jotai';
import { providerAtom } from '../lib/provider-atom';

export type GenericComponent = {
  id: string;
  label: string;
  providerNames: Record<string, string>;
};

export const GENERIC_COMPONENTS: GenericComponent[] = [
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
