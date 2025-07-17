import { InfraToolPlugin, ToolCategory, ToolContext, ToolParams, ToolResult } from '../core/plugin-system';
import { TLShape } from 'tldraw';
import { BaseInfraShapeProps } from '../../shapes/base';

export class HierarchicalLayoutTool implements InfraToolPlugin {
  id = 'hierarchical-layout';
  name = 'Hierarchical Layout';
  description = 'Automatically arrange infrastructure components in a hierarchical tree structure';
  category = ToolCategory.LAYOUT;
  version = '1.0.0';

  private context?: ToolContext;

  async initialize(context: ToolContext): Promise<void> {
    this.context = context;
    console.log('🌳 Hierarchical Layout Tool initialized');
  }

  async execute(params: ToolParams): Promise<ToolResult> {
    const { direction = 'top-down', spacing = 100, options = {} } = params;
    
    if (!this.context) {
      return {
        success: false,
        error: 'Tool not initialized'
      };
    }

    try {
      const startTime = Date.now();
      const { canvas, shapes } = this.context;
      
      // Filter out non-infrastructure shapes
      const infraShapes = shapes.filter(shape => shape.type.startsWith('infra-'));
      
      if (infraShapes.length === 0) {
        return {
          success: false,
          error: 'No infrastructure shapes found to layout'
        };
      }

      // Apply hierarchical layout
      const layoutResult = await this.applyHierarchicalLayout(infraShapes, direction, spacing, options);
      
      // Update shapes on canvas
      for (const update of layoutResult.updates) {
        canvas.updateShape(update);
      }

      const executionTime = Date.now() - startTime;

      return {
        success: true,
        data: {
          shapesProcessed: layoutResult.updates.length,
          layout: 'hierarchical',
          direction,
          spacing
        },
        metadata: {
          executionTime,
          processingStats: {
            shapesProcessed: layoutResult.updates.length,
            containersProcessed: layoutResult.containers.length,
            levels: layoutResult.levels,
            algorithm: 'hierarchical'
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during layout'
      };
    }
  }

  private async applyHierarchicalLayout(
    shapes: TLShape[],
    direction: string,
    spacing: number,
    options: any
  ): Promise<LayoutResult> {
    const { canvas } = this.context!;
    
    // Build hierarchy tree
    const hierarchy = this.buildHierarchy(shapes);
    
    // Calculate positions for each level
    const levelPositions = this.calculateLevelPositions(hierarchy, direction, spacing, options);
    
    // Generate shape updates
    const updates: any[] = [];
    const processedContainers: string[] = [];
    
    for (const level of levelPositions) {
      for (const node of level.nodes) {
        const shape = shapes.find(s => s.id === node.id);
        if (shape) {
          const currentProps = shape.props as BaseInfraShapeProps;
          
          // Update position
          updates.push({
            id: shape.id,
            type: shape.type,
            x: node.x,
            y: node.y,
            props: currentProps
          });
          
          if (currentProps.isBoundingBox) {
            processedContainers.push(shape.id);
          }
        }
      }
    }
    
    return {
      updates,
      containers: processedContainers,
      levels: levelPositions.length
    };
  }

  private buildHierarchy(shapes: TLShape[]): HierarchyNode[] {
    const nodeMap = new Map<string, HierarchyNode>();
    const roots: HierarchyNode[] = [];
    
    // Create nodes for all shapes
    for (const shape of shapes) {
      const props = shape.props as BaseInfraShapeProps;
      const node: HierarchyNode = {
        id: shape.id,
        shape,
        isContainer: props.isBoundingBox || false,
        children: [],
        parent: null,
        level: 0,
        x: shape.x,
        y: shape.y,
        width: props.w || 120,
        height: props.h || 80
      };
      nodeMap.set(shape.id, node);
    }
    
    // Build parent-child relationships
    for (const shape of shapes) {
      const props = shape.props as BaseInfraShapeProps;
      const node = nodeMap.get(shape.id)!;
      
      // Find parent based on spatial containment for bounding boxes
      if (props.isBoundingBox) {
        // This is a container, find its parent container
        const parentContainer = this.findParentContainer(shape, shapes);
        if (parentContainer) {
          const parentNode = nodeMap.get(parentContainer.id);
          if (parentNode) {
            node.parent = parentNode;
            parentNode.children.push(node);
          }
        } else {
          roots.push(node);
        }
      } else {
        // This is a regular shape, find containing bounding box
        const parentContainer = this.findContainingContainer(shape, shapes);
        if (parentContainer) {
          const parentNode = nodeMap.get(parentContainer.id);
          if (parentNode) {
            node.parent = parentNode;
            parentNode.children.push(node);
          }
        } else {
          roots.push(node);
        }
      }
    }
    
    // Calculate levels
    this.calculateLevels(roots, 0);
    
    return roots;
  }

  private findParentContainer(shape: TLShape, shapes: TLShape[]): TLShape | null {
    const currentProps = shape.props as BaseInfraShapeProps;
    const shapeCenterX = shape.x + currentProps.w / 2;
    const shapeCenterY = shape.y + currentProps.h / 2;
    
    for (const otherShape of shapes) {
      if (otherShape.id === shape.id) continue;
      
      const otherProps = otherShape.props as BaseInfraShapeProps;
      if (!otherProps.isBoundingBox) continue;
      
      // Check if this shape is contained within the other shape
      const isContained = 
        shapeCenterX >= otherShape.x &&
        shapeCenterX <= otherShape.x + otherProps.w &&
        shapeCenterY >= otherShape.y &&
        shapeCenterY <= otherShape.y + otherProps.h;
      
      if (isContained) {
        return otherShape;
      }
    }
    
    return null;
  }

  private findContainingContainer(shape: TLShape, shapes: TLShape[]): TLShape | null {
    const currentProps = shape.props as BaseInfraShapeProps;
    const shapeCenterX = shape.x + currentProps.w / 2;
    const shapeCenterY = shape.y + currentProps.h / 2;
    
    for (const otherShape of shapes) {
      if (otherShape.id === shape.id) continue;
      
      const otherProps = otherShape.props as BaseInfraShapeProps;
      if (!otherProps.isBoundingBox) continue;
      
      // Check if this shape is contained within the other shape
      const isContained = 
        shapeCenterX >= otherShape.x &&
        shapeCenterX <= otherShape.x + otherProps.w &&
        shapeCenterY >= otherShape.y &&
        shapeCenterY <= otherShape.y + otherProps.h;
      
      if (isContained) {
        return otherShape;
      }
    }
    
    return null;
  }

  private calculateLevels(nodes: HierarchyNode[], level: number): void {
    for (const node of nodes) {
      node.level = level;
      this.calculateLevels(node.children, level + 1);
    }
  }

  private calculateLevelPositions(
    hierarchy: HierarchyNode[],
    direction: string,
    spacing: number,
    options: any
  ): LevelPosition[] {
    const levels: LevelPosition[] = [];
    const { startX = 50, startY = 50, containerPadding = 50 } = options;
    
    // Flatten hierarchy into levels
    const levelNodes = this.flattenToLevels(hierarchy);
    
    // Calculate positions for each level
    for (let levelIndex = 0; levelIndex < levelNodes.length; levelIndex++) {
      const nodes = levelNodes[levelIndex];
      const levelPosition: LevelPosition = {
        level: levelIndex,
        nodes: []
      };
      
      // Calculate positions based on direction
      if (direction === 'top-down') {
        const y = startY + levelIndex * (spacing + 100);
        let x = startX;
        
        for (const node of nodes) {
          levelPosition.nodes.push({
            id: node.id,
            x: x,
            y: y,
            width: node.width,
            height: node.height
          });
          
          x += node.width + spacing;
        }
      } else if (direction === 'left-right') {
        const x = startX + levelIndex * (spacing + 150);
        let y = startY;
        
        for (const node of nodes) {
          levelPosition.nodes.push({
            id: node.id,
            x: x,
            y: y,
            width: node.width,
            height: node.height
          });
          
          y += node.height + spacing;
        }
      }
      
      levels.push(levelPosition);
    }
    
    // Adjust container positions to accommodate children
    this.adjustContainerPositions(levels, hierarchy, containerPadding);
    
    return levels;
  }

  private flattenToLevels(nodes: HierarchyNode[]): HierarchyNode[][] {
    const levels: HierarchyNode[][] = [];
    
    const addToLevel = (node: HierarchyNode, level: number) => {
      if (!levels[level]) {
        levels[level] = [];
      }
      levels[level].push(node);
      
      for (const child of node.children) {
        addToLevel(child, level + 1);
      }
    };
    
    for (const node of nodes) {
      addToLevel(node, 0);
    }
    
    return levels;
  }

  private adjustContainerPositions(
    levels: LevelPosition[],
    hierarchy: HierarchyNode[],
    containerPadding: number
  ): void {
    // For containers, adjust size to accommodate children
    for (const level of levels) {
      for (const nodePos of level.nodes) {
        const hierarchyNode = this.findHierarchyNode(hierarchy, nodePos.id);
        if (hierarchyNode && hierarchyNode.isContainer && hierarchyNode.children.length > 0) {
          // Calculate bounding box of children
          const childBounds = this.calculateChildrenBounds(hierarchyNode, levels);
          
          // Adjust container position and size
          nodePos.x = childBounds.minX - containerPadding;
          nodePos.y = childBounds.minY - containerPadding;
          nodePos.width = childBounds.maxX - childBounds.minX + 2 * containerPadding;
          nodePos.height = childBounds.maxY - childBounds.minY + 2 * containerPadding;
        }
      }
    }
  }

  private findHierarchyNode(hierarchy: HierarchyNode[], id: string): HierarchyNode | null {
    for (const node of hierarchy) {
      if (node.id === id) return node;
      
      const found = this.findHierarchyNodeRecursive(node.children, id);
      if (found) return found;
    }
    return null;
  }

  private findHierarchyNodeRecursive(nodes: HierarchyNode[], id: string): HierarchyNode | null {
    for (const node of nodes) {
      if (node.id === id) return node;
      
      const found = this.findHierarchyNodeRecursive(node.children, id);
      if (found) return found;
    }
    return null;
  }

  private calculateChildrenBounds(node: HierarchyNode, levels: LevelPosition[]): ChildBounds {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    
    const processChildren = (children: HierarchyNode[]) => {
      for (const child of children) {
        // Find child position in levels
        for (const level of levels) {
          const childPos = level.nodes.find(n => n.id === child.id);
          if (childPos) {
            minX = Math.min(minX, childPos.x);
            minY = Math.min(minY, childPos.y);
            maxX = Math.max(maxX, childPos.x + childPos.width);
            maxY = Math.max(maxY, childPos.y + childPos.height);
          }
        }
        
        // Process grandchildren
        processChildren(child.children);
      }
    };
    
    processChildren(node.children);
    
    return { minX, minY, maxX, maxY };
  }
}

// Helper interfaces
interface HierarchyNode {
  id: string;
  shape: TLShape;
  isContainer: boolean;
  children: HierarchyNode[];
  parent: HierarchyNode | null;
  level: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface LevelPosition {
  level: number;
  nodes: {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }[];
}

interface ChildBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

interface LayoutResult {
  updates: any[];
  containers: string[];
  levels: number;
}