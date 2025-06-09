export type CanvasItem = {
  id: string;
  label: string;
  x: number;
  y: number;
  key: string;
  properties?: {
    instanceType?: string;
    region?: string;
    engine?: string;
    // Add more fields as needed for other component types
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
