import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TLShape, TLArrowBinding, useEditor, TLArrowShape, GeoShape, TLEditor } from 'tldraw';
// Import ALL from export-utils for the exportCanvas suite, but individual for useCanvasExport if needed
import * as ExportUtilsModule from './export-utils';
import { CanvasItem, Connection, ExportData as ActualExportData } from '../types';
import { BaseInfraShapeProps } from '../shapes/base';
import { EXPORT_FORMATS } from './formats'; // Import for default filename logic

// Mock tldraw's useEditor hook - This is global for the file
vi.mock('tldraw', async (importOriginal) => {
  const original = await importOriginal<typeof import('tldraw')>();
  return {
    ...original,
    useEditor: vi.fn(), // Mock useEditor at the top level
  };
});


// --- Mocks for exportCanvas test suite START ---
// This vi.mock is specifically for the 'exportCanvas' describe block later.
// It is designed to mock the dependencies of exportCanvas for focused testing of exportCanvas itself.
vi.mock('./export-utils', async (importActual) => {
  const actual = await importActual<typeof ExportUtilsModule>();
  return {
    ...actual, // IMPORTANT: Start with actual implementations
    // Then, selectively mock functions that exportCanvas calls internally FOR THE exportCanvas SUITE ONLY
    // These mocks will be restored by vi.restoreAllMocks() in exportCanvas's afterEach
    convertShapesToCanvasItems: vi.fn(),
    extractConnectionsFromArrows: vi.fn(),
    generateMermaidC4: vi.fn(),
    generateMermaidArchitecture: vi.fn(),
    generateJSON: vi.fn(),
    generateTerraform: vi.fn(),
    generateMermaidFlowchart: vi.fn(),
    // Note: `exportCanvas` itself is NOT mocked here, we test its actual implementation.
    // `useCanvasExport` is also not mocked here.
  };
});

// Typed mocks for the exportCanvas test suite
const mockedConvertShapesToCanvasItems = ExportUtilsModule.convertShapesToCanvasItems as vi.MockedFunction<typeof ExportUtilsModule.convertShapesToCanvasItems>;
const mockedExtractConnectionsFromArrows = ExportUtilsModule.extractConnectionsFromArrows as vi.MockedFunction<typeof ExportUtilsModule.extractConnectionsFromArrows>;
const mockedGenerateMermaidC4 = ExportUtilsModule.generateMermaidC4 as vi.MockedFunction<typeof ExportUtilsModule.generateMermaidC4>;
const mockedGenerateMermaidArchitecture = ExportUtilsModule.generateMermaidArchitecture as vi.MockedFunction<typeof ExportUtilsModule.generateMermaidArchitecture>;
const mockedGenerateJSON = ExportUtilsModule.generateJSON as vi.MockedFunction<typeof ExportUtilsModule.generateJSON>;
const mockedGenerateTerraform = ExportUtilsModule.generateTerraform as vi.MockedFunction<typeof ExportUtilsModule.generateTerraform>;
const mockedGenerateMermaidFlowchart = ExportUtilsModule.generateMermaidFlowchart as vi.MockedFunction<typeof ExportUtilsModule.generateMermaidFlowchart>;
// --- Mocks for exportCanvas test suite END ---


const mockEditorInstance = {
  getCurrentPageShapes: vi.fn(),
  getBindingsFromShape: vi.fn(),
} as unknown as TLEditor;

const createMockShape = (id: string, type: string = 'geo'): TLShape => ({
    id, type, x:0,y:0,rotation:0,index:'a1',parentId:'page:page',isLocked:false,props:{},meta:{}
}) as TLShape;

const createDummyExportData = (format: string = 'dummy') : ActualExportData => ({items: [], connections: [], metadata: {exportedAt: '2023-01-01T00:00:00Z', format, version: '1.0.0'}});


describe('Export Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useEditor as vi.Mock).mockReturnValue(mockEditorInstance);
  });

  // Restore all mocks after each test in the top-level describe to ensure isolation
  // between the 'exportCanvas' suite and the 'useCanvasExport' suite.
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should have a working test setup', () => { expect(true).toBe(true); });

  // --- Test suite for exportCanvas (uses the vi.mock('./export-utils', ...)) ---
  describe('exportCanvas (testing with mocked dependencies)', () => {
    const dummyShapes: TLShape[] = [createMockShape('s1')];
    const mockCanvasItems: CanvasItem[] = [{ id: 'item1', key: 'k1', label: 'L1', x:0,y:0, properties: {}, children: [], parentId: undefined, isBoundingBox: false }];
    const mockConnections: Connection[] = [{ id: 'conn1', from: 'f1', to: 't1', label: 'L2', properties: {} }];

    beforeEach(() => {
        // Setup mock implementations for functions called by exportCanvas
        mockedConvertShapesToCanvasItems.mockReturnValue(mockCanvasItems);
        mockedExtractConnectionsFromArrows.mockReturnValue(mockConnections);
        mockedGenerateJSON.mockReturnValue('json_result_for_export_canvas_test');
        mockedGenerateMermaidC4.mockReturnValue('c4_result_for_export_canvas_test');
        // ... mock other generators if they are tested in this suite directly
    });

    // afterEach for exportCanvas suite to restore its specific mocks if they were more global.
    // However, vi.restoreAllMocks() in the parent afterEach should handle this.

    it('should call convertShapesToCanvasItems and extractConnectionsFromArrows', () => {
        ExportUtilsModule.exportCanvas('json', mockEditorInstance, dummyShapes);
        expect(mockedConvertShapesToCanvasItems).toHaveBeenCalledWith(dummyShapes);
        expect(mockedExtractConnectionsFromArrows).toHaveBeenCalledWith(mockEditorInstance, dummyShapes);
    });

    it('should call the correct generator (e.g., generateJSON)', () => {
        ExportUtilsModule.exportCanvas('json', mockEditorInstance, dummyShapes);
        expect(mockedGenerateJSON).toHaveBeenCalledTimes(1);
        const callArg = mockedGenerateJSON.mock.calls[0][0];
        expect(callArg.items).toEqual(mockCanvasItems);
        expect(callArg.connections).toEqual(mockConnections);
        expect(callArg.metadata.format).toBe('json');
    });
    // ... other tests for exportCanvas using its mocked dependencies
  });


  // --- Test suite for useCanvasExport (should use actual exportCanvas) ---
  describe('useCanvasExport (testing with actual exportCanvas)', () => {
    let dummyShapes: TLShape[];
    let mockAnchorElement: HTMLAnchorElement;
    let mockCreateObjectURL: vi.Mock;
    let mockRevokeObjectURL: vi.Mock;
    let exportCanvasActualSpy: vi.Spied<typeof ExportUtilsModule.exportCanvas>;


    beforeEach(() => {
        // vi.restoreAllMocks() in parent afterEach should have reset mocks of generateXYZ functions.
        // So, exportCanvas called by useCanvasExport should use actual generators.

        dummyShapes = [createMockShape('s1-ucx'), createMockShape('s2-ucx')];
        (mockEditorInstance.getCurrentPageShapes as vi.Mock).mockReturnValue(dummyShapes);

        mockAnchorElement = {
            href: '',
            download: '',
            click: vi.fn(),
            setAttribute: vi.fn(),
            removeAttribute: vi.fn(),
        } as unknown as HTMLAnchorElement;

        vi.spyOn(document, 'createElement').mockReturnValue(mockAnchorElement);
        vi.spyOn(document.body, 'appendChild').mockImplementation(() => {}); // Mock to avoid actual DOM manipulation
        vi.spyOn(document.body, 'removeChild').mockImplementation(() => {});


        mockCreateObjectURL = vi.fn().mockReturnValue('blob:http://localhost/mock-url-ucx');
        mockRevokeObjectURL = vi.fn();
        global.URL.createObjectURL = mockCreateObjectURL;
        global.URL.revokeObjectURL = mockRevokeObjectURL;

        // Spy on the *actual* exportCanvas for this suite
        exportCanvasActualSpy = vi.spyOn(ExportUtilsModule, 'exportCanvas').mockImplementation(
            (format, _editor, _shapes) => `${format}_actual_export_result`
        );
    });

    // afterEach for useCanvasExport suite to clean up its specific spies
    afterEach(() => {
       exportCanvasActualSpy.mockRestore(); // Restore original exportCanvas
       // Other spies on document, URL are restored by parent's vi.restoreAllMocks()
    });

    it('exportToFormat should call editor.getCurrentPageShapes and exportCanvas with correct arguments', () => {
      const { exportToFormat } = ExportUtilsModule.useCanvasExport();
      const result = exportToFormat('json');

      expect(mockEditorInstance.getCurrentPageShapes).toHaveBeenCalled();
      expect(exportCanvasActualSpy).toHaveBeenCalledWith('json', mockEditorInstance, dummyShapes);
      expect(result).toBe('json_actual_export_result');
    });

    it('downloadExport should call exportToFormat and trigger download with custom filename', async () => {
      // Need to spy on the hook's own exportToFormat method
      const hookInstance = ExportUtilsModule.useCanvasExport();
      const exportToFormatSpy = vi.spyOn(hookInstance, 'exportToFormat').mockReturnValue('file content for download');

      await hookInstance.downloadExport('json', 'custom-file.json');

      expect(exportToFormatSpy).toHaveBeenCalledWith('json');
      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(mockCreateObjectURL).toHaveBeenCalledWith(expect.any(Blob));
      const blobArg = mockCreateObjectURL.mock.calls[0][0] as Blob;
      expect(await blobArg.text()).toBe('file content for download'); // Check blob content
      expect(mockAnchorElement.href).toBe('blob:http://localhost/mock-url-ucx');
      expect(mockAnchorElement.download).toBe('custom-file.json');
      expect(document.body.appendChild).toHaveBeenCalledWith(mockAnchorElement);
      expect(mockAnchorElement.click).toHaveBeenCalled();
      expect(document.body.removeChild).toHaveBeenCalledWith(mockAnchorElement);
      expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:http://localhost/mock-url-ucx');

      exportToFormatSpy.mockRestore();
    });

    it('downloadExport should use default filename if none provided', async () => {
      const hookInstance = ExportUtilsModule.useCanvasExport();
      const exportToFormatSpy = vi.spyOn(hookInstance, 'exportToFormat').mockReturnValue('default filename content');

      await hookInstance.downloadExport('mermaid-c4'); // No filename

      const expectedFormatInfo = EXPORT_FORMATS.find(f => f.id === 'mermaid-c4');
      const expectedFilename = `infrastructure-diagram.${expectedFormatInfo?.extension || 'txt'}`;

      expect(mockAnchorElement.download).toBe(expectedFilename);
      exportToFormatSpy.mockRestore();
    });

    it('availableFormats should return the EXPORT_FORMATS constant', () => {
        const { availableFormats } = ExportUtilsModule.useCanvasExport();
        expect(availableFormats).toEqual(EXPORT_FORMATS);
    });
  });

  // Placeholder for actual implementation tests of individual generators (run if not in exportCanvas suite)
  // These should be outside the 'exportCanvas (testing with mocked dependencies)' describe block
  // and ensure they are testing the non-mocked versions.
  describe('generateJSON (actual implementation)', () => {
    it('should produce valid JSON output', () => {
        const result = ExportUtilsModule.generateJSON(createDummyExportData('json'));
        expect(() => JSON.parse(result)).not.toThrow();
        expect(JSON.parse(result).metadata.format).toBe('json');
    });
  });
  // Add similar actual implementation test blocks for other generators if needed,
  // ensuring they run when the top-level vi.mock('./export-utils') is not active or has been restored.

});
```
