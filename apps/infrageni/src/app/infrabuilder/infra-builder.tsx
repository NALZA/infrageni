import { useState } from 'react';
import { GENERIC_COMPONENTS } from './components';
import { ComponentLibrary } from './component-library';
import { Canvas } from './canvas';

const InfraBuilder = () => {
    const [search, setSearch] = useState('');
    const [favorites, setFavorites] = useState<string[]>([]);

    return (
        <div className="flex flex-col h-[80vh] gap-4 p-8">
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
        </div>
    );
};

export default InfraBuilder;