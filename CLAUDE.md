# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Product Overview

InfraGeni is a visual-first infrastructure design platform that empowers developers, architects, and learners to design, understand, and provision cloud infrastructure. The platform features:

- **Visual drag-and-drop interface** for rapid system architecture creation using tldraw
- **Multi-cloud support** with seamless toggling between AWS, Azure, and GCP providers
- **Education Mode** with interactive system design questions and step-by-step teaching
- **Pattern Library** with reusable architecture blueprints and templates
- **AI-powered assistance** for design optimization and Infrastructure as Code generation

## Core Architecture Principles

1. **Cloud Provider Agnostic**: All components must support switching between cloud providers at any point in the design process
2. **Educational Focus**: Features should contribute to user understanding and skill development in systems design
3. **Production-Ready Output**: Generated Infrastructure as Code must be syntactically correct and deployable
4. **Extensibility**: Architecture designed to easily integrate new cloud services, IaC providers, and AI models

## Development Commands

### Build and Development
```bash
# Build the infrageni app
npx nx build infrageni

# Serve the app in development mode
npx nx serve infrageni

# Run development server with hot reload
npx nx dev infrageni

# Preview production build
npx nx preview infrageni
```

### Testing and Quality
```bash
# Run unit tests
npx nx test infrageni

# Run unit tests with coverage
npx nx test infrageni --coverage

# Run E2E tests
npx nx e2e infrageni-e2e

# Type checking
npx nx typecheck infrageni

# Linting
npx nx lint infrageni

# Run specific test file
npx nx test infrageni --testNamePattern="specific-test-name"
```

### Nx Workspace Management
```bash
# Sync TypeScript project references
npx nx sync

# Check if references are in sync (for CI)
npx nx sync:check

# Version and release
npx nx release

# Dry run release
npx nx release --dry-run
```

## Architecture Overview

### Main Application Structure

**apps/infrageni/src/app/**
- `app.tsx` - Main app router with navigation between home, design tool, and education mode
- `infrabuilder/` - Core infrastructure design tool
- `components/` - Shared UI components (navbar, theme toggle, glass morphism components)

### Infrastructure Builder (`infrabuilder/`)

**Core Systems:**
- `infra-builder.tsx` - Main container with mode switching between Design and Education modes
- `canvas.tsx` - tldraw-based drawing canvas for infrastructure diagrams
- `enhanced-component-library.tsx` - Component palette with cloud provider components

**Pattern System (`patterns/`):**
- `core/` - Pattern types, validation, template engine, and registry
- `library/` - Pre-built patterns (web apps, microservices, security, data analytics)
- `ui/` - Pattern browser, search, preview, and management components

**Component System (`components/`):**
- `core/` - Component types, registry, and provider-specific implementations
- `providers/` - AWS, Azure, GCP component definitions with metadata
- `hooks/` - React hooks for component management

**Education System (`education/`):**
- `types.ts` - Learning interfaces (questions, progress, teaching steps)
- `data/questionLibrary.ts` - System design questions with solutions and explanations
- `components/` - Interactive learning interface with step-by-step teaching

**Export System (`export/`):**
- Multiple format support: Terraform, CloudFormation, Mermaid, PlantUML, Draw.io
- `export-utils.ts` - Core export logic and format conversion
- `formats.ts` - Format-specific generators

### Key Data Structures

**InfrastructurePattern**: Comprehensive pattern definition with components, relationships, documentation, cost models, and deployment guides

**DesignQuestion**: Educational questions with requirements, solutions, teaching steps, annotations, and progress tracking

**ComponentReference**: Pattern components with position, configuration, dependencies, and metadata

**TeachingStep**: Step-by-step explanations with visual highlights, code examples, and common mistakes

## Technology Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Nx monorepo with Rspack bundler
- **UI Library**: Custom glass morphism components with Tailwind CSS
- **Drawing Engine**: tldraw for interactive diagrams
- **State Management**: Jotai atoms for global state
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Testing**: Vitest with React Testing Library
- **E2E Testing**: Playwright

## Key Integration Points

### Provider System
Components are abstracted to work across cloud providers. Each component has:
- `componentId` (generic identifier)
- `providers` array (supported cloud providers)
- Provider-specific configuration and metadata
- Icon and visualization assets per provider

### Pattern-Education Integration
- Patterns from the library are used as solutions in education questions
- Teaching steps reference pattern components for visual highlighting
- Educational annotations overlay on the tldraw canvas
- Progress tracking integrates with pattern completion

### Canvas Integration
- tldraw canvas renders infrastructure components as custom shapes
- Pattern deployment places components with calculated positions
- Educational mode adds annotation overlays and highlights
- Export system reads canvas state for IaC generation

## Development Guidelines

### Component Development
- All new cloud components must support multiple providers
- Include comprehensive metadata (description, documentation links, best practices)
- Follow the existing component structure in `components/providers/`

### Pattern Development
- Use the pattern template system for parameterized patterns
- Include comprehensive documentation with deployment guides
- Add validation rules and cost estimation where applicable
- Reference existing patterns in `patterns/library/`

### Education Content
- Questions should build on existing patterns
- Include step-by-step teaching with visual highlighting
- Provide multiple difficulty levels and learning objectives
- Add comprehensive explanations of architectural decisions

### Export Format Support
- New formats should implement the `ExportFormat` interface
- Include validation and preview capabilities
- Support both individual components and full patterns
- Maintain provider-specific syntax accuracy