import { useState } from 'react';
import { useCanvasExport } from './export-utils';
import { EXPORT_FORMATS } from './formats';
import { EXPORT_EXAMPLES } from './export-examples';
import { MermaidPreview } from './mermaid-preview';

interface ExportDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ExportDialog({ isOpen, onClose }: ExportDialogProps) {
    const [selectedFormat, setSelectedFormat] = useState(EXPORT_FORMATS[0].id);
    const [filename, setFilename] = useState('');
    const [previewContent, setPreviewContent] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    const { exportToFormat, downloadExport, availableFormats } = useCanvasExport();

    // Helper to check if format is a Mermaid format
    const isMermaidFormat = (format: string) => {
        return format.startsWith('mermaid-');
    };

    // Handle format change - clear preview to avoid rendering conflicts
    const handleFormatChange = (newFormat: string) => {
        setSelectedFormat(newFormat);
        setShowPreview(false);
        setPreviewContent('');
        setCopySuccess(false);
    };

    const handlePreview = () => {
        try {
            const content = exportToFormat(selectedFormat);
            setPreviewContent(content);
            setShowPreview(true);
            setCopySuccess(false); // Reset copy status
        } catch (error) {
            console.error('Export error:', error);
            alert('Error generating export: ' + (error as Error).message);
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(previewContent);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000); // Reset after 2 seconds
        } catch (error) {
            console.error('Copy error:', error);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = previewContent;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 2000);
            } catch (fallbackError) {
                console.error('Fallback copy failed:', fallbackError);
                alert('Copy failed. Please select the text manually and copy.');
            }
            document.body.removeChild(textArea);
        }
    };

    const handleDownload = () => {
        try {
            downloadExport(selectedFormat, filename || undefined);
            onClose();
        } catch (error) {
            console.error('Download error:', error);
            alert('Error downloading file: ' + (error as Error).message);
        }
    };

    const selectedFormatInfo = availableFormats.find(f => f.id === selectedFormat);

    if (!isOpen) return null;

    return (
        <div className="dialog-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 9999 }}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-5/6 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold">Export Infrastructure Diagram</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                        ×
                    </button>
                </div>

                <div className="flex flex-1 min-h-0">
                    {/* Left Panel - Export Options */}
                    <div className="w-1/3 p-6 border-r bg-gray-50">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Export Format
                                </label>                <select
                                    value={selectedFormat}
                                    onChange={(e) => handleFormatChange(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                                >
                                    {availableFormats.map((format) => (
                                        <option key={format.id} value={format.id}>
                                            {format.name}
                                        </option>
                                    ))}
                                </select>                {selectedFormatInfo && (
                                    <div className="text-sm text-gray-600 mt-1">
                                        <p>{selectedFormatInfo.description}</p>
                                        {EXPORT_EXAMPLES[selectedFormat] && (
                                            <p className="mt-1 font-medium text-blue-600">
                                                {EXPORT_EXAMPLES[selectedFormat].useCase}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Filename (optional)
                                </label>
                                <input
                                    type="text"
                                    value={filename}
                                    onChange={(e) => setFilename(e.target.value)}
                                    placeholder={`infrastructure-diagram.${selectedFormatInfo?.extension}`}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <button
                                    onClick={handlePreview}
                                    className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-hidden focus:ring-2 focus:ring-gray-500"
                                >
                                    Preview
                                </button>
                                <button
                                    onClick={handleDownload}
                                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                                >
                                    Download
                                </button>
                            </div>
                        </div>
                    </div>          {/* Right Panel - Preview */}
                    <div className="flex-1 p-6">
                        <div className="h-full flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium">Preview</h3>
                                {showPreview && (
                                    <button
                                        onClick={handleCopy}
                                        className={`px-3 py-1 text-sm rounded-md border transition-colors ${copySuccess
                                                ? 'bg-green-100 text-green-700 border-green-300'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        {copySuccess ? '✓ Copied!' : 'Copy to Clipboard'}
                                    </button>
                                )}
                            </div>
                            {showPreview ? (
                                <>                  {/* Mermaid formats get both text and visual preview */}
                                    {isMermaidFormat(selectedFormat) ? (
                                        <div className="flex-1 flex flex-col space-y-4 min-h-0">
                                            {/* Visual Preview */}
                                            <div className="flex-1 border border-gray-300 rounded-md overflow-hidden">
                                                <div className="bg-gray-50 px-3 py-2 border-b border-gray-300">
                                                    <h4 className="text-sm font-medium text-gray-700">Rendered Diagram</h4>
                                                </div>                        <MermaidPreview
                                                    content={previewContent}
                                                    className="h-full p-4 bg-white"
                                                    key={`${selectedFormat}-${previewContent.substring(0, 50)}`}
                                                />
                                            </div>

                                            {/* Text Source */}
                                            <div className="h-48 border border-gray-300 rounded-md overflow-hidden">
                                                <div className="bg-gray-50 px-3 py-2 border-b border-gray-300">
                                                    <h4 className="text-sm font-medium text-gray-700">Source Code</h4>
                                                </div>
                                                <div className="h-full overflow-auto">
                                                    <pre className="p-4 text-sm font-mono whitespace-pre-wrap">
                                                        {previewContent}
                                                    </pre>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        /* Non-Mermaid formats get text only */
                                        <div className="flex-1 border border-gray-300 rounded-md overflow-auto">
                                            <pre className="p-4 text-sm font-mono whitespace-pre-wrap h-full">
                                                {previewContent}
                                            </pre>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="flex-1 border border-gray-300 rounded-md flex items-center justify-center text-gray-500">
                                    Click "Preview" to see the exported content
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t bg-gray-50 flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-hidden focus:ring-2 focus:ring-gray-500"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
