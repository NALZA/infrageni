import {
    BaseBoxShapeUtil,
    TLBaseShape,
    HTMLContainer,
    Rectangle2d,
} from 'tldraw';
import { GENERIC_COMPONENTS, useProvider } from '../components';
import { getProviderIcon } from './provider-icons';
import { validateShapeProperties, ValidationResult } from '../validation/shape-validation';
import { handleShapeUpdateError, handleShapeCreationError } from '../validation/shape-error-handler';
import { ComponentRegistry } from '../components/core/component-registry';

// Base shape type interface
export interface BaseInfraShapeProps {
    w: number;
    h: number;
    color: string;
    label: string;
    componentId: string;
    isBoundingBox?: boolean; // Whether this shape can contain other shapes
    opacity?: number; // For bounding box transparency
}

// Helper function to get provider-specific label
export function getProviderSpecificLabel(componentId: string, provider: string): string {
    // Try to get from enhanced component registry first
    const registry = ComponentRegistry.getInstance();
    const enhancedComponent = registry.getComponent(componentId);

    if (enhancedComponent) {
        const providerMapping = enhancedComponent.providerMappings[provider];
        if (providerMapping) {
            return providerMapping.name;
        }
        // Fallback to generic mapping if specific provider not found
        const genericMapping = enhancedComponent.providerMappings.generic;
        if (genericMapping) {
            return genericMapping.name;
        }
        // Final fallback to component name
        return enhancedComponent.name;
    }

    // Fallback to legacy components for backward compatibility
    const component = GENERIC_COMPONENTS.find(c => c.id === componentId);
    if (!component) return componentId;
    return component.providerNames[provider] || component.label;
}

// Component that uses the provider hook and renders the shape content
export function ShapeContent({ componentId, color, icon }: { componentId: string; color?: string; icon?: React.ReactNode }) {
    const provider = useProvider();
    const label = getProviderSpecificLabel(componentId, provider);
    const defaultIcon = getProviderIcon(componentId, provider, { width: 24, height: 24 });

    return (
        <>
            {icon || defaultIcon}
            <div style={{ marginTop: '4px', wordBreak: 'break-word' }}>
                {label}
            </div>
        </>
    );
}

// Base shape utility class with common functionality
export abstract class BaseInfraShapeUtil<T extends TLBaseShape<string, BaseInfraShapeProps>> extends BaseBoxShapeUtil<T> {

    // Validate shape properties at runtime
    protected validateProps(shape: T): ValidationResult {
        return validateShapeProperties(shape.props);
    }

    // Hook for shape validation on updates
    override onBeforeUpdate(prev: T, next: T) {
        const correctedProps = handleShapeUpdateError(next.type, prev.props, next.props);

        // Return shape with corrected properties if needed
        return {
            ...next,
            props: correctedProps
        } as T;
    }

    // Hook for shape validation on creation
    override onBeforeCreate(shape: T) {
        const correctedProps = handleShapeCreationError(shape.type, shape.props);

        // Return shape with corrected properties if needed
        return {
            ...shape,
            props: correctedProps
        } as T;
    }

    override getGeometry(shape: T) {
        return new Rectangle2d({
            width: shape.props.w,
            height: shape.props.h,
            isFilled: true,
        });
    }

    override indicator(shape: T) {
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

    // Abstract method that each shape must implement to provide its icon
    abstract getIcon(): React.ReactNode;

    // Abstract method that each shape must implement to provide its color
    abstract getBorderColor(): string;
    abstract getTextColor(): string;

    override component(shape: T) {
        const icon = this.getIcon();
        const borderColor = this.getBorderColor();
        const textColor = this.getTextColor();

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
                    border: `2px solid ${borderColor}`,
                    borderRadius: '8px',
                    backgroundColor: shape.props.isBoundingBox
                        ? `rgba(255, 255, 255, ${shape.props.opacity || 0.1})`
                        : 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    padding: '8px',
                    boxSizing: 'border-box',
                    color: textColor,
                    pointerEvents: 'all',
                }}
            >
                <ShapeContent
                    componentId={shape.props.componentId}
                    icon={icon}
                    color={shape.props.color}
                />
            </HTMLContainer>
        );
    }
}
