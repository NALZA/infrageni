import React, { useState } from 'react';
import { useAtom } from 'jotai';

import { providerAtom } from './lib/provider-atom';

const COMPONENTS = [
    { id: 'aws-ec2', label: 'AWS EC2' },
    { id: 'azure-vm', label: 'Azure VM' },
    { id: 'gcp-compute', label: 'GCP Compute Engine' },
    { id: 'external-system', label: 'External System' },
    { id: 'user', label: 'User' },
];

type CanvasItem = {
    id: string;
    label: string;
    x: number;
    y: number;
    key: string;
};

// TODO: Implement the drag-and-drop canvas and component management UI here
const InfraBuilder = () => {
    const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);
    const [provider] = useAtom(providerAtom);
    // Search state for filtering components
    const [search, setSearch] = useState('');

    // Handle drop on canvas
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const componentId = e.dataTransfer.getData('componentId');
        const component = COMPONENTS.find((c) => c.id === componentId);
        if (component) {
            // Get mouse position relative to canvas
            const canvasRect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - canvasRect.left;
            const y = e.clientY - canvasRect.top;
            setCanvasItems((items) => [
                ...items,
                { ...component, x, y, key: `${component.id}-${Date.now()}` },
            ]);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

    // Filter components based on provider and search
    const filteredComponents = COMPONENTS.filter((comp) => {
        if (provider === 'generic') {
            return (comp.id === 'external-system' || comp.id === 'user') && comp.label.toLowerCase().includes(search.toLowerCase());
        }
        if (provider === 'aws') {
            return (comp.id.startsWith('aws-') || comp.id === 'external-system' || comp.id === 'user') && comp.label.toLowerCase().includes(search.toLowerCase());
        }
        if (provider === 'azure') {
            return (comp.id.startsWith('azure-') || comp.id === 'external-system' || comp.id === 'user') && comp.label.toLowerCase().includes(search.toLowerCase());
        }
        if (provider === 'gcp') {
            return (comp.id.startsWith('gcp-') || comp.id === 'external-system' || comp.id === 'user') && comp.label.toLowerCase().includes(search.toLowerCase());
        }
        return comp.label.toLowerCase().includes(search.toLowerCase());
    });

    return (
        <div className="flex flex-col h-[80vh] gap-4 p-8">
            <div className="flex flex-1 gap-4">
                {/* Component Library */}
                <aside className="w-64 bg-card border rounded-lg p-4 flex-shrink-0 flex flex-col">
                    <h2 className="text-lg font-semibold mb-2">Component Library</h2>
                    <input
                        type="text"
                        placeholder="Search components..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="mb-2 px-2 py-1 border rounded bg-background text-foreground"
                    />
                    <div className="flex-1 overflow-y-auto text-muted-foreground space-y-2">
                        {filteredComponents.map((comp) => (
                            <div
                                key={comp.id}
                                draggable
                                onDragStart={(e) => e.dataTransfer.setData('componentId', comp.id)}
                                className="cursor-move px-3 py-2 rounded border bg-muted hover:bg-accent transition"
                            >
                                {comp.label}
                            </div>
                        ))}
                    </div>
                </aside>
                {/* Canvas */}
                <main
                    className="flex-1 bg-muted border rounded-lg relative min-h-[400px] overflow-hidden"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    {canvasItems.length === 0 && (
                        <span className="text-muted-foreground absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                            Drag and drop your cloud components here...
                        </span>
                    )}
                    {canvasItems.map((item) => (
                        <div
                            key={item.key}
                            className="absolute px-3 py-2 rounded border bg-card shadow-md select-none"
                            style={{ left: item.x, top: item.y }}
                        >
                            {item.label}
                        </div>
                    ))}
                </main>
                {/* Configuration Panel */}
                <aside className="w-80 bg-card border rounded-lg p-4 flex-shrink-0 flex flex-col">
                    <h2 className="text-lg font-semibold mb-2">Configuration</h2>
                    <div className="flex-1 text-muted-foreground">
                        <span>Select a component to configure its properties.</span>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default InfraBuilder;