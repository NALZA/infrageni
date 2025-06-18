import {
    TLBaseShape,
    HTMLContainer,
    Rectangle2d,
    RecordProps,
    T,
} from 'tldraw';
import { BaseInfraShapeProps, BaseInfraShapeUtil, ShapeContent } from './base';
import { getProviderIcon } from './provider-icons';

// Availability Zone shape type
export type AvailabilityZoneShape = TLBaseShape<'availability-zone', BaseInfraShapeProps>;

// Availability Zone shape utility
export class AvailabilityZoneShapeUtil extends BaseInfraShapeUtil<AvailabilityZoneShape> {
    static override type = 'availability-zone' as const;
    static override props: RecordProps<AvailabilityZoneShape> = {
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
            w: 250,
            h: 150,
            color: 'purple',
            label: 'Availability Zone',
            componentId: 'availability-zone',
            isBoundingBox: true,
            opacity: 0.15,
        };
    }

    override getGeometry(shape: AvailabilityZoneShape) {
        return new Rectangle2d({
            width: shape.props.w,
            height: shape.props.h,
            isFilled: true,
        });
    }

    override indicator(shape: AvailabilityZoneShape) {
        return (
            <rect
                width={shape.props.w}
                height={shape.props.h}
                fill="none"
                stroke="var(--color-selection-stroke)"
                strokeWidth="2"
                strokeDasharray="8,4"
                rx="10"
            />
        );
    }

    override getIcon(): React.ReactNode {
        return getProviderIcon('availability-zone', 'aws', { width: 22, height: 22 });
    }

    override getBorderColor(): string {
        return '#8b5cf6'; // Purple color for AZ
    }

    override getTextColor(): string {
        return '#5b21b6'; // Darker purple for text
    }

    override component(shape: AvailabilityZoneShape) {
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
                    borderRadius: '10px',
                    backgroundColor: `rgba(139, 92, 246, ${shape.props.opacity || 0.1})`,
                    backdropFilter: 'blur(10px)',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    textAlign: 'left',
                    padding: '10px',
                    boxSizing: 'border-box',
                    color: this.getTextColor(),
                    position: 'relative',
                }}
            >
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    marginBottom: '6px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    padding: '4px 7px',
                    borderRadius: '5px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                }}>
                    <ShapeContent
                        componentId={shape.props.componentId}
                        color={shape.props.color}
                    />
                </div>
                <div style={{
                    fontSize: '10px',
                    opacity: 0.7,
                    fontStyle: 'italic',
                }}>
                    Contains subnets and resources
                </div>
            </HTMLContainer>
        );
    }

    override canResize = () => true;
    override canBind = () => false; // AZs shouldn't be bindable to arrows
}
