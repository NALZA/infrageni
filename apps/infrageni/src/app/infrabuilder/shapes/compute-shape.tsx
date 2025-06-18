import { RecordProps, T, TLBaseShape } from 'tldraw';
import { BaseInfraShapeUtil, BaseInfraShapeProps } from './base';

export type ComputeShape = TLBaseShape<'compute', BaseInfraShapeProps>;

export class ComputeShapeUtil extends BaseInfraShapeUtil<ComputeShape> {
    static override type = 'compute' as const;
    static override props: RecordProps<ComputeShape> = {
        w: T.number,
        h: T.number,
        color: T.string,
        label: T.string,
        componentId: T.string,
        isBoundingBox: T.optional(T.boolean),
        opacity: T.optional(T.number),
    };

    override getDefaultProps(): ComputeShape['props'] {
        return {
            w: 120,
            h: 80,
            color: 'blue',
            label: 'Compute Instance',
            componentId: 'compute',
            isBoundingBox: false,
        };
    }

    getIcon() {
        return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="4" width="18" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
                <rect x="7" y="8" width="2" height="2" fill="currentColor" />
                <rect x="11" y="8" width="2" height="2" fill="currentColor" />
                <rect x="15" y="8" width="2" height="2" fill="currentColor" />
                <rect x="7" y="12" width="2" height="2" fill="currentColor" />
                <rect x="11" y="12" width="2" height="2" fill="currentColor" />
                <rect x="15" y="12" width="2" height="2" fill="currentColor" />
            </svg>
        );
    }

    getBorderColor(): string {
        return '#3b82f6';
    }

    getTextColor(): string {
        return '#1e40af';
    }
}
