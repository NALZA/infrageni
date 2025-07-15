import { SavedDiagram, DiagramTemplate, ImportResult } from './diagram-types';
import LZString from 'lz-string';

const STORAGE_KEYS = {
  SAVED_DIAGRAMS: 'infrageni-saved-diagrams',
  TEMPLATES: 'infrageni-templates',
  LIBRARY_STATE: 'infrageni-library-state',
  AUTO_SAVE: 'infrageni-auto-save',
} as const;

export class DiagramStorage {
  // Save diagram to localStorage
  static saveDiagram(diagram: SavedDiagram): void {
    try {
      const existingDiagrams = this.getSavedDiagrams();
      const existingIndex = existingDiagrams.findIndex(d => d.id === diagram.id);
      
      if (existingIndex >= 0) {
        existingDiagrams[existingIndex] = {
          ...diagram,
          updatedAt: new Date().toISOString(),
          version: existingDiagrams[existingIndex].version + 1,
        };
      } else {
        existingDiagrams.push({
          ...diagram,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: 1,
        });
      }
      
      // Compress data before storing
      const compressed = LZString.compress(JSON.stringify(existingDiagrams));
      localStorage.setItem(STORAGE_KEYS.SAVED_DIAGRAMS, compressed);
    } catch (error) {
      console.error('Failed to save diagram:', error);
      throw new Error('Failed to save diagram to storage');
    }
  }

  // Load all saved diagrams
  static getSavedDiagrams(): SavedDiagram[] {
    try {
      const compressed = localStorage.getItem(STORAGE_KEYS.SAVED_DIAGRAMS);
      if (!compressed) return [];
      
      const decompressed = LZString.decompress(compressed);
      if (!decompressed) return [];
      
      return JSON.parse(decompressed);
    } catch (error) {
      console.error('Failed to load saved diagrams:', error);
      return [];
    }
  }

  // Get specific diagram by ID
  static getDiagram(id: string): SavedDiagram | null {
    const diagrams = this.getSavedDiagrams();
    return diagrams.find(d => d.id === id) || null;
  }

  // Delete diagram
  static deleteDiagram(id: string): void {
    try {
      const diagrams = this.getSavedDiagrams();
      const filtered = diagrams.filter(d => d.id !== id);
      
      const compressed = LZString.compress(JSON.stringify(filtered));
      localStorage.setItem(STORAGE_KEYS.SAVED_DIAGRAMS, compressed);
    } catch (error) {
      console.error('Failed to delete diagram:', error);
      throw new Error('Failed to delete diagram from storage');
    }
  }

  // Auto-save current diagram
  static autoSaveDiagram(diagramData: any): void {
    try {
      const autoSave: SavedDiagram = {
        id: 'auto-save',
        name: 'Auto-saved Diagram',
        data: diagramData,
        provider: 'generic',
        tags: ['auto-save'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isAutoSave: true,
        version: 1,
      };
      
      const compressed = LZString.compress(JSON.stringify(autoSave));
      localStorage.setItem(STORAGE_KEYS.AUTO_SAVE, compressed);
    } catch (error) {
      console.error('Failed to auto-save diagram:', error);
    }
  }

  // Load auto-saved diagram
  static getAutoSavedDiagram(): SavedDiagram | null {
    try {
      const compressed = localStorage.getItem(STORAGE_KEYS.AUTO_SAVE);
      if (!compressed) return null;
      
      const decompressed = LZString.decompress(compressed);
      if (!decompressed) return null;
      
      return JSON.parse(decompressed);
    } catch (error) {
      console.error('Failed to load auto-saved diagram:', error);
      return null;
    }
  }

  // Save templates
  static saveTemplates(templates: DiagramTemplate[]): void {
    try {
      const compressed = LZString.compress(JSON.stringify(templates));
      localStorage.setItem(STORAGE_KEYS.TEMPLATES, compressed);
    } catch (error) {
      console.error('Failed to save templates:', error);
      throw new Error('Failed to save templates to storage');
    }
  }

  // Load templates
  static getTemplates(): DiagramTemplate[] {
    try {
      const compressed = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
      if (!compressed) return this.getDefaultTemplates();
      
      const decompressed = LZString.decompress(compressed);
      if (!decompressed) return this.getDefaultTemplates();
      
      return JSON.parse(decompressed);
    } catch (error) {
      console.error('Failed to load templates:', error);
      return this.getDefaultTemplates();
    }
  }

  // Export diagram as file
  static exportDiagram(diagram: SavedDiagram, options: any = {}): void {
    try {
      const exportData = {
        ...diagram,
        metadata: {
          exportedAt: new Date().toISOString(),
          version: '1.0.0',
          application: 'InfraGeni',
        },
        options,
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${diagram.name.replace(/\s+/g, '-')}.infrageni.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export diagram:', error);
      throw new Error('Failed to export diagram');
    }
  }

  // Import diagram from file
  static async importDiagram(file: File): Promise<ImportResult> {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      // Validate the imported data
      if (!this.validateDiagramData(data)) {
        return {
          success: false,
          error: 'Invalid diagram format',
        };
      }
      
      // Create new diagram with unique ID
      const diagram: SavedDiagram = {
        ...data,
        id: `imported-${Date.now()}`,
        name: `${data.name} (Imported)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isAutoSave: false,
        version: 1,
      };
      
      // Save to storage
      this.saveDiagram(diagram);
      
      return {
        success: true,
        diagram,
      };
    } catch (error) {
      console.error('Failed to import diagram:', error);
      return {
        success: false,
        error: 'Failed to import diagram. Please check the file format.',
      };
    }
  }

  // Validate diagram data structure
  private static validateDiagramData(data: any): boolean {
    return (
      data &&
      typeof data.name === 'string' &&
      data.data &&
      Array.isArray(data.data.items) &&
      Array.isArray(data.data.connections) &&
      data.data.canvasState
    );
  }

  // Get default templates
  private static getDefaultTemplates(): DiagramTemplate[] {
    return [
      {
        id: 'web-app-aws',
        name: 'AWS Web Application',
        description: 'Standard 3-tier web application architecture on AWS',
        category: 'web-architecture',
        tags: ['web', 'aws', 'ec2', 'rds', 'alb'],
        provider: 'aws',
        difficulty: 'beginner',
        estimatedTime: 15,
        data: {
          items: [
            {
              id: 'vpc-1',
              label: 'Production VPC',
              x: 50,
              y: 50,
              key: 'vpc-vpc-1',
              isBoundingBox: true,
              properties: { w: 600, h: 400 },
            },
            {
              id: 'subnet-1',
              label: 'Public Subnet',
              x: 100,
              y: 100,
              key: 'subnet-subnet-1',
              isBoundingBox: true,
              parentId: 'vpc-1',
              properties: { w: 250, h: 150 },
            },
            {
              id: 'subnet-2',
              label: 'Private Subnet',
              x: 380,
              y: 100,
              key: 'subnet-subnet-2',
              isBoundingBox: true,
              parentId: 'vpc-1',
              properties: { w: 250, h: 150 },
            },
            {
              id: 'alb-1',
              label: 'Application Load Balancer',
              x: 150,
              y: 150,
              key: 'compute-alb-1',
              parentId: 'subnet-1',
              properties: { w: 150, h: 60 },
            },
            {
              id: 'ec2-1',
              label: 'Web Server',
              x: 430,
              y: 130,
              key: 'compute-ec2-1',
              parentId: 'subnet-2',
              properties: { w: 120, h: 60 },
            },
            {
              id: 'rds-1',
              label: 'Database',
              x: 430,
              y: 200,
              key: 'database-rds-1',
              parentId: 'subnet-2',
              properties: { w: 120, h: 60 },
            },
          ],
          connections: [
            {
              id: 'conn-1',
              from: 'alb-1',
              to: 'ec2-1',
              label: 'HTTP',
            },
            {
              id: 'conn-2',
              from: 'ec2-1',
              to: 'rds-1',
              label: 'SQL',
            },
          ],
          canvasState: null,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPublic: true,
        downloadCount: 0,
        rating: 5,
      },
      {
        id: 'microservices-generic',
        name: 'Microservices Architecture',
        description: 'Basic microservices architecture with API Gateway',
        category: 'microservices',
        tags: ['microservices', 'api-gateway', 'generic'],
        provider: 'generic',
        difficulty: 'intermediate',
        estimatedTime: 25,
        data: {
          items: [
            {
              id: 'api-gw-1',
              label: 'API Gateway',
              x: 200,
              y: 100,
              key: 'compute-api-gw-1',
              properties: { w: 150, h: 60 },
            },
            {
              id: 'service-1',
              label: 'User Service',
              x: 100,
              y: 200,
              key: 'compute-service-1',
              properties: { w: 120, h: 60 },
            },
            {
              id: 'service-2',
              label: 'Order Service',
              x: 300,
              y: 200,
              key: 'compute-service-2',
              properties: { w: 120, h: 60 },
            },
            {
              id: 'db-1',
              label: 'User DB',
              x: 100,
              y: 300,
              key: 'database-db-1',
              properties: { w: 120, h: 60 },
            },
            {
              id: 'db-2',
              label: 'Order DB',
              x: 300,
              y: 300,
              key: 'database-db-2',
              properties: { w: 120, h: 60 },
            },
          ],
          connections: [
            {
              id: 'conn-1',
              from: 'api-gw-1',
              to: 'service-1',
              label: 'REST API',
            },
            {
              id: 'conn-2',
              from: 'api-gw-1',
              to: 'service-2',
              label: 'REST API',
            },
            {
              id: 'conn-3',
              from: 'service-1',
              to: 'db-1',
              label: 'SQL',
            },
            {
              id: 'conn-4',
              from: 'service-2',
              to: 'db-2',
              label: 'SQL',
            },
          ],
          canvasState: null,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPublic: true,
        downloadCount: 0,
        rating: 4,
      },
    ];
  }

  // Clear all storage (for testing/reset)
  static clearStorage(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  // Get storage usage info
  static getStorageInfo() {
    const info = {
      diagramsCount: this.getSavedDiagrams().length,
      templatesCount: this.getTemplates().length,
      hasAutoSave: !!this.getAutoSavedDiagram(),
      storageUsed: 0,
    };
    
    // Calculate approximate storage usage
    Object.values(STORAGE_KEYS).forEach(key => {
      const item = localStorage.getItem(key);
      if (item) {
        info.storageUsed += item.length;
      }
    });
    
    return info;
  }
}