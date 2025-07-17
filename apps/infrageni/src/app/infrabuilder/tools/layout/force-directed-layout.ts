import { InfraToolPlugin, ToolCategory, ToolContext, ToolParams, ToolResult } from '../core/plugin-system';
import { TLShape } from 'tldraw';
import { BaseInfraShapeProps } from '../../shapes/base';

export class ForceDirectedLayoutTool implements InfraToolPlugin {
  id = 'force-directed-layout';
  name = 'Force-Directed Layout';
  description = 'Automatically arrange infrastructure components using force-directed simulation';
  category = ToolCategory.LAYOUT;
  version = '1.0.0';

  private context?: ToolContext;

  async initialize(context: ToolContext): Promise<void> {
    this.context = context;
    console.log('⚡ Force-Directed Layout Tool initialized');
  }

  async execute(params: ToolParams): Promise<ToolResult> {
    const { 
      iterations = 300, 
      repulsionStrength = 1000, 
      attractionStrength = 0.1,
      containerConstraints = true,
      options = {} 
    } = params;
    
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

      // Apply force-directed layout
      const layoutResult = await this.applyForceDirectedLayout(
        infraShapes, 
        iterations, 
        repulsionStrength, 
        attractionStrength,
        containerConstraints,
        options
      );
      
      // Update shapes on canvas
      for (const update of layoutResult.updates) {
        canvas.updateShape(update);
      }

      const executionTime = Date.now() - startTime;

      return {
        success: true,
        data: {
          shapesProcessed: layoutResult.updates.length,
          layout: 'force-directed',
          iterations,
          finalEnergy: layoutResult.finalEnergy
        },
        metadata: {
          executionTime,
          processingStats: {
            shapesProcessed: layoutResult.updates.length,
            iterations: layoutResult.actualIterations,
            initialEnergy: layoutResult.initialEnergy,
            finalEnergy: layoutResult.finalEnergy,
            algorithm: 'force-directed'
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

  private async applyForceDirectedLayout(
    shapes: TLShape[],
    iterations: number,
    repulsionStrength: number,
    attractionStrength: number,
    containerConstraints: boolean,
    options: any
  ): Promise<ForceLayoutResult> {
    const { canvas } = this.context!;
    
    // Create simulation nodes
    const nodes = this.createSimulationNodes(shapes);
    const edges = this.createSimulationEdges(shapes, nodes);
    
    // Initialize positions
    this.initializePositions(nodes, options);
    
    // Run simulation
    const simulation = new ForceSimulation(nodes, edges, {
      repulsionStrength,
      attractionStrength,
      containerConstraints,
      damping: 0.9,
      timeStep: 0.1,
      ...options
    });
    
    const initialEnergy = simulation.calculateTotalEnergy();
    let actualIterations = 0;
    
    // Simulate
    for (let i = 0; i < iterations; i++) {
      simulation.step();
      actualIterations++;
      
      // Early termination if energy is low enough
      if (simulation.calculateTotalEnergy() < 0.01) {
        break;
      }
    }
    
    const finalEnergy = simulation.calculateTotalEnergy();
    
    // Generate shape updates
    const updates = this.generateShapeUpdates(shapes, nodes);
    
    return {
      updates,
      actualIterations,
      initialEnergy,
      finalEnergy
    };
  }

  private createSimulationNodes(shapes: TLShape[]): SimulationNode[] {
    return shapes.map(shape => {
      const props = shape.props as BaseInfraShapeProps;
      return {
        id: shape.id,
        x: shape.x,
        y: shape.y,
        vx: 0,
        vy: 0,
        fx: 0,
        fy: 0,
        mass: this.calculateMass(shape),
        width: props.w || 120,
        height: props.h || 80,
        isContainer: props.isBoundingBox || false,
        shape: shape,
        fixed: false
      };
    });
  }

  private createSimulationEdges(shapes: TLShape[], nodes: SimulationNode[]): SimulationEdge[] {
    const edges: SimulationEdge[] = [];
    const nodeMap = new Map<string, SimulationNode>();
    
    for (const node of nodes) {
      nodeMap.set(node.id, node);
    }
    
    // Create edges based on container relationships
    for (const shape of shapes) {
      const props = shape.props as BaseInfraShapeProps;
      if (!props.isBoundingBox) {
        // Find containing container
        const containerShape = this.findContainingContainer(shape, shapes);
        if (containerShape) {
          const sourceNode = nodeMap.get(shape.id);
          const targetNode = nodeMap.get(containerShape.id);
          
          if (sourceNode && targetNode) {
            edges.push({
              source: sourceNode,
              target: targetNode,
              strength: 0.5,
              restLength: 100,
              type: 'containment'
            });
          }
        }
      }
    }
    
    // Create edges based on spatial proximity (for non-container relationships)
    for (let i = 0; i < shapes.length; i++) {
      for (let j = i + 1; j < shapes.length; j++) {
        const shape1 = shapes[i];
        const shape2 = shapes[j];
        const props1 = shape1.props as BaseInfraShapeProps;
        const props2 = shape2.props as BaseInfraShapeProps;
        
        // Skip if either is a container
        if (props1.isBoundingBox || props2.isBoundingBox) continue;
        
        // Check if they're close enough to warrant a weak connection
        const distance = this.calculateDistance(shape1, shape2);
        if (distance < 300) { // Threshold for proximity
          const node1 = nodeMap.get(shape1.id);
          const node2 = nodeMap.get(shape2.id);
          
          if (node1 && node2) {
            edges.push({
              source: node1,
              target: node2,
              strength: 0.1,
              restLength: 150,
              type: 'proximity'
            });
          }
        }
      }
    }
    
    return edges;
  }

  private initializePositions(nodes: SimulationNode[], options: any): void {
    const { width = 800, height = 600, randomSeed = Math.random() } = options;
    
    // Simple random initialization
    for (const node of nodes) {
      if (!node.fixed) {
        node.x = Math.random() * width;
        node.y = Math.random() * height;
      }
    }
  }

  private calculateMass(shape: TLShape): number {
    const props = shape.props as BaseInfraShapeProps;
    const resourceType = shape.type.replace('infra-', '');
    
    // Mass affects how much the node resists forces
    const baseMass = (props.w || 120) * (props.h || 80) / 10000;
    
    // Adjust based on resource type
    const typeMultipliers = {
      'database': 2.0,
      'load-balancer': 1.8,
      'compute': 1.5,
      'storage': 1.2,
      'user': 0.8,
      'external-system': 0.9
    };
    
    const multiplier = typeMultipliers[resourceType as keyof typeof typeMultipliers] || 1.0;
    return baseMass * multiplier;
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

  private calculateDistance(shape1: TLShape, shape2: TLShape): number {
    const props1 = shape1.props as BaseInfraShapeProps;
    const props2 = shape2.props as BaseInfraShapeProps;
    
    const center1X = shape1.x + (props1.w || 120) / 2;
    const center1Y = shape1.y + (props1.h || 80) / 2;
    const center2X = shape2.x + (props2.w || 120) / 2;
    const center2Y = shape2.y + (props2.h || 80) / 2;
    
    return Math.sqrt(Math.pow(center2X - center1X, 2) + Math.pow(center2Y - center1Y, 2));
  }

  private generateShapeUpdates(shapes: TLShape[], nodes: SimulationNode[]): any[] {
    const updates: any[] = [];
    const nodeMap = new Map<string, SimulationNode>();
    
    for (const node of nodes) {
      nodeMap.set(node.id, node);
    }
    
    for (const shape of shapes) {
      const node = nodeMap.get(shape.id);
      if (node) {
        const props = shape.props as BaseInfraShapeProps;
        
        updates.push({
          id: shape.id,
          type: shape.type,
          x: Math.round(node.x),
          y: Math.round(node.y),
          props: props
        });
      }
    }
    
    return updates;
  }
}

// Force simulation implementation
class ForceSimulation {
  private nodes: SimulationNode[];
  private edges: SimulationEdge[];
  private options: SimulationOptions;

  constructor(nodes: SimulationNode[], edges: SimulationEdge[], options: SimulationOptions) {
    this.nodes = nodes;
    this.edges = edges;
    this.options = options;
  }

  step(): void {
    // Reset forces
    for (const node of this.nodes) {
      node.fx = 0;
      node.fy = 0;
    }
    
    // Apply repulsion forces
    this.applyRepulsionForces();
    
    // Apply attraction forces
    this.applyAttractionForces();
    
    // Apply container constraints
    if (this.options.containerConstraints) {
      this.applyContainerConstraints();
    }
    
    // Update positions
    this.updatePositions();
  }

  private applyRepulsionForces(): void {
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const node1 = this.nodes[i];
        const node2 = this.nodes[j];
        
        const dx = node2.x - node1.x;
        const dy = node2.y - node1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
          const force = this.options.repulsionStrength / (distance * distance);
          const fx = (dx / distance) * force;
          const fy = (dy / distance) * force;
          
          node1.fx -= fx;
          node1.fy -= fy;
          node2.fx += fx;
          node2.fy += fy;
        }
      }
    }
  }

  private applyAttractionForces(): void {
    for (const edge of this.edges) {
      const { source, target, strength, restLength } = edge;
      
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 0) {
        const force = strength * (distance - restLength);
        const fx = (dx / distance) * force;
        const fy = (dy / distance) * force;
        
        source.fx += fx;
        source.fy += fy;
        target.fx -= fx;
        target.fy -= fy;
      }
    }
  }

  private applyContainerConstraints(): void {
    // Keep nodes within their containers
    for (const node of this.nodes) {
      if (node.isContainer) continue;
      
      // Find containing container
      const container = this.findContainingContainer(node);
      if (container) {
        // Apply constraint force to keep node inside container
        const padding = 20;
        const minX = container.x + padding;
        const maxX = container.x + container.width - node.width - padding;
        const minY = container.y + padding;
        const maxY = container.y + container.height - node.height - padding;
        
        if (node.x < minX) node.fx += (minX - node.x) * 0.1;
        if (node.x > maxX) node.fx += (maxX - node.x) * 0.1;
        if (node.y < minY) node.fy += (minY - node.y) * 0.1;
        if (node.y > maxY) node.fy += (maxY - node.y) * 0.1;
      }
    }
  }

  private findContainingContainer(node: SimulationNode): SimulationNode | null {
    const nodeCenterX = node.x + node.width / 2;
    const nodeCenterY = node.y + node.height / 2;
    
    for (const container of this.nodes) {
      if (container.id === node.id || !container.isContainer) continue;
      
      const isContained = 
        nodeCenterX >= container.x &&
        nodeCenterX <= container.x + container.width &&
        nodeCenterY >= container.y &&
        nodeCenterY <= container.y + container.height;
      
      if (isContained) {
        return container;
      }
    }
    
    return null;
  }

  private updatePositions(): void {
    for (const node of this.nodes) {
      if (node.fixed) continue;
      
      // Update velocity with damping
      node.vx = (node.vx + node.fx * this.options.timeStep) * this.options.damping;
      node.vy = (node.vy + node.fy * this.options.timeStep) * this.options.damping;
      
      // Update position
      node.x += node.vx * this.options.timeStep;
      node.y += node.vy * this.options.timeStep;
    }
  }

  calculateTotalEnergy(): number {
    let energy = 0;
    
    for (const node of this.nodes) {
      energy += node.vx * node.vx + node.vy * node.vy;
    }
    
    return energy;
  }
}

// Helper interfaces
interface SimulationNode {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  fx: number;
  fy: number;
  mass: number;
  width: number;
  height: number;
  isContainer: boolean;
  shape: TLShape;
  fixed: boolean;
}

interface SimulationEdge {
  source: SimulationNode;
  target: SimulationNode;
  strength: number;
  restLength: number;
  type: 'containment' | 'proximity';
}

interface SimulationOptions {
  repulsionStrength: number;
  attractionStrength: number;
  containerConstraints: boolean;
  damping: number;
  timeStep: number;
}

interface ForceLayoutResult {
  updates: any[];
  actualIterations: number;
  initialEnergy: number;
  finalEnergy: number;
}