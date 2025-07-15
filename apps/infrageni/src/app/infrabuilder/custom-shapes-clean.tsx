import {
    BaseBoxShapeUtil,
    RecordProps,
    T,
    TLBaseShape,
    createShapeId,
    HTMLContainer,
    Rectangle2d,
} from 'tldraw';
import { GenericComponent } from './components';
import { useProvider } from './components';

// Define the shape types for each component
export type ComputeShape = TLBaseShape<
    'compute',
    {
        w: number;
        h: number;
        color: string;
        label: string;
    }
>;

export type DatabaseShape = TLBaseShape<
    'database',
    {
        w: number;
        h: number;
        color: string;
        label: string;
    }
>;

export type StorageShape = TLBaseShape<
    'storage',
    {
        w: number;
        h: number;
        color: string;
        label: string;
    }
>;

export type ExternalSystemShape = TLBaseShape<
    'external-system',
    {
        w: number;
        h: number;
        color: string;
        label: string;
    }
>;

export type UserShape = TLBaseShape<
    'user',
    {
        w: number;
        h: number;
        color: string;
        label: string;
    }
>;

// Compute Instance Shape
export class ComputeShapeUtil extends BaseBoxShapeUtil<ComputeShape> {
    static override type = 'compute' as const;
    static override props: RecordProps<ComputeShape> = {
        w: T.number,
        h: T.number,
        color: T.string,
        label: T.string,
    };

    override getDefaultProps(): ComputeShape['props'] {
        return {
            w: 120,
            h: 80,
            color: 'blue',
            label: 'Compute Instance',
        };
    }

    override getGeometry(shape: ComputeShape) {
        return new Rectangle2d({
            width: shape.props.w,
            height: shape.props.h,
            isFilled: true,
        });
    }

    override component(shape: ComputeShape) {
        return (
            <HTMLContainer
                id={shape.id}
                style={{
                    width: shape.props.w,
                    height: shape.props.h,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    border: '2px solid #3b82f6',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    padding: '8px',
                    boxSizing: 'border-box',
                    color: '#1e40af',
                }}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="3" y="4" width="18" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
                    <rect x="7" y="8" width="2" height="2" fill="currentColor"/>
                    <rect x="11" y="8" width="2" height="2" fill="currentColor"/>
                    <rect x="15" y="8" width="2" height="2" fill="currentColor"/>
                    <rect x="7" y="12" width="2" height="2" fill="currentColor"/>
                    <rect x="11" y="12" width="2" height="2" fill="currentColor"/>
                    <rect x="15" y="12" width="2" height="2" fill="currentColor"/>
                </svg>
                <div style={{ marginTop: '4px', wordBreak: 'break-word' }}>
                    {shape.props.label}
                </div>
            </HTMLContainer>
        );
    }

    override indicator(shape: ComputeShape) {
        return (
            <rect
                width={shape.props.w}
                height={shape.props.h}
                fill="none"
                stroke="var(--color-selection-stroke)"
                strokeWidth="1"
                rx="8"
            />
        );
    }
}

// Database Shape
export class DatabaseShapeUtil extends BaseBoxShapeUtil<DatabaseShape> {
    static override type = 'database' as const;
    static override props: RecordProps<DatabaseShape> = {
        w: T.number,
        h: T.number,
        color: T.string,
        label: T.string,
    };

    override getDefaultProps(): DatabaseShape['props'] {
        return {
            w: 120,
            h: 80,
            color: 'green',
            label: 'Database',
        };
    }

    override getGeometry(shape: DatabaseShape) {
        return new Rectangle2d({
            width: shape.props.w,
            height: shape.props.h,
            isFilled: true,
        });
    }

    override component(shape: DatabaseShape) {
        return (
            <HTMLContainer
                id={shape.id}
                style={{
                    width: shape.props.w,
                    height: shape.props.h,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    border: '2px solid #10b981',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    padding: '8px',
                    boxSizing: 'border-box',
                    color: '#047857',
                }}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <ellipse cx="12" cy="5" rx="9" ry="3" fill="none" stroke="currentColor" strokeWidth="2"/>
                    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" fill="none" stroke="currentColor" strokeWidth="2"/>
                    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" fill="none" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <div style={{ marginTop: '4px', wordBreak: 'break-word' }}>
                    {shape.props.label}
                </div>
            </HTMLContainer>
        );
    }

    override indicator(shape: DatabaseShape) {
        return (
            <rect
                width={shape.props.w}
                height={shape.props.h}
                fill="none"
                stroke="var(--color-selection-stroke)"
                strokeWidth="1"
                rx="8"
            />
        );
    }
}

// Storage Shape
export class StorageShapeUtil extends BaseBoxShapeUtil<StorageShape> {
    static override type = 'storage' as const;
    static override props: RecordProps<StorageShape> = {
        w: T.number,
        h: T.number,
        color: T.string,
        label: T.string,
    };

    override getDefaultProps(): StorageShape['props'] {
        return {
            w: 120,
            h: 80,
            color: 'orange',
            label: 'Storage Bucket',
        };
    }

    override getGeometry(shape: StorageShape) {
        return new Rectangle2d({
            width: shape.props.w,
            height: shape.props.h,
            isFilled: true,
        });
    }

    override component(shape: StorageShape) {
        return (
            <HTMLContainer
                id={shape.id}
                style={{
                    width: shape.props.w,
                    height: shape.props.h,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    border: '2px solid #f59e0b',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    padding: '8px',
                    boxSizing: 'border-box',
                    color: '#d97706',
                }}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="none" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="14,2 14,8 20,8" fill="none" stroke="currentColor" strokeWidth="2"/>
                    <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2"/>
                    <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <div style={{ marginTop: '4px', wordBreak: 'break-word' }}>
                    {shape.props.label}
                </div>
            </HTMLContainer>
        );
    }

    override indicator(shape: StorageShape) {
        return (
            <rect
                width={shape.props.w}
                height={shape.props.h}
                fill="none"
                stroke="var(--color-selection-stroke)"
                strokeWidth="1"
                rx="8"
            />
        );
    }
}

// External System Shape
export class ExternalSystemShapeUtil extends BaseBoxShapeUtil<ExternalSystemShape> {
    static override type = 'external-system' as const;
    static override props: RecordProps<ExternalSystemShape> = {
        w: T.number,
        h: T.number,
        color: T.string,
        label: T.string,
    };

    override getDefaultProps(): ExternalSystemShape['props'] {
        return {
            w: 120,
            h: 80,
            color: 'red',
            label: 'External System',
        };
    }

    override getGeometry(shape: ExternalSystemShape) {
        return new Rectangle2d({
            width: shape.props.w,
            height: shape.props.h,
            isFilled: true,
        });
    }

    override component(shape: ExternalSystemShape) {
        return (
            <HTMLContainer
                id={shape.id}
                style={{
                    width: shape.props.w,
                    height: shape.props.h,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    border: '2px solid #ef4444',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    padding: '8px',
                    boxSizing: 'border-box',
                    color: '#dc2626',
                }}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
                    <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" fill="none" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <div style={{ marginTop: '4px', wordBreak: 'break-word' }}>
                    {shape.props.label}
                </div>
            </HTMLContainer>
        );
    }

    override indicator(shape: ExternalSystemShape) {
        return (
            <rect
                width={shape.props.w}
                height={shape.props.h}
                fill="none"
                stroke="var(--color-selection-stroke)"
                strokeWidth="1"
                rx="8"
            />
        );
    }
}

// User Shape
export class UserShapeUtil extends BaseBoxShapeUtil<UserShape> {
    static override type = 'user' as const;
    static override props: RecordProps<UserShape> = {
        w: T.number,
        h: T.number,
        color: T.string,
        label: T.string,
    };

    override getDefaultProps(): UserShape['props'] {
        return {
            w: 120,
            h: 80,
            color: 'violet',
            label: 'User',
        };
    }

    override getGeometry(shape: UserShape) {
        return new Rectangle2d({
            width: shape.props.w,
            height: shape.props.h,
            isFilled: true,
        });
    }

    override component(shape: UserShape) {
        return (
            <HTMLContainer
                id={shape.id}
                style={{
                    width: shape.props.w,
                    height: shape.props.h,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    border: '2px solid #8b5cf6',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    padding: '8px',
                    boxSizing: 'border-box',
                    color: '#7c3aed',
                }}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" fill="none" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="12" cy="7" r="4" fill="none" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <div style={{ marginTop: '4px', wordBreak: 'break-word' }}>
                    {shape.props.label}
                </div>
            </HTMLContainer>
        );
    }

    override indicator(shape: UserShape) {
        return (
            <rect
                width={shape.props.w}
                height={shape.props.h}
                fill="none"
                stroke="var(--color-selection-stroke)"
                strokeWidth="1"
                rx="8"
            />
        );
    }
}

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

// Export all shape utils
export const customShapeUtils = [
    ComputeShapeUtil,
    DatabaseShapeUtil,
    StorageShapeUtil,
    ExternalSystemShapeUtil,
    UserShapeUtil,
];
