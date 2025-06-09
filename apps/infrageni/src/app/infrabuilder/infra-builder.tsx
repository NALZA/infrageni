import React, { useState } from 'react';
import { GENERIC_COMPONENTS, useProvider } from './components';
import type { CanvasItem, Connection } from './types';
import { ComponentLibrary } from './component-library';
import { Canvas } from './canvas';
import { ConfigPanel } from './config-panel';

const InfraBuilder = () => {
    const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);
    const provider = useProvider();
    const [search, setSearch] = useState('');
    const [favorites, setFavorites] = useState<string[]>([]);
    const [selectedKey, setSelectedKey] = useState<string | null>(null);
    const [connections, setConnections] = useState<Connection[]>([]);

    // Handle drop on canvas
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const componentId = e.dataTransfer.getData('componentId');
        const component = GENERIC_COMPONENTS.find((c) => c.id === componentId);
        if (component) {
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
    const selectedItem = canvasItems.find((item) => item.key === selectedKey);

    return (
        <div className="flex flex-col h-[80vh] gap-4 p-8">
            <div className="flex flex-1 gap-4">
                <ComponentLibrary
                    components={GENERIC_COMPONENTS}
                    favorites={favorites}
                    setFavorites={setFavorites}
                    search={search}
                    setSearch={setSearch}
                    onDragStart={(e, id) => e.dataTransfer.setData('componentId', id)}
                />
                <Canvas
                    items={canvasItems}
                    connections={connections}
                    setConnections={setConnections}
                    selectedKey={selectedKey}
                    setSelectedKey={setSelectedKey}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    setCanvasItems={setCanvasItems}
                />
                <ConfigPanel
                    selectedItem={selectedItem}
                    setCanvasItems={setCanvasItems}
                    selectedKey={selectedKey}
                    connections={connections}
                    setConnections={setConnections}
                />
            </div>
        </div>
    );
};

export default InfraBuilder;