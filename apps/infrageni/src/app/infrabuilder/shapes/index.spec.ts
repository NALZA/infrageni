import { describe, it, expect } from 'vitest';
import { createShapeId } from 'tldraw';
import { createComponentShape, customShapeUtils } from './index';
import { GENERIC_COMPONENTS } from '../components';

describe('Shapes Index', () => {
  describe('customShapeUtils', () => {
    it('should export all required shape utilities', () => {
      const expectedShapeTypes = [
        'ComputeShapeUtil',
        'DatabaseShapeUtil',
        'StorageShapeUtil',
        'ExternalSystemShapeUtil',
        'UserShapeUtil',
        'VPCShapeUtil',
        'SubnetShapeUtil',
        'AvailabilityZoneShapeUtil',
      ];

      expect(customShapeUtils).toHaveLength(8);
      
      customShapeUtils.forEach(util => {
        expect(util.type).toBeTruthy();
        expect(util.props).toBeTruthy();
        expect(util.component).toBeTruthy();
      });
    });

    it('should have unique shape types', () => {
      const types = customShapeUtils.map(util => util.type);
      const uniqueTypes = [...new Set(types)];
      
      expect(types).toHaveLength(uniqueTypes.length);
    });
  });

  describe('createComponentShape', () => {
    const mockParentId = createShapeId();

    it('should create VPC shape with correct properties', () => {
      const vpcComponent = GENERIC_COMPONENTS.find(comp => comp.id === 'vpc')!;
      
      const shape = createComponentShape(vpcComponent, 100, 200, 'aws', mockParentId);

      expect(shape.type).toBe('vpc');
      expect(shape.x).toBe(100);
      expect(shape.y).toBe(200);
      expect(shape.parentId).toBe(mockParentId);
      expect(shape.props.label).toBe('VPC');
      expect(shape.props.isBoundingBox).toBe(true);
      expect(shape.props.w).toBe(400);
      expect(shape.props.h).toBe(250);
      expect(shape.props.color).toBe('blue');
      expect(shape.props.opacity).toBe(0.1);
    });

    it('should create subnet shape with correct properties', () => {
      const subnetComponent = GENERIC_COMPONENTS.find(comp => comp.id === 'subnet')!;
      
      const shape = createComponentShape(subnetComponent, 50, 75, 'azure');

      expect(shape.type).toBe('subnet');
      expect(shape.x).toBe(50);
      expect(shape.y).toBe(75);
      expect(shape.props.label).toBe('Subnet');
      expect(shape.props.isBoundingBox).toBe(true);
      expect(shape.props.w).toBe(200);
      expect(shape.props.h).toBe(120);
      expect(shape.props.color).toBe('green');
      expect(shape.props.opacity).toBe(0.2);
    });

    it('should create availability zone shape with correct properties', () => {
      const azComponent = GENERIC_COMPONENTS.find(comp => comp.id === 'availability-zone')!;
      
      const shape = createComponentShape(azComponent, 0, 0, 'gcp');

      expect(shape.type).toBe('availability-zone');
      expect(shape.props.label).toBe('Zone');
      expect(shape.props.isBoundingBox).toBe(true);
      expect(shape.props.w).toBe(300);
      expect(shape.props.h).toBe(180);
      expect(shape.props.color).toBe('purple');
      expect(shape.props.opacity).toBe(0.15);
    });

    it('should create compute shape with correct properties', () => {
      const computeComponent = GENERIC_COMPONENTS.find(comp => comp.id === 'compute')!;
      
      const shape = createComponentShape(computeComponent, 25, 50, 'aws');

      expect(shape.type).toBe('compute');
      expect(shape.props.label).toBe('EC2 Instance');
      expect(shape.props.isBoundingBox).toBe(false);
      expect(shape.props.w).toBe(120);
      expect(shape.props.h).toBe(80);
      expect(shape.props.color).toBe('blue');
    });

    it('should create database shape with correct properties', () => {
      const databaseComponent = GENERIC_COMPONENTS.find(comp => comp.id === 'database')!;
      
      const shape = createComponentShape(databaseComponent, 0, 0, 'gcp');

      expect(shape.type).toBe('database');
      expect(shape.props.label).toBe('Cloud SQL');
      expect(shape.props.isBoundingBox).toBe(false);
      expect(shape.props.color).toBe('green');
    });

    it('should create storage shape with correct properties', () => {
      const storageComponent = GENERIC_COMPONENTS.find(comp => comp.id === 'storage')!;
      
      const shape = createComponentShape(storageComponent, 0, 0, 'azure');

      expect(shape.type).toBe('storage');
      expect(shape.props.label).toBe('Blob Storage');
      expect(shape.props.isBoundingBox).toBe(false);
      expect(shape.props.color).toBe('orange');
    });

    it('should create external system shape with correct properties', () => {
      const externalComponent = GENERIC_COMPONENTS.find(comp => comp.id === 'external-system')!;
      
      const shape = createComponentShape(externalComponent, 0, 0, 'generic');

      expect(shape.type).toBe('external-system');
      expect(shape.props.label).toBe('External System');
      expect(shape.props.isBoundingBox).toBe(false);
      expect(shape.props.color).toBe('red');
    });

    it('should create user shape with correct properties', () => {
      const userComponent = GENERIC_COMPONENTS.find(comp => comp.id === 'user')!;
      
      const shape = createComponentShape(userComponent, 0, 0, 'aws');

      expect(shape.type).toBe('user');
      expect(shape.props.label).toBe('User');
      expect(shape.props.isBoundingBox).toBe(false);
      expect(shape.props.color).toBe('violet');
    });

    it('should include componentId in props', () => {
      const computeComponent = GENERIC_COMPONENTS.find(comp => comp.id === 'compute')!;
      
      const shape = createComponentShape(computeComponent, 0, 0, 'aws');

      expect(shape.props.componentId).toBe('compute');
    });

    it('should use provider-specific labels', () => {
      const storageComponent = GENERIC_COMPONENTS.find(comp => comp.id === 'storage')!;
      
      const awsShape = createComponentShape(storageComponent, 0, 0, 'aws');
      const azureShape = createComponentShape(storageComponent, 0, 0, 'azure');
      const gcpShape = createComponentShape(storageComponent, 0, 0, 'gcp');
      const genericShape = createComponentShape(storageComponent, 0, 0, 'generic');

      expect(awsShape.props.label).toBe('S3 Bucket');
      expect(azureShape.props.label).toBe('Blob Storage');
      expect(gcpShape.props.label).toBe('Cloud Storage');
      expect(genericShape.props.label).toBe('Storage Bucket');
    });

    it('should handle unknown component types', () => {
      const unknownComponent = {
        id: 'unknown',
        label: 'Unknown Component',
        providerNames: { aws: 'Unknown', azure: 'Unknown', gcp: 'Unknown', generic: 'Unknown' },
      };
      
      const shape = createComponentShape(unknownComponent, 0, 0, 'aws');

      expect(shape.type).toBe('note');
      expect(shape.props.color).toBe('yellow');
      expect(shape.props.richText.content[0].content[0].text).toBe('Unknown');
    });
  });
});