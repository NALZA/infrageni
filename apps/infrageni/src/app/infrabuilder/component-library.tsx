import { GenericComponent, useProvider } from './components';

export function ComponentLibrary({
    components,
    favorites,
    setFavorites,
    search,
    setSearch,
}: {
    components: GenericComponent[];
    favorites: string[];
    setFavorites: (favs: string[]) => void;
    search: string;
    setSearch: (s: string) => void;
}) {
    const provider = useProvider();

    // Filter components
    const filtered = components.filter((comp) => {
        const name = comp.providerNames[provider] || comp.label;
        return name.toLowerCase().includes(search.toLowerCase());
    });

    // Separate bounding box components from regular components
    const boundingBoxComponents = filtered.filter(c => c.isBoundingBox);
    const regularComponents = filtered.filter(c => !c.isBoundingBox);

    // Sort each group
    const sortedBoundingBox = [
        ...boundingBoxComponents.filter((c) => favorites.includes(c.id)),
        ...boundingBoxComponents.filter((c) => !favorites.includes(c.id)),
    ];
    const sortedRegular = [
        ...regularComponents.filter((c) => favorites.includes(c.id)),
        ...regularComponents.filter((c) => !favorites.includes(c.id)),
    ];    const renderComponent = (comp: GenericComponent) => (
        <div
            key={comp.id}
            draggable
            onDragStart={e => {
                e.dataTransfer.setData('application/x-infrageni-component', comp.id);
            }}
            className={`cursor-move px-3 py-2 rounded-lg glass-button glass-button-hover transition-all duration-200 flex items-center justify-between ${
                favorites.includes(comp.id) 
                    ? 'border-2 border-yellow-400/60 bg-yellow-50/40 dark:bg-yellow-900/20' 
                    : ''
            } ${
                comp.isBoundingBox 
                    ? 'border-2 border-dashed border-blue-400/60 bg-blue-50/40 dark:bg-blue-900/20' 
                    : ''
            }`}
        >
            <span className={`${comp.isBoundingBox ? 'text-blue-700 dark:text-blue-300 font-medium' : 'text-black/80 dark:text-white/80'} text-sm`}>
                {comp.providerNames[provider] || comp.label}
            </span>
            <button
                type="button"
                aria-label={favorites.includes(comp.id) ? 'Unfavorite' : 'Favorite'}
                className="ml-2 text-yellow-500 hover:text-yellow-600 dark:text-yellow-400 dark:hover:text-yellow-300 transition-colors duration-200 focus:outline-none"
                onClick={e => {
                    e.stopPropagation();
                    setFavorites(
                        favorites.includes(comp.id)
                            ? favorites.filter(id => id !== comp.id)
                            : [...favorites, comp.id]
                    );
                }}
            >
                {favorites.includes(comp.id) ? '★' : '☆'}
            </button>
        </div>
    );    return (
        <aside className="w-64 glass-panel border border-white/20 dark:border-white/10 rounded-lg p-4 shrink-0 flex flex-col shadow-lg">
            <h2 className="text-lg font-semibold mb-3 text-black/90 dark:text-white/90">Component Library</h2>
            <input
                type="text"
                placeholder="Search components..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="mb-4 glass-input px-3 py-2 rounded-lg text-sm"
            />
            <div className="flex-1 overflow-y-auto space-y-4">
                {sortedBoundingBox.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-3 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            Container Components
                        </h3>
                        <div className="space-y-2">
                            {sortedBoundingBox.map(renderComponent)}
                        </div>
                    </div>
                )}
                {sortedRegular.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                            Resources
                        </h3>
                        <div className="space-y-2">
                            {sortedRegular.map(renderComponent)}
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
}
