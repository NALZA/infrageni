import { InfraToolPlugin, ToolCategory, ToolContext, ToolParams, ToolResult } from '../core/plugin-system';
import { ExportData } from '../../export/export-utils';
import { CanvasItem, Connection } from '../../types';

export class PlantUMLExportTool implements InfraToolPlugin {
  id = 'plantuml-export';
  name = 'PlantUML Export';
  description = 'Export infrastructure diagrams to PlantUML format with C4 model support';
  category = ToolCategory.EXPORT;
  version = '1.0.0';

  async initialize(context: ToolContext): Promise<void> {
    console.log('🌱 PlantUML Export Tool initialized');
  }

  async execute(params: ToolParams): Promise<ToolResult> {
    const { data, format = 'c4-context' } = params;
    
    if (!data || !data.items) {
      return {
        success: false,
        error: 'No canvas data provided'
      };
    }

    try {
      const startTime = Date.now();
      let plantUMLContent = '';

      switch (format) {
        case 'c4-context':
          plantUMLContent = this.generateC4Context(data);
          break;
        case 'c4-container':
          plantUMLContent = this.generateC4Container(data);
          break;
        case 'c4-component':
          plantUMLContent = this.generateC4Component(data);
          break;
        case 'deployment':
          plantUMLContent = this.generateDeployment(data);
          break;
        case 'network':
          plantUMLContent = this.generateNetwork(data);
          break;
        default:
          plantUMLContent = this.generateC4Context(data);
      }

      const executionTime = Date.now() - startTime;

      return {
        success: true,
        data: {
          content: plantUMLContent,
          format,
          extension: 'puml'
        },
        metadata: {
          executionTime,
          processingStats: {
            itemsProcessed: data.items.length,
            connectionsProcessed: data.connections?.length || 0,
            format
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during PlantUML export'
      };
    }
  }

  private generateC4Context(data: ExportData): string {
    const { items, connections } = data;
    
    let puml = `@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Context.puml

LAYOUT_WITH_LEGEND()

title Infrastructure Context Diagram

`;

    // Process containers and systems
    const containers = items.filter(item => item.isBoundingBox);
    const systems = items.filter(item => !item.isBoundingBox);

    // Add enterprise boundaries (VPCs)
    for (const container of containers) {
      const containerType = container.key.split('-')[0];
      if (containerType === 'vpc') {
        puml += `Enterprise_Boundary(${this.sanitizeId(container.id)}, "${container.label}", "VPC") {\n`;
        
        // Add nested containers and systems
        const children = this.getChildrenRecursive(container, items);
        for (const child of children) {
          puml += this.generateC4Element(child, '  ');
        }
        
        puml += `}\n\n`;
      }
    }

    // Add orphaned systems (no parent container)
    const orphanedSystems = systems.filter(system => !system.parentId);
    for (const system of orphanedSystems) {
      puml += this.generateC4Element(system, '');
    }

    // Add relationships
    if (connections && connections.length > 0) {
      puml += '\n' + this.generateC4Relationships(connections);
    }

    puml += `
@enduml`;

    return puml;
  }

  private generateC4Container(data: ExportData): string {
    const { items, connections } = data;
    
    let puml = `@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml

LAYOUT_WITH_LEGEND()

title Infrastructure Container Diagram

`;

    // Process all items as containers
    for (const item of items) {
      if (item.isBoundingBox) {
        puml += this.generateContainerBoundary(item, items);
      } else {
        puml += this.generateC4Container_Element(item);
      }
    }

    // Add relationships
    if (connections && connections.length > 0) {
      puml += '\n' + this.generateC4Relationships(connections);
    }

    puml += `
@enduml`;

    return puml;
  }

  private generateC4Component(data: ExportData): string {
    const { items, connections } = data;
    
    let puml = `@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Component.puml

LAYOUT_WITH_LEGEND()

title Infrastructure Component Diagram

`;

    // Generate components with detailed view
    for (const item of items) {
      puml += this.generateC4Component_Element(item);
    }

    // Add relationships
    if (connections && connections.length > 0) {
      puml += '\n' + this.generateC4Relationships(connections);
    }

    puml += `
@enduml`;

    return puml;
  }

  private generateDeployment(data: ExportData): string {
    const { items, connections } = data;
    
    let puml = `@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Deployment.puml

LAYOUT_WITH_LEGEND()

title Infrastructure Deployment Diagram

`;

    // Generate deployment nodes
    const containers = items.filter(item => item.isBoundingBox);
    const resources = items.filter(item => !item.isBoundingBox);

    for (const container of containers) {
      const containerType = container.key.split('-')[0];
      
      if (containerType === 'vpc') {
        puml += `Deployment_Node(${this.sanitizeId(container.id)}, "${container.label}", "AWS VPC") {\n`;
      } else if (containerType === 'availability-zone') {
        puml += `Deployment_Node(${this.sanitizeId(container.id)}, "${container.label}", "Availability Zone") {\n`;
      } else {
        puml += `Deployment_Node(${this.sanitizeId(container.id)}, "${container.label}", "Network Segment") {\n`;
      }

      // Add child resources
      const children = resources.filter(r => r.parentId === container.id);
      for (const child of children) {
        puml += this.generateDeploymentArtifact(child, '  ');
      }

      puml += `}\n\n`;
    }

    // Add orphaned resources
    const orphanedResources = resources.filter(r => !r.parentId);
    for (const resource of orphanedResources) {
      puml += this.generateDeploymentArtifact(resource, '');
    }

    // Add relationships
    if (connections && connections.length > 0) {
      puml += '\n' + this.generateC4Relationships(connections);
    }

    puml += `
@enduml`;

    return puml;
  }

  private generateNetwork(data: ExportData): string {
    const { items, connections } = data;
    
    let puml = `@startuml
!theme plain

title Network Topology Diagram

`;

    // Generate network elements
    for (const item of items) {
      if (item.isBoundingBox) {
        puml += this.generateNetworkBoundary(item);
      } else {
        puml += this.generateNetworkNode(item);
      }
    }

    // Add network connections
    if (connections && connections.length > 0) {
      puml += '\n' + this.generateNetworkConnections(connections);
    }

    puml += `
@enduml`;

    return puml;
  }

  private generateC4Element(item: CanvasItem, indent: string): string {
    const resourceType = item.key.split('-')[0];
    const cleanId = this.sanitizeId(item.id);
    
    switch (resourceType) {
      case 'compute':
        return `${indent}System(${cleanId}, "${item.label}", "Compute Instance")\n`;
      case 'database':
        return `${indent}SystemDb(${cleanId}, "${item.label}", "Database")\n`;
      case 'storage':
        return `${indent}System(${cleanId}, "${item.label}", "Storage")\n`;
      case 'user':
        return `${indent}Person(${cleanId}, "${item.label}", "User")\n`;
      case 'external-system':
        return `${indent}System_Ext(${cleanId}, "${item.label}", "External System")\n`;
      default:
        return `${indent}System(${cleanId}, "${item.label}", "${resourceType}")\n`;
    }
  }

  private generateC4Container_Element(item: CanvasItem): string {
    const resourceType = item.key.split('-')[0];
    const cleanId = this.sanitizeId(item.id);
    const technology = item.properties?.instanceType || resourceType;
    
    return `Container(${cleanId}, "${item.label}", "${technology}", "${this.getDescription(item)}")\n`;
  }

  private generateC4Component_Element(item: CanvasItem): string {
    const resourceType = item.key.split('-')[0];
    const cleanId = this.sanitizeId(item.id);
    const technology = item.properties?.instanceType || resourceType;
    
    return `Component(${cleanId}, "${item.label}", "${technology}", "${this.getDescription(item)}")\n`;
  }

  private generateContainerBoundary(container: CanvasItem, allItems: CanvasItem[]): string {
    const containerType = container.key.split('-')[0];
    const cleanId = this.sanitizeId(container.id);
    
    let puml = '';
    
    if (containerType === 'vpc') {
      puml += `Container_Boundary(${cleanId}, "${container.label}", "VPC") {\n`;
    } else if (containerType === 'subnet') {
      puml += `Container_Boundary(${cleanId}, "${container.label}", "Subnet") {\n`;
    } else {
      puml += `Container_Boundary(${cleanId}, "${container.label}", "Container") {\n`;
    }

    // Add child items
    const children = allItems.filter(item => item.parentId === container.id);
    for (const child of children) {
      puml += this.generateC4Container_Element(child);
    }

    puml += `}\n\n`;
    
    return puml;
  }

  private generateDeploymentArtifact(item: CanvasItem, indent: string): string {
    const resourceType = item.key.split('-')[0];
    const cleanId = this.sanitizeId(item.id);
    
    switch (resourceType) {
      case 'compute':
        return `${indent}Container(${cleanId}, "${item.label}", "EC2 Instance", "${item.properties?.instanceType || 't3.micro'}")\n`;
      case 'database':
        return `${indent}ContainerDb(${cleanId}, "${item.label}", "RDS Database", "${item.properties?.engine || 'MySQL'}")\n`;
      default:
        return `${indent}Container(${cleanId}, "${item.label}", "${resourceType}", "${this.getDescription(item)}")\n`;
    }
  }

  private generateNetworkBoundary(item: CanvasItem): string {
    const containerType = item.key.split('-')[0];
    const cleanId = this.sanitizeId(item.id);
    
    if (containerType === 'vpc') {
      return `cloud "${item.label}" as ${cleanId} {\n}\n`;
    } else if (containerType === 'subnet') {
      return `rectangle "${item.label}" as ${cleanId} {\n}\n`;
    } else {
      return `package "${item.label}" as ${cleanId} {\n}\n`;
    }
  }

  private generateNetworkNode(item: CanvasItem): string {
    const resourceType = item.key.split('-')[0];
    const cleanId = this.sanitizeId(item.id);
    
    switch (resourceType) {
      case 'compute':
        return `node "${item.label}" as ${cleanId}\n`;
      case 'database':
        return `database "${item.label}" as ${cleanId}\n`;
      case 'storage':
        return `storage "${item.label}" as ${cleanId}\n`;
      default:
        return `rectangle "${item.label}" as ${cleanId}\n`;
    }
  }

  private generateC4Relationships(connections: Connection[]): string {
    let puml = '';
    
    for (const connection of connections) {
      const fromId = this.sanitizeId(connection.from);
      const toId = this.sanitizeId(connection.to);
      const label = connection.label || 'Uses';
      
      puml += `Rel(${fromId}, ${toId}, "${label}")\n`;
    }
    
    return puml;
  }

  private generateNetworkConnections(connections: Connection[]): string {
    let puml = '';
    
    for (const connection of connections) {
      const fromId = this.sanitizeId(connection.from);
      const toId = this.sanitizeId(connection.to);
      const label = connection.label || '';
      
      if (label) {
        puml += `${fromId} --> ${toId} : ${label}\n`;
      } else {
        puml += `${fromId} --> ${toId}\n`;
      }
    }
    
    return puml;
  }

  private getChildrenRecursive(container: CanvasItem, allItems: CanvasItem[]): CanvasItem[] {
    const children: CanvasItem[] = [];
    
    for (const item of allItems) {
      if (item.parentId === container.id) {
        children.push(item);
        
        // If this child is also a container, get its children
        if (item.isBoundingBox) {
          children.push(...this.getChildrenRecursive(item, allItems));
        }
      }
    }
    
    return children;
  }

  private getDescription(item: CanvasItem): string {
    const resourceType = item.key.split('-')[0];
    const instanceType = item.properties?.instanceType;
    
    if (instanceType) {
      return `${resourceType} (${instanceType})`;
    }
    
    return resourceType.charAt(0).toUpperCase() + resourceType.slice(1);
  }

  private sanitizeId(id: string): string {
    return id.replace(/[^a-zA-Z0-9_]/g, '_');
  }
}