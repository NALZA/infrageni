import { describe, it, expect, vi } from 'vitest';
import { TLShape, TLArrowBinding } from 'tldraw';
import { 
  convertShapesToCanvasItems, 
  extractConnectionsFromArrows,
  generateMermaidC4,
  generateMermaidArchitecture,
  generateTerraform,
  generateJSON,
  ExportData
} from './export-utils';

// Mock tldraw editor
const mockEditor = {
  getBindingsFromShape: vi.fn(),
};

describe('Export Utils', () => {
  describe('convertShapesToCanvasItems', () => {
    it('should convert basic shapes to canvas items', () => {
      const shapes: TLShape[] = [
        {
          id: 'shape1',
          type: 'infra-compute',
          x: 100,
          y: 200,
          props: {
            label: 'Test Compute',
            w: 120,
            h: 80,
            isBoundingBox: false,
          },
        } as any,
        {
          id: 'shape2',
          type: 'infra-vpc',
          x: 50,
          y: 150,
          props: {
            label: 'Test VPC',
            w: 300,
            h: 200,
            isBoundingBox: true,
          },
        } as any,
      ];

      const result = convertShapesToCanvasItems(shapes);

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        id: 'shape1',
        label: 'Test Compute',
        x: 100,
        y: 200,
        key: 'compute-shape1',
        isBoundingBox: false,
      });
      expect(result[1]).toMatchObject({
        id: 'shape2',
        label: 'Test VPC',
        x: 50,
        y: 150,
        key: 'vpc-shape2',
        isBoundingBox: true,
      });
    });

    it('should establish parent-child relationships', () => {
      const shapes: TLShape[] = [
        {
          id: 'vpc1',
          type: 'infra-vpc',
          x: 0,
          y: 0,
          props: {
            label: 'VPC',
            w: 400,
            h: 300,
            isBoundingBox: true,
          },
        } as any,
        {
          id: 'compute1',
          type: 'infra-compute',
          x: 100,
          y: 100,
          props: {
            label: 'EC2',
            w: 120,
            h: 80,
            isBoundingBox: false,
          },
        } as any,
      ];

      const result = convertShapesToCanvasItems(shapes);
      
      const vpc = result.find(item => item.id === 'vpc1');
      const compute = result.find(item => item.id === 'compute1');

      expect(vpc?.children).toContain('compute1');
      expect(compute?.parentId).toBe('vpc1');
    });

    it('should skip arrow shapes', () => {
      const shapes: TLShape[] = [
        {
          id: 'arrow1',
          type: 'arrow',
          x: 100,
          y: 100,
          props: {},
        } as any,
        {
          id: 'compute1',
          type: 'infra-compute',
          x: 100,
          y: 100,
          props: {
            label: 'EC2',
            w: 120,
            h: 80,
          },
        } as any,
      ];

      const result = convertShapesToCanvasItems(shapes);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('compute1');
    });
  });

  describe('extractConnectionsFromArrows', () => {
    it('should extract connections from arrow shapes', () => {
      const shapes: TLShape[] = [
        {
          id: 'arrow1',
          type: 'arrow',
          props: {
            text: 'connects to',
            color: 'blue',
            arrowheadStart: 'none',
            arrowheadEnd: 'arrow',
          },
        } as any,
      ];

      const startBinding: TLArrowBinding = {
        id: 'binding1',
        type: 'arrow',
        fromId: 'arrow1',
        toId: 'shape1',
        props: {
          terminal: 'start',
          normalizedAnchor: { x: 0.5, y: 0.5 },
          isExact: false,
        },
      } as any;

      const endBinding: TLArrowBinding = {
        id: 'binding2',
        type: 'arrow',
        fromId: 'arrow1',
        toId: 'shape2',
        props: {
          terminal: 'end',
          normalizedAnchor: { x: 0.5, y: 0.5 },
          isExact: false,
        },
      } as any;

      mockEditor.getBindingsFromShape.mockReturnValue([startBinding, endBinding]);

      const result = extractConnectionsFromArrows(mockEditor as any, shapes);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: 'arrow1',
        from: 'shape1',
        to: 'shape2',
        label: 'connects to',
      });
    });

    it('should handle arrows without bindings', () => {
      const shapes: TLShape[] = [
        {
          id: 'arrow1',
          type: 'arrow',
          props: {},
        } as any,
      ];

      mockEditor.getBindingsFromShape.mockReturnValue([]);

      const result = extractConnectionsFromArrows(mockEditor as any, shapes);

      expect(result).toHaveLength(0);
    });
  });

  describe('generateMermaidC4', () => {
    it('should generate C4 diagram with containers and resources', () => {
      const data: ExportData = {
        items: [
          {
            id: 'vpc1',
            label: 'Production VPC',
            x: 0,
            y: 0,
            key: 'vpc-vpc1',
            isBoundingBox: true,
            children: ['compute1'],
          },
          {
            id: 'compute1',
            label: 'Web Server',
            x: 100,
            y: 100,
            key: 'compute-compute1',
            parentId: 'vpc1',
            properties: {
              instanceType: 't3.micro',
            },
          },
        ],
        connections: [
          {
            id: 'conn1',
            from: 'compute1',
            to: 'external1',
            label: 'API calls',
          },
        ],
        metadata: {
          exportedAt: '2023-01-01T00:00:00Z',
          format: 'mermaid-c4',
          version: '1.0.0',
        },
      };

      const result = generateMermaidC4(data);

      expect(result).toContain('C4Context');
      expect(result).toContain('Enterprise_Boundary(vpc1, "Production VPC", "VPC")');
      expect(result).toContain('System(compute1, "Web Server", "Compute (t3.micro)")');
      expect(result).toContain('Rel(compute1, external1, "API calls")');
    });
  });

  describe('generateMermaidArchitecture', () => {
    it('should generate architecture diagram', () => {
      const data: ExportData = {
        items: [
          {
            id: 'vpc1',
            label: 'Production VPC',
            x: 0,
            y: 0,
            key: 'vpc-vpc1',
            isBoundingBox: true,
          },
          {
            id: 'compute1',
            label: 'Web Server',
            x: 100,
            y: 100,
            key: 'compute-compute1',
            parentId: 'vpc1',
          },
        ],
        connections: [],
        metadata: {
          exportedAt: '2023-01-01T00:00:00Z',
          format: 'mermaid-architecture',
          version: '1.0.0',
        },
      };

      const result = generateMermaidArchitecture(data);

      expect(result).toContain('architecture-beta');
      expect(result).toContain('group vpc1(cloud)[Production VPC]');
      expect(result).toContain('service compute1(server)[Web Server] in vpc1');
    });
  });

  describe('generateTerraform', () => {
    it('should generate basic Terraform configuration', () => {
      const data: ExportData = {
        items: [
          {
            id: 'vpc1',
            label: 'Production VPC',
            x: 0,
            y: 0,
            key: 'vpc-vpc1',
            properties: {
              cidrBlock: '10.0.0.0/16',
            },
          },
          {
            id: 'compute1',
            label: 'Web Server',
            x: 100,
            y: 100,
            key: 'compute-compute1',
            parentId: 'vpc1',
            properties: {
              instanceType: 't3.micro',
            },
          },
        ],
        connections: [],
        metadata: {
          exportedAt: '2023-01-01T00:00:00Z',
          format: 'terraform',
          version: '1.0.0',
        },
      };

      const result = generateTerraform(data);

      expect(result).toContain('terraform {');
      expect(result).toContain('provider "aws" {');
      expect(result).toContain('resource "aws_vpc" "vpc1" {');
      expect(result).toContain('cidr_block = "10.0.0.0/16"');
      expect(result).toContain('resource "aws_instance" "compute1" {');
      expect(result).toContain('instance_type = "t3.micro"');
    });
  });

  describe('generateJSON', () => {
    it('should generate JSON export', () => {
      const data: ExportData = {
        items: [
          {
            id: 'compute1',
            label: 'Web Server',
            x: 100,
            y: 100,
            key: 'compute-compute1',
          },
        ],
        connections: [],
        metadata: {
          exportedAt: '2023-01-01T00:00:00Z',
          format: 'json',
          version: '1.0.0',
        },
      };

      const result = generateJSON(data);
      const parsed = JSON.parse(result);

      expect(parsed).toMatchObject(data);
      expect(parsed.items).toHaveLength(1);
      expect(parsed.items[0].label).toBe('Web Server');
    });
  });
});