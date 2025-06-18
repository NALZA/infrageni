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

// Component to handle container movement logic
function ContainerMovementHandler() {
    const editor = useEditor();
    const [lastPositions, setLastPositions] = React.useState<Record<string, { x: number; y: number }>>({});

    React.useEffect(() => {
        let animationFrame: number;

        const checkForMovement = () => {
            const allShapes = editor.getCurrentPageShapes();
            const containers = allShapes.filter(shape => {
                const props = shape.props as BaseInfraShapeProps;
                return props?.isBoundingBox === true;
            });

            let hasMovement = false;

            containers.forEach(container => {
                const containerId = container.id;
                const currentPos = { x: container.x, y: container.y };
                const lastPos = lastPositions[containerId];

                if (lastPos) {
                    const deltaX = currentPos.x - lastPos.x;
                    const deltaY = currentPos.y - lastPos.y;

                    // Only process if there's actual movement
                    if (Math.abs(deltaX) > 0.1 || Math.abs(deltaY) > 0.1) {
                        console.log(`Container ${containerId} moved by`, { deltaX, deltaY });
                        hasMovement = true;

                        // Find all contained shapes based on their position relative to the OLD container position
                        const oldContainerBounds = {
                            x: lastPos.x,
                            y: lastPos.y,
                            w: (container.props as BaseInfraShapeProps).w,
                            h: (container.props as BaseInfraShapeProps).h
                        };

                        const containedShapeIds: TLShapeId[] = [];

                        allShapes.forEach(shape => {
                            if (shape.id === containerId) return; // Skip the container itself

                            const shapeProps = shape.props as BaseInfraShapeProps;
                            if (shapeProps?.isBoundingBox) return; // Skip other containers

                            // Check if the shape's center was inside the old container position
                            const shapeCenterX = shape.x + (shapeProps?.w || 0) / 2;
                            const shapeCenterY = shape.y + (shapeProps?.h || 0) / 2;

                            const wasInside = shapeCenterX >= oldContainerBounds.x &&
                                shapeCenterX <= oldContainerBounds.x + oldContainerBounds.w &&
                                shapeCenterY >= oldContainerBounds.y &&
                                shapeCenterY <= oldContainerBounds.y + oldContainerBounds.h;

                            if (wasInside) {
                                containedShapeIds.push(shape.id);
                            }
                        });

                        if (containedShapeIds.length > 0) {
                            console.log(`Moving ${containedShapeIds.length} contained shapes:`, containedShapeIds);

                            // Move all contained shapes by the same delta
                            const updates = containedShapeIds.map(shapeId => {
                                const shape = editor.getShape(shapeId);
                                if (shape) {
                                    return {
                                        ...shape,
                                        x: shape.x + deltaX,
                                        y: shape.y + deltaY,
                                    };
                                }
                                return null;
                            }).filter(Boolean);

                            if (updates.length > 0) {
                                editor.updateShapes(updates);
                            }
                        }
                    }
                }
            });

            // Update positions
            if (hasMovement || Object.keys(lastPositions).length === 0) {
                const newPositions: Record<string, { x: number; y: number }> = {};
                containers.forEach(container => {
                    newPositions[container.id] = { x: container.x, y: container.y };
                });
                setLastPositions(newPositions);
            }

            // Continue checking
            animationFrame = requestAnimationFrame(checkForMovement);
        };

        // Start the checking loop
        animationFrame = requestAnimationFrame(checkForMovement);

        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };
    }, [editor, lastPositions]);

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
            console.log('Creating shape at point:', point);
            // For non-bounding box components, check if they should be contained
            const adjustedPoint = point;
            if (!comp.isBoundingBox) {
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
