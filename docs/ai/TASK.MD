### Epic 1: Core Visual Design Canvas & Component Management

- **Feature: Intuitive Drag-and-Drop Canvas**
  - Responsive and performant drawing area.
  - Smart snapping, alignment guides, and auto-layout options.
  - Zoom, pan, and fit-to-view functionalities.
- **Feature: Multi-Cloud Component Library**
  - Categorized library of cloud provider-specific components (e.g., AWS EC2, Azure VM, GCP Compute Engine).
  - Generic components for non-cloud elements (e.g., "External System," "User").
  - Search and filtering for components.
  - Option to mark favorite or frequently used components.
- **Feature: Component Configuration Panel**
  - Dynamic properties panel for each selected component (e.g., instance type, region, database engine, network rules).
  - Type-ahead suggestions and validation for common properties (e.g., region dropdowns).
- **Feature: Intelligent Connection Tools**
  - Draw connections between components (e.g., arrows, bidirectional lines).
  - Connection labels and text fields for detailing data flow or relationships.
  - "Smart" connections that stick to components when moved.
- **Feature: Grouping and Scoping**
  - Ability to draw boundaries/boxes to group related components (e.g., VPCs, Subnets, Microservices).
  - Labels for groups to define context.
- **Feature: Design Persistence & Export**
  - Save and load designs (proprietary InfraGeni format).
  - Export diagrams as PNG, SVG, PDF.
  - Version control for designs (basic history or integration with external VCS).
