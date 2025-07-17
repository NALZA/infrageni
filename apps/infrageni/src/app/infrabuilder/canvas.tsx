import React from 'react';
import { Tldraw, useEditor, TLShapeId, TLShape, TLParentId } from 'tldraw';
import 'tldraw/tldraw.css';
import { GENERIC_COMPONENTS, useProvider } from './components';
import { customShapeUtils, createComponentShape } from './shapes';
import { BaseInfraShapeProps } from './shapes/base';
import { Toolbar } from './toolbar';
import { ExportDialog } from './export';
import { ConnectionGuide } from './connection-guide';
import { useTldrawThemeSync } from '../lib/use-tldraw-theme-sync';
import { useInitialUrlLoad } from './hooks/useInitialUrlLoad';

// To test validation functionality, run this in browser console:
// import { runAllTests } from './validation'; runAllTests();

// Enhanced drag-and-drop system with smooth container transitions
class DragDropManager {
    private editor: ReturnType<typeof useEditor>;
    private lastReparentTime: number = 0;
    private readonly REPARENT_COOLDOWN = 200; // Minimum time between reparenting operations
    private readonly HYSTERESIS_MARGIN = 20; // Buffer zone to prevent rapid switching
    
    constructor(editor: ReturnType<typeof useEditor>) {
        this.editor = editor;
    }
    
    // Performance monitoring for debugging
    private measurePerformance<T>(name: string, fn: () => T): T {
        const start = performance.now();
        const result = fn();
        const duration = performance.now() - start;
        if (duration > 10) { // Log operations taking more than 10ms
            console.debug(`DragDropManager.${name} took ${duration.toFixed(2)}ms`);
        }
        return result;
    }
    
    // Check if a point is inside a container shape
    private isPointInContainer(point: { x: number; y: number }, shape: TLShape): boolean {
        const { x, y, props } = shape;
        const shapeProps = props as BaseInfraShapeProps;
        return point.x >= x &&
            point.x <= x + shapeProps.w &&
            point.y >= y &&
            point.y <= y + shapeProps.h;
    }
    
    // Find the most appropriate container for a point with hysteresis
    public findBestContainer(point: { x: number; y: number }, excludeShapeId?: TLShapeId, currentParentId?: TLShapeId): TLShapeId | null {
        return this.measurePerformance('findBestContainer', () => {
            const allShapes = this.editor.getCurrentPageShapes();
            const containers = allShapes.filter((shape: TLShape) => {
                const shapeProps = shape.props as BaseInfraShapeProps;
                return shapeProps?.isBoundingBox &&
                    shape.id !== excludeShapeId &&
                    this.isPointInContainer(point, shape);
            });
            
            if (containers.length === 0) return null;
            
            // Apply hysteresis: if already in a container, require more distance to switch
            if (currentParentId) {
                const currentParent = containers.find(c => c.id === currentParentId);
                if (currentParent) {
                    const currentProps = currentParent.props as BaseInfraShapeProps;
                    // Check if point is still within hysteresis margin of current container
                    const margin = this.HYSTERESIS_MARGIN;
                    const withinHysteresis = 
                        point.x >= currentParent.x - margin &&
                        point.x <= currentParent.x + currentProps.w + margin &&
                        point.y >= currentParent.y - margin &&
                        point.y <= currentParent.y + currentProps.h + margin;
                    
                    if (withinHysteresis) {
                        return currentParentId;
                    }
                }
            }
            
            // Return the smallest container (most specific)
            return containers.reduce((smallest: TLShape, current: TLShape) => {
                const smallestProps = smallest.props as BaseInfraShapeProps;
                const currentProps = current.props as BaseInfraShapeProps;
                const smallestArea = smallestProps.w * smallestProps.h;
                const currentArea = currentProps.w * currentProps.h;
                return currentArea < smallestArea ? current : smallest;
            }).id;
        });
    }
    
    // Check if a container can hold another container (prevent invalid nesting)
    private canContainContainer(parentContainer: TLShape, childContainer: TLShape): boolean {
        const parentProps = parentContainer.props as BaseInfraShapeProps;
        const childProps = childContainer.props as BaseInfraShapeProps;
        
        // Define containment rules based on component types
        const parentType = parentProps.componentId;
        const childType = childProps.componentId;
        
        // VPC can contain subnets and availability zones
        if (parentType === 'vpc') {
            return childType === 'subnet' || childType === 'availability-zone';
        }
        
        // Availability zones can contain subnets
        if (parentType === 'availability-zone') {
            return childType === 'subnet';
        }
        
        // Subnets can contain non-container components
        if (parentType === 'subnet') {
            return !childProps.isBoundingBox;
        }
        
        return true; // Default: allow containment
    }
    
    // Enhanced reparenting with validation and cooldown
    public reparentShape(shapeId: TLShapeId, newParentId: TLParentId): boolean {
        const now = Date.now();
        
        // Apply cooldown to prevent rapid reparenting
        if (now - this.lastReparentTime < this.REPARENT_COOLDOWN) {
            return false;
        }
        
        const shape = this.editor.getShape(shapeId);
        const newParent = newParentId !== this.editor.getCurrentPageId() ? this.editor.getShape(newParentId as TLShapeId) : null;
        
        if (!shape) return false;
        
        // If moving to a container, validate the containment
        if (newParent) {
            const shapeProps = shape.props as BaseInfraShapeProps;
            const parentProps = newParent.props as BaseInfraShapeProps;
            
            // Prevent containers from containing themselves or invalid nesting
            if (shapeProps.isBoundingBox && !this.canContainContainer(newParent, shape)) {
                return false;
            }
        }
        
        this.editor.reparentShapes([shapeId], newParentId);
        this.editor.bringToFront([shapeId]);
        this.lastReparentTime = now;
        return true;
    }
    
    // Create a new shape with proper parent assignment
    public createShapeWithParent(component: any, point: { x: number; y: number }, provider: string): TLShape | null {
        const parentId = this.findBestContainer(point);
        const shape = createComponentShape(component, point.x, point.y, provider, parentId);
        
        const createdShape = this.editor.createShape(shape);
        if (createdShape) {
            this.editor.bringToFront([createdShape.id as TLShapeId]);
        }
        return createdShape;
    }
}

// Helper function to maintain backward compatibility
function findContainingBoundingBox(editor: ReturnType<typeof useEditor>, point: { x: number; y: number }, excludeShapeId?: TLShapeId): TLShapeId | null {
    const manager = new DragDropManager(editor);
    return manager.findBestContainer(point, excludeShapeId);
}

// Enhanced reparenting handler with improved logic
// URL state management removed for better performance
// Can be re-enabled for sharing functionality when needed

function ReparentingHandler() {
    const editor = useEditor();
    const isProcessingRef = React.useRef(false);
    const dragDropManager = React.useMemo(() => new DragDropManager(editor), [editor]);

    React.useEffect(() => {
        const listener = editor.store.listen(
            (entry) => {
                // Prevent recursion by checking if we're already processing
                if (isProcessingRef.current) return;

                let wasDrag = false;
                for (const change of Object.values(entry.changes.updated)) {
                    const [from, to] = change;
                    if (
                        from.typeName === 'shape' &&
                        to.typeName === 'shape' &&
                        ((from as TLShape).x !== (to as TLShape).x || (from as TLShape).y !== (to as TLShape).y)
                    ) {
                        wasDrag = true;
                        break;
                    }
                }

                if (wasDrag) {
                    setTimeout(() => {
                        if (isProcessingRef.current) return;
                        
                        // Check if user is still dragging
                        const isDragging = editor.getInstanceState().isChangingStyle || 
                                         editor.getInstanceState().isMoving;
                        
                        if (isDragging) return; // Skip reparenting while actively dragging
                        
                        isProcessingRef.current = true;

                        try {
                            const selectedShapes = editor.getSelectedShapes();
                            if (selectedShapes.length === 0) return;

                            const shapesToReparent: { shapeId: TLShapeId; newParentId: TLParentId }[] = [];

                            selectedShapes.forEach(shape => {
                                if (shape.type === 'arrow') return;

                                const shapeProps = shape.props as BaseInfraShapeProps;
                                const shapeCenter = { x: shape.x + (shapeProps.w || 0) / 2, y: shape.y + (shapeProps.h || 0) / 2 };
                                const currentParentId = shape.parentId === editor.getCurrentPageId() ? undefined : shape.parentId;
                                const newParentId = dragDropManager.findBestContainer(shapeCenter, shape.id, currentParentId);
                                const currentPageId = editor.getCurrentPageId();

                                // Only add to reparent list if the parent is actually changing
                                if (newParentId && shape.parentId !== newParentId) {
                                    shapesToReparent.push({ shapeId: shape.id, newParentId: newParentId as TLShapeId });
                                } else if (!newParentId && shape.parentId !== currentPageId) {
                                    shapesToReparent.push({ shapeId: shape.id, newParentId: currentPageId });
                                }
                            });

                            // Batch the reparenting operations with validation
                            if (shapesToReparent.length > 0) {
                                editor.batch(() => {
                                    shapesToReparent.forEach(({ shapeId, newParentId }) => {
                                        dragDropManager.reparentShape(shapeId, newParentId);
                                    });
                                });
                            }
                        } finally {
                            // Reset the processing flag after a delay to ensure operations complete
                            setTimeout(() => {
                                isProcessingRef.current = false;
                            }, 100);
                        }
                    }, 150); // Increased timeout for smoother dragging
                }
            },
            { source: 'user', scope: 'document' }
        );

        return () => {
            listener();
        };
    }, [editor, dragDropManager]);

    return null;
}

function DropZone() {
    const editor = useEditor();
    const provider = useProvider();
    const dragDropManager = React.useMemo(() => new DragDropManager(editor), [editor]);

    useTldrawThemeSync();
    useInitialUrlLoad(); // Load shared canvas state on initial load only

    const [connectMode, setConnectMode] = React.useState(false);
    const [labelMode, setLabelMode] = React.useState(false);
    const [showExportDialog, setShowExportDialog] = React.useState(false);
    const [showConnectionGuide, setShowConnectionGuide] = React.useState(false);

    React.useEffect(() => {
        const handleDrop = (e: DragEvent) => {
            if (e.defaultPrevented) return;
            e.preventDefault();
            e.stopPropagation();

            const compId = e.dataTransfer?.getData('application/x-infrageni-component');
            if (!compId) return;
            const comp = GENERIC_COMPONENTS.find(c => c.id === compId);
            if (!comp) return;

            const point = editor.screenToPage({ x: e.clientX, y: e.clientY });
            dragDropManager.createShapeWithParent(comp, point, provider);
        };

        const handleDragOver = (e: DragEvent) => e.preventDefault();

        const container = editor.getContainer();
        container.addEventListener('drop', handleDrop);
        container.addEventListener('dragover', handleDragOver);

        return () => {
            container.removeEventListener('drop', handleDrop);
            container.removeEventListener('dragover', handleDragOver);
        };
    }, [editor, provider, dragDropManager]);

    return (
        <>
            <Toolbar
                connectMode={connectMode}
                setConnectMode={setConnectMode}
                labelMode={labelMode}
                setLabelMode={setLabelMode}
                onExport={() => setShowExportDialog(true)}
                onShowConnectionGuide={() => setShowConnectionGuide(true)}
            />
            {showExportDialog && (
                <ExportDialog
                    isOpen={showExportDialog}
                    onClose={() => setShowExportDialog(false)}
                />
            )}
            {showConnectionGuide && (
                <ConnectionGuide
                    isVisible={showConnectionGuide}
                    onClose={() => setShowConnectionGuide(false)}
                />
            )}
        </>
    );
}

export function Canvas() {
    return (
        <main className="flex-1 glass-panel rounded-lg relative min-h-[400px] overflow-hidden">
            <Tldraw
                className="w-full h-full"
                shapeUtils={customShapeUtils}
                inferDarkMode
                persistenceKey="infra-builder"
            >
                <DropZone />
                <ReparentingHandler />
            </Tldraw>
        </main>
    );
}
