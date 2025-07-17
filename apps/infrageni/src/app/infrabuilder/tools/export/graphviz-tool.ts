import { InfraToolPlugin, ToolCategory, ToolContext, ToolParams, ToolResult } from '../core/plugin-system';
import { ExportData } from '../../export/export-utils';
import { CanvasItem, Connection } from '../../types';

export class GraphvizExportTool implements InfraToolPlugin {
  id = 'graphviz-export';
  name = 'Graphviz Export';
  description = 'Export infrastructure diagrams to Graphviz DOT format with advanced layout options';
  category = ToolCategory.EXPORT;
  version = '1.0.0';

  async initialize(context: ToolContext): Promise<void> {
    console.log('🎯 Graphviz Export Tool initialized');
  }

  async execute(params: ToolParams): Promise<ToolResult> {
    const { data, layout = 'dot', options = {} } = params;
    
    if (!data || !data.items) {
      return {
        success: false,
        error: 'No canvas data provided'
      };
    }

    try {
      const startTime = Date.now();
      let dotContent = '';

      switch (layout) {
        case 'dot':
          dotContent = this.generateHierarchicalDOT(data, options);
          break;
        case 'neato':
          dotContent = this.generateSpringModelDOT(data, options);
          break;
        case 'fdp':
          dotContent = this.generateForceDirectedDOT(data, options);
          break;
        case 'sfdp':
          dotContent = this.generateLargeGraphDOT(data, options);
          break;
        case 'circo':
          dotContent = this.generateCircularDOT(data, options);
          break;
        case 'twopi':
          dotContent = this.generateRadialDOT(data, options);
          break;
        default:
          dotContent = this.generateHierarchicalDOT(data, options);
      }

      const executionTime = Date.now() - startTime;

      return {
        success: true,
        data: {
          content: dotContent,
          format: 'graphviz',
          extension: 'dot',
          layout
        },
        metadata: {
          executionTime,
          processingStats: {
            itemsProcessed: data.items.length,
            connectionsProcessed: data.connections?.length || 0,
            layout
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during Graphviz export'
      };
    }
  }

  private generateHierarchicalDOT(data: ExportData, options: any): string {
    const { items, connections } = data;
    const { direction = 'TB', provider = 'aws' } = options;

    let dot = `digraph Infrastructure {
    // Graph settings
    rankdir="${direction}";
    bgcolor="white";
    fontname="Arial";
    fontsize="12";
    
    // Node defaults
    node [
        fontname="Arial",
        fontsize="10",
        shape="box",
        style="rounded,filled",
        fillcolor="lightblue",
        color="black",
        margin="0.2"
    ];
    
    // Edge defaults
    edge [
        fontname="Arial",
        fontsize="9",
        color="gray60",
        arrowsize="0.7"
    ];

`;

    // Add container subgraphs
    const containers = items.filter(item => item.isBoundingBox);
    const resources = items.filter(item => !item.isBoundingBox);

    for (const container of containers) {
      dot += this.generateContainerSubgraph(container, items, provider);
    }

    // Add orphaned resources
    const orphanedResources = resources.filter(r => !r.parentId);
    for (const resource of orphanedResources) {
      dot += this.generateResourceNode(resource, provider);
    }

    // Add connections
    if (connections && connections.length > 0) {
      dot += '\n    // Connections\n';
      for (const connection of connections) {
        dot += this.generateConnection(connection);
      }
    }

    dot += '\n}';
    return dot;
  }

  private generateSpringModelDOT(data: ExportData, options: any): string {
    const { items, connections } = data;
    const { provider = 'aws' } = options;

    let dot = `graph Infrastructure {
    // Graph settings for spring model
    layout="neato";
    bgcolor="white";
    fontname="Arial";
    fontsize="12";
    overlap="false";
    splines="true";
    
    // Node defaults
    node [
        fontname="Arial",
        fontsize="10",
        shape="ellipse",
        style="filled",
        fillcolor="lightblue",
        color="black"
    ];
    
    // Edge defaults
    edge [
        fontname="Arial",
        fontsize="9",
        color="gray60",
        len="2.0"
    ];

`;

    // Add all items as nodes
    for (const item of items) {
      if (!item.isBoundingBox) {
        dot += this.generateResourceNode(item, provider);
      }
    }

    // Add connections as undirected edges
    if (connections && connections.length > 0) {
      dot += '\n    // Connections\n';
      for (const connection of connections) {
        dot += this.generateUndirectedConnection(connection);
      }
    }

    dot += '\n}';
    return dot;
  }

  private generateForceDirectedDOT(data: ExportData, options: any): string {
    const { items, connections } = data;
    const { provider = 'aws' } = options;

    let dot = `graph Infrastructure {
    // Graph settings for force-directed layout
    layout="fdp";
    bgcolor="white";
    fontname="Arial";
    fontsize="12";
    overlap="scale";
    splines="true";
    K="2.0";
    
    // Node defaults
    node [
        fontname="Arial",
        fontsize="10",
        shape="box",
        style="rounded,filled",
        fillcolor="lightgreen",
        color="black"
    ];
    
    // Edge defaults
    edge [
        fontname="Arial",
        fontsize="9",
        color="gray60",
        len="2.5"
    ];

`;

    // Add nodes with force-directed attributes
    for (const item of items) {
      if (!item.isBoundingBox) {
        dot += this.generateForceDirectedNode(item, provider);
      }
    }

    // Add connections
    if (connections && connections.length > 0) {
      dot += '\n    // Connections\n';
      for (const connection of connections) {
        dot += this.generateUndirectedConnection(connection);
      }
    }

    dot += '\n}';
    return dot;
  }

  private generateLargeGraphDOT(data: ExportData, options: any): string {
    const { items, connections } = data;
    const { provider = 'aws' } = options;

    let dot = `graph Infrastructure {
    // Graph settings for large graphs
    layout="sfdp";
    bgcolor="white";
    fontname="Arial";
    fontsize="12";
    overlap="prism";
    splines="curved";
    K="1.5";
    
    // Node defaults
    node [
        fontname="Arial",
        fontsize="9",
        shape="circle",
        style="filled",
        fillcolor="lightyellow",
        color="black",
        width="0.8",
        height="0.8"
    ];
    
    // Edge defaults
    edge [
        fontname="Arial",
        fontsize="8",
        color="gray70",
        len="2.0"
    ];

`;

    // Add nodes optimized for large graphs
    for (const item of items) {
      if (!item.isBoundingBox) {
        dot += this.generateCompactNode(item, provider);
      }
    }

    // Add connections
    if (connections && connections.length > 0) {
      dot += '\n    // Connections\n';
      for (const connection of connections) {
        dot += this.generateSimpleConnection(connection);
      }
    }

    dot += '\n}';
    return dot;
  }

  private generateCircularDOT(data: ExportData, options: any): string {
    const { items, connections } = data;
    const { provider = 'aws' } = options;

    let dot = `graph Infrastructure {
    // Graph settings for circular layout
    layout="circo";
    bgcolor="white";
    fontname="Arial";
    fontsize="12";
    
    // Node defaults
    node [
        fontname="Arial",
        fontsize="10",
        shape="box",
        style="rounded,filled",
        fillcolor="lightcoral",
        color="black"
    ];
    
    // Edge defaults
    edge [
        fontname="Arial",
        fontsize="9",
        color="gray60"
    ];

`;

    // Add nodes for circular layout
    for (const item of items) {
      if (!item.isBoundingBox) {
        dot += this.generateResourceNode(item, provider);
      }
    }

    // Add connections
    if (connections && connections.length > 0) {
      dot += '\n    // Connections\n';
      for (const connection of connections) {
        dot += this.generateUndirectedConnection(connection);
      }
    }

    dot += '\n}';
    return dot;
  }

  private generateRadialDOT(data: ExportData, options: any): string {
    const { items, connections } = data;
    const { provider = 'aws', centerNode } = options;

    let dot = `graph Infrastructure {
    // Graph settings for radial layout
    layout="twopi";
    bgcolor="white";
    fontname="Arial";
    fontsize="12";
    root="${centerNode || this.findCenterNode(items, connections)}";
    
    // Node defaults
    node [
        fontname="Arial",
        fontsize="10",
        shape="box",
        style="rounded,filled",
        fillcolor="lightsteelblue",
        color="black"
    ];
    
    // Edge defaults
    edge [
        fontname="Arial",
        fontsize="9",
        color="gray60"
    ];

`;

    // Add nodes for radial layout
    for (const item of items) {
      if (!item.isBoundingBox) {
        dot += this.generateResourceNode(item, provider);
      }
    }

    // Add connections
    if (connections && connections.length > 0) {
      dot += '\n    // Connections\n';
      for (const connection of connections) {
        dot += this.generateUndirectedConnection(connection);
      }
    }

    dot += '\n}';
    return dot;
  }

  private generateContainerSubgraph(container: CanvasItem, allItems: CanvasItem[], provider: string): string {
    const containerType = container.key.split('-')[0];
    const cleanId = this.sanitizeId(container.id);
    
    let dot = `
    subgraph cluster_${cleanId} {
        label="${container.label}";
        style="rounded,filled";
        fillcolor="${this.getContainerColor(containerType)}";
        color="black";
        fontsize="12";
        fontname="Arial Bold";
        
`;

    // Add child items
    const children = allItems.filter(item => item.parentId === container.id);
    for (const child of children) {
      if (child.isBoundingBox) {
        dot += this.generateContainerSubgraph(child, allItems, provider);
      } else {
        dot += this.generateResourceNode(child, provider);
      }
    }

    dot += '    }\n';
    return dot;
  }

  private generateResourceNode(item: CanvasItem, provider: string): string {
    const resourceType = item.key.split('-')[0];
    const cleanId = this.sanitizeId(item.id);
    const nodeAttrs = this.getResourceNodeAttributes(resourceType, provider);
    
    return `    "${cleanId}" [label="${item.label}", ${nodeAttrs}];\n`;
  }

  private generateForceDirectedNode(item: CanvasItem, provider: string): string {
    const resourceType = item.key.split('-')[0];
    const cleanId = this.sanitizeId(item.id);
    const nodeAttrs = this.getResourceNodeAttributes(resourceType, provider);
    const weight = this.getNodeWeight(resourceType);
    
    return `    "${cleanId}" [label="${item.label}", ${nodeAttrs}, weight="${weight}"];\n`;
  }

  private generateCompactNode(item: CanvasItem, provider: string): string {
    const cleanId = this.sanitizeId(item.id);
    const shortLabel = item.label.length > 10 ? item.label.substring(0, 10) + '...' : item.label;
    
    return `    "${cleanId}" [label="${shortLabel}", tooltip="${item.label}"];\n`;
  }

  private generateConnection(connection: Connection): string {
    const fromId = this.sanitizeId(connection.from);
    const toId = this.sanitizeId(connection.to);
    const label = connection.label || '';
    
    if (label) {
      return `    "${fromId}" -> "${toId}" [label="${label}"];\n`;
    } else {
      return `    "${fromId}" -> "${toId}";\n`;
    }
  }

  private generateUndirectedConnection(connection: Connection): string {
    const fromId = this.sanitizeId(connection.from);
    const toId = this.sanitizeId(connection.to);
    const label = connection.label || '';
    
    if (label) {
      return `    "${fromId}" -- "${toId}" [label="${label}"];\n`;
    } else {
      return `    "${fromId}" -- "${toId}";\n`;
    }
  }

  private generateSimpleConnection(connection: Connection): string {
    const fromId = this.sanitizeId(connection.from);
    const toId = this.sanitizeId(connection.to);
    
    return `    "${fromId}" -- "${toId}";\n`;
  }

  private getContainerColor(containerType: string): string {
    const colors = {
      'vpc': 'lightblue',
      'subnet': 'lightgreen',
      'availability-zone': 'lightyellow',
      'security-group': 'lightcoral'
    };
    
    return colors[containerType as keyof typeof colors] || 'lightgray';
  }

  private getResourceNodeAttributes(resourceType: string, provider: string): string {
    const attributes = {
      compute: 'shape="box", fillcolor="lightblue"',
      database: 'shape="cylinder", fillcolor="lightgreen"',
      storage: 'shape="folder", fillcolor="lightyellow"',
      'load-balancer': 'shape="diamond", fillcolor="lightcoral"',
      'api-gateway': 'shape="trapezium", fillcolor="lightsteelblue"',
      user: 'shape="ellipse", fillcolor="lightpink"',
      'external-system': 'shape="hexagon", fillcolor="lightgray"'
    };
    
    return attributes[resourceType as keyof typeof attributes] || 'shape="box", fillcolor="white"';
  }

  private getNodeWeight(resourceType: string): number {
    const weights = {
      'load-balancer': 3.0,
      'api-gateway': 2.5,
      'database': 2.0,
      'compute': 1.5,
      'storage': 1.0,
      'user': 0.5,
      'external-system': 0.8
    };
    
    return weights[resourceType as keyof typeof weights] || 1.0;
  }

  private findCenterNode(items: CanvasItem[], connections: Connection[]): string {
    if (!connections || connections.length === 0) {
      return items[0] ? this.sanitizeId(items[0].id) : 'root';
    }
    
    // Find node with most connections
    const connectionCounts = new Map<string, number>();
    
    for (const connection of connections) {
      connectionCounts.set(connection.from, (connectionCounts.get(connection.from) || 0) + 1);
      connectionCounts.set(connection.to, (connectionCounts.get(connection.to) || 0) + 1);
    }
    
    let maxConnections = 0;
    let centerNode = items[0] ? this.sanitizeId(items[0].id) : 'root';
    
    for (const [nodeId, count] of connectionCounts) {
      if (count > maxConnections) {
        maxConnections = count;
        centerNode = this.sanitizeId(nodeId);
      }
    }
    
    return centerNode;
  }

  private sanitizeId(id: string): string {
    return id.replace(/[^a-zA-Z0-9_]/g, '_');
  }
}