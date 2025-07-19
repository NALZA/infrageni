import React from 'react';

export interface ToolbarProps {
    connectMode: boolean;
    setConnectMode: (v: boolean) => void;
    labelMode: boolean;
    setLabelMode: (v: boolean) => void;
    onExport?: () => void;
    onShowConnectionGuide?: () => void;
    // boxMode?: boolean;
    // setBoxMode?: (v: boolean) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
    connectMode,
    setConnectMode,
    labelMode,
    setLabelMode,
    onExport,
    onShowConnectionGuide
}) => {
    const toolbarButton = (active: boolean, onClick: () => void, label: string) => (
        <button
            className={`px-4 py-2 glass-button glass-button-hover transition-all duration-200 text-sm font-medium ${
                active 
                    ? 'bg-primary/20 border-primary/30 text-primary dark:text-primary-foreground shadow-primary/20' 
                    : 'hover:bg-white/10 dark:hover:bg-white/5'
            }`}
            onClick={onClick}
            type="button"
        >
            {label}
        </button>
    );

    const actionButton = (onClick: () => void, label: string, variant: 'primary' | 'secondary' = 'primary') => (
        <button
            className={`px-4 py-2 glass-button glass-button-hover transition-all duration-200 text-sm font-medium ${
                variant === 'primary'
                    ? 'bg-green-500/20 border-green-500/30 text-green-700 dark:text-green-300 hover:bg-green-500/30 hover:shadow-green-500/20'
                    : 'bg-blue-500/20 border-blue-500/30 text-blue-700 dark:text-blue-300 hover:bg-blue-500/30 hover:shadow-blue-500/20'
            }`}
            onClick={onClick}
            type="button"
        >
            {label}
        </button>
    ); 
    
    return (
        <div className="absolute top-0 left-0 w-full z-20 glass-navbar backdrop-blur-lg border-b border-white/10 dark:border-white/5 rounded-t-lg px-6 py-3" style={{ minHeight: 56 }}>
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent dark:via-white/2 pointer-events-none rounded-t-lg" />
            
            <div className="relative flex items-center justify-between">
                {/* Left section - Mode toggles */}
                <div className="flex items-center gap-3">
                    {toolbarButton(connectMode, () => setConnectMode(!connectMode), 'Connect')}
                    {toolbarButton(labelMode, () => setLabelMode(!labelMode), 'Label')}
                    {/* Add more mode buttons here as needed */}
                </div>

                {/* Center section - Main actions */}
                <div className="flex items-center gap-3">
                    {onShowConnectionGuide && actionButton(onShowConnectionGuide, 'How to Connect', 'secondary')}
                    {onExport && actionButton(onExport, 'Export')}
                </div>

                {/* Right section - Additional tools */}
                <div className="flex items-center gap-3">
                    {/* Future toolbar items can go here */}
                    {/* {toolbarButton(boxMode, () => setBoxMode && setBoxMode(!boxMode), 'Box')} */}
                    
                    {/* Subtle indicator dots */}
                    <div className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-primary/30 rounded-full animate-pulse" />
                        <div className="w-1 h-1 bg-primary/20 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
};
