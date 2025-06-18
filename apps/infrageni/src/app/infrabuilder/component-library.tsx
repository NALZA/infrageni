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
    ];

    const renderComponent = (comp: GenericComponent) => (
        <div
            key={comp.id}
            draggable
            onDragStart={e => {
                e.dataTransfer.setData('application/x-infrageni-component', comp.id);
            }}
            className={`cursor-move px-3 py-2 rounded border bg-muted hover:bg-accent transition flex items-center justify-between ${favorites.includes(comp.id) ? 'border-yellow-400' : ''} ${comp.isBoundingBox ? 'border-dashed border-blue-300 bg-blue-50' : ''}`}
        >
            <span className={comp.isBoundingBox ? 'text-blue-700 font-medium' : ''}>{comp.providerNames[provider] || comp.label}</span>
            <button
                type="button"
                aria-label={favorites.includes(comp.id) ? 'Unfavorite' : 'Favorite'}
                className="ml-2 text-yellow-500 hover:text-yellow-600 focus:outline-none"
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
    );

    return (
        <aside className="w-64 bg-card border rounded-lg p-4 flex-shrink-0 flex flex-col">
            <h2 className="text-lg font-semibold mb-2">Component Library</h2>
            <input
                type="text"
                placeholder="Search components..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="mb-2 px-2 py-1 border rounded bg-background text-foreground"
            />
            <div className="flex-1 overflow-y-auto text-muted-foreground space-y-4">
                {sortedBoundingBox.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold text-blue-700 mb-2">Container Components</h3>
                        <div className="space-y-2">
                            {sortedBoundingBox.map(renderComponent)}
                        </div>
                    </div>
                )}
                {sortedRegular.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Resources</h3>
                        <div className="space-y-2">
                            {sortedRegular.map(renderComponent)}
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
}
