import {
    BaseBoxShapeUtil,
    TLBaseShape,
    HTMLContainer,
    Rectangle2d,
} from 'tldraw';
import { GENERIC_COMPONENTS, useProvider } from '../components';
import { getProviderIcon } from './provider-icons';

// Base shape type interface
export interface BaseInfraShapeProps {
    w: number;
    h: number;
    color: string;
    label: string;
    componentId: string;
}

// Helper function to get provider-specific label
export function getProviderSpecificLabel(componentId: string, provider: string): string {
    const component = GENERIC_COMPONENTS.find(c => c.id === componentId);
    if (!component) return componentId;
    return component.providerNames[provider] || component.label;
}

// Component that uses the provider hook and renders the shape content
export function ShapeContent({ componentId, color }: { componentId: string; color?: string }) {
    const provider = useProvider();
    const label = getProviderSpecificLabel(componentId, provider);
    const icon = getProviderIcon(componentId, provider, { width: 24, height: 24 });
    
    return (
        <>
            {icon}
            <div style={{ marginTop: '4px', wordBreak: 'break-word' }}>
                {label}
            </div>
        </>
    );
}

// Base shape utility class with common functionality
export abstract class BaseInfraShapeUtil<T extends TLBaseShape<string, BaseInfraShapeProps>> extends BaseBoxShapeUtil<T> {
    
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
                    border: `2px solid ${this.getBorderColor()}`,
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    padding: '8px',
                    boxSizing: 'border-box',
                    color: this.getTextColor(),
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
