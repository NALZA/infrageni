import React from 'react';

export interface ToolbarProps {
    connectMode: boolean;
    setConnectMode: (v: boolean) => void;
    labelMode: boolean;
    setLabelMode: (v: boolean) => void;
    onExport?: () => void;
    onShowConnectionGuide?: () => void;
    onShare?: () => void;
    onLibrary?: () => void;
    onAnimation?: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
    connectMode,
    setConnectMode,
    labelMode,
    setLabelMode,
    onExport,
    onShowConnectionGuide,
    onShare,
    onLibrary,
    onAnimation
}) => {
    const toolbarButton = (active: boolean, onClick: () => void, label: string) => (
        <button
            className={`px-3 py-1 rounded-sm border bg-background shadow-sm text-sm font-medium ${active ? 'bg-primary text-primary-foreground' : ''}`}
            onClick={onClick}
            type="button"
        >
            {label}
        </button>
    );

    const actionButton = (onClick: () => void, label: string, variant: 'primary' | 'secondary' = 'primary') => (
        <button
            className={`px-3 py-1 rounded-sm border shadow-sm text-sm font-medium ${variant === 'primary'
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
            onClick={onClick}
            type="button"
        >
            {label}
        </button>
    ); return (
        <div className="absolute top-0 left-0 w-full z-20 flex items-center justify-between bg-card border-b rounded-t-lg shadow-sm px-4 py-2" style={{ minHeight: 48 }}>
            {/* Left section - Mode toggles */}
            <div className="flex items-center gap-2">
                {toolbarButton(connectMode, () => setConnectMode(!connectMode), 'Connect')}
                {toolbarButton(labelMode, () => setLabelMode(!labelMode), 'Label')}
                {/* Add more mode buttons here as needed */}
            </div>

            {/* Center section - Main actions */}
            <div className="flex items-center gap-2">
                {onShowConnectionGuide && actionButton(onShowConnectionGuide, 'How to Connect', 'secondary')}
                {onExport && actionButton(onExport, 'Export')}
            </div>

            {/* Right section - Additional tools */}
            <div className="flex items-center gap-2">
                {onLibrary && actionButton(onLibrary, 'Library', 'secondary')}
                {onAnimation && actionButton(onAnimation, 'Animation', 'secondary')}
                {onShare && actionButton(onShare, 'Share', 'secondary')}
            </div>
        </div>
    );
};
