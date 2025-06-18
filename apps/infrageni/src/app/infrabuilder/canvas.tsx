import React from 'react';
import { Tldraw, useEditor, TLShapeId, TLShape } from 'tldraw';
import 'tldraw/tldraw.css';
import { GENERIC_COMPONENTS, useProvider } from './components';
import { customShapeUtils, createComponentShape } from './shapes';
import { BaseInfraShapeProps } from './shapes/base';
import { Toolbar } from './toolbar';
import { ExportDialog } from './export';
import { ConnectionGuide } from './connection-guide';
import { useTldrawThemeSync } from '../lib/use-tldraw-theme-sync';

// Helper function to check if a point is inside a bounding box shape
function isPointInBoundingBox(point: { x: number; y: number }, shape: TLShape): boolean {
    const { x, y, props } = shape;
    const shapeProps = props as BaseInfraShapeProps;
    return point.x >= x &&
        point.x <= x + shapeProps.w &&
        point.y >= y &&
        point.y <= y + shapeProps.h;
}

// Helper function to find the smallest bounding box that contains a point
function findContainingBoundingBox(editor: ReturnType<typeof useEditor>, point: { x: number; y: number }): TLShapeId | null {
    const allShapes = editor.getCurrentPageShapes();
    const boundingBoxShapes = allShapes.filter((shape: TLShape) => {
        const shapeProps = shape.props as BaseInfraShapeProps;
        return shapeProps?.isBoundingBox && isPointInBoundingBox(point, shape);
    });

    // Return the smallest bounding box (by area) that contains the point
    if (boundingBoxShapes.length === 0) return null;

    return boundingBoxShapes.reduce((smallest: TLShape, current: TLShape) => {
        const smallestProps = smallest.props as BaseInfraShapeProps;
        const currentProps = current.props as BaseInfraShapeProps;
        const smallestArea = smallestProps.w * smallestProps.h;
        const currentArea = currentProps.w * currentProps.h;
        return currentArea < smallestArea ? current : smallest;
    }).id;
}

// Helper function to build containment hierarchy with nested containers
function buildContainmentHierarchy(allShapes: TLShape[]): Map<string, string[]> {
    const containmentMap = new Map<string, string[]>();

    const containers = allShapes.filter(shape => {
        const props = shape.props as BaseInfraShapeProps;
        return props?.isBoundingBox === true;
    });

    // Initialize containment map for all containers
    containers.forEach(container => {
        containmentMap.set(container.id, []);
    });

    // For each shape, find its immediate container (smallest containing box)
    allShapes.forEach(shape => {
        if (shape.props && (shape.props as BaseInfraShapeProps).isBoundingBox) {
            return; // Skip containers for now, we'll handle them separately
        }

        const shapeProps = shape.props as BaseInfraShapeProps;
        const shapeCenterX = shape.x + (shapeProps?.w || 0) / 2;
        const shapeCenterY = shape.y + (shapeProps?.h || 0) / 2;

        // Find the smallest container that contains this shape
        let smallestContainer: TLShape | null = null;
        let smallestArea = Infinity;

        containers.forEach(container => {
            const containerProps = container.props as BaseInfraShapeProps;
            const containerBounds = {
                x: container.x,
                y: container.y,
                w: containerProps.w,
                h: containerProps.h
            };

            const isContained = shapeCenterX >= containerBounds.x &&
                shapeCenterX <= containerBounds.x + containerBounds.w &&
                shapeCenterY >= containerBounds.y &&
                shapeCenterY <= containerBounds.y + containerBounds.h;

            if (isContained) {
                const area = containerBounds.w * containerBounds.h;
                if (area < smallestArea) {
                    smallestContainer = container;
                    smallestArea = area;
                }
            }
        });

        if (smallestContainer) {
            const contained = containmentMap.get(smallestContainer.id) || [];
            contained.push(shape.id);
            containmentMap.set(smallestContainer.id, contained);
        }
    });

    // Now handle container nesting - containers can be inside other containers
    containers.forEach(container => {
        const containerProps = container.props as BaseInfraShapeProps;
        const containerCenterX = container.x + containerProps.w / 2;
        const containerCenterY = container.y + containerProps.h / 2;

        // Find the smallest container that contains this container
        let smallestParentContainer: TLShape | null = null;
        let smallestArea = Infinity;

        containers.forEach(parentContainer => {
            if (parentContainer.id === container.id) return; // Skip self

            const parentProps = parentContainer.props as BaseInfraShapeProps;
            const parentBounds = {
                x: parentContainer.x,
                y: parentContainer.y,
                w: parentProps.w,
                h: parentProps.h
            };

            const isContained = containerCenterX >= parentBounds.x &&
                containerCenterX <= parentBounds.x + parentBounds.w &&
                containerCenterY >= parentBounds.y &&
                containerCenterY <= parentBounds.y + parentBounds.h;

            if (isContained) {
                const area = parentBounds.w * parentBounds.h;
                if (area < smallestArea) {
                    smallestParentContainer = parentContainer;
                    smallestArea = area;
                }
            }
        });

        if (smallestParentContainer) {
            const contained = containmentMap.get(smallestParentContainer.id) || [];
            contained.push(container.id);
            containmentMap.set(smallestParentContainer.id, contained);
        }
    });

    return containmentMap;
}

// Helper function to get all descendants recursively with circular reference protection
function getAllDescendants(containerId: string, containmentMap: Map<string, string[]>, visited = new Set<string>()): string[] {
    // Prevent infinite recursion from circular references
    if (visited.has(containerId)) {
        console.warn(`Circular reference detected for container ${containerId}`);
        return [];
    }

    visited.add(containerId);
    const directChildren = containmentMap.get(containerId) || [];
    const allDescendants = [...directChildren];

    // Recursively get descendants of child containers
    directChildren.forEach(childId => {
        if (containmentMap.has(childId)) { // This child is also a container
            const childDescendants = getAllDescendants(childId, containmentMap, visited);
            allDescendants.push(...childDescendants);
        }
    });

    visited.delete(containerId); // Clean up for other branches
    return allDescendants;
}

// Component to handle container movement logic with nested container support
// Snapshot-based container movement handler with visual feedback for nested elements
function ContainerMovementHandler() {
    const editor = useEditor();
    const containerSnapshots = React.useRef<Map<string, {
        descendants: string[];
        startPositions: Map<string, { x: number; y: number }>;
        containerStartPos: { x: number; y: number };
    }>>(new Map());
    const isDragging = React.useRef<Set<string>>(new Set());
    const lastKnownPositions = React.useRef<Map<string, { x: number; y: number }>>(new Map());
    const highlightedShapes = React.useRef<Set<string>>(new Set()); React.useEffect(() => {
        let isPointerDown = false;        // Function to add visual feedback to nested elements
        const highlightNestedElements = (containerId: string) => {
            const snapshot = containerSnapshots.current.get(containerId);
            if (!snapshot) return;

            console.log(`🔵 Creating movement preview for ${snapshot.descendants.length} nested elements in container ${containerId}`);

            // Create visual movement preview shapes for all descendants
            snapshot.descendants.forEach(descendantId => {
                const shape = editor.getShape(descendantId as TLShapeId);
                if (shape) {
                    // Create a temporary preview shape that shows where this element will move
                    // Ensure the preview ID starts with "shape:" as required by tldraw
                    const previewShapeId = `shape:preview_${descendantId.replace('shape:', '')}` as TLShapeId;
                    try {
                        editor.createShape({
                            id: previewShapeId,
                            type: 'geo',
                            x: shape.x,
                            y: shape.y, props: {
                                w: (shape.props as BaseInfraShapeProps).w || 100,
                                h: (shape.props as BaseInfraShapeProps).h || 50,
                                geo: 'rectangle',
                                color: 'blue',
                                fill: 'none',
                                dash: 'dashed',
                                size: 'm'
                            }
                        });

                        highlightedShapes.current.add(previewShapeId);
                    } catch (error) {
                        console.warn(`Could not create preview for ${descendantId}:`, error);
                    }
                }
            });
        };// Function to update preview positions during drag
        const updateMovementPreviews = (containerId: string, deltaX: number, deltaY: number) => {
            const snapshot = containerSnapshots.current.get(containerId);
            if (!snapshot) return;

            // Update preview positions to show where elements will end up
            snapshot.descendants.forEach(descendantId => {
                const previewShapeId = `shape:preview_${descendantId.replace('shape:', '')}` as TLShapeId;
                const previewShape = editor.getShape(previewShapeId);
                const startPos = snapshot.startPositions.get(descendantId);

                if (previewShape && startPos) {
                    try {
                        editor.updateShape({
                            ...previewShape,
                            x: startPos.x + deltaX,
                            y: startPos.y + deltaY,
                        });
                    } catch (error) {
                        console.warn(`Could not update preview for ${descendantId}:`, error);
                    }
                }
            });
        };

        // Function to remove visual feedback
        const removeHighlights = () => {
            console.log(`🔴 Removing movement previews for ${highlightedShapes.current.size} elements`);

            // Delete all preview shapes
            const previewShapeIds = Array.from(highlightedShapes.current) as TLShapeId[];
            try {
                editor.deleteShapes(previewShapeIds);
            } catch (error) {
                console.warn('Could not remove some preview shapes:', error);
            }

            highlightedShapes.current.clear();
        };
        const handlePointerDown = () => {
            isPointerDown = true;

            // Clear any existing snapshots when starting a new interaction
            containerSnapshots.current.clear();
            isDragging.current.clear();

            // Don't create snapshots proactively - wait until containers actually start moving
            // This prevents conflicts when selecting inner containers
        };

        const handlePointerUp = () => {
            if (!isPointerDown) return;
            isPointerDown = false;

            // Process all moved containers when dragging ends
            if (isDragging.current.size === 0) return;

            const allUpdates: TLShape[] = [];
            const processedShapes = new Set<string>();

            isDragging.current.forEach(containerId => {
                const snapshot = containerSnapshots.current.get(containerId);
                if (!snapshot) return;

                const currentContainer = editor.getShape(containerId as TLShapeId);
                if (!currentContainer) return;

                // Calculate how much the container moved
                const deltaX = currentContainer.x - snapshot.containerStartPos.x;
                const deltaY = currentContainer.y - snapshot.containerStartPos.y;

                // Only process if there was significant movement
                if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
                    console.log(`Applying snapshot movement for container ${containerId}:`, { deltaX, deltaY });

                    // Apply the same movement to all descendants
                    snapshot.descendants.forEach(descendantId => {
                        if (processedShapes.has(descendantId)) return;

                        const startPos = snapshot.startPositions.get(descendantId);
                        if (!startPos) return;

                        const currentShape = editor.getShape(descendantId as TLShapeId);
                        if (currentShape) {
                            allUpdates.push({
                                ...currentShape,
                                x: startPos.x + deltaX,
                                y: startPos.y + deltaY,
                            });
                            processedShapes.add(descendantId);
                        }
                    });
                }
            });            // Apply all updates in a single batch
            if (allUpdates.length > 0) {
                console.log(`✅ Moved ${allUpdates.length} nested elements together with ${isDragging.current.size} container(s)`);
                editor.updateShapes(allUpdates);
            }

            // Remove visual highlights and clean up
            removeHighlights();
            isDragging.current.clear();
            containerSnapshots.current.clear();
        }; const handleShapeChange = () => {
            if (!isPointerDown) return;

            // Get currently selected shapes to determine what the user is actually dragging
            const selectedShapes = editor.getSelectedShapes();
            const selectedShapeIds = new Set(selectedShapes.map(shape => shape.id));

            // Detect when containers are being dragged, but only process selected containers
            const allShapes = editor.getCurrentPageShapes();
            const containers = allShapes.filter(shape => {
                const props = shape.props as BaseInfraShapeProps;
                return props?.isBoundingBox === true && selectedShapeIds.has(shape.id);
            });

            containers.forEach(container => {
                // Create snapshot on-demand if it doesn't exist yet
                if (!containerSnapshots.current.has(container.id)) {
                    try {
                        // Build containment hierarchy and get descendants for this specific container
                        const containmentMap = buildContainmentHierarchy(allShapes);
                        const descendants = getAllDescendants(container.id, containmentMap);
                        const startPositions = new Map<string, { x: number; y: number }>();

                        // Capture starting positions of all descendants
                        descendants.forEach(descendantId => {
                            const shape = editor.getShape(descendantId as TLShapeId);
                            if (shape) {
                                startPositions.set(descendantId, { x: shape.x, y: shape.y });
                            }
                        });

                        containerSnapshots.current.set(container.id, {
                            descendants,
                            startPositions,
                            containerStartPos: { x: container.x, y: container.y }
                        });

                        lastKnownPositions.current.set(container.id, { x: container.x, y: container.y });
                    } catch (error) {
                        console.error(`Error creating snapshot for container ${container.id}:`, error);
                        return;
                    }
                }

                const snapshot = containerSnapshots.current.get(container.id);
                const lastPos = lastKnownPositions.current.get(container.id);
                if (!snapshot || !lastPos) return;

                const deltaX = Math.abs(container.x - lastPos.x);
                const deltaY = Math.abs(container.y - lastPos.y);                // Mark as dragging if moved significantly
                if (deltaX > 2 || deltaY > 2) {
                    if (!isDragging.current.has(container.id)) {
                        console.log(`🚀 Container ${container.id} started dragging - moving ${snapshot?.descendants.length || 0} nested elements`);
                        isDragging.current.add(container.id);
                        // Highlight all nested elements to show they will move together
                        highlightNestedElements(container.id);
                    } else {
                        // Update preview positions during drag to show live movement
                        const currentDeltaX = container.x - snapshot.containerStartPos.x;
                        const currentDeltaY = container.y - snapshot.containerStartPos.y;
                        updateMovementPreviews(container.id, currentDeltaX, currentDeltaY);
                    }
                }

                // Update last known position
                lastKnownPositions.current.set(container.id, { x: container.x, y: container.y });
            });
        };// Use DOM events on the editor container
        const container = editor.getContainer();

        // Listen to changes - tldraw's addListener might not return cleanup function
        editor.addListener('change', handleShapeChange);

        container.addEventListener('pointerdown', handlePointerDown);
        container.addEventListener('pointerup', handlePointerUp);

        return () => {
            container.removeEventListener('pointerdown', handlePointerDown);
            container.removeEventListener('pointerup', handlePointerUp);
        };
    }, [editor]);

    return null;
}

// Inner component that has access to the editor
function DropZone() {
    const editor = useEditor();
    const provider = useProvider();

    // Sync tldraw theme with our application theme
    useTldrawThemeSync();

    // Toolbar state
    const [connectMode, setConnectMode] = React.useState(false);
    const [labelMode, setLabelMode] = React.useState(false);
    const [showExportDialog, setShowExportDialog] = React.useState(false);
    const [showConnectionGuide, setShowConnectionGuide] = React.useState(false);

    React.useEffect(() => {
        let isDropping = false; // Flag to prevent multiple drops
        const handleDrop = (e: DragEvent) => {
            console.log('Drop event triggered', { timestamp: Date.now(), clientX: e.clientX, clientY: e.clientY });

            const compId = e.dataTransfer?.getData('application/x-infrageni-component');
            if (!compId) {
                console.log('No component ID found in drop event');
                return;
            }

            // Prevent multiple simultaneous drops
            if (isDropping) {
                console.log('Drop already in progress, ignoring');
                return;
            }

            e.preventDefault();
            e.stopPropagation(); // Prevent event bubbling that might cause duplicates
            e.stopImmediatePropagation(); // Prevent other handlers on the same element

            isDropping = true;
            console.log('Processing drop for component:', compId);

            const comp = GENERIC_COMPONENTS.find(c => c.id === compId);
            if (!comp) {
                console.log('Component not found:', compId);
                isDropping = false;
                return;
            }

            // Get the viewport position and convert to page coordinates
            const point = editor.screenToPage({ x: e.clientX, y: e.clientY });
            console.log('Creating shape at point:', point);            // For containers, check if they should be nested inside other containers
            const adjustedPoint = point;
            if (comp.isBoundingBox) {
                const containingBoxId = findContainingBoundingBox(editor, point);
                if (containingBoxId) {
                    console.log('Container will be nested inside:', containingBoxId);
                    // You could implement additional logic here to adjust positioning relative to parent
                }
            } else {
                // For non-bounding box components, check if they should be contained
                const containingBoxId = findContainingBoundingBox(editor, point);
                if (containingBoxId) {
                    console.log('Component will be contained in:', containingBoxId);
                    // You could implement additional logic here to snap to container or adjust positioning
                }
            }

            // Create the appropriate custom shape
            const shape = createComponentShape(comp, adjustedPoint.x, adjustedPoint.y, provider);
            editor.createShape(shape);

            // Reset the flag after a short delay
            setTimeout(() => {
                isDropping = false;
                console.log('Drop flag reset');
            }, 100);
        };

        const handleDragOver = (e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation(); // Prevent event bubbling
        };        // Add listeners to the editor container
        const container = editor.getContainer();
        console.log('Adding drop listeners to container:', container);
        container.addEventListener('drop', handleDrop);
        container.addEventListener('dragover', handleDragOver); return () => {
            console.log('Removing drop listeners from container');
            container.removeEventListener('drop', handleDrop);
            container.removeEventListener('dragover', handleDragOver);
        };
    }, [editor, provider]); return (
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
            >
                <DropZone />
                <ContainerMovementHandler />
            </Tldraw>
        </main>
    );
}
