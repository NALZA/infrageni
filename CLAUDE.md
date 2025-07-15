# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

InfraGeni is a visual cloud infrastructure design and code generation platform. It enables users to:
- Design cloud infrastructure using a drag-and-drop interface
- Support multiple cloud providers (AWS, Azure, GCP)
- Generate Infrastructure as Code (IaC) from visual designs
- Export diagrams in multiple formats (Mermaid, JSON, Terraform)

## Development Commands

### Common Development Tasks
- `nx serve infrageni` - Start development server
- `nx build infrageni` - Build the application
- `nx test infrageni` - Run tests
- `nx lint infrageni` - Run linter
- `nx typecheck infrageni` - Run TypeScript type checking
- `nx e2e infrageni-e2e` - Run end-to-end tests

### Project Management
- `nx sync` - Sync TypeScript project references
- `nx sync:check` - Check if TypeScript references are in sync
- `nx release` - Version and release (use `--dry-run` for preview)

### Testing
- `nx test` - Run all tests
- `nx test --watch` - Run tests in watch mode
- `nx test --coverage` - Run tests with coverage report

## Architecture Overview

### Core Technologies
- **Frontend**: React 19 with TypeScript
- **Build System**: Nx monorepo with Rspack bundler
- **Drawing Canvas**: tldraw v3 for the visual editor
- **State Management**: Jotai for atomic state management
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS with custom glass morphism components
- **UI Components**: Radix UI primitives with custom components

### Key Application Structure

```
apps/infrageni/src/app/
├── infrabuilder/           # Main infrastructure builder feature
│   ├── canvas.tsx         # Main canvas component with tldraw integration
│   ├── components.ts      # Component definitions and provider logic
│   ├── component-library.tsx # Component palette/library
│   ├── shapes/            # Custom tldraw shape definitions
│   ├── export/            # Export functionality (Mermaid, JSON, Terraform)
│   └── hooks/             # Custom hooks for URL state management
├── components/            # Shared UI components
│   ├── navbar/           # Navigation components
│   └── ui/               # Reusable UI components
└── lib/                  # Shared utilities and state management
    ├── provider-atom.ts  # Cloud provider state management
    └── theme-context.tsx # Theme management
```

### Key Architectural Patterns

#### Multi-Provider Support
- Provider selection handled via `providerAtom` (Jotai)
- Component definitions include provider-specific names and icons
- Export functionality adapts to selected provider

#### Visual Canvas Integration
- Built on tldraw v3 with custom shape utilities
- Shapes support drag-and-drop from component library
- Automatic container hierarchy (VPC > Subnet > Resources)
- Real-time URL state synchronization with compression

#### Export System
- Supports multiple output formats: Mermaid C4, Architecture diagrams, JSON, Terraform
- Extracts connections from tldraw arrows
- Maintains hierarchical relationships in exports

#### State Management
- URL-based state persistence with LZ-string compression
- Atomic state management with Jotai
- Provider-specific component rendering

## Development Guidelines

### Component Development
- Infrastructure components are defined in `apps/infrageni/src/app/infrabuilder/components.ts`
- Each component includes provider-specific names, icons, and properties
- Custom tldraw shapes are in `apps/infrageni/src/app/infrabuilder/shapes/`
- Follow the BaseInfraShapeUtil pattern for new shapes

### Adding New Cloud Providers
1. Update `Provider` type in `apps/infrageni/src/app/lib/provider-atom.ts`
2. Add provider-specific names to component definitions
3. Update export utilities to handle provider-specific resources
4. Add provider icons to `apps/infrageni/src/assets/provider-icons/`

### Export Format Development
- Export utilities are in `apps/infrageni/src/app/infrabuilder/export/`
- New formats require updates to `formats.ts` and `export-utils.ts`
- Export functions receive structured data with items and connections

### Testing
- Use Vitest for unit tests
- Test files should be named `*.spec.ts` or `*.test.ts`
- Place test files adjacent to the code they test
- Use React Testing Library for component tests

### Glass Morphism Design System
- Custom glass morphism components are in `apps/infrageni/src/app/components/ui/glass-components.tsx`
- Follow the established glassmorphism patterns for new UI components
- Theme integration uses custom tldraw theme synchronization

## Important Files to Understand

### Core Infrastructure Files
- `apps/infrageni/src/app/infrabuilder/canvas.tsx` - Main canvas with drag-and-drop logic
- `apps/infrageni/src/app/infrabuilder/components.ts` - Component definitions and provider logic
- `apps/infrageni/src/app/infrabuilder/export/export-utils.ts` - Export format generation
- `apps/infrageni/src/app/infrabuilder/UrlStateManager.ts` - URL state persistence

### Shape System
- `apps/infrageni/src/app/infrabuilder/shapes/base.tsx` - Base shape utility pattern
- `apps/infrageni/src/app/infrabuilder/shapes/index.ts` - Shape registration and creation

### State Management
- `apps/infrageni/src/app/lib/provider-atom.ts` - Cloud provider state
- `apps/infrageni/src/app/lib/theme-context.tsx` - Theme management

## URL State Management

The application uses URL-based state persistence with LZ-string compression. The canvas state is automatically synchronized with the URL, allowing for:
- Shareable diagram URLs
- Browser back/forward navigation
- Persistent state across sessions

## Export System

The export system supports multiple formats:
- **Mermaid C4**: Context diagrams with proper C4 syntax
- **Mermaid Architecture**: Beta architecture diagrams
- **Mermaid Flowchart**: Simple flowchart representation
- **JSON**: Structured data export
- **Terraform**: Basic AWS Terraform configuration

## Provider System

The application supports multiple cloud providers through:
- Provider-specific component naming
- Provider-specific icons and styling
- Provider-aware export generation
- Unified component interface across providers

## Performance Considerations

- URL state updates are debounced (500ms) to prevent excessive updates
- Canvas operations use tldraw's built-in optimization
- Component library uses React.memo for performance
- Export operations are performed client-side