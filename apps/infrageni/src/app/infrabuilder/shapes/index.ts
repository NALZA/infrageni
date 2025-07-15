import { createShapeId } from 'tldraw';
import { GenericComponent } from '../components';

// Import all shape utils for the customShapeUtils array
import { ComputeShapeUtil } from './compute-shape';
import { DatabaseShapeUtil } from './database-shape';
import { StorageShapeUtil } from './storage-shape';
import { ExternalSystemShapeUtil } from './external-system-shape';
import { UserShapeUtil } from './user-shape';

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
export type { BaseInfraShapeProps } from './base';
export { BaseInfraShapeUtil, ShapeContent, getProviderSpecificLabel } from './base';

// Export all shape utils for tldraw
export const customShapeUtils = [
    ComputeShapeUtil,
    DatabaseShapeUtil,
    StorageShapeUtil,
    ExternalSystemShapeUtil,
    UserShapeUtil,
];

// Helper function to create a shape based on component type
export function createComponentShape(component: GenericComponent, x: number, y: number, provider: string) {
    const shapeId = createShapeId();
    const label = component.providerNames[provider] || component.label;
    
    const baseProps = {
        id: shapeId,
        x,
        y,
        props: {
            w: 120,
            h: 80,
            label,
            componentId: component.id, // Add the component ID to make shapes reactive
        },
    };

    switch (component.id) {
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
                                        text: label
                                    }
                                ]
                            }
                        ]
                    }
                }
            };
    }
}
