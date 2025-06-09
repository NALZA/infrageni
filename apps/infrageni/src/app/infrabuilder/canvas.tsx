import React, { useRef, useState } from 'react';
import type { CanvasItem, Connection } from './types';

export function Canvas({
    items,
    connections,
    setConnections,
    selectedKey,
    setSelectedKey,
    onDrop,
    onDragOver,
    setCanvasItems,
}: {
    items: CanvasItem[];
    connections: Connection[];
    setConnections: React.Dispatch<React.SetStateAction<Connection[]>>;
    selectedKey: string | null;
    setSelectedKey: (key: string) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    setCanvasItems: React.Dispatch<React.SetStateAction<CanvasItem[]>>;
}) {
    const [draggingFrom, setDraggingFrom] = useState<string | null>(null);
    const [dragPos, setDragPos] = useState<{x: number, y: number} | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    // Mouse event handlers for drag-to-connect
    const handleItemMouseDown = (e: React.MouseEvent, key: string) => {
        e.stopPropagation();
        setDraggingFrom(key);
        setDragPos({ x: e.clientX, y: e.clientY });
    };
    const handleMouseMove = (e: React.MouseEvent) => {
        if (draggingFrom) {
            setDragPos({ x: e.clientX, y: e.clientY });
        }
    };
    const handleMouseUp = (e: React.MouseEvent) => {
        if (draggingFrom && dragPos) {
            // Check if mouse is over a different item
            let toKey: string | null = null;
            for (const item of items) {
                const el = document.getElementById(`canvas-item-${item.key}`);
                if (el) {
                    const r = el.getBoundingClientRect();
                    if (
                        e.clientX >= r.left && e.clientX <= r.right &&
                        e.clientY >= r.top && e.clientY <= r.bottom &&
                        item.key !== draggingFrom
                    ) {
                        toKey = item.key;
                        break;
                    }
                }
            }
            if (toKey) {
                setConnections(conns => [
                    ...conns,
                    {
                        id: `conn-${draggingFrom}-${toKey}-${Date.now()}`,
                        from: draggingFrom,
                        to: toKey,
                        label: '',
                    },
                ]);
            }
        }
        setDraggingFrom(null);
        setDragPos(null);
    };

    // Connection deletion
    const handleConnectionDelete = (connId: string) => {
        setConnections(conns => conns.filter(conn => conn.id !== connId));
    };

    // Connection selection
    const handleConnectionClick = (e: React.MouseEvent, connId: string) => {
        e.stopPropagation();
        setSelectedKey(connId);
    };
    const isConnectionSelected = (connId: string) => selectedKey === connId;

    // Item drag for position
    const [draggingItem, setDraggingItem] = useState<string | null>(null);
    const [dragOffset, setDragOffset] = useState<{x: number, y: number} | null>(null);
    const handleItemDragStart = (e: React.MouseEvent, key: string) => {
        e.stopPropagation();
        setDraggingItem(key);
        const item = items.find(i => i.key === key);
        if (item) {
            setDragOffset({ x: e.clientX - item.x, y: e.clientY - item.y });
        }
    };
    const handleItemDrag = (e: React.MouseEvent) => {
        if (draggingItem && dragOffset) {
            setCanvasItems(items => items.map(it => it.key === draggingItem ? { ...it, x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y } : it));
        }
    };
    const handleItemDragEnd = () => {
        setDraggingItem(null);
        setDragOffset(null);
    };

    return (
        <main
            className="flex-1 bg-muted border rounded-lg relative min-h-[400px] overflow-hidden"
            onDrop={onDrop}
            onDragOver={onDragOver}
            onMouseMove={e => { handleMouseMove(e); handleItemDrag(e); }}
            onMouseUp={e => { handleMouseUp(e); handleItemDragEnd(); }}
        >
            {/* Render SVG connections/arrows */}
            <svg ref={svgRef} className="absolute top-0 left-0 w-full h-full" style={{ zIndex: 1, pointerEvents: 'none' }}>
                {connections.map((conn) => {
                    const from = items.find(i => i.key === conn.from);
                    const to = items.find(i => i.key === conn.to);
                    if (!from || !to) return null;
                    const fromX = from.x + 60;
                    const fromY = from.y + 20;
                    const toX = to.x;
                    const toY = to.y + 20;
                    return (
                        <g key={conn.id} style={{ cursor: 'pointer', pointerEvents: 'all' }} onClick={e => handleConnectionClick(e, conn.id)}>
                            <line x1={fromX} y1={fromY} x2={toX} y2={toY} stroke={isConnectionSelected(conn.id) ? '#f59e42' : '#6366f1'} strokeWidth={2} markerEnd="url(#arrowhead)" />
                            {conn.label && (
                                <text x={(fromX + toX) / 2} y={(fromY + toY) / 2 - 5} fill="#6366f1" fontSize="12" textAnchor="middle">{conn.label}</text>
                            )}
                            {isConnectionSelected(conn.id) && (
                                <rect x={((fromX + toX) / 2) - 16} y={((fromY + toY) / 2) - 24} width={32} height={18} rx={4} fill="#fff" stroke="#f59e42" strokeWidth={1} style={{ cursor: 'pointer' }} onClick={e => { e.stopPropagation(); handleConnectionDelete(conn.id); }} />
                                /* Trash icon */
                            )}
                        </g>
                    );
                })}
                {/* Dragging connection preview */}
                {draggingFrom && dragPos && (() => {
                    const from = items.find(i => i.key === draggingFrom);
                    if (!from) return null;
                    const fromX = from.x + 60;
                    const fromY = from.y + 20;
                    return (
                        <line x1={fromX} y1={fromY} x2={dragPos.x} y2={dragPos.y} stroke="#f59e42" strokeWidth={2} markerEnd="url(#arrowhead)" />
                    );
                })()}
                <defs>
                    <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto" markerUnits="strokeWidth">
                        <path d="M0,0 L8,4 L0,8 Z" fill="#6366f1" />
                    </marker>
                </defs>
            </svg>
            {/* Render items */}
            {items.length === 0 && (
                <span className="text-muted-foreground absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    Drag and drop your cloud components here...
                </span>
            )}
            {items.map((item) => (
                <div
                    key={item.key}
                    id={`canvas-item-${item.key}`}
                    className={`absolute px-3 py-2 rounded border bg-card shadow-md select-none ${selectedKey === item.key ? 'ring-2 ring-primary' : ''}`}
                    style={{ left: item.x, top: item.y, zIndex: 2, cursor: draggingItem ? 'grabbing' : 'pointer' }}
                    onMouseDown={e => {
                        if (e.shiftKey) {
                            handleItemMouseDown(e, item.key);
                        } else {
                            handleItemDragStart(e, item.key);
                            setSelectedKey(item.key);
                        }
                    }}
                >
                    {item.label}
                </div>
            ))}
        </main>
    );
}
