## InfraGeni: Epic Feature List

This list is structured in an "Epic" style, breaking down large functional areas into smaller, manageable features. This will be helpful for agile planning.

---

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

---

### Epic 2: Multi-Cloud Flavors & IaC Generation

- **Feature: Cloud Provider Toggle (Global & Component-Specific)**
  - Global switch to set the active cloud provider (AWS, Azure, GCP).
  - Automatic mapping and visual transformation of existing generic components to the selected cloud.
  - Ability to explicitly designate a component's provider if a design mixes clouds (e.g., AWS component connecting to Azure component).
- **Feature: Infrastructure as Code (IaC) Generator**
  - Generate Terraform HCL for the current design.
  - Generate AWS CloudFormation templates.
  - Generate Azure Resource Manager (ARM) templates.
  - Generate basic Kubernetes manifests (e.g., Deployments, Services).
- **Feature: IaC Preview & Editor**
  - Side-panel or modal to view the generated IaC code.
  - Syntax highlighting for IaC.
  - Basic inline editing capabilities (with a warning if manual edits might break diagram synchronization).
- **Feature: IaC Validation & Error Highlighting**
  - Basic static analysis/validation of generated IaC.
  - Highlight design elements that lead to IaC errors or warnings.
- **Feature: Import from IaC (Stretch Goal / Advanced)**
  - Parse existing Terraform/CloudFormation files and render a visual diagram. (Complex, consider for later stages).

---

### Epic 3: AI-Powered Design Assistant

- **Feature: Intelligent Component Suggestions**
  - As user designs, AI suggests logical next components (e.g., if a Load Balancer is added, suggest Auto Scaling Group and multiple EC2 instances).
  - Context-aware suggestions based on common patterns and best practices.
- **Feature: Architecture Pattern Recommendations**
  - User inputs requirements (e.g., "high availability web app," "serverless data pipeline"), AI suggests an initial skeleton design.
  - Visual representation of suggested patterns with explanations.
- **Feature: Cost Estimation & Optimization**
  - Basic cost estimations for designed infrastructure based on configured component properties and current cloud pricing data.
  - AI suggests cost-saving alternatives or optimizations (e.g., "Consider a cheaper instance type for this workload").
- **Feature: Scalability & Performance Analysis**
  - AI provides insights into potential bottlenecks or scaling limits based on the design.
  - Suggestions for improving scalability (e.g., adding a cache, increasing database read replicas).
- **Feature: Security Best Practice Recommendations**
  - AI flags common security vulnerabilities or anti-patterns in the design (e.g., public S3 buckets, overly permissive security groups).
  - Suggests secure alternatives or configurations.
- **Feature: Design Quality Score/Review**
  - AI provides an overall "health" score for the design based on resilience, cost, security, and adherence to best practices.
  - Detailed report outlining strengths and areas for improvement.

---

### Epic 4: AI-Powered Systems Design Educator

- **Feature: Interactive Guided Learning Paths**
  - Structured lessons on core systems design concepts (e.g., CAP Theorem, Microservices vs. Monoliths, Asynchronous Messaging).
  - Hands-on exercises within the design canvas, guided by AI.
- **Feature: Contextual Explanations (Hover/Click to Learn)**
  - Hovering over a component or design pattern triggers an AI explanation of its purpose, pros/cons, and common use cases.
  - Clickable "Learn More" links to detailed documentation or InfraGeni's knowledge base.
- **Feature: Design Critique & Rationale Generation**
  - User provides a design (or builds one), and AI generates a comprehensive critique, explaining why certain choices are good/bad, identifying anti-patterns, and suggesting alternatives.
  - AI can explain _why_ it made certain recommendations during the design process.
- **Feature: "Application Idea to Design" Translator**
  - User inputs a natural language description of an application (e.g., "I want a real-time chat app for 1 million users with a user authentication system").
  - AI generates an initial high-level system architecture diagram and explains its design rationale.
- **Feature: Quiz & Assessment Engine**
  - AI generates quizzes based on learning paths or specific design scenarios.
  - Evaluates user's understanding of systems design principles.
