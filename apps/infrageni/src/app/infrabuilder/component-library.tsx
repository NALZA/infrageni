import React from 'react';
import { GenericComponent, useProvider } from './components';

export function ComponentLibrary({
    components,
    favorites,
    setFavorites,
    search,
    setSearch,
    onDragStart,
}: {
    components: GenericComponent[];
    favorites: string[];
    setFavorites: (favs: string[]) => void;
    search: string;
    setSearch: (s: string) => void;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, id: string) => void;
}) {
    const provider = useProvider();
    // Filter and sort
    const filtered = components.filter((comp) => {
        const name = comp.providerNames[provider] || comp.label;
        return name.toLowerCase().includes(search.toLowerCase());
    });
    const sorted = [
        ...filtered.filter((c) => favorites.includes(c.id)),
        ...filtered.filter((c) => !favorites.includes(c.id)),
    ];
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
            <div className="flex-1 overflow-y-auto text-muted-foreground space-y-2">
                {sorted.map((comp) => (
                    <div
                        key={comp.id}
                        draggable
                        onDragStart={e => onDragStart(e, comp.id)}
                        className={`cursor-move px-3 py-2 rounded border bg-muted hover:bg-accent transition flex items-center justify-between ${favorites.includes(comp.id) ? 'border-yellow-400' : ''}`}
                    >
                        <span>{comp.providerNames[provider] || comp.label}</span>
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
                ))}
            </div>
        </aside>
    );
}
