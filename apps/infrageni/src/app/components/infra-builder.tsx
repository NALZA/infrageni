import React, { useState } from 'react';
import { useAtom } from 'jotai';

import { providerAtom } from '../lib/provider-atom';

// List of generic infra components and their provider-specific names
const GENERIC_COMPONENTS = [
    {
        id: 'compute',
        label: 'Compute Instance',
        providerNames: {
            aws: 'EC2 Instance',
            azure: 'Virtual Machine',
            gcp: 'Compute Engine',
            generic: 'Compute Instance',
        },
    },
    {
        id: 'database',
        label: 'Database',
        providerNames: {
            aws: 'RDS Database',
            azure: 'Azure SQL',
            gcp: 'Cloud SQL',
            generic: 'Database',
        },
    },
    {
        id: 'storage',
        label: 'Storage Bucket',
        providerNames: {
            aws: 'S3 Bucket',
            azure: 'Blob Storage',
            gcp: 'Cloud Storage',
            generic: 'Storage Bucket',
        },
    },
    {
        id: 'external-system',
        label: 'External System',
        providerNames: {
            aws: 'External System',
            azure: 'External System',
            gcp: 'External System',
            generic: 'External System',
        },
    },
    {
        id: 'user',
        label: 'User',
        providerNames: {
            aws: 'User',
            azure: 'User',
            gcp: 'User',
            generic: 'User',
        },
    },
];

type CanvasItem = {
    id: string;
    label: string;
    x: number;
    y: number;
    key: string;
    properties?: {
        instanceType?: string;
        region?: string;
        engine?: string;
        // Add more fields as needed for other component types
    };
};

// TODO: Implement the drag-and-drop canvas and component management UI here
const InfraBuilder = () => {
    const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);
    const [provider] = useAtom(providerAtom);
    // Search state for filtering components
    const [search, setSearch] = useState('');
    // Add ability to mark favorite components
    const [favorites, setFavorites] = useState<string[]>([]);
    const [selectedKey, setSelectedKey] = useState<string | null>(null);

    // Handle drop on canvas
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const componentId = e.dataTransfer.getData('componentId');
        const component = GENERIC_COMPONENTS.find((c) => c.id === componentId);
        if (component) {
            // Get mouse position relative to canvas
            const canvasRect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - canvasRect.left;
            const y = e.clientY - canvasRect.top;
            setCanvasItems((items) => [
                ...items,
                {
                    id: component.id,
                    label: component.providerNames[provider] || component.label,
                    x,
                    y,
                    key: `${component.id}-${Date.now()}`,
                },
            ]);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

    // Filter components based on provider and search
    const filteredComponents = GENERIC_COMPONENTS.filter((comp) => {
        const name = comp.providerNames[provider] || comp.label;
        return name.toLowerCase().includes(search.toLowerCase());
    });
    // Sort favorites to the top
    const sortedComponents = [
        ...filteredComponents.filter((comp) => favorites.includes(comp.id)),
        ...filteredComponents.filter((comp) => !favorites.includes(comp.id)),
    ];

    // Helper to get selected item
    const selectedItem = canvasItems.find((item) => item.key === selectedKey);

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
                        {sortedComponents.map((comp) => (
                            <div
                                key={comp.id}
                                draggable
                                onDragStart={(e) => e.dataTransfer.setData('componentId', comp.id)}
                                className={`cursor-move px-3 py-2 rounded border bg-muted hover:bg-accent transition flex items-center justify-between ${favorites.includes(comp.id) ? 'border-yellow-400' : ''}`}
                            >
                                <span>{comp.providerNames[provider] || comp.label}</span>
                                <button
                                    type="button"
                                    aria-label={favorites.includes(comp.id) ? 'Unfavorite' : 'Favorite'}
                                    className={`ml-2 text-yellow-500 hover:text-yellow-600 focus:outline-none`}
                                    onClick={e => {
                                        e.stopPropagation();
                                        setFavorites(favs => favs.includes(comp.id)
                                            ? favs.filter(id => id !== comp.id)
                                            : [...favs, comp.id]);
                                    }}
                                >
                                    {favorites.includes(comp.id) ? '★' : '☆'}
                                </button>
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
                            className={`absolute px-3 py-2 rounded border bg-card shadow-md select-none ${selectedKey === item.key ? 'ring-2 ring-primary' : ''}`}
                            style={{ left: item.x, top: item.y }}
                            onClick={() => setSelectedKey(item.key)}
                        >
                            {item.label}
                        </div>
                    ))}
                </main>
                {/* Configuration Panel */}
                <aside className="w-80 bg-card border rounded-lg p-4 flex-shrink-0 flex flex-col">
                    <h2 className="text-lg font-semibold mb-2">Configuration</h2>
                    <div className="flex-1 text-muted-foreground">
                        {selectedItem ? (
                            <div className="space-y-4">
                                <div className="font-semibold text-base text-foreground mb-2">{selectedItem.label}</div>
                                {/* Example dynamic properties: instanceType, region for compute; engine for database; etc. */}
                                {selectedItem.id === 'compute' && (
                                    <>
                                        <label className="block text-sm font-medium">Instance Type</label>
                                        <input
                                            type="text"
                                            className="w-full px-2 py-1 border rounded bg-background text-foreground mb-2"
                                            value={selectedItem.properties?.instanceType || ''}
                                            onChange={e => {
                                                const value = e.target.value;
                                                setCanvasItems(items => items.map(it => it.key === selectedKey ? { ...it, properties: { ...it.properties, instanceType: value } } : it));
                                            }}
                                            placeholder="e.g. t3.micro"
                                        />
                                        <label className="block text-sm font-medium">Region</label>
                                        <input
                                            type="text"
                                            className="w-full px-2 py-1 border rounded bg-background text-foreground"
                                            value={selectedItem.properties?.region || ''}
                                            onChange={e => {
                                                const value = e.target.value;
                                                setCanvasItems(items => items.map(it => it.key === selectedKey ? { ...it, properties: { ...it.properties, region: value } } : it));
                                            }}
                                            placeholder="e.g. us-east-1"
                                        />
                                    </>
                                )}
                                {selectedItem.id === 'database' && (
                                    <>
                                        <label className="block text-sm font-medium">Engine</label>
                                        <input
                                            type="text"
                                            className="w-full px-2 py-1 border rounded bg-background text-foreground mb-2"
                                            value={selectedItem.properties?.engine || ''}
                                            onChange={e => {
                                                const value = e.target.value;
                                                setCanvasItems(items => items.map(it => it.key === selectedKey ? { ...it, properties: { ...it.properties, engine: value } } : it));
                                            }}
                                            placeholder="e.g. postgres"
                                        />
                                        <label className="block text-sm font-medium">Region</label>
                                        <input
                                            type="text"
                                            className="w-full px-2 py-1 border rounded bg-background text-foreground"
                                            value={selectedItem.properties?.region || ''}
                                            onChange={e => {
                                                const value = e.target.value;
                                                setCanvasItems(items => items.map(it => it.key === selectedKey ? { ...it, properties: { ...it.properties, region: value } } : it));
                                            }}
                                            placeholder="e.g. us-east-1"
                                        />
                                    </>
                                )}
                                {/* Add more dynamic fields for other component types as needed */}
                            </div>
                        ) : (
                            <span>Select a component to configure its properties.</span>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default InfraBuilder;