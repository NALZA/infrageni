export type CanvasItem = {
  id: string;
  label: string;
  x: number;
  y: number;
  key: string;
  parentId?: string; // ID of the container this item belongs to
  isBoundingBox?: boolean; // Whether this item can contain other items
  children?: string[]; // IDs of contained items (for bounding box types)
  properties?: {
    w?: number; // Width of the shape
    h?: number; // Height of the shape
    instanceType?: string;
    region?: string;
    engine?: string;
    cidrBlock?: string; // For VPC/subnet CIDR blocks
    color?: string;
    opacity?: number;
    componentId?: string;
    // Add more fields as needed for other component types
    [key: string]: unknown; // Allow additional properties
  };
};

export type Connection = {
  id: string;
  from: string; // key of source CanvasItem
  to: string; // key of target CanvasItem
  label?: string;
  properties?: {
    [key: string]: unknown;
  };
};
