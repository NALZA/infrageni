import { InfraToolPlugin, ToolCategory, ToolContext, ToolParams, ToolResult } from '../core/plugin-system';
import { ExportData } from '../../export/export-utils';
import { CanvasItem, Connection } from '../../types';

export class DrawIOExportTool implements InfraToolPlugin {
  id = 'drawio-export';
  name = 'Draw.io Export';
  description = 'Export infrastructure diagrams to Draw.io XML format with AWS/Azure/GCP shapes';
  category = ToolCategory.EXPORT;
  version = '1.0.0';

  async initialize(context: ToolContext): Promise<void> {
    console.log('🎨 Draw.io Export Tool initialized');
  }

  async execute(params: ToolParams): Promise<ToolResult> {
    const { data, options = {} } = params;
    
    if (!data || !data.items) {
      return {
        success: false,
        error: 'No canvas data provided'
      };
    }

    try {
      const startTime = Date.now();
      const drawioXML = this.generateDrawioXML(data, options);
      const executionTime = Date.now() - startTime;

      return {
        success: true,
        data: {
          content: drawioXML,
          format: 'drawio',
          extension: 'drawio'
        },
        metadata: {
          executionTime,
          processingStats: {
            itemsProcessed: data.items.length,
            connectionsProcessed: data.connections?.length || 0,
            format: 'drawio-xml'
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during Draw.io export'
      };
    }
  }

  private generateDrawioXML(data: ExportData, options: any): string {
    const { items, connections } = data;
    const { provider = 'aws', theme = 'default' } = options;

    // Generate unique IDs for Draw.io
    let idCounter = 1;
    const itemIdMap = new Map<string, string>();
    
    // Map canvas items to Draw.io IDs
    for (const item of items) {
      itemIdMap.set(item.id, `item_${idCounter++}`);
    }

    const cells: string[] = [];
    
    // Add root cell
    cells.push('<mxCell id="0"/>');
    cells.push('<mxCell id="1" parent="0"/>');

    // Add items as cells
    for (const item of items) {
      const drawioId = itemIdMap.get(item.id)!;
      cells.push(this.generateDrawioCell(item, drawioId, provider, theme));
    }

    // Add connections as edges
    if (connections && connections.length > 0) {
      for (const connection of connections) {
        const edgeId = `edge_${idCounter++}`;
        const sourceId = itemIdMap.get(connection.from);
        const targetId = itemIdMap.get(connection.to);
        
        if (sourceId && targetId) {
          cells.push(this.generateDrawioEdge(connection, edgeId, sourceId, targetId));
        }
      }
    }

    // Generate complete XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net" modified="${new Date().toISOString()}" agent="InfraGeni" etag="generated" version="24.7.17" type="device">
  <diagram name="Infrastructure Diagram" id="infrastructure">
    <mxGraphModel dx="1422" dy="754" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169" math="0" shadow="0">
      <root>
        ${cells.join('\n        ')}
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;

    return xml;
  }

  private generateDrawioCell(item: CanvasItem, drawioId: string, provider: string, theme: string): string {
    const resourceType = item.key.split('-')[0];
    const { x, y } = item;
    const width = item.properties?.w || 120;
    const height = item.properties?.h || 80;
    
    // Get provider-specific styling
    const styling = this.getProviderStyling(resourceType, provider, theme);
    
    if (item.isBoundingBox) {
      return this.generateContainerCell(item, drawioId, styling, x, y, width, height);
    } else {
      return this.generateResourceCell(item, drawioId, styling, x, y, width, height);
    }
  }

  private generateContainerCell(item: CanvasItem, drawioId: string, styling: any, x: number, y: number, width: number, height: number): string {
    const containerType = item.key.split('-')[0];
    const strokeColor = styling.strokeColor || '#4A90E2';
    const fillColor = styling.fillColor || '#E8F4FD';
    const strokeWidth = styling.strokeWidth || 2;
    
    let shape = 'rectangle';
    
    if (containerType === 'vpc') {
      shape = 'mxgraph.aws4.group;grIcon=mxgraph.aws4.group_vpc';
    } else if (containerType === 'subnet') {
      shape = 'mxgraph.aws4.group;grIcon=mxgraph.aws4.group_subnet';
    } else if (containerType === 'availability-zone') {
      shape = 'mxgraph.aws4.group;grIcon=mxgraph.aws4.group_availability_zone';
    }
    
    const style = `${shape};strokeColor=${strokeColor};fillColor=${fillColor};strokeWidth=${strokeWidth};dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;pointerEvents=1;cursor=pointer;`;
    
    return `<mxCell id="${drawioId}" value="${this.escapeXML(item.label)}" style="${style}" vertex="1" parent="1">
          <mxGeometry x="${x}" y="${y}" width="${width}" height="${height}" as="geometry"/>
        </mxCell>`;
  }

  private generateResourceCell(item: CanvasItem, drawioId: string, styling: any, x: number, y: number, width: number, height: number): string {
    const resourceType = item.key.split('-')[0];
    const shape = this.getResourceShape(resourceType, styling.provider);
    const strokeColor = styling.strokeColor || '#232F3E';
    const fillColor = styling.fillColor || '#FFFFFF';
    
    const style = `${shape};strokeColor=${strokeColor};fillColor=${fillColor};strokeWidth=2;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;pointerEvents=1;cursor=pointer;`;
    
    return `<mxCell id="${drawioId}" value="${this.escapeXML(item.label)}" style="${style}" vertex="1" parent="1">
          <mxGeometry x="${x}" y="${y}" width="${width}" height="${height}" as="geometry"/>
        </mxCell>`;
  }

  private generateDrawioEdge(connection: Connection, edgeId: string, sourceId: string, targetId: string): string {
    const label = connection.label || '';
    const style = 'edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#232F3E;strokeWidth=2;';
    
    return `<mxCell id="${edgeId}" value="${this.escapeXML(label)}" style="${style}" edge="1" parent="1" source="${sourceId}" target="${targetId}">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>`;
  }

  private getProviderStyling(resourceType: string, provider: string, theme: string): any {
    const providerStyles = {
      aws: {
        strokeColor: '#FF9900',
        fillColor: '#FFFFFF',
        strokeWidth: 2,
        provider: 'aws'
      },
      azure: {
        strokeColor: '#0078D4',
        fillColor: '#FFFFFF',
        strokeWidth: 2,
        provider: 'azure'
      },
      gcp: {
        strokeColor: '#4285F4',
        fillColor: '#FFFFFF',
        strokeWidth: 2,
        provider: 'gcp'
      }
    };

    return providerStyles[provider as keyof typeof providerStyles] || providerStyles.aws;
  }

  private getResourceShape(resourceType: string, provider: string): string {
    const shapes = {
      aws: {
        compute: 'mxgraph.aws4.ec2',
        database: 'mxgraph.aws4.rds',
        storage: 'mxgraph.aws4.s3',
        'load-balancer': 'mxgraph.aws4.elastic_load_balancing',
        'api-gateway': 'mxgraph.aws4.api_gateway',
        lambda: 'mxgraph.aws4.lambda_function',
        'cloudfront': 'mxgraph.aws4.cloudfront',
        'route53': 'mxgraph.aws4.route_53',
        'iam': 'mxgraph.aws4.iam',
        'cloudwatch': 'mxgraph.aws4.cloudwatch',
        'sns': 'mxgraph.aws4.sns',
        'sqs': 'mxgraph.aws4.sqs',
        'user': 'mxgraph.aws4.user',
        'external-system': 'mxgraph.aws4.external_system'
      },
      azure: {
        compute: 'mxgraph.azure.compute.VM',
        database: 'mxgraph.azure.databases.SQL_Database',
        storage: 'mxgraph.azure.storage.Storage_Account',
        'load-balancer': 'mxgraph.azure.networking.Load_Balancer',
        'api-gateway': 'mxgraph.azure.networking.API_Management',
        'function': 'mxgraph.azure.compute.Function_App',
        'cdn': 'mxgraph.azure.networking.CDN',
        'dns': 'mxgraph.azure.networking.DNS_Zone',
        'identity': 'mxgraph.azure.identity.Active_Directory',
        'monitoring': 'mxgraph.azure.monitoring.Application_Insights',
        'messaging': 'mxgraph.azure.messaging.Service_Bus',
        'user': 'mxgraph.azure.identity.User',
        'external-system': 'mxgraph.azure.general.External_System'
      },
      gcp: {
        compute: 'mxgraph.gcp2.compute.compute_engine',
        database: 'mxgraph.gcp2.databases.cloud_sql',
        storage: 'mxgraph.gcp2.storage.cloud_storage',
        'load-balancer': 'mxgraph.gcp2.networking.cloud_load_balancing',
        'api-gateway': 'mxgraph.gcp2.networking.cloud_endpoints',
        'function': 'mxgraph.gcp2.compute.cloud_functions',
        'cdn': 'mxgraph.gcp2.networking.cloud_cdn',
        'dns': 'mxgraph.gcp2.networking.cloud_dns',
        'identity': 'mxgraph.gcp2.identity.cloud_identity',
        'monitoring': 'mxgraph.gcp2.monitoring.cloud_monitoring',
        'messaging': 'mxgraph.gcp2.messaging.cloud_pub_sub',
        'user': 'mxgraph.gcp2.identity.user',
        'external-system': 'mxgraph.gcp2.general.external_system'
      }
    };

    const providerShapes = shapes[provider as keyof typeof shapes] || shapes.aws;
    return providerShapes[resourceType as keyof typeof providerShapes] || 'rectangle';
  }

  private escapeXML(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}