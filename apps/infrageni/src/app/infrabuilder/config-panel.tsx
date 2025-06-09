import React from 'react';
import type { CanvasItem, Connection } from './types';

export function ConfigPanel({
    selectedItem,
    setCanvasItems,
    selectedKey,
    connections,
    setConnections,
}: {
    selectedItem: CanvasItem | Connection | undefined;
    setCanvasItems: (fn: (items: CanvasItem[]) => CanvasItem[]) => void;
    selectedKey: string | null;
    connections: Connection[];
    setConnections: React.Dispatch<React.SetStateAction<Connection[]>>;
}) {
    // Detect if selectedItem is a connection
    const isConnection = (item: unknown): item is Connection => !!item && typeof item === 'object' && 'from' in item && 'to' in item;
    return (
        <aside className="w-80 bg-card border rounded-lg p-4 flex-shrink-0 flex flex-col">
            <h2 className="text-lg font-semibold mb-2">Configuration</h2>
            <div className="flex-1 text-muted-foreground">
                {selectedItem ? (
                    isConnection(selectedItem) ? (
                        <div className="space-y-4">
                            <div className="font-semibold text-base text-foreground mb-2">Connection</div>
                            <label className="block text-sm font-medium">Label</label>
                            <input
                                type="text"
                                className="w-full px-2 py-1 border rounded bg-background text-foreground mb-2"
                                value={selectedItem.label || ''}
                                onChange={e => {
                                    const value = e.target.value;
                                    setConnections(conns => conns.map(conn => conn.id === selectedItem.id ? { ...conn, label: value } : conn));
                                }}
                                placeholder="e.g. HTTPS, DB Link"
                            />
                            {/* Add more connection property fields as needed */}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="font-semibold text-base text-foreground mb-2">{selectedItem.label}</div>
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
                    )
                ) : (
                    <span>Select a component or connection to configure its properties.</span>
                )}
            </div>
        </aside>
    );
}
