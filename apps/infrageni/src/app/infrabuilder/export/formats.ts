export interface ExportFormat {
  id: string;
  name: string;
  extension: string;
  description: string;
}

export const EXPORT_FORMATS: ExportFormat[] = [
  {
    id: 'mermaid-c4',
    name: 'Mermaid C4 Context',
    extension: 'mmd',
    description: 'Mermaid C4 Context diagram format',
  },
  {
    id: 'mermaid-architecture',
    name: 'Mermaid Architecture',
    extension: 'mmd',
    description: 'Mermaid Architecture diagram format',
  },
  {
    id: 'mermaid-flowchart',
    name: 'Mermaid Flowchart',
    extension: 'mmd',
    description: 'Simple Mermaid flowchart diagram',
  },
  {
    id: 'json',
    name: 'JSON',
    extension: 'json',
    description: 'Raw canvas data in JSON format',
  },
  {
    id: 'terraform',
    name: 'Terraform (Basic)',
    extension: 'tf',
    description: 'Basic Terraform configuration (experimental)',
  },
];
