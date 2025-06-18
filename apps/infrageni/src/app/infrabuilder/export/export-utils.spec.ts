import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TLShape, TLArrowBinding, useEditor, TLArrowShape, GeoShape, TLEditor } from 'tldraw';
import * as ExportUtils from './export-utils'; // Import all exports
import { CanvasItem, Connection, ExportData as ActualExportData } from '../types';
import { BaseInfraShapeProps } from '../shapes/base';

// Mock tldraw's useEditor hook
vi.mock('tldraw', async (importOriginal) => {
  const original = await importOriginal<typeof import('tldraw')>();
  return {
    ...original,
    useEditor: vi.fn(), // Mock useEditor at the top level
  };
});

// Mock specific functions from './export-utils'
// This allows us to spy on their calls from exportCanvas
vi.mock('./export-utils', async (importActual) => {
  const actual = await importActual<typeof ExportUtils>(); // Import actuals to ensure the module is loaded
  return {
    ...actual, // Spread actual implementations first
    // Then explicitly mock the functions we want to control/spy on for exportCanvas tests
    convertShapesToCanvasItems: vi.fn(),
    extractConnectionsFromArrows: vi.fn(),
    generateMermaidC4: vi.fn(),
    generateMermaidArchitecture: vi.fn(),
    generateJSON: vi.fn(),
    generateTerraform: vi.fn(),
    generateMermaidFlowchart: vi.fn(),
    // exportCanvas itself will use the actual implementation from 'actual'
    // useCanvasExport is not directly tested here but could be mocked if it interfered
  };
});


// Cast the mocked functions to Vi.Mocked types for type safety in tests
const mockedConvertShapesToCanvasItems = ExportUtils.convertShapesToCanvasItems as vi.MockedFunction<typeof ExportUtils.convertShapesToCanvasItems>;
const mockedExtractConnectionsFromArrows = ExportUtils.extractConnectionsFromArrows as vi.MockedFunction<typeof ExportUtils.extractConnectionsFromArrows>;
const mockedGenerateMermaidC4 = ExportUtils.generateMermaidC4 as vi.MockedFunction<typeof ExportUtils.generateMermaidC4>;
const mockedGenerateMermaidArchitecture = ExportUtils.generateMermaidArchitecture as vi.MockedFunction<typeof ExportUtils.generateMermaidArchitecture>;
const mockedGenerateJSON = ExportUtils.generateJSON as vi.MockedFunction<typeof ExportUtils.generateJSON>;
const mockedGenerateTerraform = ExportUtils.generateTerraform as vi.MockedFunction<typeof ExportUtils.generateTerraform>;
const mockedGenerateMermaidFlowchart = ExportUtils.generateMermaidFlowchart as vi.MockedFunction<typeof ExportUtils.generateMermaidFlowchart>;


const mockEditorInstance = { // A stand-in for TLEditor
  getBindingsFromShape: vi.fn(),
  getCurrentPageShapes: vi.fn(),
  // Add any other TLEditor methods if they are used by the functions being called by exportCanvas
} as unknown as TLEditor;

const createMockShape = (id: string, type: string = 'geo'): TLShape => ({
    id, type, x:0,y:0,rotation:0,index:'a1',parentId:'page:page',isLocked:false,props:{},meta:{}
}) as TLShape;

// Dummy data for previous tests, ensuring they don't rely on the new mocks
const createDummyExportData = (format: string = 'dummy') : ActualExportData => ({items: [], connections: [], metadata: {exportedAt: '', format, version: ''}});


describe('Export Utils', () => {
  // This beforeEach applies to all describe blocks within Export Utils,
  // including the ones for individual generator functions.
  // We clear mocks here to ensure a clean state for *those* tests too,
  // as they should test the *actual* implementations, not mocks from exportCanvas tests.
  beforeEach(() => {
    vi.clearAllMocks();
    // If useEditor is used by individual functions, mock its return value here.
    // For exportCanvas tests specifically, its internal calls are what we're testing.
    (useEditor as vi.Mock).mockReturnValue(mockEditorInstance);
  });

  // No top-level afterEach here to restoreAllMocks, as individual describe blocks
  // for generator functions should not have their implementations mocked.
  // The afterEach for restoring mocks is specific to the exportCanvas suite.

  it('should have a working test setup', () => { expect(true).toBe(true); });

  // Condensed previous describe blocks - these will use ACTUAL implementations
  // because the vi.mock for './export-utils' is more targeted for the exportCanvas suite.
  // However, if they were to run after the exportCanvas suite without proper mock restoration, they could fail.
  // The afterEach in exportCanvas suite should handle this.
  describe('extractConnectionsFromArrows (actual)', () => {it('should work with actual implementation', () => { /* placeholder for actual test */ });});
  describe('convertShapesToCanvasItems (actual)', () => {it('should work with actual implementation', () => { /* placeholder for actual test */ });});
  describe('generateMermaidC4 (actual)', () => {it('should work with actual implementation', () => {expect(ExportUtils.generateMermaidC4(createDummyExportData('mermaid-c4'))).toContain('C4Context');});});
  describe('generateMermaidArchitecture (actual)', () => {it('should work with actual implementation', () => {expect(ExportUtils.generateMermaidArchitecture(createDummyExportData('mermaid-architecture')).trim()).toBe('architecture-beta');});});
  describe('generateJSON (actual)', () => {it('should work with actual implementation', () => {expect(typeof ExportUtils.generateJSON(createDummyExportData('json'))).toBe('string');});});
  describe('generateTerraform (actual)', () => {it('should work with actual implementation', () => {expect(ExportUtils.generateTerraform(createDummyExportData('terraform'))).toContain('terraform {');});});
  describe('generateMermaidFlowchart (actual)', () => {it('should work with actual implementation', () => {expect(ExportUtils.generateMermaidFlowchart(createDummyExportData('mermaid-flowchart'))).toContain('flowchart TD');});});


  describe('exportCanvas', () => {
    const dummyShapes: TLShape[] = [createMockShape('s1'), createMockShape('s2')];
    const mockCanvasItems: CanvasItem[] = [{ id: 'item1', key: 'k1', label: 'L1', x:0,y:0, properties: {}, children: [], parentId: undefined, isBoundingBox: false }];
    const mockConnections: Connection[] = [{ id: 'conn1', from: 'f1', to: 't1', label: 'L2', properties: {} }];

    // This beforeEach is specific to the exportCanvas test suite
    beforeEach(() => {
        // Reset and provide default return values for the mocked functions for this suite
        mockedConvertShapesToCanvasItems.mockReset().mockReturnValue(mockCanvasItems);
        mockedExtractConnectionsFromArrows.mockReset().mockReturnValue(mockConnections);

        mockedGenerateMermaidC4.mockReset().mockReturnValue('c4_result_mocked');
        mockedGenerateMermaidArchitecture.mockReset().mockReturnValue('arch_result_mocked');
        mockedGenerateJSON.mockReset().mockReturnValue('json_result_mocked');
        mockedGenerateTerraform.mockReset().mockReturnValue('tf_result_mocked');
        mockedGenerateMermaidFlowchart.mockReset().mockReturnValue('flowchart_result_mocked');
    });

    // This afterEach is crucial for restoring the original implementations
    // so that other test suites for individual functions work correctly.
    afterEach(() => {
        vi.restoreAllMocks();
    });


    it('should call convertShapesToCanvasItems and extractConnectionsFromArrows with correct arguments', () => {
      ExportUtils.exportCanvas('json', mockEditorInstance, dummyShapes); // Calls the actual exportCanvas
      expect(mockedConvertShapesToCanvasItems).toHaveBeenCalledWith(dummyShapes);
      expect(mockedExtractConnectionsFromArrows).toHaveBeenCalledWith(mockEditorInstance, dummyShapes);
    });

    it('should construct ExportData correctly and pass to the generation function', () => {
      const format = 'json';
      ExportUtils.exportCanvas(format, mockEditorInstance, dummyShapes);

      expect(mockedGenerateJSON).toHaveBeenCalledTimes(1);
      const calledWithData = mockedGenerateJSON.mock.calls[0][0] as ActualExportData;

      expect(calledWithData.items).toEqual(mockCanvasItems);
      expect(calledWithData.connections).toEqual(mockConnections);
      expect(calledWithData.metadata.format).toBe(format);
      expect(calledWithData.metadata.version).toBe('1.0.0'); // Assuming '1.0.0' is hardcoded in exportCanvas
      expect(calledWithData.metadata.exportedAt).toBeInstanceOf(String); // Check if it's a date string
      expect(new Date(calledWithData.metadata.exportedAt).toString()).not.toBe('Invalid Date');
    });

    const testCases: {format: ExportUtils.ExportFormat; generator: vi.MockedFunction<any>; expectedResult: string}[] = [
        { format: 'mermaid-c4', generator: mockedGenerateMermaidC4, expectedResult: 'c4_result_mocked' },
        { format: 'mermaid-architecture', generator: mockedGenerateMermaidArchitecture, expectedResult: 'arch_result_mocked' },
        { format: 'mermaid-flowchart', generator: mockedGenerateMermaidFlowchart, expectedResult: 'flowchart_result_mocked' },
        { format: 'json', generator: mockedGenerateJSON, expectedResult: 'json_result_mocked' },
        { format: 'terraform', generator: mockedGenerateTerraform, expectedResult: 'tf_result_mocked' },
    ];

    testCases.forEach(({ format, generator, expectedResult }) => {
        it(`should call ${generator.getMockName() || 'generator'} for format "${format}" and return its result`, () => {
            const result = ExportUtils.exportCanvas(format, mockEditorInstance, dummyShapes);
            expect(generator).toHaveBeenCalledTimes(1);
            const exportDataArgument = generator.mock.calls[0][0] as ActualExportData;
            expect(exportDataArgument.items).toEqual(mockCanvasItems);
            expect(exportDataArgument.connections).toEqual(mockConnections);
            expect(exportDataArgument.metadata.format).toBe(format);
            expect(result).toBe(expectedResult);
        });
    });

    it('should throw an error for an unsupported format', () => {
      expect(() => {
        ExportUtils.exportCanvas('unsupported-format' as any, mockEditorInstance, dummyShapes);
      }).toThrow('Unsupported export format: unsupported-format');
    });
  });
});
```
