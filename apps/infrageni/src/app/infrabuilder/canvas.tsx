import React from 'react';
import { Tldraw, useEditor } from 'tldraw';
import 'tldraw/tldraw.css';
import { GENERIC_COMPONENTS, useProvider } from './components';
import { customShapeUtils, createComponentShape } from './shapes';

// Inner component that has access to the editor
function DropZone() {
    const editor = useEditor();
    const provider = useProvider();
      React.useEffect(() => {
        let isDropping = false; // Flag to prevent multiple drops
        
        const handleDrop = (e: DragEvent) => {
            const compId = e.dataTransfer?.getData('application/x-infrageni-component');
            if (!compId) return;
            
            // Prevent multiple simultaneous drops
            if (isDropping) {
                console.log('Drop already in progress, ignoring');
                return;
            }
            
            e.preventDefault();
            e.stopPropagation(); // Prevent event bubbling that might cause duplicates
            e.stopImmediatePropagation(); // Prevent other handlers on the same element
            
            isDropping = true;
            
            const comp = GENERIC_COMPONENTS.find(c => c.id === compId);
            if (!comp) {
                isDropping = false;
                return;
            }
            
            // Get the viewport position and convert to page coordinates
            const point = editor.screenToPage({ x: e.clientX, y: e.clientY });
            
            // Create the appropriate custom shape
            const shape = createComponentShape(comp, point.x, point.y, provider);
            editor.createShape(shape);
            
            // Reset the flag after a short delay
            setTimeout(() => {
                isDropping = false;
            }, 100);
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

    return null;
}

export function Canvas() {
    return (
        <main className="flex-1 glass-panel border rounded-lg relative min-h-[400px] overflow-hidden">
            <Tldraw 
                className="w-full h-full"
                shapeUtils={customShapeUtils}
            >
                <DropZone />
            </Tldraw>
        </main>
    );
}
