import { RecordProps, T, TLBaseShape } from 'tldraw';
import { BaseInfraShapeUtil, BaseInfraShapeProps } from './base';

export type ExternalSystemShape = TLBaseShape<'external-system', BaseInfraShapeProps>;

export class ExternalSystemShapeUtil extends BaseInfraShapeUtil<ExternalSystemShape> {
    static override type = 'external-system' as const;
    static override props: RecordProps<ExternalSystemShape> = {
        w: T.number,
        h: T.number,
        color: T.string,
        label: T.string,
        componentId: T.string,
        isBoundingBox: T.optional(T.boolean),
        opacity: T.optional(T.number),
    };

    override getDefaultProps(): ExternalSystemShape['props'] {
        return {
            w: 120,
            h: 80,
            color: 'red',
            label: 'External System',
            componentId: 'external-system',
            isBoundingBox: false,
        };
    }

    getIcon() {
        return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="2" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
        );
    }

    getBorderColor(): string {
        return '#ef4444';
    }

    getTextColor(): string {
        return '#dc2626';
    }
}
