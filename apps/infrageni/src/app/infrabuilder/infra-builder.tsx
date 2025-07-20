import { useState } from 'react';
import { EnhancedComponentLibrary } from './enhanced-component-library';
import { Canvas } from './canvas';
import { ModeToggle, EducationModeContainer } from './education';
import { EnhancedExportDialog } from './export';

const InfraBuilder = () => {
    const [search, setSearch] = useState('');
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isEducationMode, setIsEducationMode] = useState(false);
    const [showExportDialog, setShowExportDialog] = useState(false);

    const handleModeChange = (educationMode: boolean) => {
        setIsEducationMode(educationMode);
    };

    const handleExitEducation = () => {
        setIsEducationMode(false);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-5rem)] gap-4 p-8">
            {/* Mode Toggle Header */}
            <div className="flex justify-between items-center flex-shrink-0">
                <div className="flex-1">
                    <ModeToggle
                        isEducationMode={isEducationMode}
                        onModeChange={handleModeChange}
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-h-0">
                {isEducationMode ? (
                    <EducationModeContainer
                        onExitEducation={handleExitEducation}
                        className="h-full"
                    />
                ) : (
                    <div className="flex gap-4 h-full">
                        <EnhancedComponentLibrary
                            favorites={favorites}
                            setFavorites={setFavorites}
                            search={search}
                            setSearch={setSearch}
                        />
                        <Canvas onExport={() => setShowExportDialog(true)} />
                    </div>
                )}
            </div>
            
            {/* Export Dialog - Outside tldraw component */}
            {showExportDialog && (
                <EnhancedExportDialog
                    isOpen={showExportDialog}
                    onClose={() => setShowExportDialog(false)}
                />
            )}
        </div>
    );
};

export default InfraBuilder;