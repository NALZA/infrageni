import { useState } from 'react';
import { Download, Copy, Eye, X, FileText, Image, Code, ExternalLink } from 'lucide-react';
import { useCanvasExport } from './export-utils';
import { EXPORT_FORMATS } from './formats';
import { EXPORT_EXAMPLES } from './export-examples';
import { MermaidPreview } from './mermaid-preview';
import { GlassButton, GlassInput, GlassCard } from '../../components/ui/glass-components';

interface EnhancedExportDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export function EnhancedExportDialog({ isOpen, onClose }: EnhancedExportDialogProps) {
    const [selectedFormat, setSelectedFormat] = useState(EXPORT_FORMATS[0].id);
    const [filename, setFilename] = useState('');
    const [previewContent, setPreviewContent] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const { exportToFormat, downloadExport, availableFormats } = useCanvasExport();

    // Helper to check if format is a Mermaid format
    const isMermaidFormat = (format: string) => {
        return format.startsWith('mermaid-');
    };

    // Get format icon based on type
    const getFormatIcon = (format: string) => {
        if (isMermaidFormat(format)) return Image;
        if (format.includes('terraform') || format.includes('yaml')) return Code;
        return FileText;
    };

    // Handle format change - clear preview to avoid rendering conflicts
    const handleFormatChange = (newFormat: string) => {
        setSelectedFormat(newFormat);
        setShowPreview(false);
        setPreviewContent('');
        setCopySuccess(false);
    };

    const handlePreview = async () => {
        setIsExporting(true);
        try {
            const content = exportToFormat(selectedFormat);
            setPreviewContent(content);
            setShowPreview(true);
            setCopySuccess(false);
        } catch (error) {
            console.error('Export error:', error);
            // Use a more elegant error display
            setPreviewContent(`Error generating export: ${(error as Error).message}`);
            setShowPreview(true);
        } finally {
            setIsExporting(false);
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(previewContent);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
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
                // More elegant error handling
            }
            document.body.removeChild(textArea);
        }
    };

    const handleDownload = async () => {
        setIsExporting(true);
        try {
            downloadExport(selectedFormat, filename || undefined);
            onClose();
        } catch (error) {
            console.error('Download error:', error);
        } finally {
            setIsExporting(false);
        }
    };

    const selectedFormatInfo = availableFormats.find(f => f.id === selectedFormat);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-101 flex items-center justify-center p-4">
            {/* Enhanced Glass Backdrop */}
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Main Export Dialog */}
            <GlassCard
                variant="modal"
                blur="xl"
                className="relative w-full max-w-6xl h-[90vh] max-h-[800px] flex flex-col"
            >
                {/* Enhanced Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/20 text-blue-600 dark:text-blue-400">
                            <Download className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-black/90 dark:text-white/90">
                                Export Infrastructure Diagram
                            </h2>
                            <p className="text-sm text-black/60 dark:text-white/60">
                                Export your diagram to various formats for documentation and deployment
                            </p>
                        </div>
                    </div>
                    <GlassButton
                        variant="outline"
                        size="sm"
                        onClick={onClose}
                        className="rounded-full p-2"
                    >
                        <X className="h-4 w-4" />
                    </GlassButton>
                </div>

                <div className="flex flex-1 min-h-0">
                    {/* Enhanced Left Panel - Export Options */}
                    <div className="w-1/3 border-r border-white/10 flex flex-col">
                        <div className="p-6 flex-1 overflow-y-auto">
                            <div className="space-y-6">
                                {/* Format Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-black/80 dark:text-white/80 mb-3">
                                        Export Format
                                    </label>
                                    <div className="space-y-2 max-h-64 overflow-y-auto">
                                        {availableFormats.map((format) => {
                                            const IconComponent = getFormatIcon(format.id);
                                            const isSelected = selectedFormat === format.id;

                                            return (
                                                <button
                                                    key={format.id}
                                                    onClick={() => handleFormatChange(format.id)}
                                                    className={`
                                                    w-full p-3 rounded-lg text-left transition-all duration-200
                                                    border border-white/20 dark:border-white/10
                                                    ${isSelected
                                                            ? 'bg-blue-500/20 border-blue-500/40 text-blue-700 dark:text-blue-300'
                                                            : 'glass-button glass-button-hover'
                                                        }
                                                `}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`
                                                        p-1.5 rounded-md
                                                        ${isSelected
                                                                ? 'bg-blue-500/30 text-blue-600 dark:text-blue-400'
                                                                : 'bg-gray-500/20 text-gray-600 dark:text-gray-400'
                                                            }
                                                    `}>
                                                            <IconComponent className="h-4 w-4" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-medium text-sm">
                                                                {format.name}
                                                            </div>
                                                            <div className="text-xs opacity-70 truncate">
                                                                .{format.extension}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Format Description */}
                                    {selectedFormatInfo && (
                                        <GlassCard className="mt-4 p-3">
                                            <div className="text-sm text-black/70 dark:text-white/70">
                                                <p className="mb-2">{selectedFormatInfo.description}</p>
                                                {EXPORT_EXAMPLES[selectedFormat] && (
                                                    <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
                                                        <ExternalLink className="h-3 w-3" />
                                                        <span>{EXPORT_EXAMPLES[selectedFormat].useCase}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </GlassCard>
                                    )}
                                </div>

                                {/* Filename Input */}
                                <div>
                                    <GlassInput
                                        label="Filename (optional)"
                                        value={filename}
                                        onChange={(e) => setFilename(e.target.value)}
                                        placeholder={`infrastructure-diagram.${selectedFormatInfo?.extension}`}
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    <GlassButton
                                        onClick={handlePreview}
                                        disabled={isExporting}
                                        className="w-full flex items-center justify-center gap-2"
                                        variant="outline"
                                    >
                                        <Eye className={`h-4 w-4 ${isExporting ? 'animate-pulse' : ''}`} />
                                        {isExporting ? 'Generating...' : 'Preview'}
                                    </GlassButton>

                                    <GlassButton
                                        onClick={handleDownload}
                                        disabled={isExporting}
                                        className="w-full flex items-center justify-center gap-2"
                                        variant="primary"
                                    >
                                        <Download className={`h-4 w-4 ${isExporting ? 'animate-bounce' : ''}`} />
                                        {isExporting ? 'Exporting...' : 'Download'}
                                    </GlassButton>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Right Panel - Preview */}
                    <div className="flex-1 flex flex-col">
                        <div className="p-6 flex-none">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-black/90 dark:text-white/90">
                                    Preview
                                </h3>
                                {showPreview && (
                                    <GlassButton
                                        onClick={handleCopy}
                                        size="sm"
                                        variant={copySuccess ? 'primary' : 'outline'}
                                        className="flex items-center gap-2"
                                    >
                                        <Copy className="h-3 w-3" />
                                        {copySuccess ? 'Copied!' : 'Copy'}
                                    </GlassButton>
                                )}
                            </div>
                        </div>
                        <div className="flex-1 min-h-0 px-6 pb-6">
                            {showPreview ? (
                                <div className="flex-1 min-h-0">
                                    {/* Mermaid formats get both text and visual preview */}
                                    {isMermaidFormat(selectedFormat) ? (
                                        <div className="flex flex-col space-y-4 h-full">
                                            {/* Visual Preview */}
                                            <GlassCard className="flex-1 min-h-0 overflow-hidden">
                                                <div className="p-3 border-b border-white/10">
                                                    <h4 className="text-sm font-medium text-black/80 dark:text-white/80 flex items-center gap-2">
                                                        <Image className="h-4 w-4" />
                                                        Rendered Diagram
                                                    </h4>
                                                </div>
                                                <div className="flex-1 overflow-auto">
                                                    <MermaidPreview
                                                        content={previewContent}
                                                        className="h-full p-4"
                                                        key={`${selectedFormat}-${previewContent.substring(0, 50)}`}
                                                    />
                                                </div>
                                            </GlassCard>

                                            {/* Text Source */}
                                            <GlassCard className="h-48 flex flex-col overflow-hidden">
                                                <div className="p-3 border-b border-white/10 flex-none">
                                                    <h4 className="text-sm font-medium text-black/80 dark:text-white/80 flex items-center gap-2">
                                                        <Code className="h-4 w-4" />
                                                        Source Code
                                                    </h4>
                                                </div>
                                                <div className="flex-1 overflow-auto">
                                                    <pre className="p-4 text-sm font-mono whitespace-pre-wrap text-black/80 dark:text-white/80 min-h-full">
                                                        {previewContent}
                                                    </pre>
                                                </div>
                                            </GlassCard>
                                        </div>
                                    ) : (
                                        /* Non-Mermaid formats get text only */
                                        <GlassCard className="h-full flex flex-col overflow-hidden">
                                            <div className="p-3 border-b border-white/10 flex-none">
                                                <h4 className="text-sm font-medium text-black/80 dark:text-white/80 flex items-center gap-2">
                                                    <FileText className="h-4 w-4" />
                                                    Export Content
                                                </h4>
                                            </div>
                                            <div className="flex-1 overflow-auto">
                                                <pre className="p-4 text-sm font-mono whitespace-pre-wrap text-black/80 dark:text-white/80">
                                                    {previewContent}
                                                </pre>
                                            </div>
                                        </GlassCard>
                                    )}
                                </div>
                            ) : (
                                <GlassCard className="h-full flex items-center justify-center">
                                    <div className="text-center text-black/60 dark:text-white/60">
                                        <Eye className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                        <p className="text-sm">
                                            Click "Preview" to see the exported content
                                        </p>
                                    </div>
                                </GlassCard>
                            )}
                        </div>
                    </div>
                </div>

                {/* Enhanced Footer */}
                <div className="p-6 border-t border-white/10 flex justify-between items-center">
                    <div className="text-xs text-black/50 dark:text-white/50">
                        Export formats optimized for documentation and deployment workflows
                    </div>
                    <div className="flex gap-3">
                        <GlassButton variant="outline" onClick={onClose}>
                            Cancel
                        </GlassButton>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
}