# Bounding Box Components Guide

## Overview

We've added support for bounding box type resources like VPC, Subnets, and Availability Zones to the infrageni application. These components act as containers that can hold other infrastructure resources.

## New Components

### 1. VPC (Virtual Private Cloud)

- **Purpose**: Acts as the outermost network boundary
- **Size**: Large container (400x250px by default)
- **Visual**: Blue dashed border with low opacity background
- **Provider Names**:
  - AWS: "VPC"
  - Azure: "Virtual Network"
  - GCP: "VPC Network"
  - Generic: "Virtual Private Cloud"

### 2. Subnet

- **Purpose**: Network subdivision within a VPC
- **Size**: Medium container (200x120px by default)
- **Visual**: Green dashed border with low opacity background
- **Provider Names**:
  - AWS: "Subnet"
  - Azure: "Subnet"
  - GCP: "Subnetwork"
  - Generic: "Subnet"

### 3. Availability Zone

- **Purpose**: Logical grouping representing a data center or zone
- **Size**: Large container (300x180px by default)
- **Visual**: Purple dashed border with low opacity background
- **Provider Names**:
  - AWS: "Availability Zone"
  - Azure: "Availability Zone"
  - GCP: "Zone"
  - Generic: "Availability Zone"

## Features

### Component Library Organization

- Bounding box components are now grouped separately in the component library
- They appear under "Container Components" section
- Visual distinction with blue styling and dashed borders

### Enhanced Canvas Functionality

- **Drop Detection**: The canvas now detects when components are dropped into bounding boxes
- **Containment Logic**: Non-bounding box components dropped inside containers are automatically associated
- **Container Movement**: When you move a container (VPC, Subnet, AZ), all components inside it move with it automatically
- **Visual Feedback**: Bounding boxes provide clear visual indication of drop zones

### Provider-Specific Icons

- Each bounding box component has custom icons for all supported providers (AWS, Azure, GCP)
- Icons use provider-specific color schemes and styling
- Fallback to generic icons for unsupported combinations

## Usage Instructions

### Creating Infrastructure Diagrams

1. **Start with VPC**: Drag a VPC component onto the canvas to create the network foundation
2. **Add Availability Zones**: Drag AZ components inside the VPC for regional organization
3. **Create Subnets**: Drag subnet components inside AZs or directly in the VPC
4. **Place Resources**: Drag compute, database, and storage components into appropriate subnets

### Container Movement

When you move a container component:

- All resources contained within it automatically move with the container
- The system detects containment based on whether a resource's center point is inside the container
- This applies to VPCs, Subnets, and Availability Zones
- Movement is tracked in real-time and updates smoothly

### Visual Hierarchy

The recommended hierarchy is:

```
VPC (outermost)
├── Availability Zone 1
│   ├── Subnet 1 (public)
│   │   ├── Load Balancer
│   │   └── NAT Gateway
│   └── Subnet 2 (private)
│       ├── EC2 Instances
│       └── RDS Database
└── Availability Zone 2
    └── Subnet 3 (private)
        └── EC2 Instances
```

## Technical Implementation

### Type System

- Added `isBoundingBox` property to `GenericComponent` type
- Extended `CanvasItem` type with container relationships
- Enhanced `BaseInfraShapeProps` with bounding box properties

### Shape Utilities

- New shape utilities: `VPCShapeUtil`, `SubnetShapeUtil`, `AvailabilityZoneShapeUtil`
- Custom rendering with transparency and dashed borders
- Resizable containers with proper indicators

### Provider Icons

- Complete icon sets for all three major cloud providers
- Consistent visual language across providers
- Gradient styling matching provider brand colors

## Future Enhancements

1. **Snap to Container**: Automatic alignment of components within containers
2. **Container Constraints**: Validation rules for what can be placed where
3. **Auto-Sizing**: Dynamic container resizing based on contents
4. **Nested Relationships**: Visual representation of parent-child relationships
5. **Export Support**: Include container relationships in exported diagrams
6. **Multi-level Containment**: Support for containers within containers (e.g., Subnets in AZs in VPCs)
7. **Container Grouping**: Visual grouping indicators for related containers

## Configuration Options

### Default Sizes

- VPC: 400x250px
- Availability Zone: 300x180px
- Subnet: 200x120px

### Opacity Settings

- VPC: 10% background opacity
- Availability Zone: 15% background opacity
- Subnet: 20% background opacity

### Border Styles

- All containers use dashed borders
- Different dash patterns for visual distinction
- Provider-specific colors
