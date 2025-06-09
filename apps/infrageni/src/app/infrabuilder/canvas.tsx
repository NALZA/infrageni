import React, { useRef, useState } from 'react';
import type { CanvasItem, Connection } from './types';
import { Trash } from 'lucide-react';
import { Toolbar } from './toolbar';

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
    const [dragPos, setDragPos] = useState<{ x: number, y: number } | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    // Toolbar state
    const [connectMode, setConnectMode] = useState(false);
    const [labelMode, setLabelMode] = useState(false);
    // Placeholder for future box/group mode
    // const [boxMode, setBoxMode] = useState(false);

    // Mouse event handlers for drag-to-connect
    const handleItemMouseDown = (e: React.MouseEvent, key: string) => {
        e.stopPropagation();
        if (connectMode) {
            setDraggingFrom(key);
            // Use relative position for drag start
            const canvasRect = (svgRef.current?.parentElement as HTMLElement)?.getBoundingClientRect();
            setDragPos(canvasRect ? {
                x: e.clientX - canvasRect.left,
                y: e.clientY - canvasRect.top,
            } : { x: e.clientX, y: e.clientY });
        } else {
            setDraggingItem(key);
            const item = items.find(i => i.key === key);
            if (item) {
                setDragOffset({ x: e.clientX - item.x, y: e.clientY - item.y });
            }
            setSelectedKey(key);
        }
    };
    const handleMouseMove = (e: React.MouseEvent) => {
        if (draggingFrom) {
            // Get canvas bounding rect to calculate relative mouse position
            const canvasRect = (svgRef.current?.parentElement as HTMLElement)?.getBoundingClientRect();
            if (canvasRect) {
                setDragPos({
                    x: e.clientX - canvasRect.left,
                    y: e.clientY - canvasRect.top,
                });
            } else {
                setDragPos({ x: e.clientX, y: e.clientY });
            }
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
    const [dragOffset, setDragOffset] = useState<{ x: number, y: number } | null>(null);
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
            {/* Toolbar */}
            <Toolbar
                connectMode={connectMode}
                setConnectMode={setConnectMode}
                labelMode={labelMode}
                setLabelMode={setLabelMode}
            />
            {/* Render SVG connections/arrows */}
            <svg ref={svgRef} className="absolute top-0 left-0 w-full h-full" style={{ zIndex: 1, pointerEvents: 'none' }}>
                {connections.map((conn) => {
                    const from = items.find(i => i.key === conn.from);
                    const to = items.find(i => i.key === conn.to);
                    if (!from || !to) return null;
                    // Calculate edge-to-edge connection
                    const fromX = from.x + 120; // right edge (box width 120)
                    const fromY = from.y + 20;  // vertical center (box height 40)
                    const toX = to.x;           // left edge
                    const toY = to.y + 20;
                    return (
                        <g key={conn.id} style={{ cursor: 'pointer', pointerEvents: 'all' }} onClick={e => handleConnectionClick(e, conn.id)}>
                            <line x1={fromX} y1={fromY} x2={toX} y2={toY} stroke={isConnectionSelected(conn.id) ? '#f59e42' : '#6366f1'} strokeWidth={2} markerEnd="url(#arrowhead)" />
                            {conn.label && (
                                <text x={(fromX + toX) / 2} y={(fromY + toY) / 2 - 5} fill="#6366f1" fontSize="12" textAnchor="middle">{conn.label}</text>
                            )}
                            {isConnectionSelected(conn.id) && (
                                <g>
                                    <rect x={((fromX + toX) / 2) - 16} y={((fromY + toY) / 2) - 24} width={32} height={18} rx={4} fill="#fff" stroke="#f59e42" strokeWidth={1} style={{ cursor: 'pointer' }} onClick={e => { e.stopPropagation(); handleConnectionDelete(conn.id); }} />
                                    <foreignObject x={((fromX + toX) / 2) - 16} y={((fromY + toY) / 2) - 24} width={32} height={18} style={{ pointerEvents: 'none' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                                            <Trash size={14} color="#f59e42" style={{ margin: 'auto' }} />
                                        </div>
                                    </foreignObject>
                                </g>
                            )}
                        </g>
                    );
                })}
                {/* Dragging connection preview */}
                {draggingFrom && dragPos && (() => {
                    const from = items.find(i => i.key === draggingFrom);
                    if (!from) return null;
                    // Start at right edge of source (relative to canvas)
                    const fromX = from.x + 120;
                    const fromY = from.y + 20;
                    // End at cursor (relative to canvas)
                    const toX = dragPos.x;
                    const toY = dragPos.y;
                    return (
                        <line x1={fromX} y1={fromY} x2={toX} y2={toY} stroke="#f59e42" strokeWidth={2} markerEnd="url(#arrowhead)" />
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
                    className={`absolute rounded border bg-card shadow-md select-none transition-all ${selectedKey === item.key ? 'ring-2 ring-primary' : ''}`}
                    style={{
                        left: item.x,
                        top: item.y,
                        minWidth: 80,
                        maxWidth: 240,
                        padding: '0.5rem 0.75rem',
                        zIndex: 2,
                        cursor: draggingItem ? 'grabbing' : connectMode ? 'crosshair' : 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        whiteSpace: 'pre-line',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                        boxSizing: 'border-box',
                        background: undefined,
                    }}
                    onMouseDown={e => handleItemMouseDown(e, item.key)}
                    title={item.label}
                >
                    <span className="block w-full text-center break-words whitespace-pre-line" style={{overflowWrap: 'break-word'}}>{item.label}</span>
                </div>
            ))}
        </main>
    );
}
