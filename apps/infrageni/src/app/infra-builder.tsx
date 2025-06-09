// TODO: Implement the drag-and-drop canvas and component management UI here
const InfraBuilder = () => {
    return (
        <div className="flex h-[80vh] gap-4 p-8">
            {/* Component Library */}
            <aside className="w-64 bg-card border rounded-lg p-4 flex-shrink-0 flex flex-col">
                <h2 className="text-lg font-semibold mb-2">Component Library</h2>
                <div className="flex-1 overflow-y-auto text-muted-foreground">
                    {/* TODO: List cloud & generic components here */}
                    <span>Cloud and generic components will appear here.</span>
                </div>
            </aside>
            {/* Canvas */}
            <main className="flex-1 bg-muted border rounded-lg flex items-center justify-center min-h-[400px]">
                <span className="text-muted-foreground">Drag and drop your cloud components here...</span>
            </main>
            {/* Configuration Panel */}
            <aside className="w-80 bg-card border rounded-lg p-4 flex-shrink-0 flex flex-col">
                <h2 className="text-lg font-semibold mb-2">Configuration</h2>
                <div className="flex-1 text-muted-foreground">
                    {/* TODO: Show selected component properties here */}
                    <span>Select a component to configure its properties.</span>
                </div>
            </aside>
        </div>
    );
}

export default InfraBuilder;