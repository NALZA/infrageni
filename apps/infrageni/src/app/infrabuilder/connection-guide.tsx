interface ConnectionGuideProps {
    isVisible: boolean;
    onClose: () => void;
}

export function ConnectionGuide({ isVisible, onClose }: ConnectionGuideProps) {
    if (!isVisible) return null;

    return (
        <div className="dialog-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 9999 }}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Creating Connections</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                        ×
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-medium mb-2">How to Connect Components</h3>
                        <ol className="list-decimal list-inside space-y-2 text-gray-700">
                            <li>
                                <strong>Select the Arrow Tool:</strong> In the TLDraw toolbar (left side), click on the arrow tool icon.
                            </li>
                            <li>
                                <strong>Draw Connections:</strong> Click and drag from one component to another to create an arrow connection.
                            </li>
                            <li>
                                <strong>Add Labels:</strong> Double-click on the arrow to add text labels (e.g., "HTTPS", "Database Connection").
                            </li>
                            <li>
                                <strong>Customize Arrows:</strong> Use the style panel to change arrow colors, line styles, and arrowhead types.
                            </li>
                        </ol>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">
                            <span role="img" aria-label="light bulb">💡</span> Pro Tips:
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-blue-800">
                            <li>Arrows will automatically "stick" to components when you connect them</li>
                            <li>Moving components will keep the arrows connected</li>
                            <li>Use different arrow styles to represent different types of connections</li>
                            <li>All connections will be exported to Mermaid diagrams automatically</li>
                        </ul>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-medium text-green-900 mb-2">
                            <span role="img" aria-label="link">🔗</span> Connection Examples:
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-green-800">
                            <li><strong>Web to Database:</strong> "HTTP API", "Database Query"</li>
                            <li><strong>User to System:</strong> "Login", "API Request"</li>
                            <li><strong>System to External:</strong> "HTTPS", "Webhook"</li>
                            <li><strong>Storage to Compute:</strong> "File Access", "Backup"</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    >
                        Got it!
                    </button>
                </div>
            </div>
        </div>
    );
}
