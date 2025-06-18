import { useEffect, useRef, useState } from 'react';

interface MermaidPreviewProps {
    content: string;
    className?: string;
}

export function MermaidPreview({ content, className = '' }: MermaidPreviewProps) {
    const elementRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); useEffect(() => {
        let mounted = true;
        const currentElement = elementRef.current; const renderMermaid = async () => {
            if (!currentElement || !content.trim()) {
                if (mounted) {
                    setIsLoading(false);
                    setError(null);
                }
                return;
            }

            try {
                setIsLoading(true);
                setError(null);        // Clear the container first to prevent conflicts
                currentElement.innerHTML = '';

                // Dynamic import to avoid SSR issues
                const mermaid = (await import('mermaid')).default;

                // Configure mermaid
                mermaid.initialize({
                    startOnLoad: false,
                    theme: 'default',
                    themeVariables: {
                        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
                        fontSize: '12px',
                    },
                    flowchart: {
                        useMaxWidth: true,
                        htmlLabels: true,
                    },
                    c4: {
                        useMaxWidth: true,
                    },
                    architecture: {
                        useMaxWidth: true,
                    },
                    securityLevel: 'loose', // Allow HTML in labels
                });        // Clear the container
                currentElement.innerHTML = '';

                // Generate unique ID for this diagram
                const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;        // Render the diagram
                const { svg } = await mermaid.render(id, content);

                if (mounted && currentElement) {
                    currentElement.innerHTML = svg;
                    setIsLoading(false);
                }
            } catch (err) {
                console.error('Mermaid rendering error:', err);
                if (mounted) {
                    setError(err instanceof Error ? err.message : 'Failed to render diagram');
                    setIsLoading(false);
                }
            }
        };

        renderMermaid(); return () => {
            mounted = false;      // Clear the container when unmounting or content changes
            if (currentElement) {
                currentElement.innerHTML = '';
            }
        };
    }, [content]);

    if (!content.trim()) {
        return (
            <div className={`flex items-center justify-center text-gray-500 ${className}`}>
                No diagram content to preview
            </div>
        );
    }

    if (error) {
        return (
            <div className={`p-4 ${className}`}>
                <div className="text-red-600 text-sm">
                    <div className="font-medium mb-2">Diagram Rendering Error:</div>
                    <div className="font-mono text-xs bg-red-50 p-2 rounded border">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`relative ${className}`}>
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
                    <div className="flex items-center space-x-2 text-gray-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span className="text-sm">Rendering diagram...</span>
                    </div>
                </div>
            )}
            <div
                ref={elementRef}
                className="mermaid-container overflow-auto"
                style={{
                    minHeight: '200px',
                    // Ensure the SVG scales properly
                    maxWidth: '100%',
                }}
            />
        </div>
    );
}
