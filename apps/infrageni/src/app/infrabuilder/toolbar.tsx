import React from 'react';

export interface ToolbarProps {
    connectMode: boolean;
    setConnectMode: (v: boolean) => void;
    labelMode: boolean;
    setLabelMode: (v: boolean) => void;
    // boxMode?: boolean;
    // setBoxMode?: (v: boolean) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ connectMode, setConnectMode, labelMode, setLabelMode }) => {
    const toolbarButton = (active: boolean, onClick: () => void, label: string) => (
        <button
            className={`px-3 py-1 rounded border bg-background shadow text-sm font-medium mr-2 ${active ? 'bg-primary text-primary-foreground' : ''}`}
            onClick={onClick}
            type="button"
        >
            {label}
        </button>
    );

    return (
        <div className="absolute top-0 left-0 w-full z-20 flex bg-card border-b rounded-t-lg shadow px-4 py-2 gap-2" style={{ minHeight: 48 }}>
            {toolbarButton(connectMode, () => setConnectMode(!connectMode), 'Connect')}
            {toolbarButton(labelMode, () => setLabelMode(!labelMode), 'Label')}
            {/* {toolbarButton(boxMode, () => setBoxMode && setBoxMode(!boxMode), 'Box')} */}
            {/* Add more toolbar buttons as needed */}
        </div>
    );
};
