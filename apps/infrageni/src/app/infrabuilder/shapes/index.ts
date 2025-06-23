import { createShapeId, TLShapeId } from 'tldraw';
import { GenericComponent } from '../components';

// Import all shape utils for the customShapeUtils array
import { ComputeShapeUtil } from './compute-shape';
import { DatabaseShapeUtil } from './database-shape';
import { StorageShapeUtil } from './storage-shape';
import { ExternalSystemShapeUtil } from './external-system-shape';
import { UserShapeUtil } from './user-shape';
import { VPCShapeUtil } from './vpc-shape';
import { SubnetShapeUtil } from './subnet-shape';
import { AvailabilityZoneShapeUtil } from './availability-zone-shape';

// Export all shape types and utilities
export type { ComputeShape } from './compute-shape';
export { ComputeShapeUtil } from './compute-shape';
export type { DatabaseShape } from './database-shape';
export { DatabaseShapeUtil } from './database-shape';
export type { StorageShape } from './storage-shape';
export { StorageShapeUtil } from './storage-shape';
export type { ExternalSystemShape } from './external-system-shape';
export { ExternalSystemShapeUtil } from './external-system-shape';
export type { UserShape } from './user-shape';
export { UserShapeUtil } from './user-shape';
export type { VPCShape } from './vpc-shape';
export { VPCShapeUtil } from './vpc-shape';
export type { SubnetShape } from './subnet-shape';
export { SubnetShapeUtil } from './subnet-shape';
export type { AvailabilityZoneShape } from './availability-zone-shape';
export { AvailabilityZoneShapeUtil } from './availability-zone-shape';
export type { BaseInfraShapeProps } from './base';
export {
  BaseInfraShapeUtil,
  ShapeContent,
  getProviderSpecificLabel,
} from './base';

// Export all shape utils for tldraw
export const customShapeUtils = [
  ComputeShapeUtil,
  DatabaseShapeUtil,
  StorageShapeUtil,
  ExternalSystemShapeUtil,
  UserShapeUtil,
  VPCShapeUtil,
  SubnetShapeUtil,
  AvailabilityZoneShapeUtil,
];

// Helper function to create a shape based on component type
export function createComponentShape(
  component: GenericComponent,
  x: number,
  y: number,
  provider: string,
  parentId?: TLShapeId
) {
  const shapeId = createShapeId();
  const label = component.providerNames[provider] || component.label;

  const baseProps = {
    id: shapeId,
    x,
    y,
    parentId,
    props: {
      w: component.isBoundingBox ? 300 : 120, // Larger default size for bounding boxes
      h: component.isBoundingBox ? 200 : 80,
      label,
      componentId: component.id, // Add the component ID to make shapes reactive
      isBoundingBox: component.isBoundingBox,
    },
  };

  switch (component.id) {
    case 'vpc':
      return {
        ...baseProps,
        type: 'vpc' as const,
        props: {
          ...baseProps.props,
          color: 'blue',
          w: 400,
          h: 250,
          opacity: 0.1,
        },
      };
    case 'subnet':
      return {
        ...baseProps,
        type: 'subnet' as const,
        props: {
          ...baseProps.props,
          color: 'green',
          w: 200,
          h: 120,
          opacity: 0.2,
        },
      };
    case 'availability-zone':
      return {
        ...baseProps,
        type: 'availability-zone' as const,
        props: {
          ...baseProps.props,
          color: 'purple',
          w: 300,
          h: 180,
          opacity: 0.15,
        },
      };
    case 'compute':
      return {
        ...baseProps,
        type: 'compute' as const,
        props: {
          ...baseProps.props,
          color: 'blue',
        },
      };
    case 'database':
      return {
        ...baseProps,
        type: 'database' as const,
        props: {
          ...baseProps.props,
          color: 'green',
        },
      };
    case 'storage':
      return {
        ...baseProps,
        type: 'storage' as const,
        props: {
          ...baseProps.props,
          color: 'orange',
        },
      };
    case 'external-system':
      return {
        ...baseProps,
        type: 'external-system' as const,
        props: {
          ...baseProps.props,
          color: 'red',
        },
      };
    case 'user':
      return {
        ...baseProps,
        type: 'user' as const,
        props: {
          ...baseProps.props,
          color: 'violet',
        },
      };
    default:
      // Fallback to note shape for unknown types
      return {
        ...baseProps,
        type: 'note' as const,
        props: {
          color: 'yellow',
          size: 'm' as const,
          richText: {
            type: 'doc',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: label,
                  },
                ],
              },
            ],
          },
        },
      };
  }
}
