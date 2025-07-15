import { RecordProps, T, TLBaseShape } from 'tldraw';
import { BaseInfraShapeUtil, BaseInfraShapeProps } from './base';

export type UserShape = TLBaseShape<'user', BaseInfraShapeProps>;

export class UserShapeUtil extends BaseInfraShapeUtil<UserShape> {
    static override type = 'user' as const;
    static override props: RecordProps<UserShape> = {
        w: T.number,
        h: T.number,
        color: T.string,
        label: T.string,
        componentId: T.string,
    };

    override getDefaultProps(): UserShape['props'] {
        return {
            w: 120,
            h: 80,
            color: 'violet',
            label: 'User',
            componentId: 'user',
        };
    }

    getIcon() {
        return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" fill="none" stroke="currentColor" strokeWidth="2"/>
                <circle cx="12" cy="7" r="4" fill="none" stroke="currentColor" strokeWidth="2"/>
            </svg>
        );
    }

    getBorderColor(): string {
        return '#8b5cf6';
    }

    getTextColor(): string {
        return '#7c3aed';
    }
}
