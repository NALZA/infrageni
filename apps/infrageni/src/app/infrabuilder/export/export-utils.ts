import { TLShape, useEditor, TLArrowBinding } from 'tldraw';
import { BaseInfraShapeProps } from '../shapes/base';
import { CanvasItem, Connection } from '../types';
import { EXPORT_FORMATS } from './formats';

export interface ExportData {
  items: CanvasItem[];
  connections: Connection[];
  metadata: {
    exportedAt: string;
    format: string;
    version: string;
  };
}

// Convert tldraw arrow shapes to our Connection format
export function extractConnectionsFromArrows(
  editor: ReturnType<typeof useEditor>,
  shapes: TLShape[]
): Connection[] {
  const connections: Connection[] = [];

  for (const shape of shapes) {
    if (shape.type === 'arrow') {
      console.log('� Processing arrow shape:', shape.id);

      // Use TLDraw v2 API to get arrow bindings
      const bindings = editor.getBindingsFromShape(shape.id, 'arrow');

      // Find start and end bindings
      const startBinding = bindings.find(
        (b) => (b as TLArrowBinding).props.terminal === 'start'
      ) as TLArrowBinding;
      const endBinding = bindings.find(
        (b) => (b as TLArrowBinding).props.terminal === 'end'
      ) as TLArrowBinding;

      if (startBinding && endBinding) {
        const arrowProps = shape.props as any; // eslint-disable-line @typescript-eslint/no-explicit-any

        const connection: Connection = {
          id: shape.id,
          from: startBinding.toId,
          to: endBinding.toId,
          label: arrowProps.text || '',
          properties: {
            arrowheadStart: arrowProps.arrowheadStart || 'none',
            arrowheadEnd: arrowProps.arrowheadEnd || 'arrow',
            color: arrowProps.color || 'black',
            size: arrowProps.size || 'medium',
            dash: arrowProps.dash || 'solid',
          },
        };
        connections.push(connection);
      }
    }
  }
  return connections;
}

// Convert tldraw shapes to our CanvasItem format
export function convertShapesToCanvasItems(shapes: TLShape[]): CanvasItem[] {
  const items: CanvasItem[] = [];

  for (const shape of shapes) {
    // Skip arrow shapes as they are handled separately as connections
    if (shape.type === 'arrow') continue;

    const props = shape.props as BaseInfraShapeProps;
    if (!props) continue;

    // Determine the component type based on shape type
    const componentType = shape.type.replace('infra-', '');
    const item: CanvasItem = {
      id: shape.id,
      label: props.label || componentType,
      x: shape.x,
      y: shape.y,
      key: `${componentType}-${shape.id}`,
      isBoundingBox: props.isBoundingBox,
      properties: {
        // Extract any custom properties from the shape's props
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(props as any), // Cast to any to access potential custom properties
      },
    };

    // For bounding boxes, find their children
    if (props.isBoundingBox) {
      const children: string[] = [];
      const containerBounds = {
        x: shape.x,
        y: shape.y,
        w: props.w,
        h: props.h,
      };

      for (const otherShape of shapes) {
        if (otherShape.id === shape.id) continue;

        const otherProps = otherShape.props as BaseInfraShapeProps;
        if (otherProps?.isBoundingBox) continue; // Skip other containers

        // Check if the other shape is contained within this bounding box
        const otherCenterX = otherShape.x + (otherProps?.w || 0) / 2;
        const otherCenterY = otherShape.y + (otherProps?.h || 0) / 2;

        const isContained =
          otherCenterX >= containerBounds.x &&
          otherCenterX <= containerBounds.x + containerBounds.w &&
          otherCenterY >= containerBounds.y &&
          otherCenterY <= containerBounds.y + containerBounds.h;

        if (isContained) {
          children.push(otherShape.id);
        }
      }

      item.children = children;
    }

    // For non-bounding boxes, find their parent
    if (!props.isBoundingBox) {
      const shapeCenterX = shape.x + (props.w || 0) / 2;
      const shapeCenterY = shape.y + (props.h || 0) / 2;

      for (const containerShape of shapes) {
        const containerProps = containerShape.props as BaseInfraShapeProps;
        if (!containerProps?.isBoundingBox || containerShape.id === shape.id)
          continue;

        const containerBounds = {
          x: containerShape.x,
          y: containerShape.y,
          w: containerProps.w,
          h: containerProps.h,
        };

        const isContained =
          shapeCenterX >= containerBounds.x &&
          shapeCenterX <= containerBounds.x + containerBounds.w &&
          shapeCenterY >= containerBounds.y &&
          shapeCenterY <= containerBounds.y + containerBounds.h;

        if (isContained) {
          item.parentId = containerShape.id;
          break; // Take the first matching container (we could make this smarter)
        }
      }
    }

    items.push(item);
  }

  return items;
}

// Generate Mermaid C4 Context diagram
export function generateMermaidC4(data: ExportData): string {
  const { items, connections } = data;

  let mermaid = `C4Context\n`;

  // Filter out arrow shapes from being rendered as components
  const filteredItems = items.filter((item) => !item.key.startsWith('arrow-'));

  // Group items by their container hierarchy
  const containers = filteredItems.filter((item) => item.isBoundingBox);
  const resources = filteredItems.filter((item) => !item.isBoundingBox);

  // Build hierarchy tree
  const hierarchy = buildHierarchy(containers, resources);

  // Render hierarchy recursively with proper nesting
  mermaid += renderC4Hierarchy(hierarchy, 1);

  // Add connections/relationships at the end (required by C4 syntax)
  if (connections.length > 0) {
    mermaid += '\n    %% Relationships\n';
    for (const connection of connections) {
      const cleanFrom = connection.from.replace(/[^a-zA-Z0-9_]/g, '_');
      const cleanTo = connection.to.replace(/[^a-zA-Z0-9_]/g, '_');

      // Use proper C4 relationship syntax
      if (connection.label) {
        mermaid += `    Rel(${cleanFrom}, ${cleanTo}, "${connection.label}")\n`;
      } else {
        mermaid += `    Rel(${cleanFrom}, ${cleanTo}, "Uses")\n`;
      }
    }
  }

  mermaid += `\n    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")\n`;

  return mermaid;
}

// Helper types for hierarchy building
interface HierarchyNode {
  container?: CanvasItem;
  resource?: CanvasItem;
  children?: HierarchyNode[];
}

// Helper function to build container hierarchy
function buildHierarchy(
  containers: CanvasItem[],
  resources: CanvasItem[]
): HierarchyNode[] {
  const hierarchy: HierarchyNode[] = [];

  // Find root containers (no parent)
  const rootContainers = containers.filter((c) => !c.parentId);

  for (const container of rootContainers) {
    const node: HierarchyNode = {
      container,
      children: buildChildren(container, containers, resources),
    };
    hierarchy.push(node);
  }

  // Add orphaned resources (no parent container)
  const orphanedResources = resources.filter((r) => !r.parentId);
  for (const resource of orphanedResources) {
    hierarchy.push({ resource });
  }

  return hierarchy;
}

function buildChildren(
  parent: CanvasItem,
  containers: CanvasItem[],
  resources: CanvasItem[]
): HierarchyNode[] {
  const children: HierarchyNode[] = [];

  // Find child containers
  const childContainers = containers.filter((c) => c.parentId === parent.id);
  for (const container of childContainers) {
    children.push({
      container,
      children: buildChildren(container, containers, resources),
    });
  }

  // Find child resources
  const childResources = resources.filter((r) => r.parentId === parent.id);
  for (const resource of childResources) {
    children.push({ resource });
  }

  return children;
}

function renderC4Hierarchy(nodes: HierarchyNode[], depth: number): string {
  let result = '';
  const indent = '    '.repeat(depth);

  for (const node of nodes) {
    if (node.container) {
      const container = node.container;
      const containerType = container.key.split('-')[0];
      let c4Type = 'Container';

      if (containerType === 'vpc') {
        c4Type = 'Enterprise_Boundary';
      } else if (containerType === 'subnet') {
        c4Type = 'System_Boundary';
      } else if (containerType === 'availability-zone') {
        c4Type = 'Boundary';
      }

      const cleanId = container.id.replace(/[^a-zA-Z0-9_]/g, '_');
      result += `${indent}${c4Type}(${cleanId}, "${
        container.label
      }", "${containerType.toUpperCase()}")`;

      if (node.children && node.children.length > 0) {
        result += ' {\n';
        result += renderC4Hierarchy(node.children, depth + 1);
        result += `${indent}}\n`;
      } else {
        result += '\n';
      }
    } else if (node.resource) {
      const resource = node.resource;
      const resourceType = resource.key.split('-')[0];
      let c4Type = 'System';

      // Map resource types to C4 types
      switch (resourceType) {
        case 'compute':
          c4Type = 'System';
          break;
        case 'database':
          c4Type = 'SystemDb';
          break;
        case 'storage':
          c4Type = 'System';
          break;
        case 'user':
          c4Type = 'Person';
          break;
        case 'external-system':
          c4Type = 'System_Ext';
          break;
        default:
          c4Type = 'System';
      }

      let description =
        resourceType.charAt(0).toUpperCase() + resourceType.slice(1);
      if (resource.properties?.instanceType) {
        description += ` (${resource.properties.instanceType})`;
      }

      const cleanId = resource.id.replace(/[^a-zA-Z0-9_]/g, '_');
      result += `${indent}${c4Type}(${cleanId}, "${resource.label}", "${description}")\n`;
    }
  }

  return result;
}

// Generate Mermaid Architecture diagram
export function generateMermaidArchitecture(data: ExportData): string {
  const { items, connections } = data;

  let mermaid = `architecture-beta\n`;

  // Add services grouped by containers
  const containers = items.filter((item) => item.isBoundingBox);
  const resources = items.filter((item) => !item.isBoundingBox);
  // Add groups for containers
  for (const container of containers) {
    const cleanId = container.id.replace(/[^a-zA-Z0-9_]/g, '_');
    mermaid += `    group ${cleanId}(cloud)[${container.label}]\n`;
  }

  if (containers.length > 0) {
    mermaid += '\n';
  }

  // Add services
  for (const resource of resources) {
    const resourceType = resource.key.split('-')[0];
    let icon = 'server';

    // Map resource types to icons
    switch (resourceType) {
      case 'compute':
        icon = 'server';
        break;
      case 'database':
        icon = 'database';
        break;
      case 'storage':
        icon = 'disk';
        break;
      case 'user':
        icon = 'server'; // architecture doesn't have user icon, fallback to server
        break;
      case 'external-system':
        icon = 'cloud';
        break;
      default:
        icon = 'server';
    }

    const cleanId = resource.id.replace(/[^a-zA-Z0-9_]/g, '_');
    const cleanParentId = resource.parentId
      ? resource.parentId.replace(/[^a-zA-Z0-9_]/g, '_')
      : '';
    const groupSpec = cleanParentId ? ` in ${cleanParentId}` : '';
    mermaid += `    service ${cleanId}(${icon})[${resource.label}]${groupSpec}\n`;
  }

  // Add connections using proper architecture syntax
  if (connections.length > 0) {
    mermaid += '\n';
    for (const connection of connections) {
      // Clean connection IDs for valid syntax
      const cleanFrom = connection.from.replace(/[^a-zA-Z0-9_]/g, '_');
      const cleanTo = connection.to.replace(/[^a-zA-Z0-9_]/g, '_');

      // Architecture diagrams use specific directional syntax
      // For simplicity, we'll use Right to Left connections
      mermaid += `    ${cleanFrom}:R --> L:${cleanTo}\n`;
    }
  }

  return mermaid;
}

// Generate JSON export
export function generateJSON(data: ExportData): string {
  return JSON.stringify(data, null, 2);
}

// Generate basic Terraform configuration
export function generateTerraform(data: ExportData): string {
  const { items } = data;

  let terraform = `# Generated Terraform configuration
# This is a basic template - you'll need to customize it for your specific needs

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.region
}

variable "region" {
  description = "AWS region"
  type        = string
  default     = "us-west-2"
}

`;

  // Generate resources based on the canvas items
  for (const item of items) {
    const resourceType = item.key.split('-')[0];

    switch (resourceType) {
      case 'vpc':
        terraform += `
resource "aws_vpc" "${item.id.replace('-', '_')}" {
  cidr_block           = "${item.properties?.cidrBlock || '10.0.0.0/16'}"
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  tags = {
    Name = "${item.label}"
  }
}
`;
        break;

      case 'subnet':
        terraform += `
resource "aws_subnet" "${item.id.replace('-', '_')}" {
  vpc_id     = aws_vpc.${item.parentId?.replace('-', '_') || 'main_vpc'}.id
  cidr_block = "${item.properties?.cidrBlock || '10.0.1.0/24'}"
  
  tags = {
    Name = "${item.label}"
  }
}
`;
        break;

      case 'compute':
        terraform += `
resource "aws_instance" "${item.id.replace('-', '_')}" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "${item.properties?.instanceType || 't3.micro'}"
  ${
    item.parentId
      ? `subnet_id     = aws_subnet.${item.parentId.replace('-', '_')}.id`
      : ''
  }
  
  tags = {
    Name = "${item.label}"
  }
}
`;
        break;

      case 'database':
        terraform += `
resource "aws_db_instance" "${item.id.replace('-', '_')}" {
  identifier     = "${item.label.toLowerCase().replace(/[^a-z0-9-]/g, '-')}"
  engine         = "${item.properties?.engine || 'mysql'}"
  engine_version = "8.0"
  instance_class = "db.t3.micro"
  allocated_storage = 20
  
  db_name  = "database"
  username = "admin"
  password = "changeme123!"
  
  skip_final_snapshot = true
  
  tags = {
    Name = "${item.label}"
  }
}
`;
        break;
    }
  }

  terraform += `
# Data source for Ubuntu AMI
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical
  
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
  
  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}
`;

  return terraform;
}

// Generate simple Mermaid flowchart as fallback
export function generateMermaidFlowchart(data: ExportData): string {
  const { items, connections } = data;

  let mermaid = `flowchart TD
`;

  // Add nodes
  for (const item of items) {
    const cleanId = item.id.replace(/[^a-zA-Z0-9_]/g, '_');
    const shape = item.isBoundingBox ? '[]' : '()';
    mermaid += `    ${cleanId}${shape[0]}"${item.label}"${shape[1]}\n`;
  }

  // Add connections
  if (connections.length > 0) {
    mermaid += '\n';
    for (const connection of connections) {
      const cleanFrom = connection.from.replace(/[^a-zA-Z0-9_]/g, '_');
      const cleanTo = connection.to.replace(/[^a-zA-Z0-9_]/g, '_');
      const label = connection.label ? `|${connection.label}|` : '';
      mermaid += `    ${cleanFrom} --> ${label} ${cleanTo}\n`;
    }
  }

  return mermaid;
}

// Main export function
export function exportCanvas(
  format: string,
  editor: ReturnType<typeof useEditor>,
  shapes: TLShape[]
): string {
  const items = convertShapesToCanvasItems(shapes);
  const connections = extractConnectionsFromArrows(editor, shapes);

  const data: ExportData = {
    items,
    connections,
    metadata: {
      exportedAt: new Date().toISOString(),
      format,
      version: '1.0.0',
    },
  };

  switch (format) {
    case 'mermaid-c4':
      return generateMermaidC4(data);
    case 'mermaid-architecture':
      return generateMermaidArchitecture(data);
    case 'mermaid-flowchart':
      return generateMermaidFlowchart(data);
    case 'json':
      return generateJSON(data);
    case 'terraform':
      return generateTerraform(data);
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}

// Hook to get canvas data from tldraw editor
export function useCanvasExport() {
  const editor = useEditor();
  const exportToFormat = (format: string) => {
    const shapes = editor.getCurrentPageShapes();
    return exportCanvas(format, editor, shapes);
  };

  const downloadExport = (format: string, filename?: string) => {
    const content = exportToFormat(format);
    const exportFormat = EXPORT_FORMATS.find((f) => f.id === format);
    const extension = exportFormat?.extension || 'txt';
    const defaultFilename = `infrastructure-diagram.${extension}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || defaultFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return {
    exportToFormat,
    downloadExport,
    availableFormats: EXPORT_FORMATS,
  };
}
