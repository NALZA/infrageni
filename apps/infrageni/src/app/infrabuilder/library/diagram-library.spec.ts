import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DiagramStorage } from './diagram-storage';
import { SavedDiagram, DiagramTemplate } from './diagram-types';

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// Mock LZString
vi.mock('lz-string', () => ({
  default: {
    compress: vi.fn((data) => `compressed:${data}`),
    decompress: vi.fn((data) => data?.replace('compressed:', '')),
  },
}));

// Setup localStorage mock
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

describe('DiagramStorage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('saveDiagram', () => {
    it('should save a new diagram', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      
      const diagram: SavedDiagram = {
        id: 'test-1',
        name: 'Test Diagram',
        data: {
          items: [],
          connections: [],
          canvasState: null,
        },
        provider: 'aws',
        tags: ['test'],
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
        isAutoSave: false,
        version: 1,
      };

      DiagramStorage.saveDiagram(diagram);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'infrageni-saved-diagrams',
        expect.stringContaining('compressed:')
      );
    });

    it('should update existing diagram', () => {
      const existingDiagram: SavedDiagram = {
        id: 'test-1',
        name: 'Old Name',
        data: { items: [], connections: [], canvasState: null },
        provider: 'aws',
        tags: [],
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
        isAutoSave: false,
        version: 1,
      };

      mockLocalStorage.getItem.mockReturnValue(
        `compressed:${JSON.stringify([existingDiagram])}`
      );

      const updatedDiagram: SavedDiagram = {
        ...existingDiagram,
        name: 'New Name',
      };

      DiagramStorage.saveDiagram(updatedDiagram);

      expect(mockLocalStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('getSavedDiagrams', () => {
    it('should return empty array when no diagrams exist', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      
      const diagrams = DiagramStorage.getSavedDiagrams();
      
      expect(diagrams).toEqual([]);
    });

    it('should return saved diagrams', () => {
      const testDiagrams: SavedDiagram[] = [
        {
          id: 'test-1',
          name: 'Test Diagram',
          data: { items: [], connections: [], canvasState: null },
          provider: 'aws',
          tags: ['test'],
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
          isAutoSave: false,
          version: 1,
        },
      ];

      mockLocalStorage.getItem.mockReturnValue(
        `compressed:${JSON.stringify(testDiagrams)}`
      );

      const diagrams = DiagramStorage.getSavedDiagrams();

      expect(diagrams).toEqual(testDiagrams);
    });
  });

  describe('deleteDiagram', () => {
    it('should remove diagram from storage', () => {
      const testDiagrams: SavedDiagram[] = [
        {
          id: 'test-1',
          name: 'Test Diagram 1',
          data: { items: [], connections: [], canvasState: null },
          provider: 'aws',
          tags: [],
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
          isAutoSave: false,
          version: 1,
        },
        {
          id: 'test-2',
          name: 'Test Diagram 2',
          data: { items: [], connections: [], canvasState: null },
          provider: 'aws',
          tags: [],
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
          isAutoSave: false,
          version: 1,
        },
      ];

      mockLocalStorage.getItem.mockReturnValue(
        `compressed:${JSON.stringify(testDiagrams)}`
      );

      DiagramStorage.deleteDiagram('test-1');

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'infrageni-saved-diagrams',
        expect.stringContaining('compressed:')
      );
    });
  });

  describe('getTemplates', () => {
    it('should return default templates when none exist', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      
      const templates = DiagramStorage.getTemplates();
      
      expect(templates).toHaveLength(2);
      expect(templates[0].name).toBe('AWS Web Application');
      expect(templates[1].name).toBe('Microservices Architecture');
    });

    it('should return saved templates', () => {
      const customTemplates: DiagramTemplate[] = [
        {
          id: 'custom-1',
          name: 'Custom Template',
          description: 'A custom template',
          category: 'custom',
          tags: ['custom'],
          provider: 'generic',
          difficulty: 'beginner',
          estimatedTime: 10,
          data: {
            items: [],
            connections: [],
            canvasState: null,
          },
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
          isPublic: false,
          downloadCount: 0,
          rating: 5,
        },
      ];

      mockLocalStorage.getItem.mockReturnValue(
        `compressed:${JSON.stringify(customTemplates)}`
      );

      const templates = DiagramStorage.getTemplates();

      expect(templates).toEqual(customTemplates);
    });
  });

  describe('autoSaveDiagram', () => {
    it('should save diagram as auto-save', () => {
      const diagramData = {
        items: [],
        connections: [],
        canvasState: null,
      };

      DiagramStorage.autoSaveDiagram(diagramData);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'infrageni-auto-save',
        expect.stringContaining('compressed:')
      );
    });
  });

  describe('importDiagram', () => {
    it('should import valid diagram', async () => {
      const validDiagram = {
        name: 'Imported Diagram',
        data: {
          items: [],
          connections: [],
          canvasState: null,
        },
      };

      // Mock File.prototype.text
      const mockFile = {
        text: vi.fn().mockResolvedValue(JSON.stringify(validDiagram)),
      } as unknown as File;

      mockLocalStorage.getItem.mockReturnValue(null);

      const result = await DiagramStorage.importDiagram(mockFile);

      expect(result.success).toBe(true);
      expect(result.diagram?.name).toBe('Imported Diagram (Imported)');
    });

    it('should reject invalid diagram', async () => {
      const invalidDiagram = {
        invalidField: 'test',
      };

      // Mock File.prototype.text
      const mockFile = {
        text: vi.fn().mockResolvedValue(JSON.stringify(invalidDiagram)),
      } as unknown as File;

      const result = await DiagramStorage.importDiagram(mockFile);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid diagram format');
    });
  });

  describe('clearStorage', () => {
    it('should clear all storage keys', () => {
      DiagramStorage.clearStorage();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('infrageni-saved-diagrams');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('infrageni-templates');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('infrageni-library-state');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('infrageni-auto-save');
    });
  });

  describe('getStorageInfo', () => {
    it('should return storage information', () => {
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'infrageni-saved-diagrams') {
          return `compressed:${JSON.stringify([{ id: 'test' }])}`;
        }
        if (key === 'infrageni-auto-save') {
          return `compressed:${JSON.stringify({ id: 'auto' })}`;
        }
        return null;
      });

      const info = DiagramStorage.getStorageInfo();

      expect(info.diagramsCount).toBe(1);
      expect(info.templatesCount).toBe(2); // Default templates
      expect(info.hasAutoSave).toBe(true);
      expect(info.storageUsed).toBeGreaterThan(0);
    });
  });
});