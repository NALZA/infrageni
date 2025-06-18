import { RecordProps, T, TLBaseShape } from 'tldraw';
import { BaseInfraShapeUtil, BaseInfraShapeProps } from './base';

export type DatabaseShape = TLBaseShape<'database', BaseInfraShapeProps>;

export class DatabaseShapeUtil extends BaseInfraShapeUtil<DatabaseShape> {
    static override type = 'database' as const;
    static override props: RecordProps<DatabaseShape> = {
        w: T.number,
        h: T.number,
        color: T.string,
        label: T.string,
        componentId: T.string,
        isBoundingBox: T.optional(T.boolean),
        opacity: T.optional(T.number),
    };

    override getDefaultProps(): DatabaseShape['props'] {
        return {
            w: 120,
            h: 80,
            color: 'green',
            label: 'Database',
            componentId: 'database',
            isBoundingBox: false,
        };
    }

    getIcon() {
        return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <ellipse cx="12" cy="5" rx="9" ry="3" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
        );
    }

    getBorderColor(): string {
        return '#10b981';
    }

    getTextColor(): string {
        return '#047857';
    }
}
