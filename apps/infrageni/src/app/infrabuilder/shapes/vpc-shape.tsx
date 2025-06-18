import {
    TLBaseShape,
    HTMLContainer,
    Rectangle2d,
    RecordProps,
    T,
} from 'tldraw';
import { BaseInfraShapeProps, BaseInfraShapeUtil, ShapeContent } from './base';
import { getProviderIcon } from './provider-icons';

// VPC shape type
export type VPCShape = TLBaseShape<'vpc', BaseInfraShapeProps>;

// VPC shape utility
export class VPCShapeUtil extends BaseInfraShapeUtil<VPCShape> {
    static override type = 'vpc' as const;
    static override props: RecordProps<VPCShape> = {
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
            w: 300,
            h: 200,
            color: 'blue',
            label: 'VPC',
            componentId: 'vpc',
            isBoundingBox: true,
            opacity: 0.3,
        };
    }

    override getGeometry(shape: VPCShape) {
        return new Rectangle2d({
            width: shape.props.w,
            height: shape.props.h,
            isFilled: true,
        });
    }

    override indicator(shape: VPCShape) {
        return (
            <rect
                width={shape.props.w}
                height={shape.props.h}
                fill="none"
                stroke="var(--color-selection-stroke)"
                strokeWidth="2"
                strokeDasharray="5,5"
                rx="12"
            />
        );
    }

    override getIcon(): React.ReactNode {
        return getProviderIcon('vpc', 'aws', { width: 24, height: 24 });
    }

    override getBorderColor(): string {
        return '#3b82f6'; // Blue color for VPC
    }

    override getTextColor(): string {
        return '#1e40af'; // Darker blue for text
    }

    override component(shape: VPCShape) {
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
                    borderRadius: '12px',
                    backgroundColor: `rgba(59, 130, 246, ${shape.props.opacity || 0.1})`,
                    backdropFilter: 'blur(10px)',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    textAlign: 'left',
                    padding: '12px',
                    boxSizing: 'border-box',
                    color: this.getTextColor(),
                    position: 'relative',
                }}
            >
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    padding: '4px 8px',
                    borderRadius: '6px',
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
                    Drag components here
                </div>
            </HTMLContainer>
        );
    }

    override canResize = () => true;
    override canBind = () => false; // VPCs shouldn't be bindable to arrows
}
