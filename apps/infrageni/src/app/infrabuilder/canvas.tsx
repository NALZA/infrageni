import React from 'react';
import { Tldraw, useEditor } from 'tldraw';
import 'tldraw/tldraw.css';
import { GENERIC_COMPONENTS, useProvider } from './components';
import { customShapeUtils, createComponentShape } from './shapes';
import { useTldrawThemeSync } from '../lib/use-tldraw-theme-sync';
import { DiagramLibrary } from './library/diagram-library';
import { DiagramTemplate, SavedDiagram } from './library/diagram-types';
import { AnimationControls } from './animation/animation-controls';

// Props for the Canvas component
interface CanvasProps {
    showLibrary?: boolean;
    onCloseLibrary?: () => void;
    onLoadDiagram?: (diagram: SavedDiagram | DiagramTemplate) => void;
    showAnimationControls?: boolean;
}

// Inner component that has access to the editor
function DropZone({ showLibrary, onCloseLibrary, onLoadDiagram, showAnimationControls }: CanvasProps) {
    const editor = useEditor();
    const provider = useProvider();
    
    // Synchronize tldraw theme with application theme
    useTldrawThemeSync();
    
    React.useEffect(() => {
        const handleDrop = (e: DragEvent) => {
            const compId = e.dataTransfer?.getData('application/x-infrageni-component');
            if (!compId) return;
            
            e.preventDefault();
            e.stopPropagation(); // Prevent event bubbling that might cause duplicates
            
            const comp = GENERIC_COMPONENTS.find(c => c.id === compId);
            if (!comp) return;
            
            // Get the viewport position and convert to page coordinates
            const point = editor.screenToPage({ x: e.clientX, y: e.clientY });
            
            // Create the appropriate custom shape
            const shape = createComponentShape(comp, point.x, point.y, provider);
            editor.createShape(shape);
        };

        const handleDragOver = (e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation(); // Prevent event bubbling
        };

        // Add listeners to the editor container
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
            {showLibrary && onCloseLibrary && onLoadDiagram && (
                <DiagramLibrary
                    isOpen={showLibrary}
                    onClose={onCloseLibrary}
                    onLoadDiagram={onLoadDiagram}
                />
            )}
            {showAnimationControls && (
                <div style={{ 
                    position: 'absolute', 
                    top: 10, 
                    left: 10, 
                    zIndex: 1000, 
                    pointerEvents: 'auto' 
                }}>
                    <AnimationControls />
                </div>
            )}
        </>
    );
}

export function Canvas({ showLibrary, onCloseLibrary, onLoadDiagram, showAnimationControls }: CanvasProps = {}) {
    return (
        <main className="flex-1 glass-panel border rounded-lg relative min-h-[400px] overflow-hidden">
            <Tldraw 
                className="w-full h-full"
                shapeUtils={customShapeUtils}
            >
                <DropZone 
                    showLibrary={showLibrary}
                    onCloseLibrary={onCloseLibrary}
                    onLoadDiagram={onLoadDiagram}
                    showAnimationControls={showAnimationControls}
                />
            </Tldraw>
        </main>
    );
}
