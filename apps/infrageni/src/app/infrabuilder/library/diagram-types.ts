export interface DiagramTemplate {
  id: string;
  name: string;
  description: string;
  category: 'web-architecture' | 'microservices' | 'data-pipeline' | 'networking' | 'custom';
  tags: string[];
  provider: 'aws' | 'azure' | 'gcp' | 'generic';
  thumbnail?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // minutes
  data: {
    items: any[];
    connections: any[];
    canvasState: any;
  };
  createdAt: string;
  updatedAt: string;
  author?: string;
  isPublic: boolean;
  downloadCount: number;
  rating: number;
}

export interface SavedDiagram {
  id: string;
  name: string;
  description?: string;
  data: {
    items: any[];
    connections: any[];
    canvasState: any;
    animationSequences?: any[];
  };
  thumbnail?: string;
  provider: 'aws' | 'azure' | 'gcp' | 'generic';
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isAutoSave: boolean;
  version: number;
}

export interface DiagramLibraryState {
  templates: DiagramTemplate[];
  savedDiagrams: SavedDiagram[];
  currentDiagram?: SavedDiagram;
  searchQuery: string;
  selectedCategory: string;
  selectedProvider: string;
  sortBy: 'name' | 'date' | 'rating' | 'downloads';
  sortOrder: 'asc' | 'desc';
  isLoading: boolean;
  error?: string;
}

export interface ImportResult {
  success: boolean;
  diagram?: SavedDiagram;
  error?: string;
}

export interface ExportOptions {
  includeAnimations: boolean;
  includeMetadata: boolean;
  format: 'json' | 'compressed';
}