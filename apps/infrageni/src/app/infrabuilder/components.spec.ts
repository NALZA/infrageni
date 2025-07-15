import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAtom } from 'jotai';
import { GENERIC_COMPONENTS, useProvider } from './components';
import { Provider } from '../lib/provider-atom';

// Mock jotai
vi.mock('jotai', () => ({
  useAtom: vi.fn(),
}));

describe('Components', () => {
  describe('GENERIC_COMPONENTS', () => {
    it('should contain all required components', () => {
      const expectedComponents = [
        'vpc',
        'subnet',
        'availability-zone',
        'compute',
        'database',
        'storage',
        'external-system',
        'user',
      ];

      const componentIds = GENERIC_COMPONENTS.map(comp => comp.id);

      expectedComponents.forEach(id => {
        expect(componentIds).toContain(id);
      });
    });

    it('should have provider-specific names for all components', () => {
      const providers: Provider[] = ['aws', 'azure', 'gcp', 'generic'];

      GENERIC_COMPONENTS.forEach(component => {
        providers.forEach(provider => {
          expect(component.providerNames).toHaveProperty(provider);
          expect(component.providerNames[provider]).toBeTruthy();
        });
      });
    });

    it('should correctly identify bounding box components', () => {
      const boundingBoxComponents = GENERIC_COMPONENTS.filter(comp => comp.isBoundingBox);
      const expectedBoundingBoxes = ['vpc', 'subnet', 'availability-zone'];

      expect(boundingBoxComponents).toHaveLength(3);
      expectedBoundingBoxes.forEach(id => {
        expect(boundingBoxComponents.some(comp => comp.id === id)).toBe(true);
      });
    });

    it('should have different provider names for multi-cloud components', () => {
      const vpcComponent = GENERIC_COMPONENTS.find(comp => comp.id === 'vpc');
      
      expect(vpcComponent?.providerNames.aws).toBe('VPC');
      expect(vpcComponent?.providerNames.azure).toBe('Virtual Network');
      expect(vpcComponent?.providerNames.gcp).toBe('VPC Network');
      expect(vpcComponent?.providerNames.generic).toBe('Virtual Private Cloud');
    });

    it('should have appropriate compute instance names per provider', () => {
      const computeComponent = GENERIC_COMPONENTS.find(comp => comp.id === 'compute');
      
      expect(computeComponent?.providerNames.aws).toBe('EC2 Instance');
      expect(computeComponent?.providerNames.azure).toBe('Virtual Machine');
      expect(computeComponent?.providerNames.gcp).toBe('Compute Engine');
      expect(computeComponent?.providerNames.generic).toBe('Compute Instance');
    });

    it('should have appropriate storage names per provider', () => {
      const storageComponent = GENERIC_COMPONENTS.find(comp => comp.id === 'storage');
      
      expect(storageComponent?.providerNames.aws).toBe('S3 Bucket');
      expect(storageComponent?.providerNames.azure).toBe('Blob Storage');
      expect(storageComponent?.providerNames.gcp).toBe('Cloud Storage');
      expect(storageComponent?.providerNames.generic).toBe('Storage Bucket');
    });

    it('should have appropriate database names per provider', () => {
      const databaseComponent = GENERIC_COMPONENTS.find(comp => comp.id === 'database');
      
      expect(databaseComponent?.providerNames.aws).toBe('RDS Database');
      expect(databaseComponent?.providerNames.azure).toBe('Azure SQL');
      expect(databaseComponent?.providerNames.gcp).toBe('Cloud SQL');
      expect(databaseComponent?.providerNames.generic).toBe('Database');
    });
  });

  describe('useProvider', () => {
    it('should return current provider from atom', () => {
      const mockProvider: Provider = 'aws';
      const mockSetProvider = vi.fn();
      
      (useAtom as any).mockReturnValue([mockProvider, mockSetProvider]);

      const { result } = renderHook(() => useProvider());

      expect(result.current).toBe('aws');
    });

    it('should return different providers when atom changes', () => {
      const providers: Provider[] = ['aws', 'azure', 'gcp', 'generic'];
      
      providers.forEach(provider => {
        const mockSetProvider = vi.fn();
        (useAtom as any).mockReturnValue([provider, mockSetProvider]);

        const { result } = renderHook(() => useProvider());

        expect(result.current).toBe(provider);
      });
    });
  });
});