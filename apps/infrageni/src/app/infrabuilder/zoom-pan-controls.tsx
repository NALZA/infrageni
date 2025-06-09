import React from 'react';
import { Button } from '../ui/button';

import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';

interface ZoomPanControlsProps {
    onZoomIn: () => void;
    onZoomOut: () => void;
    onResetView: () => void;
    currentZoom: number;
}

export const ZoomPanControls: React.FC<ZoomPanControlsProps> = ({
    onZoomIn,
    onZoomOut,
    onResetView,
    currentZoom,
}) => {
    return (
        <div className="absolute bottom-4 right-4 z-10 flex flex-col space-y-2">
            <Button variant="outline" size="icon" onClick={onZoomIn} title="Zoom In">
                <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={onZoomOut} title="Zoom Out">
                <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={onResetView} title="Reset View">
                <Maximize className="h-4 w-4" />
            </Button>
            <div className="text-xs text-center bg-background/80 px-2 py-1 rounded">
                {Math.round(currentZoom * 100)}%
            </div>
        </div>
    );
};
