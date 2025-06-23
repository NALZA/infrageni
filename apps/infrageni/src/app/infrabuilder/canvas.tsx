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
import { useUrlStateWithTldraw } from './hooks/useUrlStateWithTldraw';

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
function findContainingBoundingBox(editor: ReturnType<typeof useEditor>, point: { x: number; y: number }, excludeShapeId?: TLShapeId): TLShapeId | null {
    const allShapes = editor.getCurrentPageShapes();
    const boundingBoxShapes = allShapes.filter((shape: TLShape) => {
        const shapeProps = shape.props as BaseInfraShapeProps;
        return shapeProps?.isBoundingBox &&
            shape.id !== excludeShapeId && // Prevent a shape from being its own parent
            isPointInBoundingBox(point, shape);
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

// A component to handle reparenting logic when shapes are moved


// Inner component that has access to the editor
// A component to handle the URL state synchronization
function UrlState() {
    useUrlStateWithTldraw();
    return null;
}

function ReparentingHandler() {
    const editor = useEditor();
    const isProcessingRef = React.useRef(false);

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
                    // Use a longer timeout and set processing flag to prevent recursion
                    setTimeout(() => {
                        if (isProcessingRef.current) return;
                        isProcessingRef.current = true;

                        try {
                            const selectedShapes = editor.getSelectedShapes();
                            if (selectedShapes.length === 0) return;

                            const shapesToReparent: { shapeId: TLShapeId; newParentId: TLParentId }[] = [];

                            selectedShapes.forEach(shape => {
                                if (shape.type === 'arrow') return;

                                const shapeProps = shape.props as BaseInfraShapeProps;
                                // Skip container shapes to prevent moving containers into themselves
                                if (shapeProps.isBoundingBox) return;

                                const shapeCenter = { x: shape.x + (shapeProps.w || 0) / 2, y: shape.y + (shapeProps.h || 0) / 2 };
                                const newParentId = findContainingBoundingBox(editor, shapeCenter, shape.id);
                                const currentPageId = editor.getCurrentPageId();

                                // Only add to reparent list if the parent is actually changing
                                if (newParentId && shape.parentId !== newParentId) {
                                    shapesToReparent.push({ shapeId: shape.id, newParentId: newParentId as TLShapeId });
                                } else if (!newParentId && shape.parentId !== currentPageId) {
                                    shapesToReparent.push({ shapeId: shape.id, newParentId: currentPageId });
                                }
                            });

                            // Batch the reparenting operations to reduce store updates
                            if (shapesToReparent.length > 0) {
                                editor.batch(() => {
                                    shapesToReparent.forEach(({ shapeId, newParentId }) => {
                                        editor.reparentShapes([shapeId], newParentId);
                                        editor.bringToFront([shapeId]);
                                    });
                                });
                            }
                        } finally {
                            // Reset the processing flag after a delay to ensure operations complete
                            setTimeout(() => {
                                isProcessingRef.current = false;
                            }, 100);
                        }
                    }, 50); // Increased timeout to allow drag operation to complete
                }
            },
            { source: 'user', scope: 'document' }
        );

        return () => {
            listener();
        };
    }, [editor]);

    return null;
}

function DropZone() {
    const editor = useEditor();
    const provider = useProvider();

    useTldrawThemeSync();

    const [connectMode, setConnectMode] = React.useState(false);
    const [labelMode, setLabelMode] = React.useState(false);
    const [showExportDialog, setShowExportDialog] = React.useState(false);
    const [showConnectionGuide, setShowConnectionGuide] = React.useState(false);

    React.useEffect(() => {
        const handleDrop = (e: DragEvent) => {
            if (e.defaultPrevented) return; // Prevent duplicate handling
            e.preventDefault();
            e.stopPropagation();

            // Remove the event listeners immediately to avoid double firing
            const container = editor.getContainer();
            container.removeEventListener('drop', handleDrop);
            container.removeEventListener('dragover', handleDragOver);

            const compId = e.dataTransfer?.getData('application/x-infrageni-component');
            if (!compId) return;
            const comp = GENERIC_COMPONENTS.find(c => c.id === compId);
            if (!comp) return;

            const point = editor.screenToPage({ x: e.clientX, y: e.clientY });
            const parentId = findContainingBoundingBox(editor, point) || undefined;
            const shape = createComponentShape(comp, point.x, point.y, provider, parentId);
            const createdShape = editor.createShape(shape);
            if (createdShape) {
                editor.bringToFront([createdShape.id as TLShapeId]);
            }
        };

        const handleDragOver = (e: DragEvent) => e.preventDefault();

        const container = editor.getContainer();
        container.addEventListener('drop', handleDrop);
        container.addEventListener('dragover', handleDragOver);

        return () => {
            container.removeEventListener('drop', handleDrop);
            container.removeEventListener('dragover', handleDragOver);
        };
    }, [editor, provider]);

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
            >
                <UrlState />
                <DropZone />
                <ReparentingHandler />
            </Tldraw>
        </main>
    );
}
