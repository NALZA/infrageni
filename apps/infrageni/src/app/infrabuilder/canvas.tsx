import React, { useRef, useState, useEffect } from 'react';
import type { CanvasItem, Connection } from './types';
import { Trash } from 'lucide-react'; // Removed ZoomIn, ZoomOut, Maximize
import { Toolbar } from './toolbar';
import { ZoomPanControls } from './zoom-pan-controls';

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
    const canvasContainerRef = useRef<HTMLDivElement>(null); // Ref for the main container

    // Zoom and Pan state
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

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
            // Use relative position for drag start, considering pan and zoom
            const canvasRect = canvasContainerRef.current?.getBoundingClientRect();
            if (canvasRect) {
                setDragPos({
                    x: (e.clientX - canvasRect.left - pan.x) / zoom,
                    y: (e.clientY - canvasRect.top - pan.y) / zoom,
                });
            } else {
                setDragPos({ x: (e.clientX - pan.x) / zoom, y: (e.clientY - pan.y) / zoom });
            }
        } else {
            setDraggingItem(key);
            const item = items.find(i => i.key === key);
            if (item) {
                // Adjust drag offset for current pan and zoom
                setDragOffset({
                    x: e.clientX - item.x * zoom - pan.x,
                    y: e.clientY - item.y * zoom - pan.y
                });
            }
            setSelectedKey(key);
        }
    };
    const handleMouseMove = (e: React.MouseEvent) => {
        if (isPanning) {
            setPan(prevPan => ({
                x: prevPan.x + e.clientX - lastMousePos.x,
                y: prevPan.y + e.clientY - lastMousePos.y,
            }));
            setLastMousePos({ x: e.clientX, y: e.clientY });
            return; // Prevent other actions while panning
        }

        if (draggingFrom) {
            // Get canvas bounding rect to calculate relative mouse position, considering pan and zoom
            const canvasRect = canvasContainerRef.current?.getBoundingClientRect();
            if (canvasRect) {
                setDragPos({
                    x: (e.clientX - canvasRect.left - pan.x) / zoom,
                    y: (e.clientY - canvasRect.top - pan.y) / zoom,
                });
            } else {
                setDragPos({ x: (e.clientX - pan.x) / zoom, y: (e.clientY - pan.y) / zoom });
            }
        }
    };
    const handleMouseUp = (e: React.MouseEvent) => {
        if (isPanning) {
            setIsPanning(false);
            return;
        }
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
            // Adjust item position based on current pan and zoom
            const newX = (e.clientX - dragOffset.x - pan.x) / zoom;
            const newY = (e.clientY - dragOffset.y - pan.y) / zoom;
            setCanvasItems(items => items.map(it => it.key === draggingItem ? { ...it, x: newX, y: newY } : it));
        }
    };
    const handleItemDragEnd = () => {
        setDraggingItem(null);
        setDragOffset(null);
    };

    // Zoom handlers
    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const zoomFactor = 1.1;
        const newZoom = e.deltaY < 0 ? zoom * zoomFactor : zoom / zoomFactor;
        const boundedZoom = Math.max(0.1, Math.min(newZoom, 5)); // Zoom limits

        const canvasRect = canvasContainerRef.current?.getBoundingClientRect();
        if (!canvasRect) return;

        const mouseX = e.clientX - canvasRect.left;
        const mouseY = e.clientY - canvasRect.top;

        // Calculate new pan to keep mouse position fixed relative to content
        const newPanX = mouseX - (mouseX - pan.x) * (boundedZoom / zoom);
        const newPanY = mouseY - (mouseY - pan.y) * (boundedZoom / zoom);

        setZoom(boundedZoom);
        setPan({ x: newPanX, y: newPanY });
    };

    // Pan handlers (Space + Drag)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' && !isPanning) {
                e.preventDefault();
                // Check if the mouse is over the canvas before enabling panning
                if (canvasContainerRef.current?.matches(':hover')) {
                    setIsPanning(true);
                    setLastMousePos(prev => ({ x: prev?.x ?? 0, y: prev?.y ?? 0 }));
                    if (canvasContainerRef.current) {
                        canvasContainerRef.current.style.cursor = 'grabbing';
                    }
                }
            }
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                setIsPanning(false);
                if (canvasContainerRef.current) {
                    canvasContainerRef.current.style.cursor = 'default';
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [isPanning]); // Only re-run if isPanning changes

    const handleCanvasMouseDown = (e: React.MouseEvent) => {
        if (e.button === 0 && (e.target === canvasContainerRef.current || e.target === svgRef.current)) { // Left click on canvas/svg directly
            if (isPanning) { // Already initiated by spacebar
                setLastMousePos({ x: e.clientX, y: e.clientY });
            } else if (e.altKey) { // Alt + Click to pan (alternative)
                setIsPanning(true);
                setLastMousePos({ x: e.clientX, y: e.clientY });
                if (canvasContainerRef.current) {
                    canvasContainerRef.current.style.cursor = 'grabbing';
                }
            }
            else {
                setSelectedKey(''); // Deselect if clicking on canvas background
            }
        }
    };
    const handleCanvasMouseUp = () => {
        if (isPanning && !window.navigator.userAgent.includes('Space')) { // only stop panning if not initiated by space
            setIsPanning(false);
            if (canvasContainerRef.current) {
                canvasContainerRef.current.style.cursor = 'default';
            }
        }
    };


    // Zoom/Pan control functions
    const zoomIn = () => setZoom(z => Math.min(z * 1.2, 5));
    const zoomOut = () => setZoom(z => Math.max(z / 1.2, 0.1));
    const resetView = () => {
        setZoom(1);
        setPan({ x: 0, y: 0 });
    };


    return (
        <main
            ref={canvasContainerRef}
            className="flex-1 glass-panel border rounded-lg relative min-h-[400px] overflow-hidden"
            onDrop={onDrop}
            onDragOver={onDragOver}
            onMouseMove={e => { handleMouseMove(e); handleItemDrag(e); }}
            onMouseUp={e => { handleMouseUp(e); handleItemDragEnd(); handleCanvasMouseUp(); }}
            onWheel={handleWheel}
            onMouseDown={handleCanvasMouseDown}
            style={{ cursor: isPanning ? 'grabbing' : 'default' }}
        >
            {/* Toolbar */}
            <Toolbar
                connectMode={connectMode}
                setConnectMode={setConnectMode}
                labelMode={labelMode}
                setLabelMode={setLabelMode}
            />
            {/* Zoom/Pan Controls */}
            <ZoomPanControls
                onZoomIn={zoomIn}
                onZoomOut={zoomOut}
                onResetView={resetView}
                currentZoom={zoom}
            />
            {/* Content wrapper for zoom and pan */}
            <div
                style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                    transformOrigin: 'top left',
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                }}
            >
                {/* Render SVG connections/arrows */}
                <svg ref={svgRef} className="absolute top-0 left-0 w-full h-full" style={{ zIndex: 1, pointerEvents: 'none', width: `calc(100% / ${zoom})`, height: `calc(100% / ${zoom})` }}>
                    {connections.map((conn) => {
                        const fromItem = items.find(i => i.key === conn.from);
                        const toItem = items.find(i => i.key === conn.to);
                        if (!fromItem || !toItem) return null;

                        // Item positions are already in the "world" space (pre-zoom/pan)
                        const fromX = fromItem.x + 120; // right edge (box width 120)
                        const fromY = fromItem.y + 20;  // vertical center (box height 40)
                        const toX = toItem.x;           // left edge
                        const toY = toItem.y + 20;

                        // Calculate label position in world space
                        const labelX = (fromX + toX) / 2;
                        const labelY = (fromY + toY) / 2 - 5;

                        // Calculate delete button position in world space
                        const deleteBtnCenterX = (fromX + toX) / 2;
                        const deleteBtnCenterY = (fromY + toY) / 2;
                        const deleteBtnRectX = deleteBtnCenterX - 16; // Half width of 32
                        const deleteBtnRectY = deleteBtnCenterY - 12; // Adjusted for better centering around line

                        return (
                            <g key={conn.id} style={{ cursor: 'pointer', pointerEvents: 'all' }} onClick={e => handleConnectionClick(e, conn.id)}>
                                <line x1={fromX} y1={fromY} x2={toX} y2={toY} stroke={isConnectionSelected(conn.id) ? '#f59e42' : '#6366f1'} strokeWidth={2 / zoom} markerEnd="url(#arrowhead)" />
                                {conn.label && (
                                    <text x={labelX} y={labelY} fill="#6366f1" fontSize={12 / zoom} textAnchor="middle">{conn.label}</text>
                                )}
                                {isConnectionSelected(conn.id) && (
                                    <g transform={`scale(${1 / zoom}) translate(${deleteBtnRectX * zoom - deleteBtnRectX}, ${deleteBtnRectY * zoom - deleteBtnRectY})`}>
                                        {/* The transform on the <g> above is tricky. We want the button to appear fixed size on screen.
                                            So we scale it by 1/zoom. But its position is defined in world coords.
                                            So we need to translate it to compensate for the scale.
                                            The rect itself is now in its own coordinate system, scaled up.
                                        */}
                                        <rect
                                            x={deleteBtnRectX}
                                            y={deleteBtnRectY}
                                            width={32} height={18} rx={4} fill="#fff" stroke="#f59e42" strokeWidth={1 * zoom} // stroke width appears constant
                                            style={{ cursor: 'pointer' }}
                                            onClick={e => { e.stopPropagation(); handleConnectionDelete(conn.id); }}
                                        />
                                        <foreignObject
                                            x={deleteBtnRectX}
                                            y={deleteBtnRectY}
                                            width={32} height={18} style={{ pointerEvents: 'none' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                                                <Trash size={14 * zoom} color="#f59e42" style={{ margin: 'auto' }} />
                                            </div>
                                        </foreignObject>
                                    </g>
                                )}
                            </g>
                        );
                    })}
                    {/* Dragging connection preview */}
                    {draggingFrom && dragPos && (() => {
                        const fromItem = items.find(i => i.key === draggingFrom);
                        if (!fromItem) return null;
                        // Start at right edge of source (world space)
                        const fromX = fromItem.x + 120;
                        const fromY = fromItem.y + 20;
                        // End at cursor (world space - dragPos is already converted)
                        const toX = dragPos.x;
                        const toY = dragPos.y;
                        return (
                            <line x1={fromX} y1={fromY} x2={toX} y2={toY} stroke="#f59e42" strokeWidth={2 / zoom} markerEnd="url(#arrowhead)" />
                        );
                    })()}
                    <defs>
                        <marker id="arrowhead" markerWidth={8 * (1 / zoom)} markerHeight={8 * (1 / zoom)} refX={8 * (1 / zoom)} refY={4 * (1 / zoom)} orient="auto" markerUnits="userSpaceOnUse"> {/* Changed to userSpaceOnUse for better scaling */}
                            <path d="M0,0 L8,4 L0,8 Z" fill="#6366f1" transform={`scale(${1 / zoom})`} /> {/* Scale the path itself */}
                        </marker>
                    </defs>
                </svg>
                {/* Render items */}
                {items.length === 0 && !isPanning && ( // Hide placeholder when panning
                    <span
                        className="text-muted-foreground absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                        style={{
                            // Adjust placeholder position based on pan and zoom for it to stay centered on screen
                            // This is a bit of a hack, ideally the placeholder is outside the zoom/pan div
                            left: `calc(50% - ${pan.x}px)`,
                            top: `calc(50% - ${pan.y}px)`,
                            transform: `translate(-50%, -50%) scale(${1 / zoom})` // Counter-scale to keep size
                        }}
                    >
                        Drag and drop your cloud components here...
                    </span>
                )}
                {items.map((item) => (
                    <div
                        key={item.key}
                        id={`canvas-item-${item.key}`}
                        className={`absolute rounded border bg-card shadow-md select-none transition-all ${selectedKey === item.key ? 'ring-2 ring-primary' : ''}`}
                        style={{
                            // Item positions are in world space, transform handles pan/zoom
                            left: item.x,
                            top: item.y,
                            minWidth: 80,
                            maxWidth: 240,
                            padding: '0.5rem 0.75rem',
                            zIndex: 2,
                            cursor: draggingItem ? 'grabbing' : connectMode ? 'crosshair' : isPanning ? 'grabbing' : 'pointer',
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
                        <span className="block w-full text-center break-words whitespace-pre-line" style={{ overflowWrap: 'break-word' }}>{item.label}</span>
                    </div>
                ))}
            </div>
        </main>
    );
}
