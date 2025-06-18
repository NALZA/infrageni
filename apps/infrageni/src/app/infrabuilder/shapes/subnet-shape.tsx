import {
    TLBaseShape,
    HTMLContainer,
    Rectangle2d,
    RecordProps,
    T,
} from 'tldraw';
import { BaseInfraShapeProps, BaseInfraShapeUtil, ShapeContent } from './base';
import { getProviderIcon } from './provider-icons';

// Subnet shape type
export type SubnetShape = TLBaseShape<'subnet', BaseInfraShapeProps>;

// Subnet shape utility
export class SubnetShapeUtil extends BaseInfraShapeUtil<SubnetShape> {
    static override type = 'subnet' as const;
    static override props: RecordProps<SubnetShape> = {
        w: T.number,
        h: T.number,
        color: T.string,
        label: T.string,
        componentId: T.string,
        isBoundingBox: T.optional(T.boolean),
        opacity: T.optional(T.number),
    };

    override getDefaultProps(): BaseInfraShapeProps {
        return {
            w: 200,
            h: 120,
            color: 'green',
            label: 'Subnet',
            componentId: 'subnet',
            isBoundingBox: true,
            opacity: 0.2,
        };
    }

    override getGeometry(shape: SubnetShape) {
        return new Rectangle2d({
            width: shape.props.w,
            height: shape.props.h,
            isFilled: true,
        });
    }

    override indicator(shape: SubnetShape) {
        return (
            <rect
                width={shape.props.w}
                height={shape.props.h}
                fill="none"
                stroke="var(--color-selection-stroke)"
                strokeWidth="2"
                strokeDasharray="3,3"
                rx="8"
            />
        );
    }

    override getIcon(): React.ReactNode {
        return getProviderIcon('subnet', 'aws', { width: 20, height: 20 });
    }

    override getBorderColor(): string {
        return '#10b981'; // Green color for subnet
    }

    override getTextColor(): string {
        return '#065f46'; // Darker green for text
    }

    override component(shape: SubnetShape) {
        return (
            <HTMLContainer
                id={shape.id}
                style={{
                    width: shape.props.w,
                    height: shape.props.h,
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    flexDirection: 'column',
                    border: `2px dashed ${this.getBorderColor()}`,
                    borderRadius: '8px',
                    backgroundColor: `rgba(16, 185, 129, ${shape.props.opacity || 0.1})`,
                    backdropFilter: 'blur(10px)',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textAlign: 'left',
                    padding: '8px',
                    boxSizing: 'border-box',
                    color: this.getTextColor(),
                    position: 'relative',
                }}
            >
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '4px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    padding: '3px 6px',
                    borderRadius: '4px',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                }}>
                    <ShapeContent
                        componentId={shape.props.componentId}
                        color={shape.props.color}
                    />
                </div>
                <div style={{
                    fontSize: '9px',
                    opacity: 0.7,
                    fontStyle: 'italic',
                }}>
                    Drop resources here
                </div>
            </HTMLContainer>
        );
    }

    override canResize = () => true;
    override canBind = () => false; // Subnets shouldn't be bindable to arrows
}
