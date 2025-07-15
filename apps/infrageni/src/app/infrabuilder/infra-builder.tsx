import { useState } from 'react';
import { GENERIC_COMPONENTS } from './components';
import { ComponentLibrary } from './component-library';
import { Canvas } from './canvas';
import { AnimationControls } from './animation/animation-controls';
import { DiagramLibrary } from './library/diagram-library';
import { DiagramTemplate, SavedDiagram } from './library/diagram-types';

const InfraBuilder = () => {
    const [search, setSearch] = useState('');
    const [favorites, setFavorites] = useState<string[]>([]);
    const [showLibrary, setShowLibrary] = useState(false);

    const handleLoadDiagram = (diagram: SavedDiagram | DiagramTemplate) => {
        // TODO: Implement diagram loading logic
        console.log('Loading diagram:', diagram);
        setShowLibrary(false);
    };

    return (
        <div className="flex flex-col h-[80vh] gap-4 p-8">
            <div className="flex items-center justify-between">
                <AnimationControls />
                <button
                    onClick={() => setShowLibrary(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Library
                </button>
            </div>
            
            <div className="flex flex-1 gap-4">
                <ComponentLibrary
                    components={GENERIC_COMPONENTS}
                    favorites={favorites}
                    setFavorites={setFavorites}
                    search={search}
                    setSearch={setSearch}
                />
                <Canvas />
            </div>

            <DiagramLibrary
                isOpen={showLibrary}
                onClose={() => setShowLibrary(false)}
                onLoadDiagram={handleLoadDiagram}
            />
        </div>
    );
};

export default InfraBuilder;