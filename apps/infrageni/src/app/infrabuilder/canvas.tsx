import React from 'react';
import { Tldraw, useEditor, TLShapeId, TLShape, TLParentId } from 'tldraw';
import 'tldraw/tldraw.css';
import { GENERIC_COMPONENTS, useProvider } from './components';
import { customShapeUtils, createComponentShape } from './shapes';
import { BaseInfraShapeProps } from './shapes/base';
import { ComponentRegistry } from './components/core/component-registry';
import { Toolbar } from './toolbar';
import { EnhancedExportDialog } from './export';
import { ConnectionGuide } from './connection-guide';
import { useTldrawThemeSync } from '../lib/use-tldraw-theme-sync';
import { useInitialUrlLoad } from './hooks/useInitialUrlLoad';

// To test validation functionality, run this in browser console:
// import { runAllTests } from './validation'; runAllTests();

// Enhanced drag-and-drop system with smooth container transitions
class DragDropManager {
    private editor: ReturnType<typeof useEditor>;
    private lastReparentTime: number = 0;
    private readonly REPARENT_COOLDOWN = 500; // Minimum time between reparenting operations
    private readonly HYSTERESIS_MARGIN = 50; // Buffer zone to prevent rapid switching
    private lastReparentedShapes: Map<string, { parentId: string; timestamp: number }> = new Map();

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
        const shape = this.editor.getShape(shapeId);
        if (!shape) return false;

        const currentParentId = shape.parentId;
        const newParentIdStr = newParentId === this.editor.getCurrentPageId() ? 'page' : newParentId as string;
        const currentParentIdStr = currentParentId === this.editor.getCurrentPageId() ? 'page' : currentParentId as string;
        
        // Check if we're trying to reparent to the same parent
        if (currentParentIdStr === newParentIdStr) {
            return false;
        }

        // Apply global cooldown to prevent rapid reparenting
        if (now - this.lastReparentTime < this.REPARENT_COOLDOWN) {
            return false;
        }

        // Check per-shape cooldown to prevent oscillation
        const lastReparent = this.lastReparentedShapes.get(shapeId);
        if (lastReparent && now - lastReparent.timestamp < this.REPARENT_COOLDOWN * 2) {
            // If this is the same transition we just did, apply extra cooldown
            if (lastReparent.parentId === newParentIdStr) {
                return false;
            }
        }

        const newParent = newParentId !== this.editor.getCurrentPageId() ? this.editor.getShape(newParentId as TLShapeId) : null;

        // If moving to a container, validate the containment
        if (newParent) {
            const shapeProps = shape.props as BaseInfraShapeProps;
            const parentProps = newParent.props as BaseInfraShapeProps;

            // Prevent containers from containing themselves or invalid nesting
            if (shapeProps.isBoundingBox && !this.canContainContainer(newParent, shape)) {
                return false;
            }
        }

        // Debug logging
        console.log(`🔄 Reparenting shape:`, {
            shapeId,
            currentParent: currentParentIdStr,
            newParent: newParentIdStr
        });

        // Use tldraw's native reparenting - this preserves visual position automatically
        // The shape will appear in exactly the same screen position after reparenting
        this.editor.batch(() => {
            this.editor.reparentShapes([shapeId], newParentId);
            this.editor.bringToFront([shapeId]);
        });

        // Track this reparenting operation
        this.lastReparentedShapes.set(shapeId, { parentId: currentParentIdStr, timestamp: now });
        this.lastReparentTime = now;
        
        // Clean up old entries (older than 2 seconds)
        const cutoff = now - 2000;
        for (const [key, value] of this.lastReparentedShapes.entries()) {
            if (value.timestamp < cutoff) {
                this.lastReparentedShapes.delete(key);
            }
        }
        
        return true;
    }

    // Create a new shape with proper parent assignment
    public createShapeWithParent(component: any, point: { x: number; y: number }, provider: string): TLShape | null {
        // Validate input coordinates
        if (!isFinite(point.x) || !isFinite(point.y)) {
            console.error(`🚨 Invalid point coordinates for shape creation:`, point);
            return null;
        }

        const parentId = this.findBestContainer(point);

        // If creating inside a container, convert coordinates to be relative to the container
        let shapeX = point.x;
        let shapeY = point.y;

        if (parentId) {
            const parent = this.editor.getShape(parentId);
            if (parent) {
                // Validate parent coordinates
                if (!isFinite(parent.x) || !isFinite(parent.y)) {
                    console.error(`🚨 Invalid parent coordinates:`, { parentId, x: parent.x, y: parent.y });
                    return null;
                }

                shapeX = point.x - parent.x;
                shapeY = point.y - parent.y;

                // Ensure shape is within container bounds with padding
                const parentProps = parent.props as BaseInfraShapeProps;
                const padding = 10;
                const shapeW = component.isBoundingBox ? 300 : 120;
                const shapeH = component.isBoundingBox ? 200 : 80;

                shapeX = Math.max(padding, Math.min(shapeX, (parentProps.w || 400) - shapeW - padding));
                shapeY = Math.max(padding, Math.min(shapeY, (parentProps.h || 300) - shapeH - padding));

                // Final validation
                if (!isFinite(shapeX) || !isFinite(shapeY)) {
                    console.error(`🚨 Invalid calculated shape coordinates:`, { shapeX, shapeY });
                    shapeX = padding;
                    shapeY = padding;
                }

                console.log(`📦 Creating shape inside container:`, {
                    componentId: component.id,
                    pagePoint: point,
                    containerPos: { x: parent.x, y: parent.y },
                    relativePos: { x: shapeX, y: shapeY },
                    containerId: parentId
                });
            }
        }

        // Final coordinate validation before shape creation
        if (!isFinite(shapeX) || !isFinite(shapeY)) {
            console.error(`🚨 Cannot create shape with invalid coordinates:`, { shapeX, shapeY });
            return null;
        }

        const shape = createComponentShape(component, shapeX, shapeY, provider, parentId);

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

                        // Check if user is still dragging or interacting
                        const instanceState = editor.getInstanceState();
                        const isDragging = instanceState.isChangingStyle ||
                            instanceState.isMoving ||
                            instanceState.isPointing ||
                            editor.getCurrentTool().id === 'hand' ||
                            editor.getSelectedShapeIds().length > 0 && editor.getIsMenuOpen();

                        if (isDragging) return; // Skip reparenting while actively dragging

                        isProcessingRef.current = true;

                        try {
                            const selectedShapes = editor.getSelectedShapes();
                            if (selectedShapes.length === 0) return;
                            
                            // Double-check that no shapes are being actively manipulated
                            const hasActiveTransforms = selectedShapes.some(shape => {
                                const pageTransform = editor.getShapePageTransform(shape.id);
                                return !pageTransform || !isFinite(pageTransform.x) || !isFinite(pageTransform.y);
                            });
                            
                            if (hasActiveTransforms) return;

                            const shapesToReparent: { shapeId: TLShapeId; newParentId: TLParentId }[] = [];

                            selectedShapes.forEach(shape => {
                                if (shape.type === 'arrow') return;

                                const shapeProps = shape.props as BaseInfraShapeProps;
                                
                                // Use the shape's current absolute position to determine container
                                const absoluteTransform = editor.getShapePageTransform(shape.id);
                                let shapeCenter;
                                
                                if (absoluteTransform && isFinite(absoluteTransform.x) && isFinite(absoluteTransform.y)) {
                                    shapeCenter = { 
                                        x: absoluteTransform.x + (shapeProps.w || 0) / 2, 
                                        y: absoluteTransform.y + (shapeProps.h || 0) / 2 
                                    };
                                } else {
                                    // Fallback calculation
                                    const currentParent = shape.parentId !== editor.getCurrentPageId() ? editor.getShape(shape.parentId as TLShapeId) : null;
                                    const absoluteX = currentParent ? shape.x + currentParent.x : shape.x;
                                    const absoluteY = currentParent ? shape.y + currentParent.y : shape.y;
                                    shapeCenter = { 
                                        x: absoluteX + (shapeProps.w || 0) / 2, 
                                        y: absoluteY + (shapeProps.h || 0) / 2 
                                    };
                                }
                                
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
                    }, 500); // Longer timeout to ensure user has completely finished interacting
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

    const [labelMode, setLabelMode] = React.useState(false);
    const [showExportDialog, setShowExportDialog] = React.useState(false);
    const [showConnectionGuide, setShowConnectionGuide] = React.useState(false);


    React.useEffect(() => {
        const handleDrop = (e: DragEvent) => {
            if (e.defaultPrevented) return;
            e.preventDefault();
            e.stopPropagation();

            const compId = e.dataTransfer?.getData('application/x-infrageni-component');
            console.log('🎯 Drop event triggered with component ID:', compId);
            if (!compId) {
                console.warn('⚠️ No component ID found in drop data');
                return;
            }

            // Try new component registry first (with error handling for timing issues)
            try {
                const registry = ComponentRegistry.getInstance();

                // Check if registry is initialized
                if (registry.getAllComponents().length === 0) {
                    console.warn('⚠️ Component registry not yet initialized, using legacy fallback');
                    throw new Error('Registry not initialized');
                }

                const enhancedComponent = registry.getComponent(compId);

                if (enhancedComponent) {
                    console.log('✅ Found component in registry:', enhancedComponent.name);

                    // Convert ComponentMetadata to GenericComponent format for compatibility
                    const providerMapping = enhancedComponent.providerMappings[provider] || enhancedComponent.providerMappings.generic;
                    const comp = {
                        id: enhancedComponent.id,
                        label: enhancedComponent.name,
                        providerNames: Object.fromEntries(
                            Object.entries(enhancedComponent.providerMappings).map(([key, mapping]) => [key, mapping.name])
                        ),
                        isBoundingBox: enhancedComponent.config.isContainer
                    };

                    const point = editor.screenToPage({ x: e.clientX, y: e.clientY });
                    dragDropManager.createShapeWithParent(comp, point, provider);
                    return;
                } else {
                    console.log('⚠️ Component not found in registry, trying legacy:', compId);
                }
            } catch (error) {
                console.warn('⚠️ Registry error, falling back to legacy components:', error);
            }

            // Fallback to legacy components
            const comp = GENERIC_COMPONENTS.find(c => c.id === compId);
            if (!comp) {
                console.error('❌ Component not found in either registry or legacy components:', compId);
                console.log('Available legacy IDs:', GENERIC_COMPONENTS.map(c => c.id));
                return;
            }

            console.log('✅ Found component in legacy array:', comp.label);
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
                labelMode={labelMode}
                setLabelMode={setLabelMode}
                onExport={() => setShowExportDialog(true)}
                onShowConnectionGuide={() => setShowConnectionGuide(true)}
            />
            
            {showExportDialog && (
                <EnhancedExportDialog
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
        <main className="flex-1 glass-panel rounded-lg relative min-h-[400px] overflow-hidden group">
            {/* Enhanced glass background with gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/20 dark:from-blue-950/20 dark:via-transparent dark:to-purple-950/10 pointer-events-none" />

            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] bg-[radial-gradient(circle_at_1px_1px,_rgba(99,102,241,0.15)_1px,_transparent_0)] bg-[length:20px_20px] pointer-events-none" />

            <Tldraw
                className="w-full h-full canvas-enhanced relative z-10"
                shapeUtils={customShapeUtils}
                inferDarkMode
                persistenceKey="infra-builder"
            >
                <DropZone />
                <ReparentingHandler />
            </Tldraw>

            {/* Floating animation elements */}
            <div className="absolute top-4 right-4 w-2 h-2 bg-primary/20 rounded-full animate-pulse pointer-events-none" />
            <div className="absolute bottom-6 left-6 w-1 h-1 bg-primary/30 rounded-full animate-ping pointer-events-none" style={{ animationDelay: '1s' }} />
        </main>
    );
}
